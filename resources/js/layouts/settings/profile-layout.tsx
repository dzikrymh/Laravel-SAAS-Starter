import { useTranslations } from '@/hooks/use-translations';
import SettingsShell, {
    type SettingsNavSection,
} from '@/layouts/settings/settings-shell';
import { edit } from '@/routes/profile';
import {
    Bell,
    Cookie,
    Fingerprint,
    History,
    Link2,
    Monitor,
    Shield,
    Ticket,
    User,
} from 'lucide-react';
import { type PropsWithChildren, type ReactNode, useMemo } from 'react';

type NavSection = SettingsNavSection;

const getNavSections = (
    t: (key: string, fallback: string) => string,
): NavSection[] => [
    {
        title: t('navigation.profile_section', 'Profile'),
        items: [
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
        ],
    },
    {
        title: t('navigation.security_section', 'Security'),
        items: [
            {
                title: t('navigation.authentication', 'Authentication'),
                href: '/settings/security/authentication',
                icon: Shield,
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
        ],
    },
    {
        title: t('navigation.privacy_section', 'Privacy'),
        items: [
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
        ],
    },
    {
        title: t('navigation.support_section', 'Support'),
        items: [
            {
                title: t('navigation.support_tickets', 'Support Tickets'),
                href: '/settings/tickets',
                icon: Ticket,
            },
        ],
    },
];

interface ProfileLayoutProps extends PropsWithChildren {
    title?: string;
    description?: string;
    fullWidth?: boolean;
    actions?: ReactNode;
}

export default function ProfileLayout({
    children,
    title,
    description,
    fullWidth = false,
    actions,
}: ProfileLayoutProps) {
    const { t } = useTranslations();
    const navSections = useMemo(() => getNavSections(t), [t]);

    const settingsTitle = t('settings.profile.title', 'Profile Settings');

    return (
        <SettingsShell
            sections={navSections}
            title={title ?? settingsTitle}
            description={
                description ??
                t(
                    'settings.profile.description',
                    'Manage your personal account settings',
                )
            }
            eyebrow={settingsTitle}
            navLabel={settingsTitle}
            actions={actions}
            fullWidth={fullWidth}
        >
            {children}
        </SettingsShell>
    );
}
