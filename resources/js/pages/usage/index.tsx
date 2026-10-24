import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    Building2,
    Gauge,
    Infinity as InfinityIcon,
    KeyRound,
    Sparkles,
    Users,
    Webhook,
    type LucideIcon,
} from 'lucide-react';

interface UsageItem {
    label: string;
    current: number;
    limit: number;
    message: string;
}

interface Props {
    workspace: {
        name: string;
        plan: string;
    };
    usage: Record<string, UsageItem>;
}

type UsageStatus = 'unlimited' | 'healthy' | 'warning' | 'reached';

const USAGE_ICONS: Record<string, LucideIcon> = {
    workspaces: Building2,
    team_members: Users,
    api_keys: KeyRound,
    webhooks: Webhook,
};

const STATUS_STYLES: Record<UsageStatus, { pill: string; bar: string }> = {
    unlimited: {
        pill: 'bg-accent text-accent-foreground',
        bar: 'bg-primary',
    },
    healthy: {
        pill: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
        bar: 'bg-primary',
    },
    warning: {
        pill: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
        bar: 'bg-orange-500',
    },
    reached: {
        pill: 'bg-destructive/10 text-destructive',
        bar: 'bg-destructive',
    },
};

export default function Usage({ workspace, usage }: Props) {
    const { t } = useTranslations();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('usage.title', 'Usage Dashboard'),
            href: '/usage',
        },
    ];

    const getUsagePercentage = (current: number, limit: number) => {
        if (limit === -1) return 0;
        return Math.min(Math.round((current / limit) * 100), 100);
    };

    const getUsageStatus = (current: number, limit: number): UsageStatus => {
        if (limit === -1) return 'unlimited';
        const percentage = (current / limit) * 100;
        if (percentage >= 100) return 'reached';
        if (percentage >= 80) return 'warning';
        return 'healthy';
    };

    const statusLabels: Record<UsageStatus, string> = {
        unlimited: t('usage.status.unlimited', 'Unlimited'),
        healthy: t('usage.status.healthy', 'Healthy'),
        warning: t('usage.status.warning', 'Near limit'),
        reached: t('usage.status.reached', 'Limit reached'),
    };

    const items = Object.entries(usage).map(([key, item]) => ({
        key,
        ...item,
        status: getUsageStatus(item.current, item.limit),
        percentage: getUsagePercentage(item.current, item.limit),
    }));
    const reachedItems = items.filter((item) => item.status === 'reached');
    const warningItems = items.filter((item) => item.status === 'warning');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('usage.title', 'Usage Dashboard')} />

            <div className="mx-auto flex h-full w-full max-w-[1240px] flex-1 flex-col gap-6 px-4 pt-7 pb-12 lg:px-6">
                <div className="flex animate-rise flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-[30px] leading-tight font-extrabold tracking-[-0.025em]">
                            {t('usage.title', 'Usage Dashboard')}
                        </h1>
                        <p className="text-[15px] text-muted-foreground">
                            {t(
                                'usage.description',
                                'Manage your workspace limits and monitor your current usage.',
                            )}
                        </p>
                    </div>
                    <Link
                        href="/billing/plans"
                        className="inline-flex min-h-11 items-center gap-2 rounded-[10px] bg-primary px-[18px] text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-px"
                    >
                        <Sparkles className="size-4" />
                        {t('usage.upgrade_plan', 'Upgrade plan')}
                    </Link>
                </div>

                {/* Summary */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <section className="dark relative flex animate-rise flex-col gap-2 overflow-hidden rounded-2xl border bg-ink p-[22px] text-foreground [animation-delay:0.05s]">
                        <div
                            aria-hidden="true"
                            className="absolute -top-24 -right-20 h-60 w-72 bg-[radial-gradient(closest-side,rgb(61_99_245/0.5),transparent)] blur-xl"
                        />
                        <span className="relative text-[13px] text-muted-foreground">
                            {t('usage.current_plan', 'Current Plan')}
                        </span>
                        <span className="relative text-[30px] font-extrabold tracking-[-0.02em] text-white">
                            {workspace.plan}
                        </span>
                        <span className="relative truncate text-[13px] text-muted-foreground">
                            {workspace.name}
                        </span>
                        <Link
                            href="/billing/plans"
                            className="relative mt-1 text-[13px] font-semibold text-highlight hover:underline"
                        >
                            {t('usage.compare_plans', 'Compare plans')} →
                        </Link>
                    </section>

                    <SummaryCard
                        delay="0.1s"
                        label={t('usage.limits_reached', 'Limits reached')}
                        value={reachedItems.length}
                        total={items.length}
                        hint={
                            reachedItems.length > 0
                                ? reachedItems
                                      .map((item) => item.label)
                                      .join(', ')
                                : t(
                                      'usage.none_reached',
                                      'All limits have room',
                                  )
                        }
                        hintClassName={
                            reachedItems.length > 0
                                ? 'text-destructive'
                                : 'text-muted-foreground'
                        }
                    />
                    <SummaryCard
                        delay="0.15s"
                        label={t('usage.near_limit', 'Near limit (80%+)')}
                        value={warningItems.length}
                        total={items.length}
                        hint={
                            warningItems.length > 0
                                ? warningItems
                                      .map((item) => item.label)
                                      .join(', ')
                                : t(
                                      'usage.none_near_limit',
                                      'Nothing close to its limit',
                                  )
                        }
                        hintClassName={
                            warningItems.length > 0
                                ? 'text-amber-700 dark:text-amber-300'
                                : 'text-muted-foreground'
                        }
                    />
                </div>

                <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-[17px] font-bold">
                        {t('usage.plan_limits', 'Plan limits')}
                    </h2>
                    <div className="flex flex-wrap gap-3.5 text-xs text-muted-foreground">
                        <LegendDot className="bg-primary">
                            {statusLabels.healthy}
                        </LegendDot>
                        <LegendDot className="bg-orange-500">80%+</LegendDot>
                        <LegendDot className="bg-destructive">
                            {statusLabels.reached}
                        </LegendDot>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {items.map((item, index) => {
                        const Icon = USAGE_ICONS[item.key] ?? Gauge;
                        const styles = STATUS_STYLES[item.status];
                        const remaining = Math.max(
                            item.limit - item.current,
                            0,
                        );

                        return (
                            <section
                                key={item.key}
                                style={{
                                    animationDelay: `${0.2 + index * 0.05}s`,
                                }}
                                className="flex animate-rise flex-col gap-4 rounded-2xl border bg-card p-[22px] transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-[3px] hover:border-primary hover:shadow-[0_18px_36px_-22px_rgb(15_23_41/0.45)]"
                            >
                                <div className="flex items-start gap-3.5">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-[11px] bg-accent text-accent-foreground">
                                        <Icon className="size-[19px]" />
                                    </span>
                                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                        <h3 className="text-base font-bold">
                                            {item.label}
                                        </h3>
                                        <p className="text-[13px] text-muted-foreground">
                                            {item.message}
                                        </p>
                                    </div>
                                    <span
                                        className={cn(
                                            'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-[0.04em] uppercase',
                                            styles.pill,
                                        )}
                                    >
                                        {statusLabels[item.status]}
                                    </span>
                                </div>

                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-4xl leading-none font-extrabold tracking-[-0.03em] tabular-nums">
                                        {item.current}
                                    </span>
                                    <span className="text-base text-muted-foreground">
                                        / {item.limit === -1 ? '∞' : item.limit}
                                    </span>
                                </div>

                                {item.limit === -1 ? (
                                    <div className="flex items-center gap-2 rounded-[10px] bg-muted px-3 py-2.5 text-[13px] text-muted-foreground">
                                        <InfinityIcon className="size-4" />
                                        {t(
                                            'usage.no_cap',
                                            'No cap on your current plan.',
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <div
                                            role="meter"
                                            aria-label={item.label}
                                            aria-valuemin={0}
                                            aria-valuemax={item.limit}
                                            aria-valuenow={item.current}
                                            className="h-2 overflow-hidden rounded-full bg-muted"
                                        >
                                            <div
                                                className={cn(
                                                    'h-full rounded-full transition-[width] duration-700 ease-out',
                                                    styles.bar,
                                                )}
                                                style={{
                                                    width: `${item.percentage}%`,
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>
                                                {t(
                                                    'usage.remaining',
                                                    '{{count}} remaining',
                                                    { count: remaining },
                                                )}
                                            </span>
                                            <span>
                                                {t(
                                                    'usage.percent_used',
                                                    '{{percent}}% used',
                                                    {
                                                        percent:
                                                            item.percentage,
                                                    },
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {item.status === 'reached' && (
                                    <div
                                        role="status"
                                        className="flex flex-wrap items-center gap-2.5 rounded-[10px] border border-destructive/25 bg-destructive/5 px-3 py-2.5 text-[13px] text-destructive"
                                    >
                                        <AlertCircle className="size-4 shrink-0" />
                                        <span className="min-w-44 flex-1">
                                            {t(
                                                'usage.limit_reached_alert',
                                                'Limit reached. Upgrade your plan to increase your capacity.',
                                            )}
                                        </span>
                                        <Link
                                            href="/billing/plans"
                                            className="inline-flex items-center gap-1 font-semibold hover:underline"
                                        >
                                            {t('usage.upgrade', 'Upgrade')}
                                            <ArrowRight className="size-3.5" />
                                        </Link>
                                    </div>
                                )}
                            </section>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}

function SummaryCard({
    label,
    value,
    total,
    hint,
    hintClassName,
    delay,
}: {
    label: string;
    value: number;
    total: number;
    hint: string;
    hintClassName: string;
    delay: string;
}) {
    return (
        <div
            style={{ animationDelay: delay }}
            className="flex animate-rise flex-col gap-2 rounded-2xl border bg-card p-5"
        >
            <span className="text-[13px] text-muted-foreground">{label}</span>
            <span className="text-[30px] font-extrabold tracking-[-0.02em] tabular-nums">
                {value}{' '}
                <span className="text-[15px] font-medium text-muted-foreground">
                    / {total}
                </span>
            </span>
            <span className={cn('text-[13px]', hintClassName)}>{hint}</span>
        </div>
    );
}

function LegendDot({
    className,
    children,
}: {
    className: string;
    children: string;
}) {
    return (
        <span className="flex items-center gap-1.5">
            <span className={cn('size-2 rounded-full', className)} />
            {children}
        </span>
    );
}
