<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EmailChangeRequestedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public string $newEmail) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your email address is being changed')
            ->greeting('Hello '.$notifiable->name.',')
            ->line("Someone asked to change the email address on your account to {$this->newEmail}.")
            ->line('The change only takes effect after the new address is confirmed. Until then, you keep signing in with this email address.')
            ->action('Review Profile Settings', route('profile.edit'))
            ->line('If you did not request this change, cancel it from your profile settings and change your password right away.');
    }
}
