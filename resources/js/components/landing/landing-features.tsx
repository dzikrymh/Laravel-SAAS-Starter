import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';
import {
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
} from 'motion/react';
import { useRef } from 'react';
import { Reveal } from './reveal';

const cardHover =
    'transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-primary hover:shadow-[0_24px_48px_-24px_rgb(10_20_60/0.35)]';

export function LandingFeatures() {
    const { t } = useTranslations();
    const prefersReducedMotion = useReducedMotion() ?? false;

    const stackRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: stackRef,
        offset: ['start end', 'center center'],
    });
    const ringScale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);

    const features = [
        {
            title: t('landing.features.items.flags.title', 'Feature Flags'),
            description: t(
                'landing.features.items.flags.description',
                'Native Laravel Pennant integration to roll out features globally or target specific workspaces.',
            ),
        },
        {
            title: t('landing.features.items.audit.title', 'Audit Logging'),
            description: t(
                'landing.features.items.audit.description',
                'Comprehensive activity tracking of system changes, property diffs, and administrative actions.',
            ),
        },
        {
            title: t(
                'landing.features.items.announcements.title',
                'Global Announcements',
            ),
            description: t(
                'landing.features.items.announcements.description',
                'Schedule and broadcast custom, highly visible alert banners to all authenticated users.',
            ),
        },
        {
            title: t(
                'landing.features.items.i18n.title',
                'Internationalization',
            ),
            description: t(
                'landing.features.items.i18n.description',
                'Multi-language support with RTL layouts. Easily add new languages and translations.',
            ),
        },
        {
            title: t('landing.features.items.dark_mode.title', 'Dark Mode'),
            description: t(
                'landing.features.items.dark_mode.description',
                'Beautiful light and dark themes with system preference detection and manual toggle.',
            ),
        },
    ];

    return (
        <section id="features" className="px-4 pt-20 pb-24 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-12">
                <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-3.5 text-center">
                    <span className="text-[13px] font-bold tracking-[0.1em] text-highlight uppercase">
                        {t('landing.features.eyebrow', 'Everything included')}
                    </span>
                    <h2 className="text-4xl leading-[1.08] font-extrabold tracking-[-0.03em] sm:text-5xl">
                        {t(
                            'landing.features.title.part1',
                            'Everything You Need to',
                        )}{' '}
                        {t('landing.features.title.part2', 'Ship Faster')}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        {t(
                            'landing.features.description',
                            'Stop wasting weeks on boilerplate. Everything you need is included and ready to use. Focus on building what makes your product unique.',
                        )}
                    </p>
                </Reveal>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Modern stack — dark feature card */}
                    <div ref={stackRef} className="sm:col-span-2">
                        <Reveal
                            className={cn(
                                'dark relative flex h-full min-h-60 flex-col justify-between gap-6 overflow-hidden rounded-2xl border border-white/10 bg-ink p-8 text-foreground',
                                cardHover,
                            )}
                        >
                            <motion.div
                                aria-hidden="true"
                                style={
                                    prefersReducedMotion
                                        ? undefined
                                        : { scale: ringScale }
                                }
                                className="absolute -right-16 -bottom-20 size-80 rounded-full border border-[#8fb0ff]/30 shadow-[inset_0_0_0_40px_rgb(143_176_255/0.04),inset_0_0_0_80px_rgb(143_176_255/0.03)]"
                            />
                            <span className="font-mono text-[13px] text-highlight">
                                stack.json
                            </span>
                            <div className="relative flex flex-col gap-2">
                                <h3 className="text-[26px] font-bold text-white">
                                    {t(
                                        'landing.features.items.stack.title',
                                        'Modern Stack',
                                    )}
                                </h3>
                                <p className="max-w-md leading-relaxed text-muted-foreground">
                                    {t(
                                        'landing.features.items.stack.description',
                                        'Laravel 13, Inertia.js v3, React 19, and Tailwind CSS v4 for a blazing-fast developer experience.',
                                    )}
                                </p>
                            </div>
                        </Reveal>
                    </div>

                    {features.map((feature, index) => (
                        <Reveal
                            key={feature.title}
                            delay={(index % 3) * 0.06}
                            className={cn(
                                'flex flex-col gap-2.5 rounded-2xl border bg-card p-7',
                                cardHover,
                            )}
                        >
                            <h3 className="text-lg font-bold">
                                {feature.title}
                            </h3>
                            <p className="text-[15px] leading-relaxed text-muted-foreground">
                                {feature.description}
                            </p>
                        </Reveal>
                    ))}

                    {/* Beautiful UI — accent card */}
                    <Reveal
                        className={cn(
                            'flex flex-col gap-2.5 rounded-2xl border border-primary/25 bg-accent p-7 sm:col-span-2',
                            cardHover,
                        )}
                    >
                        <h3 className="text-lg font-bold">
                            {t(
                                'landing.features.items.ui.title',
                                'Beautiful UI',
                            )}
                        </h3>
                        <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                            {t(
                                'landing.features.items.ui.description',
                                'Pre-built components with shadcn/ui design system. Fully customizable and accessible.',
                            )}
                        </p>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
