<?php

namespace App\Notifications;

use App\Services\EmailChangeService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VerifyNewEmailNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public string $url) {}

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
            ->subject('Confirm your new email address')
            ->greeting('Hello!')
            ->line('You asked to use this email address for your '.config('app.name').' account.')
            ->action('Confirm Email Address', $this->url)
            ->line('This link will expire in '.EmailChangeService::LINK_EXPIRY_MINUTES.' minutes. Your current email address stays active until you confirm.')
            ->line('If you did not request this change, you can safely ignore this email.');
    }
}
