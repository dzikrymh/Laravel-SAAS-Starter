import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/toast';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import WorkspaceLayout from '@/layouts/settings/workspace-layout';
import http from '@/lib/http';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type Plan, type WorkspaceRole } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    CreditCard,
    Lock,
    Plus,
    Sparkles,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

interface PlansPageProps {
    plans: Plan[];
    currentPlan: string;
    currentBillingPeriod: 'monthly' | 'yearly' | null;
    recommendedPlan: 'pro' | 'business' | null;
    recommendedBillingPeriod: 'monthly' | 'yearly' | null;
    fromOnboarding: boolean;
    userRole: WorkspaceRole;
}

export default function PlansPage({
    plans,
    currentPlan,
    currentBillingPeriod,
    recommendedPlan,
    recommendedBillingPeriod,
    fromOnboarding,
    userRole,
}: PlansPageProps) {
    const { t } = useTranslations();
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>(
        recommendedBillingPeriod || currentBillingPeriod || 'monthly',
    );
    const [processing, setProcessing] = useState<string | null>(null);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
    const { addToast } = useToast();
    const isOwner = userRole === 'owner';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('billing.title', 'Billing'), href: '/billing' },
        { title: t('billing.plans.title', 'Plans'), href: '/billing/plans' },
    ];

    // Check if this is the exact current plan (same plan AND same billing period)
    const isExactCurrentPlan = (plan: Plan) => {
        if (plan.id === 'free') {
            return currentPlan === 'free';
        }
        return (
            plan.id === currentPlan && billingPeriod === currentBillingPeriod
        );
    };

    // Check if user is on this plan (regardless of billing period)
    const isOnThisPlan = (plan: Plan) => plan.id === currentPlan;

    const handleSubscribe = async (planId: string) => {
        if (!isOwner) return;

        setProcessing(planId);

        try {
            const { data } = await http.post<{
                checkout_url?: string;
                success?: boolean;
                error?: string;
            }>('/billing/subscribe', {
                body: { plan: planId, billing_period: billingPeriod },
            });

            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            } else if (data.success) {
                router.visit('/billing');
            } else if (data.error) {
                addToast(data.error, 'error');
                setProcessing(null);
            } else {
                router.visit('/billing');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            setProcessing(null);
        }
    };

    const handleCancelSubscription = async () => {
        if (!isOwner) return;
        if (
            !confirm(
                'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.',
            )
        ) {
            return;
        }

        setProcessing('free');

        try {
            const { data } = await http.post<{
                success?: boolean;
                error?: string;
            }>('/billing/cancel');

            if (data.success) {
                router.visit('/billing');
            } else {
                addToast(
                    data.error || 'Failed to cancel subscription',
                    'error',
                );
                setProcessing(null);
            }
        } catch (error) {
            console.error('Cancel error:', error);
            setProcessing(null);
        }
    };

    const getButtonText = (plan: Plan) => {
        if (plan.id === 'free') {
            return currentPlan === 'free'
                ? t('billing.plans.current_plan', 'Current Plan')
                : t('billing.plans.downgrade_to_free', 'Downgrade to Free');
        }

        // Exact match: same plan AND same billing period
        if (isExactCurrentPlan(plan)) {
            return t('billing.plans.current_plan', 'Current Plan');
        }

        // Same plan but different billing period
        if (isOnThisPlan(plan)) {
            return billingPeriod === 'yearly'
                ? t('billing.plans.switch_to_yearly', 'Switch to Yearly')
                : t('billing.plans.switch_to_monthly', 'Switch to Monthly');
        }

        // Different plan
        if (currentPlan === 'free') {
            return t('billing.upgrade', 'Upgrade');
        }
        if (currentPlan === 'pro' && plan.id === 'business') {
            return t('billing.upgrade', 'Upgrade');
        }
        if (currentPlan === 'business' && plan.id === 'pro') {
            return t('billing.downgrade', 'Downgrade');
        }

        return t('billing.plans.change_billing_period', 'Switch Plan');
    };

    const formatLimit = (value: number) =>
        value === -1 ? '∞' : value.toLocaleString();

    const limitRows: { label: string; value: (plan: Plan) => string }[] = [
        {
            label: t('billing.plans.limits.workspaces', 'Workspaces'),
            value: (plan) => formatLimit(plan.limits.workspaces),
        },
        {
            label: t('billing.plans.limits.team_members', 'Team members'),
            value: (plan) => formatLimit(plan.limits.team_members),
        },
        {
            label: t('billing.plans.limits.api_keys', 'API keys'),
            value: (plan) => formatLimit(plan.limits.api_keys),
        },
        {
            label: t('billing.plans.limits.webhooks', 'Webhooks'),
            value: (plan) => formatLimit(plan.limits.webhooks),
        },
        {
            label: t('billing.plans.limits.api_requests', 'API requests / min'),
            value: (plan) => formatLimit(plan.api_requests_per_minute),
        },
    ];

    const faqs = [
        {
            question: t(
                'billing.plans.faq.change_plans',
                'Can I change plans later?',
            ),
            answer: t(
                'billing.plans.faq.change_plans_answer',
                'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and are prorated.',
            ),
        },
        {
            question: t(
                'billing.plans.faq.payment_methods',
                'What payment methods do you accept?',
            ),
            answer: t(
                'billing.plans.faq.payment_methods_answer',
                'We accept all major credit cards (Visa, MasterCard, American Express) through our secure payment processor, Stripe.',
            ),
        },
        {
            question: t(
                'billing.plans.faq.cancel',
                'Can I cancel my subscription?',
            ),
            answer: t(
                'billing.plans.faq.cancel_answer',
                "Yes, you can cancel your subscription at any time. You'll continue to have access to paid features until the end of your billing period.",
            ),
        },
    ];

    const currentPlanName =
        plans.find((plan) => plan.id === currentPlan)?.name ?? currentPlan;
    const highlightedPlanId =
        recommendedPlan ?? plans.find((plan) => plan.popular)?.id;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('billing.plans.title', 'Pricing Plans')} />
            <WorkspaceLayout
                title={t('billing.plans.title', 'Pricing Plans')}
                description={t(
                    'billing.plans.description',
                    'Choose the plan that best fits your needs.',
                )}
                fullWidth
                actions={
                    <Button variant="outline" asChild>
                        <Link href="/billing">
                            <ArrowLeft />
                            {t('billing.plans.back', 'Back to Billing')}
                        </Link>
                    </Button>
                }
            >
                {fromOnboarding && recommendedPlan && (
                    <div className="flex items-center gap-2.5 rounded-[14px] border border-primary/25 bg-accent px-4 py-3 text-sm text-accent-foreground">
                        <Sparkles className="size-4 shrink-0" />
                        {t(
                            'billing.plans.onboarding_hint',
                            'You chose the {{plan}} plan during onboarding. Complete your subscription below or pick a different option.',
                            {
                                plan:
                                    recommendedPlan.charAt(0).toUpperCase() +
                                    recommendedPlan.slice(1),
                            },
                        )}
                    </div>
                )}

                {!isOwner && (
                    <div className="flex items-center gap-2.5 rounded-[14px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                        <Lock className="size-4 shrink-0" />
                        {t(
                            'billing.plans.only_owner',
                            'Only the workspace owner can manage billing and subscriptions.',
                        )}
                    </div>
                )}

                {/* Billing Period Toggle */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border bg-card px-4 py-3.5">
                    <span className="flex items-center gap-2.5 text-sm">
                        <CreditCard className="size-4 text-highlight" />
                        <span>
                            {t('billing.plans.on_plan', "You're on")}{' '}
                            <b className="font-semibold">{currentPlanName}</b>{' '}
                            <span className="text-muted-foreground">
                                ·{' '}
                                {t(
                                    'billing.plans.prorated_hint',
                                    'changes are prorated and take effect immediately.',
                                )}
                            </span>
                        </span>
                    </span>
                    <div className="flex items-center gap-2.5">
                        <div
                            role="radiogroup"
                            aria-label={t(
                                'billing.plans.billing_period',
                                'Billing period',
                            )}
                            className="inline-flex rounded-[10px] border bg-muted p-[3px]"
                        >
                            {(['monthly', 'yearly'] as const).map((period) => (
                                <button
                                    key={period}
                                    type="button"
                                    role="radio"
                                    aria-checked={billingPeriod === period}
                                    onClick={() => setBillingPeriod(period)}
                                    className={cn(
                                        'min-h-8 rounded-lg px-3.5 text-[13px] font-semibold transition-colors',
                                        billingPeriod === period
                                            ? 'bg-card text-foreground shadow-xs'
                                            : 'text-muted-foreground hover:text-foreground',
                                    )}
                                >
                                    {period === 'monthly'
                                        ? t('billing.plans.monthly', 'Monthly')
                                        : t('billing.plans.yearly', 'Yearly')}
                                </button>
                            ))}
                        </div>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                            {t('billing.plans.save_yearly', 'Save 17%')}
                        </span>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid items-stretch gap-4 md:grid-cols-3">
                    {plans.map((plan, index) => {
                        const isCurrent = isExactCurrentPlan(plan);
                        const isHighlighted =
                            !isCurrent && plan.id === highlightedPlanId;
                        const price =
                            billingPeriod === 'monthly'
                                ? plan.price.monthly
                                : plan.price.yearly;
                        const yearlyMonthlyEquivalent =
                            plan.price.yearly > 0
                                ? (plan.price.yearly / 12).toFixed(2)
                                : null;

                        return (
                            <section
                                key={plan.id}
                                aria-label={plan.name}
                                style={{
                                    animationDelay: `${0.05 + index * 0.06}s`,
                                }}
                                className={cn(
                                    'relative flex animate-rise flex-col gap-[18px] overflow-hidden rounded-[18px] border p-6 transition-[translate,box-shadow] duration-300 hover:-translate-y-1',
                                    isHighlighted
                                        ? 'dark border-white/10 bg-ink text-foreground shadow-[0_30px_60px_-30px_rgb(31_67_214/0.6)]'
                                        : 'bg-card',
                                    isCurrent && 'border-2 border-primary',
                                )}
                            >
                                {isHighlighted && (
                                    <div
                                        aria-hidden="true"
                                        className="pointer-events-none absolute -top-28 -right-24 h-72 w-80 bg-[radial-gradient(closest-side,rgb(61_99_245/0.55),transparent)] blur-xl"
                                    />
                                )}

                                <div className="relative flex items-center justify-between gap-2">
                                    <h2 className="text-lg font-bold">
                                        {plan.name}
                                    </h2>
                                    {isCurrent ? (
                                        <span className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">
                                            <Check className="size-3.5 stroke-[3]" />
                                            {t(
                                                'billing.plans.your_plan',
                                                'Your Plan',
                                            )}
                                        </span>
                                    ) : (
                                        plan.popular && (
                                            <span className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
                                                <Sparkles className="size-3.5" />
                                                {t(
                                                    'billing.plans.most_popular',
                                                    'Most Popular',
                                                )}
                                            </span>
                                        )
                                    )}
                                </div>
                                <p className="relative text-sm text-muted-foreground">
                                    {plan.description}
                                </p>

                                <div className="relative flex flex-col gap-0.5">
                                    <span className="flex items-baseline gap-1">
                                        <span className="text-[40px] leading-none font-extrabold tracking-[-0.03em]">
                                            ${price}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            /
                                            {billingPeriod === 'monthly'
                                                ? t('common.mo', 'mo')
                                                : t('common.yr', 'yr')}
                                        </span>
                                    </span>
                                    <span className="min-h-4 text-xs text-highlight">
                                        {yearlyMonthlyEquivalent &&
                                            (billingPeriod === 'yearly'
                                                ? t(
                                                      'billing.plans.per_month_equivalent',
                                                      '≈ ${{amount}}/mo billed yearly',
                                                      {
                                                          amount: yearlyMonthlyEquivalent,
                                                      },
                                                  )
                                                : t(
                                                      'billing.plans.or_yearly',
                                                      'or ${{amount}} billed yearly',
                                                      {
                                                          amount: plan.price
                                                              .yearly,
                                                      },
                                                  ))}
                                    </span>
                                </div>

                                {plan.id === 'free' ? (
                                    <Button
                                        variant="outline"
                                        className="relative w-full"
                                        disabled={
                                            currentPlan === 'free' ||
                                            !isOwner ||
                                            processing !== null
                                        }
                                        onClick={handleCancelSubscription}
                                    >
                                        {processing === 'free' ? (
                                            <Spinner />
                                        ) : (
                                            currentPlan === 'free' && <Check />
                                        )}
                                        {getButtonText(plan)}
                                    </Button>
                                ) : (
                                    <Button
                                        variant={
                                            isCurrent
                                                ? 'secondary'
                                                : isHighlighted
                                                  ? 'default'
                                                  : 'outline'
                                        }
                                        className="relative w-full"
                                        disabled={
                                            isCurrent ||
                                            !isOwner ||
                                            processing !== null
                                        }
                                        onClick={() => handleSubscribe(plan.id)}
                                    >
                                        {processing === plan.id ? (
                                            <Spinner />
                                        ) : (
                                            !isCurrent && <Zap />
                                        )}
                                        {getButtonText(plan)}
                                    </Button>
                                )}

                                <div className="relative h-px bg-border" />

                                <ul className="relative flex flex-1 flex-col gap-2.5">
                                    {plan.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-start gap-2.5 text-sm"
                                        >
                                            <Check className="mt-0.5 size-4 shrink-0 stroke-[2.5] text-emerald-600 dark:text-emerald-400" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        );
                    })}
                </div>

                {/* Limits comparison */}
                <Card className="gap-4">
                    <CardHeader>
                        <CardTitle className="text-[17px]">
                            {t(
                                'billing.plans.compare_limits',
                                'Compare limits',
                            )}
                        </CardTitle>
                        <CardDescription>
                            {t(
                                'billing.plans.compare_limits_description',
                                'What each plan allows per workspace.',
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto px-0">
                        <table className="w-full min-w-[520px] border-collapse text-sm">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="border-b px-6 py-2.5 text-left text-xs font-semibold tracking-[0.04em] text-muted-foreground"
                                    >
                                        {t('billing.plans.limit', 'Limit')}
                                    </th>
                                    {plans.map((plan) => (
                                        <th
                                            key={plan.id}
                                            scope="col"
                                            className={cn(
                                                'border-b px-4 py-2.5 text-center text-xs font-semibold tracking-[0.04em] text-muted-foreground',
                                                plan.id === highlightedPlanId &&
                                                    'bg-accent text-accent-foreground',
                                            )}
                                        >
                                            {plan.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {limitRows.map((row) => (
                                    <tr
                                        key={row.label}
                                        className="transition-colors hover:bg-muted/60"
                                    >
                                        <th
                                            scope="row"
                                            className="border-b px-6 py-3 text-left font-medium text-muted-foreground"
                                        >
                                            {row.label}
                                        </th>
                                        {plans.map((plan) => (
                                            <td
                                                key={plan.id}
                                                className={cn(
                                                    'border-b px-4 py-3 text-center font-medium tabular-nums',
                                                    plan.id ===
                                                        highlightedPlanId &&
                                                        'bg-accent font-bold',
                                                )}
                                            >
                                                {row.value(plan)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                {/* FAQ */}
                <Card className="gap-3">
                    <CardHeader>
                        <CardTitle className="text-[17px]">
                            {t(
                                'billing.plans.faq.title',
                                'Frequently Asked Questions',
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col border-t">
                            {faqs.map((faq, index) => {
                                const isOpen = openFaqIndex === index;

                                return (
                                    <div
                                        key={faq.question}
                                        className="border-b"
                                    >
                                        <button
                                            type="button"
                                            aria-expanded={isOpen}
                                            onClick={() =>
                                                setOpenFaqIndex(
                                                    isOpen ? null : index,
                                                )
                                            }
                                            className="flex min-h-[52px] w-full items-center justify-between gap-3 text-left text-[15px] font-semibold"
                                        >
                                            {faq.question}
                                            <Plus
                                                aria-hidden="true"
                                                className={cn(
                                                    'size-5 shrink-0 text-highlight transition-transform duration-300',
                                                    isOpen && 'rotate-45',
                                                )}
                                            />
                                        </button>
                                        <div
                                            className={cn(
                                                'grid transition-[grid-template-rows] duration-300',
                                                isOpen
                                                    ? 'grid-rows-[1fr]'
                                                    : 'grid-rows-[0fr]',
                                            )}
                                        >
                                            <p className="overflow-hidden text-sm leading-relaxed text-muted-foreground">
                                                <span className="block pb-4">
                                                    {faq.answer}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </WorkspaceLayout>
        </AppLayout>
    );
}
