import { useTranslations } from '@/hooks/use-translations';
import { Activity, CreditCard, LayoutGrid, ShieldCheck } from 'lucide-react';
import { Reveal } from './reveal';

export function LandingPlatform() {
    const { t } = useTranslations();

    const stats = [
        {
            value: '1,000+',
            label: t('landing.testimonials.stats.stars', 'GitHub Stars'),
        },
        {
            value: '50+',
            label: t('landing.testimonials.stats.features', 'Features'),
        },
        {
            value: '100%',
            label: t('landing.testimonials.stats.opensource', 'Open Source'),
        },
        {
            value: 'MIT',
            label: t('landing.testimonials.stats.license', 'License'),
            highlight: true,
        },
    ];

    const pillars = [
        {
            icon: ShieldCheck,
            title: t(
                'landing.features.items.auth.title',
                'Authentication & 2FA',
            ),
            description: t(
                'landing.features.items.auth.description',
                'Complete auth system with login, register, password reset, email verification, and two-factor authentication.',
            ),
        },
        {
            icon: LayoutGrid,
            title: t(
                'landing.features.items.workspaces.title',
                'Multi-tenant Workspaces',
            ),
            description: t(
                'landing.features.items.workspaces.description',
                'Built-in workspace management allowing users to create and switch between multiple organizations.',
            ),
        },
        {
            icon: CreditCard,
            title: t('landing.features.items.billing.title', 'Stripe Billing'),
            description: t(
                'landing.features.items.billing.description',
                'Full Stripe integration with subscriptions, invoices, billing portal, and multiple pricing tiers.',
            ),
        },
        {
            icon: Activity,
            title: t('landing.features.items.admin.title', 'Super Admin Panel'),
            description: t(
                'landing.features.items.admin.description',
                'Global dashboard to monitor workspaces, impersonate users, and oversee the entire SaaS platform.',
            ),
        },
    ];

    return (
        <>
            {/* Stats strip */}
            <section className="px-4 pt-24 pb-10 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-6xl gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <div key={stat.label} className="bg-card p-8">
                            <Reveal delay={index * 0.06}>
                                <div
                                    className={`text-4xl font-extrabold tracking-[-0.03em] tabular-nums sm:text-[44px] ${stat.highlight ? 'text-highlight' : ''}`}
                                >
                                    {stat.value}
                                </div>
                                <div className="mt-1 text-[13px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                                    {stat.label}
                                </div>
                            </Reveal>
                        </div>
                    ))}
                </div>
            </section>

            {/* Sticky story: platform pillars */}
            <section id="platform" className="px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
                    <div className="flex flex-col gap-5 lg:sticky lg:top-28 lg:flex-1">
                        <span className="text-[13px] font-bold tracking-[0.1em] text-highlight uppercase">
                            {t('landing.platform.eyebrow', 'The platform')}
                        </span>
                        <h2 className="text-4xl leading-[1.06] font-extrabold tracking-[-0.03em] sm:text-5xl">
                            {t(
                                'landing.platform.title',
                                'Stop rebuilding boilerplate. Ship what makes you unique.',
                            )}
                        </h2>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            {t(
                                'landing.platform.description',
                                'Every foundation an enterprise SaaS needs — wired together, tested, and ready on day one.',
                            )}
                        </p>
                        <a
                            href="#features"
                            className="mt-2 inline-flex min-h-11 items-center self-start rounded-lg border bg-card px-4 text-[15px] font-semibold transition-[translate,border-color] hover:-translate-y-0.5 hover:border-primary"
                        >
                            {t(
                                'landing.platform.cta',
                                'Explore all features →',
                            )}
                        </a>
                    </div>

                    <div className="flex flex-col gap-6 lg:flex-[1.3]">
                        {pillars.map((pillar) => (
                            <Reveal
                                key={pillar.title}
                                className="group flex flex-col gap-3.5 rounded-2xl border bg-card p-8 transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-primary hover:shadow-[0_24px_48px_-24px_rgb(10_20_60/0.35)]"
                            >
                                <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                                    <pillar.icon className="size-[22px]" />
                                </span>
                                <h3 className="text-[22px] font-bold">
                                    {pillar.title}
                                </h3>
                                <p className="leading-relaxed text-muted-foreground">
                                    {pillar.description}
                                </p>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
