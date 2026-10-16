<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Http\Requests\Settings\UpdateLocaleRequest;
use App\Services\EmailChangeService;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'pendingEmail' => $user->pending_email,
            'status' => $request->session()->get('status'),
            'loginStreak' => [
                'current' => $user->currentLoginStreak(),
                'longest' => $user->longestLoginStreak(),
            ],
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request, EmailChangeService $emailChangeService): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        // The email only changes once the new address is confirmed through EmailChangeService
        $user->fill([
            'name' => $validated['name'],
            'bio' => $validated['bio'] ?? null,
            'timezone' => $validated['timezone'],
            'date_format' => $validated['date_format'],
        ]);

        if ($request->hasFile('avatar')) {
            if ($user->getRawOriginal('avatar_url')) {
                Storage::disk('public')->delete($user->getRawOriginal('avatar_url'));
            }
            $user->avatar_url = $request->file('avatar')->store('avatars', 'public');
        } elseif ($request->boolean('remove_avatar') && $user->getRawOriginal('avatar_url')) {
            Storage::disk('public')->delete($user->getRawOriginal('avatar_url'));
            $user->avatar_url = null;
        }

        $user->save();

        if ($validated['email'] !== $user->email) {
            $emailChangeService->request($user, $validated['email']);

            return to_route('profile.edit')->with('status', 'email-change-requested');
        }

        return to_route('profile.edit');
    }

    /**
     * Update the user's locale preference.
     */
    public function updateLocale(UpdateLocaleRequest $request): RedirectResponse
    {
        $request->user()->update([
            'locale' => $request->validated()['locale'],
        ]);

        return back();
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        // Check for workspaces where the user is the owner
        $ownedWorkspaces = $user->ownedWorkspaces;

        foreach ($ownedWorkspaces as $workspace) {
            // If it's a shared workspace with other members, prevent deletion
            if (! $workspace->personal_workspace && $workspace->users()->count() > 1) {
                return back()->withErrors([
                    'account' => __('You cannot delete your account while you own a workspace with other members. Please transfer ownership or remove all members first.'),
                ]);
            }
        }

        // logout before deleting to avoid session issues
        Auth::logout();

        // Delete personal/solely-owned workspaces
        foreach ($ownedWorkspaces as $workspace) {
            // Cancel subscriptions if any
            if ($workspace->subscribed()) {
                $workspace->subscription()->cancelNow();
            }

            $workspace->delete();
        }

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
