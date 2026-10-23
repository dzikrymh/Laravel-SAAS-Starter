import {
    LandingCta,
    LandingFaq,
    LandingFeatures,
    LandingFooter,
    LandingHeader,
    LandingHero,
    LandingMarquee,
    LandingPlatform,
    LandingPricing,
    LandingTestimonials,
} from '@/components/landing';
import { useTranslations } from '@/hooks/use-translations';
import { Head } from '@inertiajs/react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { t } = useTranslations();

    return (
        <>
            <Head
                title={t(
                    'landing.meta.title',
                    'Laravel SAAS Starter - Launch Your SaaS 10x Faster',
                )}
            >
                <meta
                    name="description"
                    content={t(
                        'landing.meta.description',
                        'Laravel SAAS Starter is a production-ready Laravel SaaS starter kit with authentication, billing, teams, and everything you need to launch faster. Built by XCO Agency.',
                    )}
                />
                <meta
                    name="keywords"
                    content={t(
                        'landing.meta.keywords',
                        'laravel, saas, starter kit, boilerplate, authentication, stripe, billing, teams',
                    )}
                />
                <meta
                    property="og:title"
                    content={t(
                        'landing.meta.og_title',
                        'Laravel SAAS Starter - Launch Your SaaS 10x Faster',
                    )}
                />
                <meta
                    property="og:description"
                    content={t(
                        'landing.meta.og_description',
                        'Production-ready Laravel SaaS starter kit. 100% free and open source. Launch your SaaS 10x faster with authentication, billing, teams, and more.',
                    )}
                />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content={t(
                        'landing.meta.twitter_title',
                        'Laravel SAAS Starter - Launch Your SaaS 10x Faster',
                    )}
                />
                <meta
                    name="twitter:description"
                    content={t(
                        'landing.meta.twitter_description',
                        'Production-ready Laravel SaaS starter kit by XCO Agency.',
                    )}
                />
            </Head>

            <div className="min-h-screen overflow-x-clip bg-background text-foreground">
                <LandingHeader canRegister={canRegister} />
                <main>
                    <LandingHero />
                    <LandingMarquee />
                    <LandingPlatform />
                    <LandingFeatures />
                    <LandingPricing />
                    <LandingTestimonials />
                    <LandingFaq />
                    <LandingCta />
                </main>
                <LandingFooter />
            </div>
        </>
    );
}
