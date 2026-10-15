import { destroy } from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyRegistrationController';
import PasskeyItem from '@/components/passkey-item';
import PasskeyRegister from '@/components/passkey-register';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslations } from '@/hooks/use-translations';
import { type Passkey } from '@/types';
import { router } from '@inertiajs/react';
import { Fingerprint, KeyRound } from 'lucide-react';

interface ManagePasskeysProps {
    passkeys: Passkey[];
}

export default function ManagePasskeys({ passkeys }: ManagePasskeysProps) {
    const { t } = useTranslations();

    const deletePasskey = (id: number, onFinish: () => void) => {
        router.delete(destroy.url(id), {
            preserveScroll: true,
            onFinish,
        });
    };

    const reloadPasskeys = () => {
        router.reload();
    };

    return (
        <Card id="passkeys" className="scroll-mt-16">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Fingerprint className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>
                        {t('settings.passkeys.title', 'Passkeys')}
                    </CardTitle>
                </div>
                <CardDescription>
                    {t(
                        'settings.passkeys.description',
                        'Sign in without a password using Face ID, Touch ID, Windows Hello or a security key. A passkey also counts as two-factor authentication.',
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="overflow-hidden rounded-lg border">
                    {passkeys.length > 0 ? (
                        passkeys.map((passkey) => (
                            <PasskeyItem
                                key={passkey.id}
                                passkey={passkey}
                                onDelete={deletePasskey}
                            />
                        ))
                    ) : (
                        <div className="p-8 text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                                <KeyRound className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium">
                                {t(
                                    'settings.passkeys.empty_title',
                                    'No passkeys yet',
                                )}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {t(
                                    'settings.passkeys.empty_description',
                                    'Add a passkey to sign in without a password',
                                )}
                            </p>
                        </div>
                    )}
                </div>

                <PasskeyRegister onSuccess={reloadPasskeys} />
            </CardContent>
        </Card>
    );
}
