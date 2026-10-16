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

it('blocks creating an API key over the plan limit and flashes upgrade details', function () {
    createApiKeys($this->workspace, $this->owner, 2);

    actingAs($this->owner)
        ->post('/workspaces/api-keys', ['name' => 'Third Key', 'scopes' => ['read']])
        ->assertRedirect()
        ->assertSessionHas('error')
        ->assertSessionHas('plan_limit', [
            'resource' => 'api_keys',
            'can_upgrade' => true,
            'current_plan' => ['key' => 'free', 'name' => 'Free', 'limit' => 2],
            'next_plan' => ['key' => 'pro', 'name' => 'Pro', 'limit' => 10],
        ]);

    expect($this->workspace->apiKeys()->count())->toBe(2);
});

it('allows creating an API key under the plan limit', function () {
    actingAs($this->owner)
        ->post('/workspaces/api-keys', ['name' => 'First Key', 'scopes' => ['read']])
        ->assertRedirect()
        ->assertSessionMissing('plan_limit');

    expect($this->workspace->apiKeys()->count())->toBe(1);
});

it('blocks creating a webhook over the plan limit', function () {
    $this->workspace->webhookEndpoints()->create(['url' => 'https://example.com/one', 'events' => []]);

    actingAs($this->owner)
        ->post("/workspaces/{$this->workspace->id}/webhooks", ['url' => 'https://example.com/two'])
        ->assertRedirect()
        ->assertSessionHas('plan_limit.resource', 'webhooks')
        ->assertSessionHas('plan_limit.current_plan.limit', 1);

    expect($this->workspace->webhookEndpoints()->count())->toBe(1);
});

it('flashes upgrade details when inviting over the team member limit', function () {
    config(['billing.plans.free.limits.team_members' => 1]);

    actingAs($this->owner)
        ->post('/team/invite', ['email' => 'new@example.com', 'role' => 'member'])
        ->assertRedirect()
        ->assertSessionHas('plan_limit.resource', 'team_members');
});

it('flashes upgrade details when creating an invite link over the team member limit', function () {
    config(['billing.plans.free.limits.team_members' => 1]);

    actingAs($this->owner)
        ->post('/team/invite-links', ['role' => 'member'])
        ->assertRedirect()
        ->assertSessionHas('plan_limit.resource', 'team_members');
});

it('does not offer the upgrade button to members who cannot manage billing', function () {
    $admin = User::factory()->create();
    $this->workspace->users()->attach($admin->id, ['role' => 'admin']);
    $admin->switchWorkspace($this->workspace);
    createApiKeys($this->workspace, $this->owner, 2);

    actingAs($admin)
        ->post('/workspaces/api-keys', ['name' => 'Third Key', 'scopes' => ['read']])
        ->assertSessionHas('plan_limit.can_upgrade', false)
        ->assertSessionHas('plan_limit.next_plan.key', 'pro');
});

it('offers the business plan when the pro limit is reached', function () {
    $this->workspace->update(['plan_override' => 'Pro']);
    createApiKeys($this->workspace, $this->owner, 10);

    actingAs($this->owner)
        ->post('/workspaces/api-keys', ['name' => 'Eleventh Key', 'scopes' => ['read']])
        ->assertSessionHas('plan_limit.current_plan.key', 'pro')
        ->assertSessionHas('plan_limit.next_plan', ['key' => 'business', 'name' => 'Business', 'limit' => -1]);
});

it('has no next plan on the highest plan', function () {
    $this->workspace->update(['plan_override' => 'Business']);

    $details = app(PlanLimitService::class)->limitReachedDetails($this->workspace->fresh(), 'api_keys', $this->owner);

    expect($details['next_plan'])->toBeNull()
        ->and($details['can_upgrade'])->toBeFalse();
});

it('shares the plan limit flash with the next page', function () {
    createApiKeys($this->workspace, $this->owner, 2);

    actingAs($this->owner)
        ->from('/workspaces/api-keys')
        ->followingRedirects()
        ->post('/workspaces/api-keys', ['name' => 'Third Key', 'scopes' => ['read']])
        ->assertInertia(fn ($page) => $page
            ->component('workspaces/api-keys')
            ->where('flash.plan_limit.resource', 'api_keys')
            ->where('flash.plan_limit.next_plan.name', 'Pro')
        );
});

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
