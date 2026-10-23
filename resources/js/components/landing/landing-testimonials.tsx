import { useTranslations } from '@/hooks/use-translations';
import { Reveal } from './reveal';

const avatarColors = ['bg-[#dbe4ff]', 'bg-[#ffe2c7]', 'bg-[#d7f2e3]'];

export function LandingTestimonials() {
    const { t } = useTranslations();

    const testimonials = [
        {
            quote: t(
                'landing.testimonials.items.sarah.quote',
                'Laravel SAAS Starter saved us months of development time. The authentication, billing, and team management were all ready to go. We launched our MVP in just 2 weeks!',
            ),
            author: 'Sarah Chen',
            role: t('landing.testimonials.items.sarah.role', 'CTO at TechFlow'),
        },
        {
            quote: t(
                'landing.testimonials.items.michael.quote',
                "The code quality is exceptional. It's clear that experienced Laravel developers built this. The multi-workspace feature was exactly what we needed.",
            ),
            author: 'Michael Rodriguez',
            role: t(
                'landing.testimonials.items.michael.role',
                'Founder at DataSync',
            ),
        },
        {
            quote: t(
                'landing.testimonials.items.emily.quote',
                "Best SaaS starter kit I've used. The Stripe integration worked flawlessly, and the dark mode looks beautiful. Highly recommended!",
            ),
            author: 'Emily Watson',
            role: t(
                'landing.testimonials.items.emily.role',
                'Lead Developer at CloudBase',
            ),
        },
    ];

    return (
        <section id="testimonials" className="px-4 py-28 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-12">
                <Reveal className="mx-auto flex max-w-3xl flex-col gap-4 text-center">
                    <h2 className="text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
                        {t('landing.testimonials.title.part1', 'Loved by')}{' '}
                        {t('landing.testimonials.title.part2', 'Developers')}{' '}
                        {t('landing.testimonials.title.part3', 'Worldwide')}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        {t(
                            'landing.testimonials.description',
                            "Don't just take our word for it. Here's what developers are saying about Laravel SAAS Starter.",
                        )}
                    </p>
                </Reveal>

                <div className="grid gap-5 md:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <Reveal
                            key={testimonial.author}
                            as="figure"
                            delay={index * 0.08}
                            className="flex flex-col justify-between gap-7 rounded-2xl border bg-card p-8 transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-primary hover:shadow-[0_24px_48px_-24px_rgb(10_20_60/0.35)]"
                        >
                            <blockquote className="text-[17px] leading-relaxed">
                                “{testimonial.quote}”
                            </blockquote>
                            <figcaption className="flex items-center gap-3">
                                <span
                                    className={`flex size-10 items-center justify-center rounded-full text-sm font-bold text-[#0f1729] ${avatarColors[index]}`}
                                >
                                    {testimonial.author
                                        .split(' ')
                                        .map((name) => name[0])
                                        .join('')}
                                </span>
                                <span className="flex flex-col">
                                    <span className="font-semibold">
                                        {testimonial.author}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {testimonial.role}
                                    </span>
                                </span>
                            </figcaption>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
