import {
    index as passkeyConfirmOptions,
    store as passkeyConfirmStore,
} from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyConfirmationController';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from '@/hooks/use-translations';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/password/confirm';
import { Form, Head } from '@inertiajs/react';

interface ConfirmPasswordProps {
    hasPassword: boolean;
    hasPasskeys: boolean;
}

export default function ConfirmPassword({
    hasPassword,
    hasPasskeys,
}: ConfirmPasswordProps) {
    const { t } = useTranslations();

    return (
        <AuthLayout
            title={
                hasPassword
                    ? t(
                          'auth.confirm_password_page.title',
                          'Confirm your password',
                      )
                    : t('auth.passkey.confirm_title', 'Confirm your identity')
            }
            description={
                hasPassword
                    ? t(
                          'auth.confirm_password_page.description',
                          'This is a secure area of the application. Please confirm your password before continuing.',
                      )
                    : t(
                          'auth.passkey.confirm_description',
                          'This is a secure area of the application. Please confirm with your passkey before continuing.',
                      )
            }
        >
            <Head
                title={t(
                    'auth.confirm_password_page.page_title',
                    'Confirm password',
                )}
            />

            {hasPasskeys && (
                <PasskeyVerify
                    routes={{
                        options: passkeyConfirmOptions(),
                        submit: passkeyConfirmStore(),
                    }}
                    label={t('auth.passkey.confirm', 'Confirm with passkey')}
                    loadingLabel={t('auth.passkey.confirming', 'Confirming...')}
                />
            )}

            {hasPasskeys && hasPassword && (
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            {t(
                                'auth.passkey.or_confirm_with_password',
                                'Or confirm with password',
                            )}
                        </span>
                    </div>
                </div>
            )}

            {hasPassword && (
                <Form {...store.form()} resetOnSuccess={['password']}>
                    {({ processing, errors }) => (
                        <div className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    {t('auth.password', 'Password')}
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder={t('auth.password', 'Password')}
                                    autoComplete="current-password"
                                    autoFocus
                                />

                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center">
                                <Button
                                    className="w-full text-[15px] transition-[translate,box-shadow] hover:-translate-y-px hover:shadow-[0_10px_26px_-10px_var(--primary)]"
                                    disabled={processing}
                                    data-test="confirm-password-button"
                                >
                                    {processing && <Spinner />}
                                    {t(
                                        'auth.confirm_password_page.button',
                                        'Confirm password',
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </Form>
            )}
        </AuthLayout>
    );
}
