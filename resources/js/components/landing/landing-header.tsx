import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTranslations } from '@/hooks/use-translations';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu, Sparkles } from 'lucide-react';
import { motion, useScroll } from 'motion/react';
import { useState, type MouseEvent } from 'react';

interface LandingHeaderProps {
    canRegister?: boolean;
}

const scrollToSection = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
) => {
    if (!href.startsWith('#')) {
        return;
    }

    event.preventDefault();
    document
        .querySelector(href)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export function LandingHeader({ canRegister = true }: LandingHeaderProps) {
    const { t } = useTranslations();
    const { auth, locale } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollYProgress } = useScroll();

    const navLinks = [
        { href: '#features', label: t('landing.nav.features', 'Features') },
        { href: '#platform', label: t('landing.nav.platform', 'Platform') },
        {
            href: '#testimonials',
            label: t('landing.nav.testimonials', 'Testimonials'),
        },
        { href: '#faq', label: t('landing.nav.faq', 'FAQ') },
    ];

    return (
        // The header always sits on the dark brand surface, so it is scoped to
        // the dark theme tokens in both light and dark mode.
        <header className="dark sticky top-0 z-50 w-full border-b border-white/10 bg-ink/75 text-foreground backdrop-blur-md">
            <motion.div
                aria-hidden="true"
                style={{ scaleX: scrollYProgress }}
                className="absolute inset-x-0 top-0 h-0.5 origin-left bg-primary"
            />
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2.5">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary">
                        <Sparkles className="size-4 text-white" />
                    </span>
                    <span className="text-base font-bold tracking-tight">
                        Laravel SAAS Starter
                    </span>
                </Link>

                <nav className="hidden items-center gap-7 md:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={(event) =>
                                scrollToSection(event, link.href)
                            }
                            className="relative text-sm font-medium text-muted-foreground transition-colors after:absolute after:inset-x-0 after:-bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-primary after:transition-transform hover:text-foreground hover:after:scale-x-100"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="hidden items-center gap-2 md:flex">
                    <LanguageSwitcher currentLocale={locale} />
                    <AppearanceToggleDropdown />
                    {auth.user ? (
                        <Button asChild>
                            <Link href={dashboard()}>
                                {t('landing.nav.dashboard', 'Dashboard')}
                            </Link>
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link href={login()}>
                                    {t('landing.nav.signin', 'Sign In')}
                                </Link>
                            </Button>
                            {canRegister && (
                                <Button
                                    asChild
                                    className="transition-[translate,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-8px_var(--primary)]"
                                >
                                    <Link href={register()}>
                                        {t(
                                            'landing.hero.get_started',
                                            'Get Started',
                                        )}
                                    </Link>
                                </Button>
                            )}
                        </>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className="flex items-center gap-1 md:hidden">
                    <AppearanceToggleDropdown />
                    <Sheet
                        open={mobileMenuOpen}
                        onOpenChange={setMobileMenuOpen}
                    >
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="size-5" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-full sm:max-w-sm"
                        >
                            <div className="flex flex-col gap-6 p-6 pt-12">
                                <nav className="flex flex-col gap-4">
                                    {navLinks.map((link) => (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            onClick={(event) => {
                                                setMobileMenuOpen(false);
                                                if (link.href.startsWith('#')) {
                                                    event.preventDefault();
                                                    setTimeout(() => {
                                                        document
                                                            .querySelector(
                                                                link.href,
                                                            )
                                                            ?.scrollIntoView({
                                                                behavior:
                                                                    'smooth',
                                                                block: 'start',
                                                            });
                                                    }, 100);
                                                }
                                            }}
                                            className="text-lg font-medium text-foreground"
                                        >
                                            {link.label}
                                        </a>
                                    ))}
                                </nav>
                                <LanguageSwitcher currentLocale={locale} />
                                <div className="flex flex-col gap-3">
                                    {auth.user ? (
                                        <Button asChild className="w-full">
                                            <Link href={dashboard()}>
                                                {t(
                                                    'landing.nav.dashboard',
                                                    'Dashboard',
                                                )}
                                            </Link>
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                variant="outline"
                                                asChild
                                                className="w-full"
                                            >
                                                <Link href={login()}>
                                                    {t(
                                                        'landing.nav.signin',
                                                        'Sign In',
                                                    )}
                                                </Link>
                                            </Button>
                                            {canRegister && (
                                                <Button
                                                    asChild
                                                    className="w-full"
                                                >
                                                    <Link href={register()}>
                                                        {t(
                                                            'landing.hero.get_started',
                                                            'Get Started',
                                                        )}
                                                    </Link>
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
