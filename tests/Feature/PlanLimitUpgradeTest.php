<?php

use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceApiKey;
use App\Services\PlanLimitService;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->owner = User::factory()->create();
    $this->workspace = Workspace::factory()->create(['owner_id' => $this->owner->id]);
    $this->workspace->users()->attach($this->owner->id, ['role' => 'owner']);
    $this->owner->switchWorkspace($this->workspace);
});

function createApiKeys(Workspace $workspace, User $user, int $count): void
{
    foreach (range(1, $count) as $number) {
        WorkspaceApiKey::generateKey($workspace, $user, "Key {$number}", ['read']);
    }
}

// --- Enforcement ---

it('blocks creating an API key over the plan limit', function () {
    createApiKeys($this->workspace, $this->owner, 2);

    actingAs($this->owner)
        ->post('/workspaces/api-keys', ['name' => 'Third Key', 'scopes' => ['read']])
        ->assertRedirect()
        ->assertSessionHas('error');

    expect($this->workspace->apiKeys()->count())->toBe(2);
});

it('allows creating an API key under the plan limit', function () {
    actingAs($this->owner)
        ->post('/workspaces/api-keys', ['name' => 'First Key', 'scopes' => ['read']])
        ->assertRedirect()
        ->assertSessionMissing('error');

    expect($this->workspace->apiKeys()->count())->toBe(1);
});

it('blocks creating a webhook over the plan limit', function () {
    $this->workspace->webhookEndpoints()->create(['url' => 'https://example.com/one', 'events' => []]);

    actingAs($this->owner)
        ->post("/workspaces/{$this->workspace->id}/webhooks", ['url' => 'https://example.com/two'])
        ->assertRedirect()
        ->assertSessionHas('error');

    expect($this->workspace->webhookEndpoints()->count())->toBe(1);
});

// --- Plan limit alert props ---

it('tells the API keys page when the limit is reached', function () {
    actingAs($this->owner)
        ->get('/workspaces/api-keys')
        ->assertInertia(fn ($page) => $page->where('planLimit', null));

    createApiKeys($this->workspace, $this->owner, 2);

    actingAs($this->owner)
        ->get('/workspaces/api-keys')
        ->assertInertia(fn ($page) => $page->where('planLimit', [
            'resource' => 'api_keys',
            'can_upgrade' => true,
            'current_plan' => ['key' => 'free', 'name' => 'Free', 'limit' => 2],
            'next_plan' => ['key' => 'pro', 'name' => 'Pro', 'limit' => 10],
        ]));
});

it('tells the webhooks page when the limit is reached', function () {
    actingAs($this->owner)
        ->get("/workspaces/{$this->workspace->id}/webhooks")
        ->assertInertia(fn ($page) => $page->where('planLimit', null));

    $this->workspace->webhookEndpoints()->create(['url' => 'https://example.com/one', 'events' => []]);

    actingAs($this->owner)
        ->get("/workspaces/{$this->workspace->id}/webhooks")
        ->assertInertia(fn ($page) => $page
            ->where('planLimit.resource', 'webhooks')
            ->where('planLimit.current_plan.limit', 1)
            ->where('planLimit.next_plan.limit', 5)
        );
});

it('tells the team and CSV import pages when the member limit is reached', function (string $url) {
    actingAs($this->owner)
        ->get($url)
        ->assertInertia(fn ($page) => $page->where('planLimit', null));

    config(['billing.plans.free.limits.team_members' => 1]);

    actingAs($this->owner)
        ->get($url)
        ->assertInertia(fn ($page) => $page
            ->where('planLimit.resource', 'team_members')
            ->where('planLimit.current_plan.limit', 1)
        );
})->with(['/team', '/team/import']);

it('does not offer the upgrade to members who cannot manage billing', function () {
    $admin = User::factory()->create();
    $this->workspace->users()->attach($admin->id, ['role' => 'admin']);
    $admin->switchWorkspace($this->workspace);
    createApiKeys($this->workspace, $this->owner, 2);

    actingAs($admin)
        ->get('/workspaces/api-keys')
        ->assertInertia(fn ($page) => $page
            ->where('planLimit.can_upgrade', false)
            ->where('planLimit.next_plan.key', 'pro')
        );
});

it('recommends the business plan when the pro limit is reached', function () {
    $this->workspace->update(['plan_override' => 'Pro']);
    createApiKeys($this->workspace, $this->owner, 10);

    actingAs($this->owner)
        ->get('/workspaces/api-keys')
        ->assertInertia(fn ($page) => $page
            ->where('planLimit.current_plan.key', 'pro')
            ->where('planLimit.next_plan', ['key' => 'business', 'name' => 'Business', 'limit' => -1])
        );
});

it('has no next plan on the highest plan', function () {
    $this->workspace->update(['plan_override' => 'Business']);

    $details = app(PlanLimitService::class)->limitReachedDetails($this->workspace->fresh(), 'api_keys', $this->owner);

    expect($details['next_plan'])->toBeNull()
        ->and($details['can_upgrade'])->toBeFalse();
});

// --- Compare page ---

it('sends every plan limit and the API rate limit to the compare page', function () {
    actingAs($this->owner)
        ->get('/billing/compare')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Billing/compare')
            ->where('plans.0.limits.api_keys', 2)
            ->where('plans.0.limits.webhooks', 1)
            ->where('plans.1.api_requests_per_minute', 300)
        );
});
