import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from '@/hooks/use-translations';
import { dashboard } from '@/routes';
import type { UrlMethodPair } from '@inertiajs/core';
import { router } from '@inertiajs/react';
import { usePasskeyVerify } from '@laravel/passkeys/react';
import { KeyRound } from 'lucide-react';

interface PasskeyVerifyProps {
    routes?: {
        options: UrlMethodPair;
        submit: UrlMethodPair;
    };
    label?: string;
    loadingLabel?: string;
    size?: 'default' | 'lg';
}

export default function PasskeyVerify({
    routes,
    label,
    loadingLabel,
    size = 'default',
}: PasskeyVerifyProps) {
    const { t } = useTranslations();
    const { verify, isLoading, error, isSupported } = usePasskeyVerify({
        ...(routes && {
            routes: {
                options: routes.options.url,
                submit: routes.submit.url,
            },
        }),
        onSuccess: (response) => {
            router.visit(response.redirect ?? dashboard.url());
        },
    });

    if (!isSupported) {
        return null;
    }

    return (
        <div className="grid gap-2">
            <Button
                type="button"
                variant="outline"
                className="w-full"
                size={size}
                onClick={verify}
                disabled={isLoading}
            >
                {isLoading ? <Spinner /> : <KeyRound className="h-4 w-4" />}
                {isLoading
                    ? (loadingLabel ??
                      t('auth.passkey.signing_in', 'Authenticating...'))
                    : (label ??
                      t('auth.passkey.sign_in', 'Sign in with a passkey'))}
            </Button>
            {error && <InputError message={error} className="text-center" />}
        </div>
    );
}
