<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\TwoFactorAuthenticationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Laravel\Fortify\Features;

class TwoFactorAuthenticationController extends Controller implements HasMiddleware
{
    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return Features::optionEnabled(Features::twoFactorAuthentication(), 'confirmPassword')
            ? [new Middleware('password.confirm', only: ['show'])]
            : [];
    }

    /**
     * Redirect to the combined authentication settings page, which renders the 2FA settings.
     */
    public function show(TwoFactorAuthenticationRequest $request): RedirectResponse
    {
        if (! Features::canManageTwoFactorAuthentication()) {
            abort(403, 'Two-factor authentication is not enabled.');
        }

        $request->ensureStateIsValid();

        return to_route('security.authentication');
    }
}
