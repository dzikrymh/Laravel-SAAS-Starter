<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Middleware\RequirePassword;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Requires password confirmation, except for users who have neither a password nor a passkey
 * (e.g. accounts created through a social provider), since they have nothing to confirm with.
 * Users with only a passkey still have to confirm, using their passkey.
 */
class RequirePasswordUnlessPasswordless extends RequirePassword
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     * @param  string|null  $redirectToRoute
     * @param  string|int|null  $passwordTimeoutSeconds
     */
    public function handle($request, Closure $next, $redirectToRoute = null, $passwordTimeoutSeconds = null): Response
    {
        $user = $request->user();

        if ($user && is_null($user->password) && ! $user->hasPasskeysEnabled()) {
            return $next($request);
        }

        return parent::handle($request, $next, $redirectToRoute, $passwordTimeoutSeconds);
    }
}
