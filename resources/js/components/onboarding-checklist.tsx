import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useTranslations } from '@/hooks/use-translations';
import http from '@/lib/http';
import { Link } from '@inertiajs/react';
import { Check, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ChecklistStep {
    id: string;
    label: string;
    description: string;
    completed: boolean;
    href: string;
}

interface ChecklistData {
    dismissed: boolean;
    steps: ChecklistStep[];
    completed: number;
    total: number;
}

export function OnboardingChecklist() {
    const { t } = useTranslations();
    const [data, setData] = useState<ChecklistData | null>(null);
    const [dismissing, setDismissing] = useState(false);
    const [hidden, setHidden] = useState(false);

    const dismiss = async () => {
        setDismissing(true);
        try {
            await http.post('/onboarding-checklist/dismiss');
            setHidden(true);
        } catch {
            // Silently fail
        } finally {
            setDismissing(false);
        }
    };

    useEffect(() => {
        http.get<ChecklistData>('/onboarding-checklist')
            .then(({ data: result, response }) => {
                if (response.ok) {
                    setData(result);
                    if (result.dismissed) {
                        setHidden(true);
                    }
                }
            })
            .catch(() => {
                // Silently fail — checklist is non-critical
            });
    }, []);

    if (hidden || !data || data.dismissed || data.steps.length === 0) {
        return null;
    }

    const progress = Math.round((data.completed / data.total) * 100);
    const allComplete = data.completed === data.total;

    return (
        <section
            aria-labelledby="onboarding-checklist-title"
            className="flex animate-rise flex-col gap-4 rounded-2xl border bg-card p-[22px] [animation-delay:0.05s]"
        >
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-accent text-accent-foreground">
                        <Sparkles className="size-[18px]" />
                    </span>
                    <div className="flex flex-col gap-1">
                        <h2
                            id="onboarding-checklist-title"
                            className="text-[17px] font-bold"
                        >
                            {t('onboarding.checklist.title', 'Get started')}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {allComplete
                                ? t(
                                      'onboarding.checklist.complete',
                                      "You're all set! Your workspace is fully configured.",
                                  )
                                : t(
                                      'onboarding.checklist.description',
                                      'Complete these steps to get the most out of your workspace.',
                                  )}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-muted-foreground tabular-nums">
                        {data.completed}/{data.total}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 text-muted-foreground hover:text-foreground"
                        onClick={dismiss}
                        disabled={dismissing}
                    >
                        <X className="size-4" />
                        <span className="sr-only">Dismiss</span>
                    </Button>
                </div>
            </div>

            <Progress value={progress} className="h-1.5" />

            <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
                {data.steps.map((step) => (
                    <Link
                        key={step.id}
                        href={step.href}
                        className={`flex min-h-16 items-start gap-3 rounded-xl border p-3.5 transition-colors hover:border-primary ${
                            step.completed ? 'bg-muted' : 'bg-card'
                        }`}
                    >
                        {step.completed ? (
                            <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Check className="size-3" strokeWidth={3} />
                            </span>
                        ) : (
                            <span className="size-[22px] shrink-0 rounded-full border-2" />
                        )}
                        <span className="flex min-w-0 flex-col gap-0.5">
                            <span
                                className={`text-sm font-semibold ${
                                    step.completed
                                        ? 'text-muted-foreground line-through'
                                        : ''
                                }`}
                            >
                                {step.label}
                            </span>
                            <span className="text-[13px] text-muted-foreground">
                                {step.description}
                            </span>
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
