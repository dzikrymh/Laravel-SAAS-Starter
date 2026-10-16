import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/toast';
import { useTranslations } from '@/hooks/use-translations';
import http from '@/lib/http';
import { cn } from '@/lib/utils';
import {
    type PlanLimitReached,
    type PlanLimitSummary,
    type SharedData,
} from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';

/**
 * Opens whenever the server flashes `plan_limit` because a plan limit blocked
 * an action (inviting a member, creating an API key or a webhook).
 */
export function UpgradeModal() {
    const { t } = useTranslations();
    const { addToast } = useToast();
    const planLimit = usePage<SharedData>().props.flash?.plan_limit ?? null;
    const [dismissedLimit, setDismissedLimit] =
        useState<PlanLimitReached | null>(null);
    const [upgrading, setUpgrading] = useState(false);

    const open = planLimit !== null && planLimit !== dismissedLimit;

    if (!planLimit) {
        return null;
    }

    const { resource, can_upgrade, current_plan, next_plan } = planLimit;
    const resourceLabel = t(
        `upgrade_modal.resources.${resource}`,
        resource.replace('_', ' '),
    );

    const formatLimit = (plan: PlanLimitSummary) =>
        plan.limit === -1
            ? t('upgrade_modal.unlimited', 'Unlimited')
            : plan.limit.toLocaleString();

    const handleUpgrade = async () => {
        if (!next_plan) {
            return;
        }

        setUpgrading(true);

        try {
            const { data } = await http.post<{
                checkout_url?: string;
                success?: boolean;
                error?: string;
            }>('/billing/subscribe', {
                body: { plan: next_plan.key, billing_period: 'monthly' },
            });

            if (data.checkout_url) {
                window.location.href = data.checkout_url;

                return;
            }

            if (data.error) {
                addToast(data.error, 'error');
                setUpgrading(false);

                return;
            }

            setDismissedLimit(planLimit);
            router.visit('/billing');
        } catch {
            addToast(
                t(
                    'upgrade_modal.upgrade_error',
                    'Could not start the upgrade. Please try again.',
                ),
                'error',
            );
            setUpgrading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setDismissedLimit(planLimit);
                }
            }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="size-5 text-primary" />
                        {t(
                            'upgrade_modal.title',
                            "You've reached your plan limit",
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {t(
                            'upgrade_modal.description',
                            'Your {{plan}} plan includes up to {{limit}} {{resource}}.',
                            {
                                plan: current_plan.name,
                                limit: formatLimit(current_plan),
                                resource: resourceLabel,
                            },
                        )}
                    </DialogDescription>
                </DialogHeader>

                {next_plan ? (
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                        <PlanLimitCard
                            label={t(
                                'upgrade_modal.current_plan',
                                'Current plan',
                            )}
                            planName={current_plan.name}
                            limit={formatLimit(current_plan)}
                            resourceLabel={resourceLabel}
                        />
                        <ArrowRight className="size-4 text-muted-foreground" />
                        <PlanLimitCard
                            label={t(
                                'upgrade_modal.next_plan',
                                'With {{plan}}',
                                { plan: next_plan.name },
                            )}
                            planName={next_plan.name}
                            limit={formatLimit(next_plan)}
                            resourceLabel={resourceLabel}
                            highlighted
                        />
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        {t(
                            'upgrade_modal.highest_plan',
                            "You're on the highest plan. Contact support if you need a higher limit.",
                        )}
                    </p>
                )}

                {next_plan && !can_upgrade && (
                    <p className="text-sm text-muted-foreground">
                        {t(
                            'upgrade_modal.ask_owner',
                            'Ask a workspace owner or billing manager to upgrade the plan.',
                        )}
                    </p>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={() => setDismissedLimit(planLimit)}
                    >
                        {t('upgrade_modal.dismiss', 'Not now')}
                    </Button>
                    {next_plan && (
                        <Button variant="ghost" asChild>
                            <Link href="/billing/compare">
                                {t(
                                    'upgrade_modal.compare_plans',
                                    'Compare plans',
                                )}
                            </Link>
                        </Button>
                    )}
                    {next_plan && can_upgrade && (
                        <Button onClick={handleUpgrade} disabled={upgrading}>
                            {upgrading && <Spinner />}
                            {t(
                                'upgrade_modal.upgrade_to',
                                'Upgrade to {{plan}}',
                                {
                                    plan: next_plan.name,
                                },
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function PlanLimitCard({
    label,
    planName,
    limit,
    resourceLabel,
    highlighted = false,
}: {
    label: string;
    planName: string;
    limit: string;
    resourceLabel: string;
    highlighted?: boolean;
}) {
    return (
        <div
            className={cn(
                'rounded-lg border p-3 text-center',
                highlighted && 'border-primary bg-primary/5',
            )}
        >
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="mt-1 text-2xl font-bold">{limit}</div>
            <div className="text-xs text-muted-foreground">
                {resourceLabel} · {planName}
            </div>
        </div>
    );
}
