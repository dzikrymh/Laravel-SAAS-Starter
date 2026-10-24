import { useFeature } from '@/contexts/feature-context';
import { cn } from '@/lib/utils';
import { ChevronDown, type LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon;
    feature?: string;
}

interface AdminSidebarGroupProps {
    title: string;
    icon: LucideIcon;
    items: NavItem[];
    currentPath: string;
    defaultExpanded?: boolean;
    storageKey: string;
}

export function AdminSidebarGroup({
    title,
    icon: GroupIcon,
    items,
    currentPath,
    defaultExpanded = true,
    storageKey,
}: AdminSidebarGroupProps) {
    // Check localStorage for saved state, default to expanded
    const [isExpanded, setIsExpanded] = useState(() => {
        if (typeof window === 'undefined') return defaultExpanded;
        const saved = localStorage.getItem(`admin-sidebar-${storageKey}`);
        return saved ? saved === 'true' : defaultExpanded;
    });

    const isFeatureEnabled = useFeature;

    // Always show the group expanded when the current route is in it
    const isActiveInGroup = items.some(
        (item) =>
            currentPath === item.href ||
            currentPath.startsWith(item.href + '/'),
    );
    const isOpen = isExpanded || isActiveInGroup;

    // Save state to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(`admin-sidebar-${storageKey}`, String(isOpen));
        }
    }, [isOpen, storageKey]);

    // Filter items by feature flag
    const visibleItems = items.filter((item) => {
        if (!item.feature) return true;
        return isFeatureEnabled(item.feature);
    });

    // Don't render if no visible items
    if (visibleItems.length === 0) return null;

    const isGroupActive = visibleItems.some(
        (item) =>
            currentPath === item.href ||
            currentPath.startsWith(item.href + '/'),
    );

    return (
        <div className="flex flex-col">
            <button
                type="button"
                onClick={() => setIsExpanded(!isOpen)}
                aria-expanded={isOpen}
                className={cn(
                    'flex min-h-9 w-full items-center justify-between rounded-lg px-2.5 text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors hover:text-foreground',
                    isGroupActive ? 'text-foreground' : 'text-muted-foreground',
                )}
            >
                <span className="flex items-center gap-2">
                    <GroupIcon className="size-3.5" />
                    {title}
                </span>
                <ChevronDown
                    className={cn(
                        'size-3.5 transition-transform duration-200',
                        isOpen ? 'rotate-0' : '-rotate-90',
                    )}
                />
            </button>
            <div
                className={cn(
                    'grid transition-[grid-template-rows,opacity] duration-200 ease-in-out',
                    isOpen
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0',
                )}
            >
                <div className="flex flex-col gap-0.5 overflow-hidden pb-2">
                    {visibleItems.map((item) => {
                        const isActive =
                            currentPath === item.href ||
                            currentPath.startsWith(item.href + '/');

                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                aria-current={isActive ? 'page' : undefined}
                                tabIndex={isOpen ? undefined : -1}
                                className={cn(
                                    'flex min-h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm transition-colors',
                                    isActive
                                        ? 'bg-sidebar-accent font-semibold text-sidebar-accent-foreground'
                                        : 'font-medium text-muted-foreground hover:bg-muted hover:text-foreground',
                                )}
                            >
                                {item.icon && (
                                    <item.icon className="size-4 shrink-0" />
                                )}
                                <span className="truncate">{item.title}</span>
                            </a>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
