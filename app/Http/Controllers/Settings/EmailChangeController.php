<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Services\EmailChangeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailChangeController extends Controller
{
    public function __construct(protected EmailChangeService $emailChangeService) {}

    /**
     * Confirm the pending email address from the signed link sent to it.
     */
    public function verify(Request $request, int $id, string $hash): RedirectResponse
    {
        abort_unless($request->user()->id === $id, 403);

        $result = $this->emailChangeService->confirm($request->user(), $hash);

        return to_route('profile.edit')->with('status', $result->value);
    }

    /**
     * Send the confirmation link to the pending email address again.
     */
    public function resend(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->pending_email) {
            $this->emailChangeService->sendConfirmationLink($user);
        }

        return back()->with('status', 'email-change-link-sent');
    }

    /**
     * Cancel the pending email change.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $this->emailChangeService->cancel($request->user());

        return back()->with('status', 'email-change-cancelled');
    }
}
