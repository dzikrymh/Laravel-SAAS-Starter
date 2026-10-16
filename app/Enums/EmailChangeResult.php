<?php

namespace App\Enums;

/**
 * Outcome of confirming a pending email change; the value is flashed as the profile page `status`.
 */
enum EmailChangeResult: string
{
    case Confirmed = 'email-changed';
    case LinkInvalid = 'email-change-link-invalid';
    case EmailTaken = 'email-change-email-taken';
}
