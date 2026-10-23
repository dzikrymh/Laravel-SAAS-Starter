import { useTranslations } from '@/hooks/use-translations';
import axios from 'axios';
import { Activity, Pencil, Plus, Trash2, type LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ActivityEntry {
    id: number;
    description: string;
    event: string | null;
    subject_type: string;
    causer_name: string;
    created_at: string;
}

const EVENT_STYLES: Record<string, { icon: LucideIcon; className: string }> = {
    created: {
        icon: Plus,
        className:
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    },
    updated: {
        icon: Pencil,
        className: 'bg-accent text-accent-foreground',
    },
    deleted: {
        icon: Trash2,
        className:
            'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
    },
};

const DEFAULT_EVENT_STYLE = {
    icon: Activity,
    className: 'bg-muted text-muted-foreground',
};

export function WorkspaceActivityFeed() {
    const { t } = useTranslations();
    const [activities, setActivities] = useState<ActivityEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get('/workspace-activity-feed')
            .then(({ data }) => {
                setActivities(data.activities ?? []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <section className="flex min-w-0 flex-col gap-1.5 rounded-2xl border bg-card p-[22px]">
            <div className="mb-2 flex items-center justify-between">
                <h2 className="text-[17px] font-bold">
                    {t('dashboard.activity.title', 'Recent Activity')}
                </h2>
                <Activity className="size-4 text-muted-foreground" />
            </div>

            {loading ? (
                <div className="flex flex-col">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex animate-pulse items-center gap-3.5 border-b py-3 last:border-b-0"
                        >
                            <div className="size-8 rounded-[9px] bg-muted" />
                            <div className="flex flex-1 flex-col gap-1.5">
                                <div className="h-3 w-3/4 rounded bg-muted" />
                                <div className="h-3 w-1/3 rounded bg-muted" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : activities.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                    {t('dashboard.activity.empty', 'No recent activity.')}
                </p>
            ) : (
                <ol className="flex flex-col">
                    {activities.map((activity) => {
                        const style = activity.event
                            ? (EVENT_STYLES[activity.event] ??
                              DEFAULT_EVENT_STYLE)
                            : DEFAULT_EVENT_STYLE;

                        return (
                            <li
                                key={activity.id}
                                className="flex gap-3.5 border-b py-3 last:border-b-0"
                            >
                                <span
                                    className={`flex size-8 shrink-0 items-center justify-center rounded-[9px] ${style.className}`}
                                    title={activity.event ?? undefined}
                                >
                                    <style.icon className="size-[15px]" />
                                    {activity.event && (
                                        <span className="sr-only">
                                            {activity.event}
                                        </span>
                                    )}
                                </span>
                                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                    <p className="truncate text-sm font-semibold">
                                        {activity.description}
                                    </p>
                                    <p className="text-[13px] text-muted-foreground">
                                        {activity.causer_name} ·{' '}
                                        {activity.created_at}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            )}
        </section>
    );
}
