import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/use-translations';
import { plans } from '@/routes/billing';
import { type PlanLimitReached } from '@/types';
import { Link } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';

const TITLE_FALLBACKS: Record<PlanLimitReached['resource'], string> = {
    team_members: 'Team member limit reached',
    api_keys: 'API key limit reached',
    webhooks: 'Webhook limit reached',
};

/**
 * Warns that a plan limit is reached and links to the plans page with the next
 * plan recommended.
 */
export function PlanLimitAlert({ planLimit }: { planLimit: PlanLimitReached }) {
    const { t } = useTranslations();
    const { resource, can_upgrade, current_plan, next_plan } = planLimit;

    const resourceLabel = t(
        `plan_limit.resources.${resource}`,
        resource.replace('_', ' '),
    );

    const nextStep = !next_plan
        ? t(
              'plan_limit.highest_plan',
              'Contact support if you need a higher limit.',
          )
        : next_plan.limit === -1
          ? t(
                'plan_limit.upgrade_hint_unlimited',
                'Upgrade to {{plan}} for unlimited {{resource}}.',
                { plan: next_plan.name, resource: resourceLabel },
            )
          : t(
                'plan_limit.upgrade_hint',
                'Upgrade to {{plan}} to get up to {{limit}}.',
                {
                    plan: next_plan.name,
                    limit: next_plan.limit.toLocaleString(),
                },
            );

    return (
        <Alert className="border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-300">
                {t(`plan_limit.title.${resource}`, TITLE_FALLBACKS[resource])}
            </AlertTitle>
            <AlertDescription className="flex items-center justify-between gap-4">
                <span className="text-amber-700 dark:text-amber-400">
                    {t(
                        'plan_limit.description',
                        'Your {{plan}} plan includes up to {{limit}} {{resource}}.',
                        {
                            plan: current_plan.name,
                            limit: current_plan.limit.toLocaleString(),
                            resource: resourceLabel,
                        },
                    )}{' '}
                    {nextStep}
                    {next_plan && !can_upgrade && (
                        <>
                            {' '}
                            {t(
                                'plan_limit.ask_owner',
                                'Ask a workspace owner or billing manager to upgrade the plan.',
                            )}
                        </>
                    )}
                </span>
                {next_plan && can_upgrade && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="shrink-0 border-amber-400 text-amber-700 hover:bg-amber-100 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-900/50"
                        asChild
                    >
                        <Link
                            href={plans.url({
                                query: { recommended_plan: next_plan.key },
                            })}
                        >
                            {t('plan_limit.upgrade_button', 'Upgrade Plan')}
                        </Link>
                    </Button>
                )}
            </AlertDescription>
        </Alert>
    );
}
