<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

test('password update page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('security.authentication'));

    $response->assertStatus(200);
});

test('password can be updated', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->from(route('security.authentication'))
        ->put(route('user-password.update'), [
            'current_password' => 'password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('security.authentication'));

    expect(Hash::check('new-password', $user->refresh()->password))->toBeTrue();
});

test('correct password must be provided to update password', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->from(route('security.authentication'))
        ->put(route('user-password.update'), [
            'current_password' => 'wrong-password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

    $response
        ->assertSessionHasErrors('current_password')
        ->assertRedirect(route('security.authentication'));
});

test('user without a password can set one without providing a current password', function () {
    $user = User::factory()->create(['password' => null]);

    $response = $this
        ->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->from(route('security.authentication'))
        ->put(route('user-password.update'), [
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('security.authentication'));

    expect(Hash::check('new-password', $user->refresh()->password))->toBeTrue();
});

test('user with a password must provide the current password', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->from(route('security.authentication'))
        ->put(route('user-password.update'), [
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

    $response->assertSessionHasErrors('current_password');

    expect(Hash::check('password', $user->refresh()->password))->toBeTrue();
});

test('authentication page tells whether the user has a password', function (?string $password, bool $hasPassword) {
    $user = User::factory()->create(['password' => $password]);

    $this
        ->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('security.authentication'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/security/authentication')
            ->where('hasPassword', $hasPassword)
        );
})->with([
    'with password' => ['password', true],
    'without password' => [null, false],
]);
