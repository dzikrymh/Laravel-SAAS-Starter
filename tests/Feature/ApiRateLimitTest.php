<?php

use App\Models\ApiRequestLog;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceApiKey;
use App\Services\PlanLimitService;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->workspace = Workspace::factory()->create(['owner_id' => $this->user->id]);
    $this->workspace->addUser($this->user, 'owner');
});

function apiKeyHeaders(Workspace $workspace, User $user, string $name = 'Test Key'): array
{
    $result = WorkspaceApiKey::generateKey($workspace, $user, $name, ['read']);

    return ['Authorization' => 'Bearer '.$result['plainTextKey']];
}

it('sends rate limit headers sized by the free plan', function () {
    $this->getJson('/api/v1/workspace', apiKeyHeaders($this->workspace, $this->user))
        ->assertOk()
        ->assertHeader('X-RateLimit-Limit', 60)
        ->assertHeader('X-RateLimit-Remaining', 59);
});

it('uses the rate limit of the workspace plan', function (string $plan, int $expectedLimit) {
    $this->workspace->update(['plan_override' => $plan]);

    $this->getJson('/api/v1/workspace', apiKeyHeaders($this->workspace, $this->user))
        ->assertOk()
        ->assertHeader('X-RateLimit-Limit', $expectedLimit);
})->with([
    'pro' => ['Pro', 300],
    'business' => ['Business', 1000],
]);

it('throttles requests over the limit and logs them as throttled', function () {
    config(['billing.plans.free.api_requests_per_minute' => 2]);
    $headers = apiKeyHeaders($this->workspace, $this->user);

    $this->getJson('/api/v1/workspace', $headers)->assertOk();
    $this->getJson('/api/v1/workspace', $headers)->assertOk();

    $this->getJson('/api/v1/workspace', $headers)
        ->assertTooManyRequests()
        ->assertHeader('Retry-After')
        ->assertHeader('X-RateLimit-Reset');

    expect(ApiRequestLog::where('workspace_id', $this->workspace->id)->count())->toBe(3)
        ->and(ApiRequestLog::where('was_throttled', true)->count())->toBe(1);
});

it('gives each API key its own rate limit bucket', function () {
    config(['billing.plans.free.api_requests_per_minute' => 1]);
    $firstKeyHeaders = apiKeyHeaders($this->workspace, $this->user, 'First Key');
    $secondKeyHeaders = apiKeyHeaders($this->workspace, $this->user, 'Second Key');

    $this->getJson('/api/v1/workspace', $firstKeyHeaders)->assertOk();
    $this->getJson('/api/v1/workspace', $firstKeyHeaders)->assertTooManyRequests();

    $this->getJson('/api/v1/workspace', $secondKeyHeaders)->assertOk();
});

it('returns a json 429 even when the client does not ask for json', function () {
    config(['billing.plans.free.api_requests_per_minute' => 1]);
    $headers = apiKeyHeaders($this->workspace, $this->user);

    $this->get('/api/v1/workspace', $headers)->assertOk();

    $this->get('/api/v1/workspace', $headers)
        ->assertTooManyRequests()
        ->assertJson(['message' => 'Too Many Attempts.']);
});

it('falls back to the free plan limit for unknown plans', function () {
    $this->workspace->update(['plan_override' => 'Enterprise']);

    expect(app(PlanLimitService::class)->getApiRequestsPerMinute($this->workspace->fresh()))->toBe(60);
});

it('shows the plan rate limit on the API usage dashboard', function () {
    $this->user->switchWorkspace($this->workspace);

    $this->actingAs($this->user)
        ->get('/workspaces/api-usage')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('workspaces/api-usage')
            ->where('rateLimit.requestsPerMinute', 60)
            ->where('rateLimit.planName', 'Free')
        );
});
