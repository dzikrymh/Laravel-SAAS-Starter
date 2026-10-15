import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-translations';
import { usePasskeyRegister } from '@laravel/passkeys/react';
import { KeyRound } from 'lucide-react';
import { useState, type FormEvent } from 'react';

interface PasskeyRegisterProps {
    onSuccess: () => void;
}

function guessDeviceName(): string {
    const userAgent = navigator.userAgent;

    const browser = [
        { pattern: /Edg|Edge/, name: 'Edge' },
        { pattern: /OPR|Opera|OPiOS/, name: 'Opera' },
        { pattern: /Firefox|FxiOS/, name: 'Firefox' },
        { pattern: /Chrome|CriOS/, name: 'Chrome' },
        { pattern: /Safari/, name: 'Safari' },
    ].find(({ pattern }) => pattern.test(userAgent))?.name;

    const os = [
        { pattern: /iPhone/, name: 'iPhone' },
        { pattern: /iPad|Macintosh(?=.*Mobile)/, name: 'iPad' },
        { pattern: /Android/, name: 'Android' },
        { pattern: /Mac/, name: 'Mac' },
        { pattern: /Windows/, name: 'Windows' },
    ].find(({ pattern }) => pattern.test(userAgent))?.name;

    return [browser, os].filter(Boolean).join(' on ');
}

export default function PasskeyRegister({ onSuccess }: PasskeyRegisterProps) {
    const { t } = useTranslations();
    const [name, setName] = useState(guessDeviceName);
    const [showForm, setShowForm] = useState(false);
    const { register, isLoading, error, isSupported } = usePasskeyRegister({
        onSuccess: () => {
            setName(guessDeviceName());
            setShowForm(false);
            onSuccess();
        },
    });

    const submit = async (event: FormEvent) => {
        event.preventDefault();

        if (!name.trim()) {
            return;
        }

        await register(name.trim());
    };

    if (!isSupported) {
        return (
            <p className="text-sm text-muted-foreground">
                {t(
                    'settings.passkeys.not_supported',
                    'Passkeys are not supported in this browser.',
                )}
            </p>
        );
    }

    if (!showForm) {
        return (
            <Button variant="outline" onClick={() => setShowForm(true)}>
                <KeyRound className="mr-2 h-4 w-4" />
                {t('settings.passkeys.add', 'Add passkey')}
            </Button>
        );
    }

    return (
        <form
            onSubmit={submit}
            className="space-y-4 rounded-lg border bg-muted/50 p-4"
        >
            <div className="grid gap-2">
                <Label htmlFor="passkey-name">
                    {t('settings.passkeys.name', 'Passkey name')}
                </Label>
                <Input
                    id="passkey-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={t(
                        'settings.passkeys.name_placeholder',
                        'e.g., MacBook Pro, iPhone',
                    )}
                    maxLength={255}
                    autoFocus
                />
                <p className="text-xs text-muted-foreground">
                    {t(
                        'settings.passkeys.name_help',
                        'A name helps you identify this passkey later.',
                    )}
                </p>
            </div>

            {error && <InputError message={error} />}

            <div className="flex gap-2">
                <Button type="submit" disabled={isLoading || !name.trim()}>
                    {isLoading
                        ? t('settings.passkeys.registering', 'Registering...')
                        : t('settings.passkeys.register', 'Register passkey')}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowForm(false)}
                >
                    {t('settings.passkeys.cancel', 'Cancel')}
                </Button>
            </div>
        </form>
    );
}
