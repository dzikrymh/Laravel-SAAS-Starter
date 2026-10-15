<?php

use App\Models\User;

it('lets a user without a password open the authentication page without confirming', function () {
    $user = User::factory()->withoutTwoFactor()->create(['password' => null]);

    $this->actingAs($user)
        ->get(route('security.authentication'))
        ->assertOk();
});

it('still requires password confirmation for a user with a password', function () {
    $user = User::factory()->withoutTwoFactor()->create();

    $this->actingAs($user)
        ->get(route('security.authentication'))
        ->assertRedirect(route('password.confirm'));
});

it('lets a user without a password enable two factor authentication without confirming', function () {
    $user = User::factory()->withoutTwoFactor()->create(['password' => null]);

    $this->actingAs($user)
        ->post(route('two-factor.enable'))
        ->assertRedirect();

    expect($user->refresh()->two_factor_secret)->not->toBeNull();
});

it('requires password confirmation to enable two factor authentication for a user with a password', function () {
    $user = User::factory()->withoutTwoFactor()->create();

    $this->actingAs($user)
        ->post(route('two-factor.enable'))
        ->assertRedirect(route('password.confirm'));

    expect($user->refresh()->two_factor_secret)->toBeNull();
});

it('requires password confirmation again once the user has set a password', function () {
    $user = User::factory()->withoutTwoFactor()->create(['password' => null]);

    $this->actingAs($user)
        ->put(route('user-password.update'), [
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
        ->assertSessionHasNoErrors();

    $this->actingAs($user->refresh())
        ->get(route('security.authentication'))
        ->assertRedirect(route('password.confirm'));
});
