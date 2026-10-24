import { useTranslations } from '@/hooks/use-translations';
import SettingsShell from '@/layouts/settings/settings-shell';
import { edit } from '@/routes/profile';
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
    Bell,
    Building2,
    Cookie,
    CreditCard,
    FileUp,
    Fingerprint,
    History,
    Link2,
    Lock,
    Monitor,
    Shield,
    Ticket,
    TrendingUp,
    User,
    Users,
    Webhook,
} from 'lucide-react';
import { type PropsWithChildren, useMemo } from 'react';

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

    const accountItems: NavItemWithRole[] = [
        {
            title: t('navigation.general', 'General'),
            href: edit(),
            icon: User,
        },
        {
            title: t('navigation.connected_accounts', 'Connected Accounts'),
            href: '/settings/connected-accounts',
            icon: Link2,
        },
        {
            title: t('navigation.authentication', 'Authentication'),
            href: '/settings/security/authentication',
            icon: Lock,
        },
        {
            title: t('navigation.sessions', 'Sessions'),
            href: '/settings/sessions',
            icon: Monitor,
        },
        {
            title: t('navigation.login_history', 'Login History'),
            href: '/settings/login-history',
            icon: History,
        },
        {
            title: t('navigation.cookies', 'Cookies'),
            href: '/settings/privacy',
            icon: Cookie,
        },
        {
            title: t('navigation.notifications', 'Notifications'),
            href: '/settings/notifications',
            icon: Bell,
        },
        {
            title: t('navigation.api_tokens', 'API Tokens'),
            href: '/settings/api-tokens',
            icon: Fingerprint,
        },
        {
            title: t('navigation.support_tickets', 'Support Tickets'),
            href: '/settings/tickets',
            icon: Ticket,
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
        {
            title: t('navigation.team', 'Team'),
            items: filterItems(teamItems),
        },
    ];

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

    sections.push({
        title: t('navigation.profile_section', 'Profile'),
        items: filterItems(accountItems),
    });

    return sections;
};

interface SettingsLayoutProps extends PropsWithChildren {
    title?: string;
    description?: string;
    fullWidth?: boolean;
}

export default function SettingsLayout({
    children,
    title,
    description,
    fullWidth = false,
}: SettingsLayoutProps) {
    const { t } = useTranslations();
    const { currentWorkspace } = usePage<SharedData>().props;
    const userRole = currentWorkspace?.role;
    const navSections = useMemo(
        () => getNavSections(t, currentWorkspace, userRole),
        [t, currentWorkspace, userRole],
    );

    const settingsTitle = t('settings.title', 'Settings');

    return (
        <SettingsShell
            sections={navSections}
            title={title ?? settingsTitle}
            description={
                description ??
                t(
                    'settings.description',
                    'Manage your workspace and account settings',
                )
            }
            eyebrow={settingsTitle}
            navLabel={settingsTitle}
            fullWidth={fullWidth}
            dangerHref="/settings/workspace-danger-zone"
        >
            {children}
        </SettingsShell>
    );
}
