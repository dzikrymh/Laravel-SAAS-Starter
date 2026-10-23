import { useTranslations } from '@/hooks/use-translations';
import {
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
} from 'motion/react';
import { useRef } from 'react';
import { Reveal } from './reveal';

/**
 * Dark band with two oversized lines sliding in opposite directions as the
 * section scrolls past, followed by the open-source guarantees.
 */
export function LandingPricing() {
    const { t } = useTranslations();
    const prefersReducedMotion = useReducedMotion() ?? false;

    const bandRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: bandRef,
        offset: ['start end', 'end start'],
    });
    const lineOneX = useTransform(scrollYProgress, [0, 1], ['8%', '-22%']);
    const lineTwoX = useTransform(scrollYProgress, [0, 1], ['-22%', '8%']);

    const items = [
        {
            title: t('landing.pricing.items.free.title', '100% Free'),
            description: t(
                'landing.pricing.items.free.description',
                'No subscriptions, no per-project fees, no royalties. Use it however you want.',
            ),
        },
        {
            title: t('landing.pricing.items.license.title', 'MIT License'),
            description: t(
                'landing.pricing.items.license.description',
                'Completely open source with permissive licensing. Commercial use is welcome.',
            ),
        },
        {
            title: t(
                'landing.pricing.items.production.title',
                'Production Ready',
            ),
            description: t(
                'landing.pricing.items.production.description',
                'Battle-tested code following Laravel best practices. Ready for production use.',
            ),
        },
    ];

    const lineOne = `${items[0].title} · ${items[1].title} · ${items[0].title} · ${items[1].title}`;
    const lineTwo = `${items[2].title} · ${t('landing.pricing.title.part3', 'Open Source')} · ${items[2].title} · ${t('landing.pricing.title.part3', 'Open Source')}`;

    return (
        <section
            id="pricing"
            ref={bandRef}
            aria-label={t('landing.pricing.title.part3', 'Open Source')}
            className="dark flex flex-col gap-2 overflow-hidden border-y border-white/10 bg-ink py-28 text-white"
        >
            <motion.div
                aria-hidden="true"
                style={prefersReducedMotion ? undefined : { x: lineOneX }}
                className="text-[clamp(56px,10vw,150px)] leading-none font-extrabold tracking-[-0.04em] whitespace-nowrap uppercase"
            >
                {lineOne}
            </motion.div>
            <motion.div
                aria-hidden="true"
                style={prefersReducedMotion ? undefined : { x: lineTwoX }}
                className="text-[clamp(56px,10vw,150px)] leading-none font-extrabold tracking-[-0.04em] whitespace-nowrap text-transparent uppercase [-webkit-text-stroke:1.5px_#8fb0ff]"
            >
                {lineTwo}
            </motion.div>

            <div className="mx-auto mt-16 grid w-full max-w-6xl gap-8 px-6 sm:grid-cols-3">
                {items.map((item, index) => (
                    <Reveal
                        key={item.title}
                        from="left"
                        delay={index * 0.08}
                        className="flex flex-col gap-2"
                    >
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                        <p className="leading-relaxed text-muted-foreground">
                            {item.description}
                        </p>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
