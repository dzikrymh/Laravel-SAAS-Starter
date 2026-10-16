<?php

use App\Models\User;
use App\Notifications\EmailChangeRequestedNotification;
use App\Notifications\VerifyNewEmailNotification;
use App\Services\EmailChangeService;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Support\Facades\Notification;
use Illuminate\Testing\TestResponse;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    Notification::fake();
    $this->user = User::factory()->create(['email' => 'old@example.com']);
});

function requestEmailChange(User $user, string $newEmail): TestResponse
{
    return actingAs($user)->patch(route('profile.update'), [
        'name' => $user->name,
        'email' => $newEmail,
        'timezone' => 'UTC',
        'date_format' => 'Y-m-d',
    ]);
}

function sentConfirmationUrl(string $email): string
{
    $url = null;

    Notification::assertSentOnDemand(
        VerifyNewEmailNotification::class,
        function (VerifyNewEmailNotification $notification, array $channels, AnonymousNotifiable $notifiable) use ($email, &$url) {
            if ($notifiable->routes['mail'] !== $email) {
                return false;
            }

            $url = $notification->url;

            return true;
        },
    );

    return $url;
}

it('keeps the current email until the new one is confirmed', function () {
    requestEmailChange($this->user, 'new@example.com')
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'))
        ->assertSessionHas('status', 'email-change-requested');

    $this->user->refresh();

    expect($this->user->email)->toBe('old@example.com')
        ->and($this->user->pending_email)->toBe('new@example.com')
        ->and($this->user->email_verified_at)->not->toBeNull();
});

it('sends a confirmation link to the new address and a security notice to the old one', function () {
    requestEmailChange($this->user, 'new@example.com');

    expect(sentConfirmationUrl('new@example.com'))->toContain('/settings/profile/email/verify/');

    Notification::assertSentTo(
        $this->user,
        EmailChangeRequestedNotification::class,
        fn (EmailChangeRequestedNotification $notification) => $notification->newEmail === 'new@example.com',
    );
});

it('shows the pending email on the profile page', function () {
    requestEmailChange($this->user, 'new@example.com');

    actingAs($this->user)
        ->get(route('profile.edit'))
        ->assertInertia(fn ($page) => $page->where('pendingEmail', 'new@example.com'));
});

it('switches to the new email when the confirmation link is opened', function () {
    $this->user->forceFill(['email_verified_at' => null])->save();
    requestEmailChange($this->user, 'new@example.com');

    actingAs($this->user)
        ->get(sentConfirmationUrl('new@example.com'))
        ->assertRedirect(route('profile.edit'))
        ->assertSessionHas('status', 'email-changed');

    $this->user->refresh();

    expect($this->user->email)->toBe('new@example.com')
        ->and($this->user->pending_email)->toBeNull()
        ->and($this->user->email_verified_at)->not->toBeNull();
});

it('rejects the link of an earlier request after another address was requested', function () {
    requestEmailChange($this->user, 'first@example.com');
    $firstUrl = sentConfirmationUrl('first@example.com');

    requestEmailChange($this->user->refresh(), 'second@example.com');

    actingAs($this->user)
        ->get($firstUrl)
        ->assertSessionHas('status', 'email-change-link-invalid');

    expect($this->user->refresh()->email)->toBe('old@example.com')
        ->and($this->user->pending_email)->toBe('second@example.com');
});

it('rejects tampered, expired, and other users\' links', function () {
    requestEmailChange($this->user, 'new@example.com');
    $url = sentConfirmationUrl('new@example.com');

    actingAs($this->user)->get($url.'x')->assertForbidden();

    actingAs(User::factory()->create())->get($url)->assertForbidden();

    $this->travel(EmailChangeService::LINK_EXPIRY_MINUTES + 1)->minutes();
    actingAs($this->user)->get($url)->assertForbidden();

    expect($this->user->refresh()->email)->toBe('old@example.com');
});

it('asks guests to log in before confirming', function () {
    requestEmailChange($this->user, 'new@example.com');
    $url = sentConfirmationUrl('new@example.com');

    auth()->logout();

    $this->get($url)->assertRedirect(route('login'));
});

it('does not switch when another account took the address meanwhile', function () {
    requestEmailChange($this->user, 'new@example.com');
    $url = sentConfirmationUrl('new@example.com');

    User::factory()->create(['email' => 'new@example.com']);

    actingAs($this->user)
        ->get($url)
        ->assertSessionHas('status', 'email-change-email-taken');

    expect($this->user->refresh()->email)->toBe('old@example.com')
        ->and($this->user->pending_email)->toBeNull();
});

it('cancels the pending change so the link stops working', function () {
    requestEmailChange($this->user, 'new@example.com');
    $url = sentConfirmationUrl('new@example.com');

    actingAs($this->user)
        ->delete(route('profile.email.destroy'))
        ->assertSessionHas('status', 'email-change-cancelled');

    expect($this->user->refresh()->pending_email)->toBeNull();

    actingAs($this->user)
        ->get($url)
        ->assertSessionHas('status', 'email-change-link-invalid');

    expect($this->user->refresh()->email)->toBe('old@example.com');
});

it('resends the confirmation link to the pending address', function () {
    requestEmailChange($this->user, 'new@example.com');

    actingAs($this->user->refresh())
        ->post(route('profile.email.resend'))
        ->assertSessionHas('status', 'email-change-link-sent');

    Notification::assertSentOnDemandTimes(VerifyNewEmailNotification::class, 2);
});

it('does not resend when the same pending address is submitted again', function () {
    requestEmailChange($this->user, 'new@example.com');
    requestEmailChange($this->user->refresh(), 'new@example.com');

    Notification::assertSentOnDemandTimes(VerifyNewEmailNotification::class, 1);
    Notification::assertSentToTimes($this->user, EmailChangeRequestedNotification::class, 1);
});

it('does not start a change when the email is unchanged', function () {
    requestEmailChange($this->user, 'old@example.com')
        ->assertSessionMissing('status');

    expect($this->user->refresh()->pending_email)->toBeNull();
    Notification::assertNothingSent();
});

it('rejects an address that belongs to another account', function () {
    User::factory()->create(['email' => 'taken@example.com']);

    requestEmailChange($this->user, 'taken@example.com')
        ->assertSessionHasErrors('email');

    expect($this->user->refresh()->pending_email)->toBeNull();
});
