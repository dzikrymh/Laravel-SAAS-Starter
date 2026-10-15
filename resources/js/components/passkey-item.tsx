import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useTranslations } from '@/hooks/use-translations';
import { type Passkey } from '@/types';
import { KeyRound, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface PasskeyItemProps {
    passkey: Passkey;
    onDelete: (id: number, onFinish: () => void) => void;
}

export default function PasskeyItem({ passkey, onDelete }: PasskeyItemProps) {
    const { t } = useTranslations();
    const [isDeleting, setIsDeleting] = useState(false);

    const deletePasskey = () => {
        setIsDeleting(true);
        onDelete(passkey.id, () => setIsDeleting(false));
    };

    return (
        <div className="flex items-center justify-between gap-4 border-b p-4 last:border-b-0">
            <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <KeyRound className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium">{passkey.name}</p>
                        {passkey.authenticator && (
                            <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase ring-1 ring-border ring-inset">
                                {passkey.authenticator}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {t('settings.passkeys.added', 'Added {{time}}', {
                            time: passkey.created_at_diff,
                        })}
                        {passkey.last_used_at_diff && (
                            <>
                                <span className="mx-1 text-muted-foreground/50">
                                    /
                                </span>
                                {t(
                                    'settings.passkeys.last_used',
                                    'Last used {{time}}',
                                    { time: passkey.last_used_at_diff },
                                )}
                            </>
                        )}
                    </p>
                </div>
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">
                            {t('settings.passkeys.remove', 'Remove passkey')}
                        </span>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>
                        {t('settings.passkeys.remove', 'Remove passkey')}
                    </DialogTitle>
                    <DialogDescription>
                        {t(
                            'settings.passkeys.remove_description',
                            'Are you sure you want to remove the "{{name}}" passkey? You will no longer be able to use it to sign in.',
                            { name: passkey.name },
                        )}
                    </DialogDescription>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary">
                                {t('settings.passkeys.cancel', 'Cancel')}
                            </Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={deletePasskey}
                            disabled={isDeleting}
                        >
                            {isDeleting
                                ? t('settings.passkeys.removing', 'Removing...')
                                : t(
                                      'settings.passkeys.remove',
                                      'Remove passkey',
                                  )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
