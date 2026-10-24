import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { formatCurrency } from '@/lib/format-currency';
import { Head, Link, router } from '@inertiajs/react';
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    Clock,
    CreditCard,
    DollarSign,
    Users,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface Metrics {
    total_users: number;
    total_workspaces: number;
    active_subscriptions: number;
    new_users_30d: number;
    user_growth_percent: number;
    workspace_growth_percent: number;
    mrr: number;
    churn_rate: number;
    avg_first_response_seconds: number;
}

interface DailyStat {
    date: string;
    count: number;
}

interface PlanDistItem {
    plan: string;
    count: number;
}

interface Sparklines {
    new_users: number[];
    new_workspaces: number[];
    new_subscriptions: number[];
}

interface AdminDashboardProps {
    metrics: Metrics;
    sparklines: Sparklines;
    dailySignups: DailyStat[];
    dailyWorkspaces: DailyStat[];
    planDistribution: PlanDistItem[];
    recent_users: {
        id: number;
        name: string;
        email: string;
        created_at: string;
    }[];
}

function Sparkline({
    data,
    color = 'var(--primary)',
}: {
    data: number[];
    color?: string;
}) {
    if (data.length < 2) return null;

    const width = 80;
    const height = 24;
    const max = Math.max(...data, 1);
    const points = data
        .map((v, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - (v / max) * height;
            return `${x},${y}`;
        })
        .join(' ');

    return (
        <svg width={width} height={height} className="opacity-70">
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function GrowthBadge({
    value,
    invertColors = false,
}: {
    value: number;
    invertColors?: boolean;
}) {
    const isPositive = value >= 0;

    // For churn, negative growth is good (green), positive growth is bad (red)
    const healthyClass = 'text-emerald-600 dark:text-emerald-400';
    const unhealthyClass = 'text-red-600 dark:text-red-400';

    const colorClass = invertColors
        ? isPositive
            ? unhealthyClass
            : healthyClass
        : isPositive
          ? healthyClass
          : unhealthyClass;

    return (
        <span
            className={`inline-flex items-center gap-0.5 text-xs font-medium ${colorClass}`}
        >
            {isPositive ? (
                <ArrowUpRight className="h-3 w-3" />
            ) : (
                <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(value)}%
        </span>
    );
}

const COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
];

const tooltipStyle = {
    backgroundColor: 'var(--popover)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    boxShadow: '0 18px 36px -22px rgb(15 23 41 / 0.45)',
};
const tooltipLabelStyle = { color: 'var(--muted-foreground)' };
const tooltipItemStyle = { color: 'var(--popover-foreground)' };

const statIconClassName =
    'flex size-9 items-center justify-center rounded-[10px] bg-accent text-accent-foreground';

export default function AdminDashboard({
    metrics,
    sparklines,
    dailySignups,
    dailyWorkspaces,
    planDistribution,
    recent_users,
}: AdminDashboardProps) {
    // Combine daily stats for the multi-line chart
    const combinedDailyStats = dailySignups
        .map((signupDay, index) => {
            const workspaceDay = dailyWorkspaces[index] || { count: 0 };
            return {
                date: signupDay.date,
                users: signupDay.count,
                workspaces: workspaceDay.count,
            };
        })
        .reverse(); // Reverse to show chronological order left-to-right

    const formatDuration = (seconds: number) => {
        if (seconds <= 0) {
            return '—';
        }

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }

        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        }

        return `${remainingSeconds}s`;
    };

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <div className="flex flex-1 flex-col gap-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-[30px] leading-tight font-extrabold tracking-[-0.025em]">
                            System Overview
                        </h1>
                        <p className="text-[15px] text-muted-foreground">
                            Monitor platform metrics across all workspaces.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/admin/system-health">
                                <Activity />
                                System Health
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/admin/users">
                                <Users />
                                Manage Users
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Top Metric Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    <Card className="gap-3 transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-[3px] hover:border-primary hover:shadow-[0_18px_36px_-22px_rgb(15_23_41/0.45)]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-[13px] font-medium text-muted-foreground">
                                Monthly Recurring Revenue
                            </CardTitle>
                            <span className={statIconClassName}>
                                <DollarSign className="size-4" />
                            </span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-[28px] font-extrabold tracking-[-0.02em] tabular-nums">
                                {formatCurrency(metrics.mrr)}
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">
                                    From active subscriptions
                                </p>
                                <Sparkline
                                    data={sparklines.new_subscriptions}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="gap-3 transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-[3px] hover:border-primary hover:shadow-[0_18px_36px_-22px_rgb(15_23_41/0.45)]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-[13px] font-medium text-muted-foreground">
                                Active Subscriptions
                            </CardTitle>
                            <span className={statIconClassName}>
                                <CreditCard className="size-4" />
                            </span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-[28px] font-extrabold tracking-[-0.02em] tabular-nums">
                                {metrics.active_subscriptions}
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">
                                    Paying and trialing workspaces
                                </p>
                                <Sparkline
                                    data={sparklines.new_subscriptions}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="gap-3 transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-[3px] hover:border-primary hover:shadow-[0_18px_36px_-22px_rgb(15_23_41/0.45)]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-[13px] font-medium text-muted-foreground">
                                Active Workspaces (7d)
                            </CardTitle>
                            <span className={statIconClassName}>
                                <Activity className="size-4" />
                            </span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-[28px] font-extrabold tracking-[-0.02em] tabular-nums">
                                {metrics.total_workspaces}
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">
                                    <GrowthBadge
                                        value={metrics.workspace_growth_percent}
                                    />{' '}
                                    vs prior 30d
                                </p>
                                <Sparkline data={sparklines.new_workspaces} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="gap-3 transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-[3px] hover:border-primary hover:shadow-[0_18px_36px_-22px_rgb(15_23_41/0.45)]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-[13px] font-medium text-muted-foreground">
                                Total Users
                            </CardTitle>
                            <span className={statIconClassName}>
                                <Users className="size-4" />
                            </span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-[28px] font-extrabold tracking-[-0.02em] tabular-nums">
                                {metrics.total_users}
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">
                                    <GrowthBadge
                                        value={metrics.user_growth_percent}
                                    />{' '}
                                    from previous 30d
                                </p>
                                <Sparkline data={sparklines.new_users} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="gap-3 transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-[3px] hover:border-primary hover:shadow-[0_18px_36px_-22px_rgb(15_23_41/0.45)]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-[13px] font-medium text-muted-foreground">
                                Avg. First Response
                            </CardTitle>
                            <span className={statIconClassName}>
                                <Clock className="size-4" />
                            </span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-[28px] font-extrabold tracking-[-0.02em] tabular-nums">
                                {formatDuration(
                                    metrics.avg_first_response_seconds,
                                )}
                            </div>
                            <div className="mt-2">
                                <p className="text-xs text-muted-foreground">
                                    From ticket creation to first reply
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Second Row: Charts */}
                <div className="grid gap-4 md:grid-cols-7">
                    {/* Growth Chart */}
                    <Card className="md:col-span-4">
                        <CardHeader>
                            <CardTitle className="text-[17px]">
                                Platform Growth
                            </CardTitle>
                            <CardDescription>
                                Daily new users and workspaces over the last 14
                                days
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-0">
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={combinedDailyStats}
                                        margin={{
                                            top: 10,
                                            right: 30,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <defs>
                                            <linearGradient
                                                id="colorUsers"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="var(--chart-1)"
                                                    stopOpacity={0.3}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="var(--chart-1)"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                            <linearGradient
                                                id="colorWorkspaces"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="var(--chart-2)"
                                                    stopOpacity={0.3}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="var(--chart-2)"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <XAxis
                                            dataKey="date"
                                            stroke="var(--muted-foreground)"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            dy={10}
                                        />
                                        <YAxis
                                            stroke="var(--muted-foreground)"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) =>
                                                `${value}`
                                            }
                                        />
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="var(--border)"
                                            strokeOpacity={0.5}
                                        />
                                        <Tooltip
                                            contentStyle={tooltipStyle}
                                            labelStyle={tooltipLabelStyle}
                                            itemStyle={tooltipItemStyle}
                                        />
                                        <Legend
                                            wrapperStyle={{
                                                paddingTop: '10px',
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="users"
                                            name="New Users"
                                            stroke="var(--chart-1)"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorUsers)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="workspaces"
                                            name="New Workspaces"
                                            stroke="var(--chart-2)"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorWorkspaces)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Plan Distribution */}
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle className="text-[17px]">
                                Plan Distribution
                            </CardTitle>
                            <CardDescription>
                                Active workspace subscriptions across pricing
                                tiers
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-[300px] items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={planDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={2}
                                            dataKey="count"
                                            nameKey="plan"
                                        >
                                            {planDistribution.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            COLORS[
                                                                index %
                                                                    COLORS.length
                                                            ]
                                                        }
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={tooltipStyle}
                                            labelStyle={tooltipLabelStyle}
                                            itemStyle={tooltipItemStyle}
                                            formatter={
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                (value: any) => [
                                                    `${value} Workspaces`,
                                                ]
                                            }
                                        />
                                        <Legend
                                            layout="horizontal"
                                            verticalAlign="bottom"
                                            align="center"
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Users */}
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-[17px] font-bold">Recent Users</h3>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/users">View All Users →</Link>
                        </Button>
                    </div>
                    <div className="overflow-x-auto rounded-2xl border bg-card text-card-foreground">
                        <table className="w-full min-w-[560px] text-left text-sm">
                            <thead className="border-b text-xs font-semibold tracking-[0.04em] text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-3 font-medium">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Joined
                                    </th>
                                    <th className="px-6 py-3 text-right font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {recent_users.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-8 text-center text-muted-foreground"
                                        >
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    recent_users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="transition-colors hover:bg-muted/50"
                                        >
                                            <td className="px-6 py-3.5">
                                                <span className="flex items-center gap-3">
                                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                                                        {user.name
                                                            .split(' ')
                                                            .map(
                                                                (part) =>
                                                                    part[0],
                                                            )
                                                            .join('')
                                                            .slice(0, 2)
                                                            .toUpperCase()}
                                                    </span>
                                                    <span className="font-semibold">
                                                        {user.name}
                                                    </span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {new Date(
                                                    user.created_at,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() =>
                                                        router.post(
                                                            `/admin/impersonate/${user.id}`,
                                                        )
                                                    }
                                                >
                                                    Impersonate
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
