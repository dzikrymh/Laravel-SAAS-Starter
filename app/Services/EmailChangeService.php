<?php

namespace App\Services;

use App\Enums\EmailChangeResult;
use App\Models\User;
use App\Notifications\EmailChangeRequestedNotification;
use App\Notifications\VerifyNewEmailNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;

class EmailChangeService
{
    public const LINK_EXPIRY_MINUTES = 60;

    /**
     * Store the new address as pending, email it a confirmation link, and warn the current address.
     */
    public function request(User $user, string $newEmail): void
    {
        if ($newEmail === $user->pending_email) {
            return;
        }

        $user->forceFill(['pending_email' => $newEmail])->save();

        $this->sendConfirmationLink($user);
        $user->notify(new EmailChangeRequestedNotification($newEmail));
    }

    /**
     * Email a fresh confirmation link to the pending address.
     */
    public function sendConfirmationLink(User $user): void
    {
        $url = URL::temporarySignedRoute(
            'profile.email.verify',
            now()->addMinutes(self::LINK_EXPIRY_MINUTES),
            ['id' => $user->id, 'hash' => sha1($user->pending_email)],
        );

        Notification::route('mail', $user->pending_email)
            ->notify(new VerifyNewEmailNotification($url));
    }

    /**
     * Switch to the pending address when the link matches it.
     */
    public function confirm(User $user, string $hash): EmailChangeResult
    {
        if (! $user->pending_email || ! hash_equals(sha1($user->pending_email), $hash)) {
            return EmailChangeResult::LinkInvalid;
        }

        if (User::where('email', $user->pending_email)->whereKeyNot($user->id)->exists()) {
            $user->forceFill(['pending_email' => null])->save();

            return EmailChangeResult::EmailTaken;
        }

        $user->forceFill([
            'email' => $user->pending_email,
            'pending_email' => null,
            'email_verified_at' => now(),
        ])->save();

        return EmailChangeResult::Confirmed;
    }

    /**
     * Discard the pending address so its confirmation link stops working.
     */
    public function cancel(User $user): void
    {
        $user->forceFill(['pending_email' => null])->save();
    }
}
