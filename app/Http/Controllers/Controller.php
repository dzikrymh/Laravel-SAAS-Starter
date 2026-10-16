<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Workspace;
use App\Services\PlanLimitService;
use Illuminate\Http\RedirectResponse;

abstract class Controller
{
    /**
     * Redirect back with the error message and the details the upgrade modal needs.
     *
     * @param  'team_members'|'api_keys'|'webhooks'  $resource
     */
    protected function planLimitReached(Workspace $workspace, User $user, string $resource, string $message): RedirectResponse
    {
        return back()
            ->with('error', $message)
            ->with('plan_limit', app(PlanLimitService::class)->limitReachedDetails($workspace, $resource, $user));
    }
}
