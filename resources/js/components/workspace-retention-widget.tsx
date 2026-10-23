import { useTranslations } from '@/hooks/use-translations';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface RetentionData {
    total_members: number;
    active_last_30_days: number;
    retention_rate: number;
}

const RING_RADIUS = 42;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function WorkspaceRetentionWidget() {
    const { t } = useTranslations();
    const [data, setData] = useState<RetentionData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get('/workspace-retention-insights')
            .then(({ data }) => {
                setData(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const rateColor =
        data && data.retention_rate >= 70
            ? 'text-emerald-600 dark:text-emerald-400'
            : data && data.retention_rate >= 40
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-red-600 dark:text-red-400';

    const rate = data ? Math.min(Math.max(data.retention_rate, 0), 100) : 0;

    return (
        <section className="flex flex-col items-center gap-3.5 rounded-2xl border bg-card p-[22px] text-center">
            <h2 className="self-start text-[17px] font-bold">
                {t('dashboard.retention.title', 'Member Retention (30d)')}
            </h2>

            {loading ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 py-2">
                    <div className="size-40 animate-pulse rounded-full border-[14px] border-muted" />
                    <div className="h-3 w-40 animate-pulse rounded bg-muted" />
                </div>
            ) : data ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3.5">
                    <div className="relative size-40">
                        <svg
                            viewBox="0 0 100 100"
                            className="size-full -rotate-90"
                            role="img"
                            aria-label={`${data.retention_rate}%`}
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r={RING_RADIUS}
                                fill="none"
                                strokeWidth="9"
                                className="stroke-muted"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r={RING_RADIUS}
                                fill="none"
                                strokeWidth="9"
                                strokeLinecap="round"
                                strokeDasharray={RING_CIRCUMFERENCE}
                                strokeDashoffset={
                                    RING_CIRCUMFERENCE * (1 - rate / 100)
                                }
                                className="stroke-primary transition-[stroke-dashoffset] duration-1000 ease-out"
                            />
                        </svg>
                        <span
                            className={`absolute inset-0 flex items-center justify-center text-[34px] font-extrabold tracking-[-0.03em] tabular-nums ${rateColor}`}
                        >
                            {data.retention_rate}%
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {t(
                            'dashboard.retention.members_active',
                            '{{active}} of {{total}} members active',
                            {
                                active: data.active_last_30_days,
                                total: data.total_members,
                            },
                        )}
                    </p>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">
                    {t('dashboard.retention.no_data', 'No data available.')}
                </p>
            )}
        </section>
    );
}
