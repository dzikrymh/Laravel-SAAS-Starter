import { OnboardingChecklist } from '@/components/onboarding-checklist';
import { ProductTour } from '@/components/product-tour';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WorkspaceActivityFeed } from '@/components/workspace-activity-feed';
import { WorkspaceRetentionWidget } from '@/components/workspace-retention-widget';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    CreditCard,
    Crown,
    Plus,
    Settings,
    Sparkles,
    Users,
    Zap,
    type LucideIcon,
} from 'lucide-react';
import { type ReactNode } from 'react';

const getBreadcrumbs = (
    t: (key: string, fallback: string) => string,
): BreadcrumbItem[] => [
    {
        title: t('dashboard.title', 'Dashboard'),
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { currentWorkspace, auth } = usePage<SharedData>().props;
    const { t } = useTranslations();

    // Default values if no workspace data passed from controller
    const workspace = currentWorkspace;
    const membersCount = currentWorkspace?.members_count ?? 1;

    const quickActions = [
        {
            title: t('dashboard.invite_team_member', 'Invite Team Member'),
            description: t(
                'dashboard.invite_team_member_desc',
                'Add a colleague to your workspace',
            ),
            icon: Users,
            href: '/team',
            color: 'text-blue-500',
            id: 'nav-team',
        },
        {
            title: t('dashboard.manage_billing_title', 'Manage Billing'),
            description: t(
                'dashboard.manage_billing_desc',
                'View plans and invoices',
            ),
            icon: CreditCard,
            href: '/billing',
            color: 'text-green-500',
            id: 'nav-billing',
        },
        {
            title: t('dashboard.workspace_settings', 'Workspace Settings'),
            description: t(
                'dashboard.workspace_settings_desc',
                'Configure your workspace',
            ),
            icon: Settings,
            href: '/workspaces/settings',
            color: 'text-purple-500',
            id: 'nav-settings',
        },
        {
            title: t('dashboard.create_workspace', 'Create Workspace'),
            description: t(
                'dashboard.create_workspace_desc',
                'Start a new project',
            ),
            icon: Plus,
            href: '/workspaces/create',
            color: 'text-orange-500',
            id: undefined,
        },
    ];

    const breadcrumbs = getBreadcrumbs(t);

    if (!workspace) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={t('dashboard.title', 'Dashboard')} />
                <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 p-4">
                    <Building2 className="h-16 w-16 text-muted-foreground" />
                    <h2 className="text-2xl font-semibold">
                        {t(
                            'dashboard.no_workspace_selected',
                            'No Workspace Selected',
                        )}
                    </h2>
                    <p className="text-muted-foreground">
                        {t(
                            'dashboard.create_or_select',
                            'Create or select a workspace to get started.',
                        )}
                    </p>
                    <Button asChild>
                        <Link href="/workspaces/create">
                            <Plus className="mr-2 h-4 w-4" />
                            {t(
                                'dashboard.create_workspace',
                                'Create Workspace',
                            )}
                        </Link>
                    </Button>
                </div>
            </AppLayout>
        );
    }

    const roleDescription =
        workspace.role === 'owner'
            ? t('dashboard.full_workspace_control', 'Full workspace control')
            : workspace.role === 'admin'
              ? t(
                    'dashboard.can_manage_team_settings',
                    'Can manage team & settings',
                )
              : workspace.role === 'member'
                ? t('dashboard.standard_access', 'Standard access')
                : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard.title', 'Dashboard')} />

            <div
                id="dashboard-main"
                className="mx-auto flex h-full w-full max-w-[1240px] flex-1 flex-col gap-6 px-4 pt-7 pb-12 lg:px-6"
            >
                {/* Welcome */}
                <div className="flex animate-rise flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-[30px] leading-tight font-extrabold tracking-[-0.025em]">
                            {t(
                                'dashboard.welcome_back',
                                'Welcome back, {{name}}!',
                                { name: auth.user?.name?.split(' ')[0] || '' },
                            )}
                        </h1>
                        <p className="text-[15px] text-muted-foreground">
                            {t(
                                'dashboard.whats_happening',
                                "Here's what's happening in {{workspace}}.",
                                { workspace: workspace.name },
                            )}
                        </p>
                    </div>
                    {workspace.plan === 'Free' && (
                        <Button
                            asChild
                            size="lg"
                            className="transition-transform hover:-translate-y-px"
                        >
                            <Link href="/billing/plans">
                                <Sparkles />
                                {t(
                                    'dashboard.upgrade_to_pro',
                                    'Upgrade to Pro',
                                )}
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Onboarding Checklist */}
                <OnboardingChecklist />

                {/* Product Tour */}
                {!auth.user?.tour_completed_at && <ProductTour />}

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        delay={0.1}
                        label={t(
                            'dashboard.current_workspace',
                            'Current Workspace',
                        )}
                        icon={Building2}
                    >
                        <div className="flex min-w-0 items-center gap-2.5">
                            {workspace.logo_url ? (
                                <img
                                    src={workspace.logo_url}
                                    alt={workspace.name}
                                    className="size-8 rounded-lg object-cover"
                                />
                            ) : (
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                                    <Building2 className="size-4" />
                                </span>
                            )}
                            <span className="truncate text-xl font-bold">
                                {workspace.name}
                            </span>
                        </div>
                        {workspace.personal_workspace && (
                            <span className="text-[13px] text-muted-foreground">
                                {t(
                                    'dashboard.personal_workspace',
                                    'Personal workspace',
                                )}
                            </span>
                        )}
                    </StatCard>

                    <StatCard
                        delay={0.15}
                        label={t('dashboard.current_plan', 'Current Plan')}
                        icon={Zap}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold">
                                {workspace.plan}
                            </span>
                            {workspace.plan !== 'Free' && (
                                <Badge variant="secondary">
                                    {t('dashboard.active', 'Active')}
                                </Badge>
                            )}
                        </div>
                        <StatLink href="/billing">
                            {t('dashboard.manage_billing', 'Manage billing')}
                        </StatLink>
                    </StatCard>

                    <StatCard
                        delay={0.2}
                        label={t('dashboard.team_members', 'Team Members')}
                        icon={Users}
                    >
                        <span className="text-xl font-bold tabular-nums">
                            {membersCount}
                        </span>
                        <StatLink href="/team">
                            {t('dashboard.manage_team', 'Manage team')}
                        </StatLink>
                    </StatCard>

                    <StatCard
                        delay={0.25}
                        label={t('dashboard.your_role', 'Your Role')}
                        icon={Crown}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold capitalize">
                                {workspace.role}
                            </span>
                            {workspace.role === 'owner' && (
                                <Crown className="size-[18px] text-amber-500" />
                            )}
                        </div>
                        {roleDescription && (
                            <span className="text-[13px] text-muted-foreground">
                                {roleDescription}
                            </span>
                        )}
                    </StatCard>
                </div>

                {/* Activity Feed & Retention */}
                <div className="grid animate-rise gap-4 [animation-delay:0.25s] lg:grid-cols-[2fr_1fr]">
                    <WorkspaceActivityFeed />
                    <WorkspaceRetentionWidget />
                </div>

                {/* Quick Actions */}
                <section className="flex animate-rise flex-col gap-3.5 [animation-delay:0.35s]">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-[17px] font-bold">
                            {t('dashboard.quick_actions', 'Quick Actions')}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {t(
                                'dashboard.quick_actions_description',
                                'Common tasks to help you get things done faster.',
                            )}
                        </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {quickActions.map((action) => (
                            <Link
                                key={action.title}
                                href={action.href}
                                id={action.id}
                                className={`group flex flex-col gap-2.5 rounded-[14px] border bg-card p-[18px] ${liftClassName}`}
                            >
                                <span className="flex size-[38px] items-center justify-center rounded-[10px] bg-accent text-accent-foreground">
                                    <action.icon className="size-[18px]" />
                                </span>
                                <span className="flex items-center justify-between gap-2 text-[15px] font-semibold">
                                    {action.title}
                                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                                </span>
                                <span className="text-[13px] text-muted-foreground">
                                    {action.description}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Upgrade Prompt */}
                {workspace.plan === 'Free' && (
                    <section className="dark relative flex animate-rise flex-wrap items-center justify-between gap-5 overflow-hidden rounded-[18px] border bg-ink p-7 text-foreground [animation-delay:0.35s]">
                        <div
                            aria-hidden="true"
                            className="absolute -top-32 -right-20 h-80 w-[420px] bg-[radial-gradient(closest-side,rgb(61_99_245/0.45),transparent)] blur-2xl"
                        />
                        <div className="relative flex max-w-xl flex-col gap-1.5">
                            <h2 className="text-xl font-bold text-white">
                                {t(
                                    'dashboard.upgrade_to_pro',
                                    'Upgrade to Pro',
                                )}
                            </h2>
                            <p className="text-[15px] leading-relaxed text-muted-foreground">
                                {t(
                                    'dashboard.unlock_features',
                                    'Unlock more workspaces, team members, and advanced features.',
                                )}
                            </p>
                        </div>
                        <Button
                            asChild
                            size="lg"
                            className="relative bg-white text-[#0f1729] transition-transform hover:-translate-y-px hover:bg-white/90"
                        >
                            <Link href="/billing/plans">
                                {t('dashboard.view_plans', 'View Plans')}
                                <ArrowRight />
                            </Link>
                        </Button>
                    </section>
                )}
            </div>
        </AppLayout>
    );
}

const liftClassName =
    'transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-[3px] hover:border-primary hover:shadow-[0_18px_36px_-22px_rgb(15_23_41/0.45)]';

function StatCard({
    delay,
    label,
    icon: Icon,
    children,
}: {
    delay: number;
    label: string;
    icon: LucideIcon;
    children: ReactNode;
}) {
    return (
        <div
            style={{ animationDelay: `${delay}s` }}
            className={`flex animate-rise flex-col gap-2.5 rounded-2xl border bg-card p-5 ${liftClassName}`}
        >
            <div className="flex items-center justify-between text-[13px] text-muted-foreground">
                {label}
                <Icon className="size-4" />
            </div>
            {children}
        </div>
    );
}

function StatLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-1 text-[13px] font-medium text-highlight hover:underline"
        >
            {children}
            <ArrowRight className="size-3.5" />
        </Link>
    );
}
