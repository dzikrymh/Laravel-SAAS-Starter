<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('lists the user passkeys on the authentication page', function () {
    $user = User::factory()->withoutTwoFactor()->withPasskey('Work laptop')->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('security.authentication'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/security/authentication')
            ->where('canManagePasskeys', true)
            ->has('passkeys', 1)
            ->where('passkeys.0.name', 'Work laptop')
            ->has('passkeys.0.created_at_diff')
        );
});

it('does not list passkeys of other users', function () {
    User::factory()->withPasskey()->create();
    $user = User::factory()->withoutTwoFactor()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('security.authentication'))
        ->assertInertia(fn (Assert $page) => $page->has('passkeys', 0));
});

it('treats a passkey as a second factor', function () {
    $userWithPasskey = User::factory()->withoutTwoFactor()->withPasskey()->create();
    $userWithoutSecondFactor = User::factory()->withoutTwoFactor()->create();

    expect($userWithPasskey->hasSecondFactor())->toBeTrue()
        ->and($userWithoutSecondFactor->hasSecondFactor())->toBeFalse();
});

it('counts a passkey towards the security score and drops the two factor recommendation', function () {
    $user = User::factory()->withoutTwoFactor()->withPasskey()->create();

    $response = $this->actingAs($user)
        ->getJson('/settings/security-summary')
        ->assertOk()
        ->assertJsonPath('authentication.passkeys.count', 1)
        ->assertJsonPath('authentication.two_factor.enabled', false)
        ->assertJsonPath('security_score', 80);

    expect(collect($response->json('recommendations'))->pluck('action'))
        ->not->toContain('/settings/security/authentication#two-factor');
});

it('requires a passwordless user with a passkey to confirm before managing passkeys', function () {
    $user = User::factory()->withoutTwoFactor()->withPasskey()->create(['password' => null]);
    $passkey = $user->passkeys()->first();

    $this->actingAs($user)
        ->delete(route('passkey.destroy', $passkey))
        ->assertRedirect(route('password.confirm'));

    expect($passkey->fresh())->not->toBeNull();
});

it('requires a passwordless user with a passkey to confirm before opening the authentication page', function () {
    $user = User::factory()->withoutTwoFactor()->withPasskey()->create(['password' => null]);

    $this->actingAs($user)
        ->get(route('security.authentication'))
        ->assertRedirect(route('password.confirm'));
});

it('offers only passkey confirmation to a passwordless user with a passkey', function () {
    $user = User::factory()->withoutTwoFactor()->withPasskey()->create(['password' => null]);

    $this->actingAs($user)
        ->get(route('password.confirm'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/confirm-password')
            ->where('hasPassword', false)
            ->where('hasPasskeys', true)
        );
});

it('offers both confirmation methods to a user with a password and a passkey', function () {
    $user = User::factory()->withoutTwoFactor()->withPasskey()->create();

    $this->actingAs($user)
        ->get(route('password.confirm'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('hasPassword', true)
            ->where('hasPasskeys', true)
        );
});

it('lets a confirmed user delete their own passkey', function () {
    $user = User::factory()->withoutTwoFactor()->withPasskey()->create();
    $passkey = $user->passkeys()->first();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->from(route('security.authentication'))
        ->delete(route('passkey.destroy', $passkey))
        ->assertRedirect(route('security.authentication'));

    expect($passkey->fresh())->toBeNull();
});

it('does not let a user delete another user passkey', function () {
    $owner = User::factory()->withPasskey()->create();
    $passkey = $owner->passkeys()->first();
    $user = User::factory()->withoutTwoFactor()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->delete(route('passkey.destroy', $passkey));

    expect($passkey->fresh())->not->toBeNull();
});

it('advertises the passkey management endpoints', function () {
    $this->getJson('/.well-known/passkey-endpoints')
        ->assertOk()
        ->assertJson([
            'enroll' => route('security.authentication'),
            'manage' => route('security.authentication'),
        ]);
});
