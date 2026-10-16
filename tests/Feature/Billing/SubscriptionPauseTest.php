<?php

use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceApiKey;
use App\Services\PlanLimitService;
use Illuminate\Support\Carbon;
use Laravel\Cashier\Http\Middleware\VerifyWebhookSignature;
use Mockery\MockInterface;
use Stripe\StripeClient;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->owner = User::factory()->create();
    $this->workspace = Workspace::factory()->create([
        'owner_id' => $this->owner->id,
        'stripe_id' => 'cus_pause',
    ]);
    $this->workspace->addUser($this->owner, 'owner');
    $this->owner->switchWorkspace($this->workspace);

    $this->subscription = $this->workspace->subscriptions()->create([
        'type' => 'default',
        'stripe_id' => 'sub_pause',
        'stripe_status' => 'active',
        'stripe_price' => config('billing.plans.pro.stripe_price_id.monthly'),
    ]);
});

/**
 * Replace the Stripe SDK client Cashier uses with one whose subscription service is the given mock.
 */
function fakeStripeSubscriptions(): MockInterface
{
    $subscriptions = Mockery::mock();
    $client = new class
    {
        public mixed $subscriptions;
    };
    $client->subscriptions = $subscriptions;

    app()->bind(StripeClient::class, fn () => $client);

    return $subscriptions;
}

function pauseWorkspace(Workspace $workspace, ?Carbon $resumesAt): void
{
    $workspace->forceFill([
        'subscription_paused_at' => now(),
        'subscription_resumes_at' => $resumesAt,
    ])->save();
}

// --- Pausing ---

it('pauses payment collection on Stripe for the chosen number of months', function (int $months) {
    Carbon::setTestNow('2026-10-16 10:00:00');
    $expectedResumesAt = now()->addMonthsNoOverflow($months);

    fakeStripeSubscriptions()
        ->shouldReceive('update')
        ->once()
        ->with('sub_pause', [
            'pause_collection' => [
                'behavior' => 'void',
                'resumes_at' => $expectedResumesAt->getTimestamp(),
            ],
        ]);

    actingAs($this->owner)
        ->postJson('/billing/pause', ['months' => $months])
        ->assertOk()
        ->assertJson(['success' => true]);

    $this->workspace->refresh();

    expect($this->workspace->subscriptionPaused())->toBeTrue()
        ->and($this->workspace->subscription_resumes_at->equalTo($expectedResumesAt))->toBeTrue();
})->with([1, 2, 3]);

it('only accepts a pause of one to three months', function (mixed $months) {
    actingAs($this->owner)
        ->postJson('/billing/pause', ['months' => $months])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('months');
})->with([0, 4, 6, 'forever']);

it('refuses to pause a subscription that is not active and paid', function (array $attributes) {
    $this->subscription->update($attributes);

    actingAs($this->owner)
        ->postJson('/billing/pause', ['months' => 1])
        ->assertStatus(400)
        ->assertJson(['success' => false]);

    expect($this->workspace->refresh()->subscriptionPaused())->toBeFalse();
})->with([
    'cancelled (grace period)' => [['ends_at' => now()->addWeek()]],
    'on trial' => [['stripe_status' => 'trialing', 'trial_ends_at' => now()->addWeek()]],
    'past due' => [['stripe_status' => 'past_due']],
]);

it('refuses to pause a workspace without a subscription', function () {
    $this->subscription->delete();

    actingAs($this->owner)
        ->postJson('/billing/pause', ['months' => 1])
        ->assertStatus(400);
});

it('refuses to pause an already paused subscription', function () {
    pauseWorkspace($this->workspace, now()->addMonth());

    actingAs($this->owner)
        ->postJson('/billing/pause', ['months' => 1])
        ->assertStatus(400)
        ->assertJson(['error' => 'Your subscription is already paused.']);
});

it('does not mark the workspace paused when Stripe fails', function () {
    fakeStripeSubscriptions()
        ->shouldReceive('update')
        ->andThrow(new RuntimeException('Stripe is down'));

    actingAs($this->owner)
        ->postJson('/billing/pause', ['months' => 1])
        ->assertStatus(500);

    expect($this->workspace->refresh()->subscriptionPaused())->toBeFalse();
});

it('only lets billing managers pause or resume', function () {
    $member = User::factory()->create();
    $this->workspace->addUser($member, 'member');
    $member->switchWorkspace($this->workspace);

    actingAs($member)->postJson('/billing/pause', ['months' => 1])->assertForbidden();
    actingAs($member)->deleteJson('/billing/pause')->assertForbidden();
});

// --- Resuming ---

it('resumes payment collection on Stripe before the resume date', function () {
    pauseWorkspace($this->workspace, now()->addMonths(2));

    fakeStripeSubscriptions()
        ->shouldReceive('update')
        ->once()
        ->with('sub_pause', ['pause_collection' => '']);

    actingAs($this->owner)
        ->deleteJson('/billing/pause')
        ->assertOk()
        ->assertJson(['success' => true]);

    $this->workspace->refresh();

    expect($this->workspace->subscriptionPaused())->toBeFalse()
        ->and($this->workspace->subscription_paused_at)->toBeNull()
        ->and($this->workspace->plan_key)->toBe('pro');
});

it('refuses to resume a subscription that is not paused', function () {
    actingAs($this->owner)
        ->deleteJson('/billing/pause')
        ->assertStatus(400);
});

// --- Plan fallback ---

it('uses Free plan limits while paused', function () {
    expect($this->workspace->plan_key)->toBe('pro');

    pauseWorkspace($this->workspace, now()->addMonth());
    $workspace = $this->workspace->fresh();

    foreach (range(1, 2) as $number) {
        WorkspaceApiKey::generateKey($workspace, $this->owner, "Key {$number}", ['read']);
    }

    expect($workspace->plan_key)->toBe('free')
        ->and($workspace->onFreePlan())->toBeTrue()
        ->and($workspace->onProPlan())->toBeFalse()
        ->and(app(PlanLimitService::class)->canCreateApiKey($workspace))->toBeFalse()
        ->and(app(PlanLimitService::class)->getApiRequestsPerMinute($workspace))->toBe(60);
});

it('returns to the paid plan once the resume date passes', function () {
    pauseWorkspace($this->workspace, now()->addMonth());

    $this->travel(1)->months();
    $this->travel(1)->minutes();

    expect($this->workspace->fresh()->plan_key)->toBe('pro');
});

it('keeps an admin plan override while paused', function () {
    pauseWorkspace($this->workspace, now()->addMonth());
    $this->workspace->update(['plan_override' => 'Business']);

    expect($this->workspace->fresh()->plan_key)->toBe('business');
});

it('shows the paused state on the billing page', function () {
    pauseWorkspace($this->workspace, now()->addMonth());

    actingAs($this->owner)
        ->get('/billing')
        ->assertInertia(fn ($page) => $page
            ->where('workspace.plan', 'Free')
            ->where('subscription.paused', true)
            ->where('subscription.plan', 'Pro')
            ->whereNot('subscription.resumes_at', null)
        );
});

// --- Webhook sync ---

function subscriptionUpdatedPayload(?array $pauseCollection): array
{
    return [
        'type' => 'customer.subscription.updated',
        'id' => 'evt_pause',
        'data' => [
            'object' => [
                'id' => 'sub_pause',
                'customer' => 'cus_pause',
                'status' => 'active',
                'pause_collection' => $pauseCollection,
                'items' => [
                    'data' => [
                        [
                            'id' => 'si_pause',
                            'price' => [
                                'id' => config('billing.plans.pro.stripe_price_id.monthly'),
                                'product' => 'prod_pro',
                            ],
                            'quantity' => 1,
                        ],
                    ],
                ],
            ],
        ],
    ];
}

it('syncs a pause made on Stripe from the subscription webhook', function () {
    $resumesAt = now()->addMonths(2)->startOfSecond();

    $this->withoutMiddleware([VerifyWebhookSignature::class])
        ->postJson('/stripe/webhook', subscriptionUpdatedPayload([
            'behavior' => 'void',
            'resumes_at' => $resumesAt->getTimestamp(),
        ]))
        ->assertSuccessful();

    $this->workspace->refresh();

    expect($this->workspace->subscriptionPaused())->toBeTrue()
        ->and($this->workspace->subscription_resumes_at->equalTo($resumesAt))->toBeTrue();
});

it('treats a pause without a resume date as paused until resumed', function () {
    $this->withoutMiddleware([VerifyWebhookSignature::class])
        ->postJson('/stripe/webhook', subscriptionUpdatedPayload(['behavior' => 'void', 'resumes_at' => null]))
        ->assertSuccessful();

    $this->workspace->refresh();

    expect($this->workspace->subscriptionPaused())->toBeTrue()
        ->and($this->workspace->subscription_resumes_at)->toBeNull();
});

it('clears the pause when Stripe resumes collection', function () {
    pauseWorkspace($this->workspace, now()->addMonth());

    $this->withoutMiddleware([VerifyWebhookSignature::class])
        ->postJson('/stripe/webhook', subscriptionUpdatedPayload(null))
        ->assertSuccessful();

    expect($this->workspace->refresh()->subscriptionPaused())->toBeFalse();
});

it('clears the pause when the subscription is deleted', function () {
    pauseWorkspace($this->workspace, now()->addMonth());

    $this->withoutMiddleware([VerifyWebhookSignature::class])
        ->postJson('/stripe/webhook', [
            'type' => 'customer.subscription.deleted',
            'id' => 'evt_pause_deleted',
            'data' => ['object' => ['id' => 'sub_pause', 'customer' => 'cus_pause', 'status' => 'canceled']],
        ])
        ->assertSuccessful();

    expect($this->workspace->refresh()->subscription_paused_at)->toBeNull();
});
