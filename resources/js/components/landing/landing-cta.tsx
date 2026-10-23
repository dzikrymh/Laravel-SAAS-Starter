import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/use-translations';
import { register } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import {
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
} from 'motion/react';
import { useRef } from 'react';
import { Reveal } from './reveal';

export function LandingCta() {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslations();
    const prefersReducedMotion = useReducedMotion() ?? false;

    const ctaRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ctaRef,
        offset: ['start end', 'center center'],
    });
    const dotsScale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);

    return (
        <section ref={ctaRef} className="px-4 pb-24 sm:px-6 lg:px-8">
            <Reveal className="dark relative mx-auto flex max-w-7xl flex-col items-center gap-5 overflow-hidden rounded-[28px] border border-white/10 bg-ink px-8 py-16 text-center text-foreground sm:py-24 lg:py-28">
                <motion.div
                    aria-hidden="true"
                    style={
                        prefersReducedMotion ? undefined : { scale: dotsScale }
                    }
                    className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.12)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)] bg-[size:22px_22px]"
                />
                <span className="relative text-[13px] font-bold tracking-[0.1em] text-highlight uppercase">
                    {t('landing.cta.badge', '100% Free & Open Source')}
                </span>
                <h2 className="relative max-w-3xl text-4xl leading-[1.04] font-extrabold tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
                    {t('landing.cta.title', 'Ready to Launch Your SaaS?')}
                </h2>
                <p className="relative max-w-2xl text-lg leading-relaxed text-muted-foreground">
                    {t(
                        'landing.cta.description',
                        'Join thousands of developers who are building and shipping faster with Laravel SAAS Starter. No credit card required. No subscriptions. Just clone and start building.',
                    )}
                </p>
                <div className="relative mt-2 flex flex-col items-center gap-3 sm:flex-row">
                    <Button
                        size="lg"
                        asChild
                        className="h-12 px-6 text-[15px] transition-[translate,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-8px_var(--primary)]"
                    >
                        <Link href={auth.user ? '/dashboard' : register()}>
                            {t('landing.cta.get_started', 'Get Started Free')}
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
                            {t('landing.cta.github', 'View on GitHub')}
                        </a>
                    </Button>
                </div>
            </Reveal>
        </section>
    );
}
