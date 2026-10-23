import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { NotificationsDropdown } from '@/components/notifications-dropdown';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTranslations } from '@/hooks/use-translations';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Search } from 'lucide-react';

const openCommandPalette = () =>
    window.dispatchEvent(new Event('open-command-palette'));

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { t } = useTranslations();

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 lg:px-6">
            <div className="flex min-w-0 items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={openCommandPalette}
                    title="Search (Cmd+K)"
                    className="hidden h-10 w-60 cursor-pointer items-center gap-2 rounded-[10px] border bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-primary md:flex"
                >
                    <Search className="size-4" />
                    <span className="flex-1 text-left">
                        {t('header.search', 'Search…')}
                    </span>
                    <kbd className="rounded-[5px] border px-1.5 font-mono text-[11px]">
                        ⌘K
                    </kbd>
                </button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="group h-9 w-9 cursor-pointer md:hidden"
                    onClick={openCommandPalette}
                    title="Search (Cmd+K)"
                >
                    <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                </Button>
                <AppearanceToggleDropdown />
                <NotificationsDropdown />
            </div>
        </header>
    );
}
