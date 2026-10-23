import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { useTranslations } from '@/hooks/use-translations';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

const ease = [0.2, 0.7, 0.2, 1] as const;

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { t } = useTranslations();
    const prefersReducedMotion = useReducedMotion() ?? false;

    const rise = (delay: number) =>
        prefersReducedMotion
            ? {}
            : {
                  initial: { opacity: 0, y: 18 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.7, delay, ease },
              };

    return (
        <div className="grid min-h-svh bg-background lg:grid-cols-[1.1fr_1fr]">
            {/* Brand panel: always on the dark brand surface */}
            <aside className="dark relative hidden flex-col justify-between gap-12 overflow-hidden border-r border-white/10 bg-ink px-12 py-10 text-foreground lg:flex">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_80%_70%_at_30%_40%,#000_20%,transparent_75%)] motion-safe:animate-grid-drift"
                />
                <div
                    aria-hidden="true"
                    className="absolute top-44 -left-28 h-[420px] w-[640px] bg-[radial-gradient(closest-side,rgb(61_99_245/0.45),transparent)] blur-3xl"
                />

                <motion.div
                    {...rise(0)}
                    className="relative flex items-center justify-between gap-4"
                >
                    <Link
                        href={home()}
                        className="flex items-center gap-2.5 font-bold text-white"
                    >
                        <span className="flex size-8 items-center justify-center rounded-lg bg-primary">
                            <Sparkles className="size-4 text-white" />
                        </span>
                        Laravel SAAS Starter
                    </Link>
                    <Link
                        href={home()}
                        className="flex min-h-11 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-white"
                    >
                        <ArrowLeft className="size-4" />
                        {t('auth.layout.back_to_home', 'Back to home')}
                    </Link>
                </motion.div>

                <div className="relative flex max-w-lg flex-col gap-6">
                    <motion.h2
                        {...rise(0.06)}
                        className="text-5xl leading-[1.05] font-extrabold tracking-[-0.035em] text-white xl:text-[52px]"
                    >
                        {t('auth.layout.hero.title_line1', 'Launch Your SaaS')}
                        <br />
                        <span className="text-highlight">
                            {t('auth.layout.hero.title_line2', '10x Faster')}
                        </span>
                    </motion.h2>
                    <motion.p
                        {...rise(0.12)}
                        className="text-[17px] leading-relaxed text-muted-foreground"
                    >
                        {t(
                            'auth.layout.hero.description',
                            'Join thousands of developers building and shipping with Laravel SAAS Starter.',
                        )}
                    </motion.p>

                    {/* Floating product fragments */}
                    <div aria-hidden="true" className="relative mt-2 h-52">
                        <div className="absolute top-0 left-0 flex w-72 flex-col gap-2.5 rounded-xl border bg-card/85 p-4 shadow-[0_24px_50px_-20px_rgb(0_0_0/0.7)] backdrop-blur-sm motion-safe:animate-float">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>
                                    {t(
                                        'auth.layout.fragment.seats',
                                        'Workspace seats',
                                    )}
                                </span>
                                <span className="text-highlight">Pro</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-muted">
                                <div className="h-full w-2/3 rounded-full bg-primary" />
                            </div>
                        </div>
                        <div className="absolute top-24 left-48 flex w-64 items-center gap-3 rounded-xl bg-white px-4 py-3.5 text-[#0f1729] shadow-[0_24px_50px_-16px_rgb(0_0_0/0.6)] motion-safe:animate-float motion-safe:[animation-delay:-3s]">
                            <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                <ShieldCheck className="size-[18px]" />
                            </span>
                            <span className="flex flex-col">
                                <span className="text-[13px] font-semibold">
                                    {t(
                                        'auth.layout.fragment.twofa',
                                        '2FA enforced',
                                    )}
                                </span>
                                <span className="text-xs text-[#545e73]">
                                    {t(
                                        'auth.layout.fragment.twofa_sub',
                                        'Workspace security policy',
                                    )}
                                </span>
                            </span>
                        </div>
                    </div>

                    <motion.div {...rise(0.18)} className="flex gap-8">
                        <div>
                            <div className="text-[26px] font-extrabold text-white tabular-nums">
                                10,000+
                            </div>
                            <div className="text-[13px] text-muted-foreground">
                                {t(
                                    'auth.layout.stats.developers',
                                    'Developers',
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="text-[26px] font-extrabold text-white tabular-nums">
                                500+
                            </div>
                            <div className="text-[13px] text-muted-foreground">
                                {t(
                                    'auth.layout.stats.apps_launched',
                                    'Apps Launched',
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="relative flex flex-col gap-6">
                    <motion.figure
                        {...rise(0.24)}
                        className="flex flex-col gap-4 rounded-xl border bg-white/[0.04] p-5"
                    >
                        <blockquote className="text-[15px] leading-relaxed text-white">
                            “
                            {t(
                                'auth.layout.testimonial.quote',
                                'Laravel SAAS Starter saved us months of development time. We launched our MVP in just 2 weeks!',
                            )}
                            ”
                        </blockquote>
                        <figcaption className="flex items-center gap-2.5">
                            <span className="flex size-9 items-center justify-center rounded-full bg-[#dbe4ff] text-xs font-bold text-[#0f1729]">
                                SC
                            </span>
                            <span className="flex flex-col">
                                <span className="text-sm font-semibold text-white">
                                    {t(
                                        'auth.layout.testimonial.author',
                                        'Sarah Chen',
                                    )}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {t(
                                        'auth.layout.testimonial.role',
                                        'CTO at TechFlow',
                                    )}
                                </span>
                            </span>
                        </figcaption>
                    </motion.figure>
                    <span className="text-xs text-muted-foreground/80">
                        © {new Date().getFullYear()}{' '}
                        {t(
                            'auth.layout.copyright',
                            'XCO Agency. All rights reserved.',
                        )}
                    </span>
                </div>
            </aside>

            {/* Form panel: follows the selected theme */}
            <main className="flex flex-col">
                <div className="flex items-center justify-between gap-3 px-5 py-4 lg:justify-end lg:px-8">
                    <Link
                        href={home()}
                        className="flex items-center gap-2.5 font-bold lg:hidden"
                    >
                        <span className="flex size-8 items-center justify-center rounded-lg bg-primary">
                            <Sparkles className="size-4 text-white" />
                        </span>
                        Laravel SAAS Starter
                    </Link>
                    <AppearanceToggleDropdown />
                </div>

                <div className="flex flex-1 items-center justify-center px-6 pt-2 pb-12 md:px-10">
                    <motion.div
                        {...rise(0.05)}
                        className="flex w-full max-w-[400px] flex-col gap-6"
                    >
                        <div className="flex flex-col gap-1.5 text-center lg:text-left">
                            <h1 className="text-3xl font-extrabold tracking-[-0.025em]">
                                {title}
                            </h1>
                            {description && (
                                <p className="text-[15px] text-muted-foreground">
                                    {description}
                                </p>
                            )}
                        </div>

                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
