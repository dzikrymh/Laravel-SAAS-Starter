import AvatarUpload from '@/components/avatar-upload';
import { HelpTooltip } from '@/components/help-tooltip';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import WorkspaceLayout from '@/layouts/settings/workspace-layout';
import { cn } from '@/lib/utils';
import {
    destroy as destroyLogo,
    update as updateLogo,
} from '@/routes/workspaces/logo';
import {
    type BreadcrumbItem,
    type Workspace,
    type WorkspaceRole,
} from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    CalendarDays,
    Check,
    Crown,
    Download,
    Key,
    Lock,
    Palette,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';

interface OnboardingStep {
    key: string;
    label: string;
    completed: boolean;
}

interface WorkspaceSettingsProps {
    workspace: Workspace & { created_at: string };
    userRole: WorkspaceRole;
    stats: {
        members_count: number;
        api_keys_count: number;
    };
    onboardingProgress: {
        score: number;
        steps: OnboardingStep[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Workspace Settings', href: '/workspaces/settings' },
];

export default function WorkspaceSettings({
    workspace,
    userRole,
    stats,
    onboardingProgress,
}: WorkspaceSettingsProps) {
    const { t } = useTranslations();
    const {
        data,
        setData,
        errors,
        processing,
        isDirty,
        put,
        reset,
        setDefaults,
    } = useForm({
        name: workspace.name,
        slug: workspace.slug,
        logo: null as File | null,
        remove_logo: false,
        accent_color: workspace.accent_color || '',
        billing_email: workspace.billing_email || '',
    });

    // No longer needed as handled by AvatarUpload sub-requests
    const [deleteConfirm, setDeleteConfirm] = useState('');

    const isAdmin = userRole === 'owner' || userRole === 'admin';
    const isOwner = userRole === 'owner';

    const saveSettings = () => {
        put('/workspaces/settings', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => setDefaults(),
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveSettings();
    };

    const handleDelete = () => {
        if (deleteConfirm === workspace.name) {
            router.delete('/workspaces');
        }
    };

    const handleExport = () => {
        window.location.href = '/workspaces/export';
    };

    const presetColors = [
        '#6366f1',
        '#8b5cf6',
        '#ec4899',
        '#ef4444',
        '#f97316',
        '#eab308',
        '#22c55e',
        '#06b6d4',
        '#3b82f6',
        '#64748b',
    ];
    const previewColor = data.accent_color || 'var(--primary)';

    const quickStats = [
        {
            icon: Users,
            label: t('workspace.settings.stats_members', 'Members'),
            value: stats.members_count,
        },
        {
            icon: Crown,
            label: t('workspace.settings.stats_plan', 'Plan'),
            value: workspace.plan,
        },
        {
            icon: CalendarDays,
            label: t('workspace.settings.stats_created', 'Created'),
            value: new Date(workspace.created_at).toLocaleDateString(),
        },
        {
            icon: Key,
            label: t('workspace.settings.stats_api_keys', 'API Keys'),
            value: stats.api_keys_count,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('workspace.settings.title', 'Workspace Settings')} />
            <WorkspaceLayout
                title={t('workspace.settings.title', 'Workspace Settings')}
                description={t(
                    'workspace.settings.description',
                    'Manage your workspace settings and configuration.',
                )}
                fullWidth
            >
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                    {quickStats.map((stat) => (
                        <div
                            key={stat.label}
                            className="flex items-center gap-3 rounded-[14px] border bg-card px-4 py-3.5"
                        >
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-accent text-accent-foreground">
                                <stat.icon className="size-4" />
                            </span>
                            <div className="flex min-w-0 flex-col">
                                <span className="text-xs text-muted-foreground">
                                    {stat.label}
                                </span>
                                <span className="truncate text-base font-bold">
                                    {stat.value}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Workspace Onboarding Progress */}
                {onboardingProgress.score < 100 && (
                    <section className="flex flex-col gap-3.5 rounded-2xl border bg-card px-[22px] py-5">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-[15px] font-bold">
                                {t(
                                    'workspace.settings.setup_progress',
                                    'Workspace Setup Progress',
                                )}
                            </h2>
                            <span className="text-sm font-bold text-highlight">
                                {onboardingProgress.score}%
                            </span>
                        </div>
                        <Progress
                            value={onboardingProgress.score}
                            className="h-2"
                        />
                        <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2 xl:grid-cols-3">
                            {onboardingProgress.steps.map((step) => (
                                <div
                                    key={step.key}
                                    className={cn(
                                        'flex items-center gap-2 text-sm',
                                        step.completed &&
                                            'text-muted-foreground line-through',
                                    )}
                                >
                                    {step.completed ? (
                                        <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white dark:bg-emerald-500">
                                            <Check
                                                className="size-3"
                                                strokeWidth={3}
                                            />
                                        </span>
                                    ) : (
                                        <span className="size-[18px] shrink-0 rounded-full border-2" />
                                    )}
                                    {step.label}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* General Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-[17px]">
                            {t('navigation.general', 'General')}
                        </CardTitle>
                        <CardDescription>
                            {t(
                                'workspace.settings.description',
                                'Manage your workspace settings and configuration.',
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            id="workspace-settings-form"
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-5"
                        >
                            <div className="flex flex-col gap-2 border-b pb-5">
                                <AvatarUpload
                                    currentUrl={workspace.logo_url}
                                    uploadUrl={updateLogo().url}
                                    deleteUrl={destroyLogo().url}
                                    onSuccess={() => {
                                        router.reload({
                                            only: ['workspace'],
                                        });
                                    }}
                                    label={t('workspace.settings.logo', 'Logo')}
                                    description={t(
                                        'workspace.settings.logo_description',
                                        'Your workspace logo appears in the sidebar, team invitations, and exported data. Recommended size: 200×200 px.',
                                    )}
                                    fieldName="image"
                                />
                                <InputError message={errors.logo} />
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">
                                        {t(
                                            'workspace.settings.name',
                                            'Workspace Name',
                                        )}
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder={t(
                                            'workspace.settings.name',
                                            'Workspace Name',
                                        )}
                                        required
                                        disabled={!isAdmin}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label
                                        htmlFor="slug"
                                        className="flex items-center gap-1.5"
                                    >
                                        {t(
                                            'workspace.settings.slug',
                                            'Workspace Slug',
                                        )}
                                        <HelpTooltip content="The URL-friendly identifier for your workspace. Used in links and API endpoints. Only letters, numbers, dashes, and underscores." />
                                    </Label>
                                    <div className="flex items-center">
                                        <span className="flex h-9 items-center rounded-l-md border border-r-0 bg-muted px-3 font-mono text-sm text-muted-foreground">
                                            /
                                        </span>
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            onChange={(e) =>
                                                setData('slug', e.target.value)
                                            }
                                            placeholder={t(
                                                'workspace.create.slug_placeholder',
                                                'my-awesome-workspace',
                                            )}
                                            className="rounded-l-none font-mono"
                                            disabled={!isAdmin}
                                        />
                                    </div>
                                    <InputError message={errors.slug} />
                                </div>
                            </div>

                            {data.slug !== workspace.slug && (
                                <p
                                    role="alert"
                                    className="flex items-center gap-2 rounded-[10px] bg-amber-50 px-3 py-2.5 text-[13px] text-amber-800 dark:bg-amber-500/10 dark:text-amber-300"
                                >
                                    <AlertTriangle className="size-4 shrink-0" />
                                    Changing the slug will break any existing
                                    links to this workspace.
                                </p>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* Plan Information */}
                <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card p-6">
                    <div className="flex items-center gap-4">
                        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                            <Crown className="size-[22px]" />
                        </span>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[13px] text-muted-foreground">
                                {t('billing.current_plan', 'Current Plan')}
                            </span>
                            <span className="text-xl font-extrabold">
                                {workspace.plan}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {workspace.plan === 'Free'
                                    ? t(
                                          'billing.no_subscription_desc',
                                          'Upgrade to a paid plan to unlock more features and team members.',
                                      )
                                    : t(
                                          'billing.thank_you',
                                          'Thank you for being a subscriber!',
                                      )}
                            </span>
                        </div>
                    </div>
                    <Button variant="outline" asChild>
                        <a href="/billing">
                            {t(
                                'billing.manage_subscription',
                                'Manage Subscription',
                            )}
                        </a>
                    </Button>
                </section>

                {/* Branding */}
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex flex-col gap-1.5">
                                <CardTitle className="flex items-center gap-2 text-[17px]">
                                    <Palette className="size-[18px] text-highlight" />
                                    {t(
                                        'workspace.settings.branding',
                                        'Branding',
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'workspace.settings.branding_description',
                                        'Customize the accent color used across your workspace.',
                                    )}
                                </CardDescription>
                            </div>
                            {data.accent_color && isAdmin && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setData('accent_color', '')}
                                >
                                    {t(
                                        'workspace.settings.reset_color',
                                        'Reset',
                                    )}
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="accent_color">
                                    {t(
                                        'workspace.settings.accent_color',
                                        'Accent Color',
                                    )}
                                </Label>
                                <div className="flex items-center gap-2.5">
                                    <input
                                        type="color"
                                        id="accent_color"
                                        value={data.accent_color || '#6366f1'}
                                        onChange={(e) =>
                                            setData(
                                                'accent_color',
                                                e.target.value,
                                            )
                                        }
                                        className="size-9 shrink-0 cursor-pointer rounded-md border bg-background p-1"
                                        disabled={!isAdmin}
                                    />
                                    <Input
                                        aria-label={t(
                                            'workspace.settings.accent_color',
                                            'Accent Color',
                                        )}
                                        value={data.accent_color || ''}
                                        onChange={(e) =>
                                            setData(
                                                'accent_color',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="#6366f1"
                                        maxLength={7}
                                        className="font-mono uppercase"
                                        disabled={!isAdmin}
                                    />
                                </div>
                                <InputError message={errors.accent_color} />
                            </div>

                            {isAdmin && (
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs text-muted-foreground">
                                        {t(
                                            'workspace.settings.preset_colors',
                                            'Presets',
                                        )}
                                    </span>
                                    <div className="flex flex-wrap gap-2.5">
                                        {presetColors.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                aria-label={color}
                                                aria-pressed={
                                                    data.accent_color === color
                                                }
                                                onClick={() =>
                                                    setData(
                                                        'accent_color',
                                                        color,
                                                    )
                                                }
                                                className={cn(
                                                    'size-[30px] rounded-full transition-transform hover:scale-110',
                                                    data.accent_color ===
                                                        color &&
                                                        'ring-2 ring-foreground ring-offset-2 ring-offset-card',
                                                )}
                                                style={{
                                                    backgroundColor: color,
                                                }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-muted-foreground">
                                {t('workspace.settings.preview', 'Preview')}
                            </span>
                            <div className="flex flex-col gap-3 rounded-[14px] border bg-background p-4">
                                <div className="flex items-center gap-3">
                                    <span
                                        className="size-10 shrink-0 rounded-[10px] transition-colors"
                                        style={{
                                            backgroundColor: previewColor,
                                        }}
                                    />
                                    <div className="flex min-w-0 flex-col">
                                        <span
                                            className="truncate text-[15px] font-bold"
                                            style={{ color: previewColor }}
                                        >
                                            {data.name || workspace.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {t(
                                                'workspace.settings.preview_example',
                                                'Your brand color in action',
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span
                                        className="rounded-lg px-3.5 py-2 text-[13px] font-semibold text-white"
                                        style={{
                                            backgroundColor: previewColor,
                                        }}
                                    >
                                        {t(
                                            'workspace.settings.preview_primary',
                                            'Primary action',
                                        )}
                                    </span>
                                    <span
                                        className="rounded-lg border px-3.5 py-2 text-[13px] font-semibold"
                                        style={{
                                            borderColor: previewColor,
                                            color: previewColor,
                                        }}
                                    >
                                        {t(
                                            'workspace.settings.preview_secondary',
                                            'Secondary',
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Billing Email */}
                {isAdmin && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-[17px]">
                                {t(
                                    'workspace.settings.billing_email',
                                    'Billing Email',
                                )}
                            </CardTitle>
                            <CardDescription>
                                {t(
                                    'workspace.settings.billing_email_desc',
                                    "Override the email address for billing receipts and invoices. Leave blank to use the workspace owner's email.",
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex max-w-lg flex-col gap-2">
                                <Label htmlFor="billing_email">
                                    {t(
                                        'workspace.settings.billing_email_label',
                                        'Billing Email Address',
                                    )}
                                </Label>
                                <Input
                                    id="billing_email"
                                    type="email"
                                    value={data.billing_email}
                                    onChange={(e) =>
                                        setData('billing_email', e.target.value)
                                    }
                                    placeholder={t(
                                        'workspace.settings.billing_email_placeholder',
                                        'billing@yourcompany.com',
                                    )}
                                    disabled={!isAdmin}
                                />
                                <InputError message={errors.billing_email} />
                                <p className="text-[13px] text-muted-foreground">
                                    {t(
                                        'workspace.settings.billing_email_help',
                                        "This email will receive invoices and payment notifications instead of the owner's email.",
                                    )}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Data Management */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-[17px]">
                            {t(
                                'workspace.settings.data_management',
                                'Data Management',
                            )}
                        </CardTitle>
                        <CardDescription>
                            {t(
                                'workspace.settings.data_management_description',
                                'Export your workspace data for GDPR compliance or backup.',
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap items-center justify-between gap-3.5 rounded-xl bg-muted px-4 py-3.5">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-semibold">
                                    {t(
                                        'workspace.settings.export_data',
                                        'Export Workspace Data',
                                    )}
                                </span>
                                <span className="text-[13px] text-muted-foreground">
                                    {t(
                                        'workspace.settings.export_data_description',
                                        'Download all workspace data, members, and activity logs in JSON format.',
                                    )}
                                </span>
                            </div>
                            <Button variant="outline" onClick={handleExport}>
                                <Download />
                                {t(
                                    'workspace.settings.export_button',
                                    'Export JSON',
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                {isOwner && !workspace.personal_workspace && (
                    <Card className="border-destructive/40">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[17px] text-destructive">
                                <AlertTriangle className="size-[18px]" />
                                {t(
                                    'workspace.settings.danger_zone',
                                    'Danger Zone',
                                )}
                            </CardTitle>
                            <CardDescription>
                                {t(
                                    'workspace.settings.delete_description',
                                    'Once you delete a workspace, there is no going back. Please be certain.',
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap items-end gap-3 rounded-xl bg-destructive/5 p-4">
                                <div className="flex min-w-64 flex-1 flex-col gap-2">
                                    <Label htmlFor="delete-confirm">
                                        {t(
                                            'workspace.settings.delete_confirm',
                                            'Type the workspace name to confirm deletion',
                                        )}
                                    </Label>
                                    <Input
                                        id="delete-confirm"
                                        value={deleteConfirm}
                                        onChange={(e) =>
                                            setDeleteConfirm(e.target.value)
                                        }
                                        placeholder={workspace.name}
                                        className="bg-card"
                                    />
                                </div>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={deleteConfirm !== workspace.name}
                                >
                                    <Trash2 />
                                    {t(
                                        'workspace.settings.delete_button',
                                        'Delete Workspace',
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {workspace.personal_workspace && (
                    <section className="flex items-center gap-3.5 rounded-2xl border border-dashed bg-card px-5 py-4">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-[11px] bg-muted text-muted-foreground">
                            <Lock className="size-[18px]" />
                        </span>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[15px] font-bold">
                                {t(
                                    'workspace.settings.danger_zone',
                                    'Danger Zone',
                                )}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {t(
                                    'workspace.settings.personal_workspace',
                                    'This is your personal workspace and cannot be deleted.',
                                )}
                            </span>
                        </div>
                    </section>
                )}

                {/* Unsaved changes bar */}
                {isAdmin && isDirty && (
                    <div
                        role="status"
                        className="dark sticky bottom-4 z-20 flex animate-rise flex-wrap items-center justify-between gap-3 rounded-[14px] border bg-ink py-3 pr-3 pl-[18px] text-foreground shadow-[0_24px_50px_-20px_rgb(0_0_0/0.55)]"
                    >
                        <span className="flex items-center gap-2.5 text-sm">
                            <span className="size-2 rounded-full bg-amber-300" />
                            {t(
                                'workspace.settings.unsaved_changes',
                                'You have unsaved changes',
                            )}
                        </span>
                        <span className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => reset()}
                                disabled={processing}
                            >
                                {t('workspace.settings.discard', 'Discard')}
                            </Button>
                            <Button
                                type="submit"
                                form="workspace-settings-form"
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                {t('workspace.settings.save', 'Save Changes')}
                            </Button>
                        </span>
                    </div>
                )}
            </WorkspaceLayout>
        </AppLayout>
    );
}
