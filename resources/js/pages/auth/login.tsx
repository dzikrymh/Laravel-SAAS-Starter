import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import SocialLoginButtons from '@/components/social-login-buttons';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from '@/hooks/use-translations';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { useState } from 'react';

const developerAccounts = [
    { label: 'Super Admin', email: 'superadmin@example.com' },
    { label: 'Admin', email: 'admin@example.com' },
    { label: 'Demo', email: 'demo@example.com' },
];

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
    email?: string;
    redirect?: string;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
    email,
    redirect,
}: LoginProps) {
    const { t } = useTranslations();
    const [showPassword, setShowPassword] = useState(false);

    // Build register URL with email and redirect params if present
    const registerUrl = () => {
        const baseUrl = register();
        const params = new URLSearchParams();
        if (email) params.set('email', email);
        if (redirect) params.set('redirect', redirect);
        return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
    };

    return (
        <AuthLayout
            title={t('auth.login.title', 'Welcome back')}
            description={t(
                'auth.login.description',
                'Log in to your workspace to continue.',
            )}
        >
            <Head title={t('auth.login.page_title', 'Log in')} />

            {status && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <SocialLoginButtons showDivider={false} />

                        <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                            <span className="h-px flex-1 bg-border" />
                            {t('auth.or_with_email', 'Or with email')}
                            <span className="h-px flex-1 bg-border" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">
                                {t('auth.email', 'Email address')}
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus={!email}
                                tabIndex={1}
                                autoComplete="email"
                                placeholder={t(
                                    'auth.email_placeholder',
                                    'email@example.com',
                                )}
                                defaultValue={email}
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">
                                    {t('auth.password', 'Password')}
                                </Label>
                                {canResetPassword && (
                                    <TextLink
                                        href={request()}
                                        className="ml-auto text-sm font-semibold text-highlight no-underline hover:underline"
                                        tabIndex={5}
                                    >
                                        {t(
                                            'auth.forgot_password',
                                            'Forgot password?',
                                        )}
                                    </TextLink>
                                )}
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder={t('auth.password', 'Password')}
                                    autoFocus={!!email}
                                    className="pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (isVisible) => !isVisible,
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? t(
                                                  'auth.hide_password',
                                                  'Hide password',
                                              )
                                            : t(
                                                  'auth.show_password',
                                                  'Show password',
                                              )
                                    }
                                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-[18px]" />
                                    ) : (
                                        <Eye className="size-[18px]" />
                                    )}
                                </button>
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex min-h-11 items-center gap-3">
                            <Checkbox
                                id="remember"
                                name="remember"
                                tabIndex={3}
                            />
                            <Label
                                htmlFor="remember"
                                className="cursor-pointer text-sm font-normal text-muted-foreground"
                            >
                                {t('auth.remember_me', 'Keep me signed in for 30 days')}
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            className="h-12 w-full text-[15px] transition-[translate,box-shadow] hover:-translate-y-px hover:shadow-[0_10px_26px_-10px_var(--primary)]"
                            size="lg"
                            tabIndex={4}
                            disabled={processing}
                            data-test="login-button"
                        >
                            {processing && <Spinner />}
                            {t('auth.login.button', 'Sign in')}
                        </Button>

                        <div className="flex gap-2.5 [&>*]:flex-1">
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="w-full"
                            >
                                <Link href="/magic-login">
                                    <Mail />
                                    {t('auth.magic_link.short', 'Magic link')}
                                </Link>
                            </Button>
                            <PasskeyVerify
                                size="lg"
                                label={t('auth.passkey.short', 'Passkey')}
                            />
                        </div>

                        {canRegister && (
                            <div className="text-center text-sm text-muted-foreground">
                                {t('auth.no_account', "Don't have an account?")}{' '}
                                <TextLink
                                    href={registerUrl()}
                                    tabIndex={5}
                                    className="font-semibold text-highlight no-underline hover:underline"
                                >
                                    {t('auth.sign_up', 'Create one free')}
                                </TextLink>
                            </div>
                        )}

                        <div className="flex flex-col gap-2.5 rounded-xl border border-dashed border-amber-300 bg-amber-50 p-3.5 dark:border-amber-500/40 dark:bg-amber-500/10">
                            <span className="font-mono text-xs text-amber-800 dark:text-amber-300">
                                DEV · quick login (local only)
                            </span>
                            <div className="grid grid-cols-3 gap-2">
                                {developerAccounts.map((account) => (
                                    <Button
                                        key={account.email}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-9 bg-card px-2 text-xs"
                                        onClick={() => {
                                            const e = document.getElementById(
                                                'email',
                                            ) as HTMLInputElement;
                                            const p = document.getElementById(
                                                'password',
                                            ) as HTMLInputElement;
                                            if (e && p) {
                                                e.value = account.email;
                                                p.value = 'password';
                                                e.form?.requestSubmit();
                                            }
                                        }}
                                    >
                                        {account.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
