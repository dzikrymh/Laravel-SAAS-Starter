import { Github } from '@/components/brand-icons';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/use-translations';
import { register } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Check, Lock } from 'lucide-react';
import {
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
} from 'motion/react';
import { useRef, type ReactNode } from 'react';

const ease = [0.2, 0.7, 0.2, 1] as const;

export function LandingHero() {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslations();
    const prefersReducedMotion = useReducedMotion() ?? false;

    // Layered parallax: each layer moves at its own speed while scrolling.
    const { scrollY } = useScroll();
    const gridY = useTransform(scrollY, [0, 900], [0, 220]);
    const glowY = useTransform(scrollY, [0, 900], [0, 120]);
    const fastY = useTransform(scrollY, [0, 900], [0, -160]);
    const copyOpacity = useTransform(scrollY, [0, 620], [1, 0]);
    const copyY = useTransform(scrollY, [0, 620], [0, -60]);
    const copyScale = useTransform(scrollY, [0, 620], [1, 0.96]);

    // The product mock tilts back and flattens as it scrolls into view.
    const mockRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: mockProgress } = useScroll({
        target: mockRef,
        offset: ['start end', 'start 35%'],
    });
    const mockRotate = useTransform(mockProgress, [0, 1], [22, 0]);
    const mockScale = useTransform(mockProgress, [0, 1], [0.9, 1]);
    const mockY = useTransform(mockProgress, [0, 1], [40, 0]);

    const still = prefersReducedMotion;
    const intro = (delay: number) =>
        still
            ? {}
            : {
                  initial: { opacity: 0, y: 28 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.9, delay, ease },
              };

    return (
        <section className="dark relative overflow-hidden bg-ink px-4 pt-24 text-foreground sm:px-6 sm:pt-32 lg:px-8">
            <motion.div
                aria-hidden="true"
                style={still ? undefined : { y: gridY }}
                className="absolute inset-x-0 -top-52 bottom-0 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000_30%,transparent_75%)]"
            />
            <motion.div
                aria-hidden="true"
                style={still ? undefined : { y: glowY }}
                className="absolute top-10 left-1/2 h-[520px] w-[900px] max-w-[160%] -translate-x-1/2 bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--primary)_55%,transparent),transparent)] opacity-70 blur-3xl"
            />

            <motion.div
                style={
                    still
                        ? undefined
                        : { opacity: copyOpacity, y: copyY, scale: copyScale }
                }
                className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 text-center"
            >
                <motion.a
                    {...intro(0)}
                    href="#platform"
                    className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 py-1.5 pr-3.5 pl-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-white">
                        {t('landing.hero.badge_new', 'New')}
                    </span>
                    Laravel 13 · Inertia v3 · React 19
                    <ArrowRight className="size-3.5" />
                </motion.a>

                <motion.h1
                    {...intro(0.08)}
                    className="text-5xl leading-[1.02] font-extrabold tracking-[-0.035em] text-white sm:text-7xl lg:text-[88px]"
                >
                    {t('landing.hero.title.part1', 'Build Your SaaS')}
                    <br />
                    <span className="text-highlight">
                        {t('landing.hero.title.part2', '10x Faster')}
                    </span>
                </motion.h1>

                <motion.p
                    {...intro(0.18)}
                    className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
                >
                    {t(
                        'landing.hero.description',
                        'Production-ready Laravel SaaS starter kit with authentication, billing, teams, and everything you need. Launch your SaaS 10x faster.',
                    )}{' '}
                    <strong className="font-semibold text-white">
                        {t(
                            'landing.hero.description_highlight',
                            '100% Open Source.',
                        )}
                    </strong>
                </motion.p>

                <motion.div
                    {...intro(0.28)}
                    className="mt-2 flex flex-col items-center gap-3 sm:flex-row"
                >
                    <Button
                        size="lg"
                        asChild
                        className="h-12 px-6 text-[15px] transition-[translate,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-8px_var(--primary)]"
                    >
                        <Link href={auth.user ? '/dashboard' : register()}>
                            {t(
                                'landing.hero.cta.get_started',
                                'Get Started Free',
                            )}
                            <ArrowRight />
                        </Link>
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        asChild
                        className="h-12 border-white/15 bg-white/5 px-6 text-[15px] text-white transition-transform hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
                    >
                        <a
                            href="https://github.com/xco-agency/laravel-saas-starter"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github />
                            {t('landing.hero.cta.github', 'View on GitHub')}
                        </a>
                    </Button>
                </motion.div>

                <motion.p
                    {...intro(0.4)}
                    className="font-mono text-[13px] text-muted-foreground/80"
                >
                    $ git clone github.com/xco-agency/laravel-saas-starter
                </motion.p>
            </motion.div>

            {/* Product mock with floating cards at different speeds */}
            <div
                ref={mockRef}
                className="relative mx-auto mt-16 max-w-6xl [perspective:1800px] sm:mt-20"
            >
                <motion.div
                    aria-hidden="true"
                    style={still ? undefined : { y: fastY }}
                    className="absolute top-28 -left-6 z-10 hidden md:block"
                >
                    <FloatingCard
                        light
                        icon={<Check className="size-[18px]" />}
                        iconClassName="bg-emerald-100 text-emerald-700"
                        title={t('landing.hero.float.paid', 'Invoice paid')}
                        subtitle={t(
                            'landing.hero.float.paid_sub',
                            'Stripe · Pro plan',
                        )}
                    />
                </motion.div>
                <motion.div
                    aria-hidden="true"
                    style={still ? undefined : { y: glowY }}
                    className="absolute top-10 -right-5 z-10 hidden md:block"
                >
                    <FloatingCard
                        delay="-2s"
                        icon={<Lock className="size-[18px]" />}
                        iconClassName="bg-primary/30 text-highlight"
                        title={t('landing.hero.float.2fa', '2FA enabled')}
                        subtitle="Fortify · TOTP"
                    />
                </motion.div>
                <motion.div
                    aria-hidden="true"
                    style={still ? undefined : { y: fastY }}
                    className="absolute right-16 bottom-28 z-10 hidden lg:block"
                >
                    <div className="flex items-center gap-2.5 rounded-xl bg-white px-3.5 py-3 text-[#0f1729] shadow-[0_20px_50px_-12px_rgb(0_0_0/0.5)] motion-safe:animate-float motion-safe:[animation-delay:-4s]">
                        <span className="flex">
                            {['AK', 'RS', '+3'].map((initials, index) => (
                                <span
                                    key={initials}
                                    className={`flex size-7 items-center justify-center rounded-full border-2 border-white text-[11px] font-bold ${['bg-[#dbe4ff]', 'bg-[#ffe2c7]', 'bg-[#d7f2e3]'][index]} ${index > 0 ? '-ml-2' : ''}`}
                                >
                                    {initials}
                                </span>
                            ))}
                        </span>
                        <span className="text-[13px] font-semibold">
                            {t('landing.hero.float.invite', 'Team invite sent')}
                        </span>
                    </div>
                </motion.div>

                <motion.div
                    style={
                        still
                            ? undefined
                            : {
                                  rotateX: mockRotate,
                                  scale: mockScale,
                                  y: mockY,
                              }
                    }
                    className="relative origin-bottom overflow-hidden rounded-t-2xl border border-b-0 border-white/10 bg-[#0f1424] shadow-[0_-20px_80px_-20px_color-mix(in_oklab,var(--primary)_60%,transparent)]"
                >
                    <DashboardMock />
                </motion.div>
            </div>
        </section>
    );
}

function FloatingCard({
    icon,
    iconClassName,
    title,
    subtitle,
    delay,
    light = false,
}: {
    icon: ReactNode;
    iconClassName: string;
    title: string;
    subtitle: string;
    delay?: string;
    light?: boolean;
}) {
    return (
        <div
            style={{ animationDelay: delay }}
            className={`flex min-w-52 items-center gap-3 rounded-xl px-4 py-3.5 shadow-[0_20px_50px_-12px_rgb(0_0_0/0.55)] motion-safe:animate-float ${light ? 'bg-white text-[#0f1729]' : 'border border-white/10 bg-card text-foreground'}`}
        >
            <span
                className={`flex size-9 items-center justify-center rounded-lg ${iconClassName}`}
            >
                {icon}
            </span>
            <span className="flex flex-col">
                <span className="text-[13px] font-semibold">{title}</span>
                <span
                    className={`text-xs ${light ? 'text-[#545e73]' : 'text-muted-foreground'}`}
                >
                    {subtitle}
                </span>
            </span>
        </div>
    );
}

const barHeights = [32, 45, 38, 56, 50, 66, 72, 68, 84, 92];

function DashboardMock() {
    const prefersReducedMotion = useReducedMotion() ?? false;

    return (
        <div aria-hidden="true">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-4 rounded-md bg-white/5 px-3.5 py-1 font-mono text-xs text-muted-foreground">
                    app.yoursaas.com/dashboard
                </span>
            </div>
            <div className="flex min-h-[300px] sm:min-h-[460px]">
                <div className="hidden w-56 shrink-0 flex-col gap-1.5 border-r border-white/10 px-4 py-5 text-[13px] text-muted-foreground sm:flex">
                    <span className="mb-2.5 flex items-center gap-2.5 rounded-lg bg-white/5 px-2.5 py-2 font-semibold text-white">
                        <span className="size-5 rounded-md bg-primary" />
                        Acme Inc.
                    </span>
                    {[
                        'Dashboard',
                        'Workspaces',
                        'Team & roles',
                        'Billing',
                        'Feature flags',
                        'Audit log',
                        'Settings',
                    ].map((item, index) => (
                        <span
                            key={item}
                            className={`rounded-lg px-2.5 py-2 ${index === 0 ? 'bg-primary/25 text-white' : ''}`}
                        >
                            {item}
                        </span>
                    ))}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-4 p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-white">
                            Overview
                        </span>
                        <span className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="size-2 rounded-full bg-[#3ddc84] motion-safe:animate-pulse" />
                            Live
                        </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {['MRR', 'Active workspaces', 'Seats'].map((label) => (
                            <div
                                key={label}
                                className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
                            >
                                <div className="truncate text-xs text-muted-foreground">
                                    {label}
                                </div>
                                <div className="mt-2 h-5 w-16 max-w-full rounded-md bg-white/15" />
                            </div>
                        ))}
                    </div>
                    <div className="flex min-h-40 flex-1 items-end gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        {barHeights.map((height, index) => (
                            <motion.span
                                key={index}
                                initial={
                                    prefersReducedMotion
                                        ? false
                                        : { scaleY: 0.15 }
                                }
                                whileInView={{ scaleY: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 1.2,
                                    delay: index * 0.05,
                                    ease,
                                }}
                                style={{ height: `${height}%` }}
                                className={`flex-1 origin-bottom rounded-t-md ${index === barHeights.length - 1 ? 'bg-primary' : 'bg-[#8fb0ff]/35'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
