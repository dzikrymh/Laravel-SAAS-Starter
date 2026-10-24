import { AdminSidebarGroup } from '@/components/admin/admin-sidebar-group';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { ImpersonationBanner } from '@/components/impersonation-banner';
import { FeatureProvider } from '@/contexts/feature-context';
import { cn } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    ArrowLeft,
    BarChart3,
    Bell,
    Building2,
    ChevronRight,
    Clock,
    Compass,
    DollarSign,
    Globe,
    Grid3X3,
    KeyRound,
    LayoutDashboard,
    ListChecks,
    Mail,
    Megaphone,
    Menu,
    MessageSquare,
    Power,
    RefreshCw,
    ScrollText,
    Search,
    ShieldCheck,
    Terminal,
    Ticket,
    ToggleLeft,
    Users,
    X,
} from 'lucide-react';
import {
    type PropsWithChildren,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

interface QuickStats {
    total_users: number;
    total_workspaces: number;
    mrr: number;
}

function AdminQuickStatsWidget() {
    const [stats, setStats] = useState<QuickStats | null>(null);
    const [loading, setLoading] = useState(true);

    const loadStats = useCallback(
        () =>
            fetch('/admin/quick-stats', {
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            })
                .then((res) => (res.ok ? res.json() : null))
                .then((data: QuickStats | null) => {
                    if (data) {
                        setStats(data);
                    }
                })
                .finally(() => setLoading(false)),
        [],
    );

    const refreshStats = () => {
        setLoading(true);
        loadStats();
    };

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    if (!stats) {
        return (
            <div className="grid grid-cols-3 gap-2 rounded-xl border border-sidebar-border bg-card p-3">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="flex flex-col gap-1.5">
                        <div className="h-4 w-10 animate-pulse rounded bg-muted" />
                        <div className="h-2.5 w-8 animate-pulse rounded bg-muted" />
                    </div>
                ))}
            </div>
        );
    }

    const items = [
        {
            label: 'Users',
            value: stats.total_users.toLocaleString(),
            trend: null,
        },
        {
            label: 'Spaces',
            value: stats.total_workspaces.toLocaleString(),
            trend: null,
        },
        {
            label: 'MRR',
            value: `$${stats.mrr.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
            trend: null,
        },
    ];

    return (
        <div className="flex flex-col gap-2.5 rounded-xl border border-sidebar-border bg-card p-3">
            <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                    Platform
                </span>
                <button
                    type="button"
                    onClick={refreshStats}
                    disabled={loading}
                    aria-label="Refresh stats"
                    title="Refresh stats"
                    className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    <RefreshCw
                        className={cn('size-3.5', loading && 'animate-spin')}
                    />
                </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {items.map((item) => (
                    <div key={item.label} className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-bold tabular-nums">
                            {item.value}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Navigation groups configuration
const adminNavGroups = [
    {
        title: 'Dashboard',
        icon: LayoutDashboard,
        storageKey: 'dashboard',
        defaultExpanded: true,
        items: [
            {
                title: 'Overview',
                href: '/admin/dashboard',
                icon: LayoutDashboard,
            },
            {
                title: 'System Health',
                href: '/admin/system-health',
                icon: Activity,
            },
        ],
    },
    {
        title: 'Analytics',
        icon: BarChart3,
        storageKey: 'analytics',
        defaultExpanded: false,
        items: [
            {
                title: 'User Analytics',
                href: '/admin/user-analytics',
                icon: Users,
            },
            {
                title: 'Revenue',
                href: '/admin/revenue-analytics',
                icon: DollarSign,
            },
            {
                title: 'Cohort Analysis',
                href: '/admin/cohort-analysis',
                icon: Grid3X3,
            },
            { title: 'Retention', href: '/admin/retention', icon: Compass },
            {
                title: 'Activity Heatmap',
                href: '/admin/workspace-activity-heatmap',
                icon: Activity,
            },
            {
                title: 'Onboarding',
                href: '/admin/onboarding-insights',
                icon: Compass,
            },
            {
                title: 'Notifications',
                href: '/admin/notification-analytics',
                icon: Bell,
            },
        ],
    },
    {
        title: 'Users & Workspaces',
        icon: Users,
        storageKey: 'users',
        defaultExpanded: false,
        items: [
            { title: 'All Users', href: '/admin/users', icon: Users },
            { title: 'Workspaces', href: '/admin/workspaces', icon: Building2 },
            {
                title: 'Impersonation Logs',
                href: '/admin/impersonation-logs',
                icon: ScrollText,
                feature: 'admin.impersonation',
            },
        ],
    },
    {
        title: 'Content & Comms',
        icon: Megaphone,
        storageKey: 'content',
        defaultExpanded: false,
        items: [
            {
                title: 'Announcements',
                href: '/admin/announcements',
                icon: Megaphone,
                feature: 'admin.announcements',
            },
            {
                title: 'Broadcasts',
                href: '/admin/broadcasts',
                icon: Megaphone,
                feature: 'admin.broadcasts',
            },
            {
                title: 'Changelog',
                href: '/admin/changelog',
                icon: ListChecks,
                feature: 'admin.changelog',
            },
            {
                title: 'Email Templates',
                href: '/admin/mail-templates',
                icon: Mail,
                feature: 'admin.mail_templates',
            },
            {
                title: 'Feedback',
                href: '/admin/feedback',
                icon: MessageSquare,
                feature: 'admin.feedback',
            },
            {
                title: 'SEO',
                href: '/admin/seo',
                icon: Globe,
                feature: 'admin.seo',
            },
            {
                title: 'Status Page',
                href: '/admin/status',
                icon: Activity,
                feature: 'admin.status_page',
            },
            {
                title: 'Support Tickets',
                href: '/admin/tickets',
                icon: Ticket,
                feature: 'user.support_tickets',
            },
            {
                title: 'Translations',
                href: '/admin/translations',
                icon: Globe,
                feature: 'admin.translations',
            },
        ],
    },
    {
        title: 'System & Security',
        icon: ShieldCheck,
        storageKey: 'system',
        defaultExpanded: false,
        items: [
            {
                title: 'Audit Logs',
                href: '/admin/audit-logs',
                icon: ScrollText,
                feature: 'admin.audit_logs',
            },
            {
                title: 'System Logs',
                href: '/admin/logs',
                icon: Terminal,
                feature: 'admin.audit_logs',
            },
            {
                title: 'Feature Flags',
                href: '/admin/feature-flags',
                icon: ToggleLeft,
                feature: 'workspace.feature_flags',
            },
            {
                title: 'Permission Presets',
                href: '/admin/permission-presets',
                icon: KeyRound,
                feature: 'admin.permission_presets',
            },
            {
                title: 'Scheduled Tasks',
                href: '/admin/scheduled-tasks',
                icon: Clock,
                feature: 'admin.scheduled_tasks',
            },
            {
                title: 'Data Retention',
                href: '/admin/retention',
                icon: ShieldCheck,
                feature: 'admin.retention',
            },
            {
                title: 'System Alerts',
                href: '/admin/system-notifications',
                icon: AlertTriangle,
                feature: 'admin.system_notifications',
            },
            {
                title: 'Maintenance',
                href: '/admin/maintenance',
                icon: Power,
                feature: 'admin.maintenance_mode',
            },
        ],
    },
];

interface SearchResult {
    id: number;
    name?: string;
    email?: string;
    slug?: string;
    workspace_name?: string;
    stripe_status?: string;
    url: string;
}

interface SearchResults {
    users: SearchResult[];
    workspaces: SearchResult[];
    subscriptions: SearchResult[];
}

function AdminSearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResults | null>(null);
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Press "/" anywhere (outside form fields) to jump to search
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const isTyping =
                target.isContentEditable ||
                ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
            if (e.key === '/' && !isTyping) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, []);

    const fetchResults = useCallback(async (q: string) => {
        if (q.length < 2) {
            setResults(null);
            return;
        }
        const res = await fetch(`/admin/search?q=${encodeURIComponent(q)}`, {
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
        });
        if (res.ok) {
            setResults(await res.json());
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => fetchResults(query), 300);
        return () => clearTimeout(timer);
    }, [query, fetchResults]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const hasResults =
        results &&
        (results.users.length > 0 ||
            results.workspaces.length > 0 ||
            results.subscriptions.length > 0);

    const navigate = (url: string) => {
        setOpen(false);
        setQuery('');
        setResults(null);
        router.visit(url);
    };

    return (
        <div ref={containerRef} className="relative px-4 pb-2">
            <label className="flex h-10 items-center gap-2 rounded-[10px] border border-sidebar-border bg-card px-3 transition-[border-color,box-shadow] focus-within:border-primary focus-within:ring-4 focus-within:ring-ring/15">
                <Search className="size-4 shrink-0 text-muted-foreground" />
                <span className="sr-only">Search users and workspaces</span>
                <input
                    ref={inputRef}
                    type="search"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    placeholder="Search users, workspaces…"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            setOpen(false);
                            inputRef.current?.blur();
                        }
                    }}
                />
                <kbd className="hidden rounded-[5px] border px-1.5 font-mono text-[11px] text-muted-foreground lg:inline">
                    /
                </kbd>
            </label>

            {open && query.length >= 2 && (
                <div className="absolute top-full right-4 left-4 z-50 mt-1.5 overflow-hidden rounded-xl border bg-popover shadow-[0_20px_45px_-20px_rgb(15_23_41/0.45)]">
                    {!hasResults ? (
                        <p className="px-3.5 py-3 text-sm text-muted-foreground">
                            No results for “{query}”.
                        </p>
                    ) : (
                        <div className="max-h-80 overflow-y-auto py-1">
                            {(
                                [
                                    {
                                        label: 'Users',
                                        items: results.users,
                                        primary: (r: SearchResult) => r.name,
                                        secondary: (r: SearchResult) => r.email,
                                    },
                                    {
                                        label: 'Workspaces',
                                        items: results.workspaces,
                                        primary: (r: SearchResult) => r.name,
                                        secondary: (r: SearchResult) => r.slug,
                                    },
                                    {
                                        label: 'Subscriptions',
                                        items: results.subscriptions,
                                        primary: (r: SearchResult) =>
                                            r.workspace_name,
                                        secondary: (r: SearchResult) =>
                                            r.stripe_status,
                                    },
                                ] as const
                            )
                                .filter((group) => group.items.length > 0)
                                .map((group) => (
                                    <div key={group.label}>
                                        <p className="px-3.5 pt-2 pb-1 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                                            {group.label}
                                        </p>
                                        {group.items.map((result) => (
                                            <button
                                                key={`${group.label}-${result.id}`}
                                                type="button"
                                                onClick={() =>
                                                    navigate(result.url)
                                                }
                                                className="flex w-full flex-col px-3.5 py-2 text-left text-sm transition-colors hover:bg-accent"
                                            >
                                                <span className="font-medium">
                                                    {group.primary(result)}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {group.secondary(result)}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function AdminBrand() {
    return (
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-ink text-white">
                <ShieldCheck className="size-4" />
            </span>
            <span className="flex flex-col leading-tight">
                <span className="text-sm font-bold">Admin Panel</span>
                <span className="text-[11px] text-muted-foreground">
                    Superadmin
                </span>
            </span>
        </Link>
    );
}

function AdminNav({ currentPath }: { currentPath: string }) {
    return (
        <>
            {adminNavGroups.map((group) => (
                <AdminSidebarGroup
                    key={group.title}
                    title={group.title}
                    icon={group.icon}
                    items={group.items}
                    currentPath={currentPath}
                    defaultExpanded={group.defaultExpanded}
                    storageKey={group.storageKey}
                />
            ))}
        </>
    );
}

function BackToAppLink({ onClick }: { onClick?: () => void }) {
    return (
        <Link
            href="/dashboard"
            onClick={onClick}
            className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
            <ArrowLeft className="size-4" />
            Back to App
        </Link>
    );
}

// Mobile drawer component
function MobileAdminDrawer({
    currentPath,
    isOpen,
    onClose,
}: {
    currentPath: string;
    isOpen: boolean;
    onClose: () => void;
}) {
    useEffect(() => {
        if (!isOpen) {
            return;
        }
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-[2px] lg:hidden"
                onClick={onClose}
            />
            {/* Drawer */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Admin navigation"
                className="fixed inset-y-0 left-0 z-50 flex w-[284px] animate-in flex-col bg-sidebar text-sidebar-foreground shadow-2xl duration-200 slide-in-from-left lg:hidden"
            >
                <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
                    <AdminBrand />
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close navigation"
                        className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                        <X className="size-5" />
                    </button>
                </div>
                <div className="pt-3">
                    <AdminSearchBar />
                </div>
                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
                    <AdminNav currentPath={currentPath} />
                </nav>
                <div className="border-t border-sidebar-border p-3">
                    <BackToAppLink onClick={onClose} />
                </div>
            </div>
        </>
    );
}

// Breadcrumb component
function AdminBreadcrumb({ currentPath }: { currentPath: string }) {
    let currentGroup = '';
    let currentItem = '';

    for (const group of adminNavGroups) {
        const item = group.items.find(
            (i) =>
                currentPath === i.href || currentPath.startsWith(i.href + '/'),
        );
        if (item) {
            currentGroup = group.title;
            currentItem = item.title;
            break;
        }
    }

    return (
        <nav
            aria-label="Breadcrumb"
            className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground"
        >
            <Link
                href="/admin/dashboard"
                className="transition-colors hover:text-foreground"
            >
                Admin
            </Link>
            {currentItem && (
                <>
                    <ChevronRight className="size-3.5 shrink-0" />
                    <span className="truncate">{currentGroup}</span>
                    {currentItem !== currentGroup && (
                        <>
                            <ChevronRight className="size-3.5 shrink-0" />
                            <span className="truncate font-semibold text-foreground">
                                {currentItem}
                            </span>
                        </>
                    )}
                </>
            )}
        </nav>
    );
}

export default function AdminLayout({ children }: PropsWithChildren) {
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const currentPath =
        typeof window !== 'undefined' ? window.location.pathname : '';

    return (
        <FeatureProvider>
            <div className="flex min-h-screen bg-background">
                {/* Desktop Sidebar */}
                <aside className="sticky top-0 hidden h-svh w-[264px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
                    <div className="flex h-16 items-center px-5">
                        <AdminBrand />
                    </div>

                    <AdminSearchBar />

                    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
                        <AdminNav currentPath={currentPath} />
                    </nav>

                    <div className="flex flex-col gap-2 border-t border-sidebar-border p-3">
                        <AdminQuickStatsWidget />
                        <BackToAppLink />
                    </div>
                </aside>

                {/* Mobile Drawer */}
                <MobileAdminDrawer
                    currentPath={currentPath}
                    isOpen={mobileDrawerOpen}
                    onClose={() => setMobileDrawerOpen(false)}
                />

                {/* Main Content */}
                <div className="flex min-w-0 flex-1 flex-col">
                    <ImpersonationBanner />

                    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md lg:px-8">
                        <button
                            type="button"
                            onClick={() => setMobileDrawerOpen(true)}
                            aria-label="Open navigation"
                            className="flex size-10 items-center justify-center rounded-lg hover:bg-accent lg:hidden"
                        >
                            <Menu className="size-5" />
                        </button>
                        <div className="lg:hidden">
                            <AdminBrand />
                        </div>
                        <div className="hidden min-w-0 flex-1 lg:block">
                            <AdminBreadcrumb currentPath={currentPath} />
                        </div>
                        <div className="ml-auto flex items-center gap-1.5">
                            <AppearanceToggleDropdown />
                            <Link
                                href="/dashboard"
                                className="hidden min-h-9 items-center gap-2 rounded-lg border bg-card px-3 text-sm font-medium transition-colors hover:border-primary sm:flex"
                            >
                                <ArrowLeft className="size-4" />
                                Back to App
                            </Link>
                        </div>
                    </header>

                    <main className="flex-1">
                        <div className="mx-auto flex w-full max-w-[1240px] animate-rise flex-col px-4 pt-7 pb-12 lg:px-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </FeatureProvider>
    );
}
