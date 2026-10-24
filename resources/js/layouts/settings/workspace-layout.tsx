import { useTranslations } from '@/hooks/use-translations';
import SettingsShell from '@/layouts/settings/settings-shell';
import {
    type NavItem,
    type SharedData,
    type Workspace,
    type WorkspaceRole,
} from '@/types';
import { usePage } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    BarChart3,
    Building2,
    CreditCard,
    FileUp,
    History,
    KeyRound,
    Shield,
    TrendingUp,
    Users,
    Webhook,
} from 'lucide-react';
import { type PropsWithChildren, type ReactNode, useMemo } from 'react';

interface NavSection {
    title: string;
    items: NavItem[];
}

interface NavItemWithRole extends NavItem {
    allowedRoles?: WorkspaceRole[];
}

const getNavSections = (
    t: (key: string, fallback: string) => string,
    workspace?: Workspace | null,
    userRole?: WorkspaceRole | null,
): NavSection[] => {
    const workspaceItems: NavItemWithRole[] = [
        {
            title: t('navigation.general', 'General'),
            href: '/workspaces/settings',
            icon: Building2,
        },
        {
            title: t('navigation.billing', 'Billing'),
            href: '/billing',
            icon: CreditCard,
            allowedRoles: ['owner', 'admin'],
        },
    ];

    const teamItems: NavItemWithRole[] = [
        {
            title: t('navigation.members', 'Members'),
            href: '/team',
            icon: Users,
        },
        {
            title: t('navigation.csv_import', 'CSV Import'),
            href: '/team/import',
            icon: FileUp,
            allowedRoles: ['owner', 'admin'],
        },
        {
            title: t('navigation.member_activity', 'Activity Report'),
            href: '/team/activity-report',
            icon: BarChart3,
            allowedRoles: ['owner', 'admin'],
        },
    ];

    const analyticsItems: NavItemWithRole[] = [
        {
            title: t('navigation.overview', 'Overview'),
            href: '/workspaces/analytics',
            icon: TrendingUp,
            allowedRoles: ['owner', 'admin'],
        },
        {
            title: t('navigation.api_usage', 'API Usage'),
            href: '/workspaces/api-usage',
            icon: Activity,
            allowedRoles: ['owner', 'admin'],
        },
        {
            title: t('navigation.activity_log', 'Activity Log'),
            href: workspace ? `/workspaces/${workspace.id}/activity` : '#',
            icon: History,
            allowedRoles: ['owner', 'admin'],
        },
    ];

    const securityItems: NavItemWithRole[] = [
        {
            title: t('navigation.security_settings', 'Security Settings'),
            href: '/settings/workspace-security',
            icon: Shield,
            allowedRoles: ['owner', 'admin'],
        },
        {
            title: t('navigation.api_keys', 'API Keys'),
            href: '/workspaces/api-keys',
            icon: KeyRound,
            allowedRoles: ['owner', 'admin'],
        },
        {
            title: t('navigation.webhooks', 'Webhooks'),
            href: workspace ? `/workspaces/${workspace.id}/webhooks` : '#',
            icon: Webhook,
            allowedRoles: ['owner', 'admin'],
        },
        {
            title: t('navigation.danger_zone', 'Danger Zone'),
            href: '/settings/workspace-danger-zone',
            icon: AlertTriangle,
            allowedRoles: ['owner'],
        },
    ];

    // Filter items based on role
    const filterItems = (items: NavItemWithRole[]): NavItem[] => {
        return items.filter((item) => {
            if (!item.allowedRoles) return true;
            if (!userRole) return false;
            return item.allowedRoles.includes(userRole);
        });
    };

    const sections: NavSection[] = [
        {
            title: t('navigation.workspace', 'Workspace'),
            items: filterItems(workspaceItems),
        },
    ];

    // Only show team section if there are visible items
    const visibleTeam = filterItems(teamItems);
    if (visibleTeam.length > 0) {
        sections.push({
            title: t('navigation.team', 'Team'),
            items: visibleTeam,
        });
    }

    // Only show analytics if there are visible items
    const visibleAnalytics = filterItems(analyticsItems);
    if (visibleAnalytics.length > 0) {
        sections.push({
            title: t('navigation.analytics', 'Analytics'),
            items: visibleAnalytics,
        });
    }

    // Only show security if there are visible items
    const visibleSecurity = filterItems(securityItems);
    if (visibleSecurity.length > 0) {
        sections.push({
            title: t('navigation.security', 'Security'),
            items: visibleSecurity,
        });
    }

    return sections;
};

interface WorkspaceLayoutProps extends PropsWithChildren {
    title?: string;
    description?: string;
    fullWidth?: boolean;
    actions?: ReactNode;
}

export default function WorkspaceLayout({
    children,
    title,
    description,
    fullWidth = false,
    actions,
}: WorkspaceLayoutProps) {
    const { t } = useTranslations();
    const { currentWorkspace } = usePage<SharedData>().props;
    const userRole = currentWorkspace?.role;
    const navSections = useMemo(
        () => getNavSections(t, currentWorkspace, userRole),
        [t, currentWorkspace, userRole],
    );

    const settingsTitle = t('settings.workspace.title', 'Workspace Settings');

    return (
        <SettingsShell
            sections={navSections}
            title={title ?? settingsTitle}
            description={
                description ??
                t(
                    'settings.workspace.description',
                    'Manage your workspace settings',
                )
            }
            eyebrow={settingsTitle}
            navLabel={settingsTitle}
            actions={actions}
            fullWidth={fullWidth}
            dangerHref="/settings/workspace-danger-zone"
        >
            {children}
        </SettingsShell>
    );
}
