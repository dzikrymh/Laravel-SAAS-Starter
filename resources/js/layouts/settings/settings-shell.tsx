import { useTranslations } from '@/hooks/use-translations';
import { cn, isSameUrl, resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren, type ReactNode } from 'react';

export interface SettingsNavSection {
    title: string;
    items: NavItem[];
}

interface SettingsShellProps extends PropsWithChildren {
    sections: SettingsNavSection[];
    title: string;
    description?: string;
    /** Small label above the title, e.g. the settings area name. */
    eyebrow?: string;
    navLabel: string;
    actions?: ReactNode;
    fullWidth?: boolean;
    /** Nav item rendered in the destructive colour (e.g. Danger Zone). */
    dangerHref?: string;
}

/**
 * Shared V1 shell for the settings areas: page header, grouped section nav
 * (sticky on desktop, horizontally scrollable on mobile) and content column.
 */
export default function SettingsShell({
    children,
    sections,
    title,
    description,
    eyebrow,
    navLabel,
    actions,
    fullWidth = false,
    dangerHref,
}: SettingsShellProps) {
    const { i18n } = useTranslations();

    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;
    const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];
    const isRTL = RTL_LANGUAGES.includes(i18n.language);

    // Highlight the most specific section, so nested pages such as
    // /billing/plans or /settings/tickets/12 keep their parent active.
    const activeHref = sections
        .flatMap((section) => section.items)
        .map((item) => resolveUrl(item.href))
        .filter(
            (href) =>
                href !== '#' &&
                (isSameUrl(currentPath, href) ||
                    currentPath.startsWith(`${href}/`)),
        )
        .sort((first, second) => second.length - first.length)[0];

    return (
        <div
            className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-4 pt-7 pb-12 lg:px-6"
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <header className="flex animate-rise flex-wrap items-end justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-1.5">
                    {eyebrow && eyebrow !== title && (
                        <span className="text-[13px] text-muted-foreground">
                            {eyebrow}
                        </span>
                    )}
                    <h1 className="text-[30px] leading-tight font-extrabold tracking-[-0.025em]">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-[15px] text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
                {actions && (
                    <div className="flex flex-wrap items-center gap-2">
                        {actions}
                    </div>
                )}
            </header>

            <div
                className={cn(
                    'settings-layout-container flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8',
                    {
                        'lg:flex-row-reverse': isRTL,
                    },
                )}
                data-rtl={isRTL}
            >
                <aside
                    className={cn(
                        'settings-layout-sidebar w-full animate-rise [animation-delay:0.05s] lg:sticky lg:top-6 lg:w-56 lg:shrink-0',
                        {
                            'lg:order-2': isRTL,
                        },
                    )}
                    data-rtl={isRTL}
                >
                    <nav
                        aria-label={navLabel}
                        className="-mx-4 flex gap-5 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
                    >
                        {sections.map((section) => (
                            <div
                                key={section.title}
                                className="flex shrink-0 flex-col gap-1.5 lg:shrink"
                            >
                                <h4 className="px-2.5 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                                    {section.title}
                                </h4>
                                <div className="flex gap-1 lg:flex-col lg:gap-0.5">
                                    {section.items.map((item, index) => {
                                        const href = resolveUrl(item.href);
                                        const isActive = href === activeHref;
                                        const isDanger =
                                            dangerHref !== undefined &&
                                            href === dangerHref;

                                        return (
                                            <Link
                                                key={`${href}-${index}`}
                                                href={item.href}
                                                aria-current={
                                                    isActive
                                                        ? 'page'
                                                        : undefined
                                                }
                                                className={cn(
                                                    'flex min-h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm whitespace-nowrap transition-colors',
                                                    isActive
                                                        ? 'bg-accent font-semibold text-accent-foreground'
                                                        : 'font-medium text-muted-foreground hover:bg-muted hover:text-foreground',
                                                    isDanger &&
                                                        !isActive &&
                                                        'text-destructive hover:text-destructive',
                                                )}
                                            >
                                                {item.icon && (
                                                    <item.icon className="size-4 shrink-0" />
                                                )}
                                                {item.title}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>
                </aside>

                <div
                    className={cn(
                        'settings-layout-content min-w-0 flex-1 animate-rise [animation-delay:0.1s]',
                        {
                            'lg:order-1': isRTL,
                        },
                    )}
                    data-rtl={isRTL}
                >
                    <section
                        className={cn('flex flex-col gap-5', {
                            'max-w-3xl': !fullWidth,
                            'w-full': fullWidth,
                        })}
                    >
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
