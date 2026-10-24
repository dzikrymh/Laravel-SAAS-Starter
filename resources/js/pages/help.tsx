import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Book,
    ChevronRight,
    FileText,
    Mail,
    MessageCircle,
    Search,
    Ticket,
} from 'lucide-react';
import { useState } from 'react';

const helpCategories = [
    {
        icon: Book,
        title: 'Getting Started',
        description:
            'Learn the basics of setting up your workspace and account.',
        articles: [
            'Quick Start Guide',
            'Workspace Setup',
            'Inviting Team Members',
        ],
    },
    {
        icon: MessageCircle,
        title: 'Account & Billing',
        description: 'Manage your subscription, billing, and account settings.',
        articles: [
            'Subscription Plans',
            'Payment Methods',
            'Cancel Subscription',
        ],
    },
    {
        icon: Ticket,
        title: 'Support Tickets',
        description: 'Get help from our support team for technical issues.',
        articles: ['Create a Ticket', 'Ticket Status', 'Escalation Process'],
    },
    {
        icon: FileText,
        title: 'API Documentation',
        description: 'Integrate with our API for custom workflows.',
        articles: ['API Keys', 'Authentication', 'Rate Limits'],
    },
];

const quickLinks = [
    { title: 'Contact Support', href: '/settings/tickets', icon: Mail },
    { title: 'View Documentation', href: '/docs', icon: FileText },
    { title: 'System Status', href: '/status', icon: Book },
];

const popularSearches = ['Billing', 'API Keys', 'Invite'];

export default function HelpCenter() {
    const [searchQuery, setSearchQuery] = useState('');

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredCategories = helpCategories
        .map((category) => {
            const categoryMatches =
                !normalizedQuery ||
                category.title.toLowerCase().includes(normalizedQuery) ||
                category.description.toLowerCase().includes(normalizedQuery);

            return {
                ...category,
                articles: category.articles.filter(
                    (article) =>
                        categoryMatches ||
                        article.toLowerCase().includes(normalizedQuery),
                ),
            };
        })
        .filter((category) => category.articles.length > 0);
    const resultCount = filteredCategories.reduce(
        (total, category) => total + category.articles.length,
        0,
    );

    return (
        <AppLayout breadcrumbs={[{ title: 'Help Center', href: '/help' }]}>
            <Head title="Help Center" />

            <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-7 px-4 pt-7 pb-14 lg:px-6">
                {/* Hero search */}
                <section className="relative flex animate-rise flex-col items-center gap-4 overflow-hidden rounded-[20px] border bg-card px-6 py-12 text-center sm:py-16">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_0%,#000_20%,transparent_70%)] bg-[size:56px_56px] opacity-60 motion-safe:animate-grid-drift"
                    />
                    <div
                        aria-hidden="true"
                        className="absolute -top-36 left-1/2 h-80 w-[640px] max-w-full -translate-x-1/2 bg-[radial-gradient(closest-side,var(--accent),transparent)]"
                    />
                    <span className="relative text-xs font-bold tracking-[0.1em] text-highlight uppercase">
                        Help Center
                    </span>
                    <h1 className="relative text-3xl font-extrabold tracking-[-0.03em] sm:text-[44px]">
                        How can we help you?
                    </h1>
                    <p className="relative max-w-xl text-base leading-relaxed text-muted-foreground">
                        Search our knowledge base or browse categories to find
                        answers to your questions.
                    </p>

                    <div className="relative mt-2 w-full max-w-[580px]">
                        <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            aria-label="Search help articles"
                            placeholder="Search for articles, guides, or topics..."
                            className="h-14 rounded-[14px] bg-background pl-12 text-base shadow-[0_12px_30px_-18px_rgb(15_23_41/0.35)]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="relative flex flex-wrap items-center justify-center gap-2 text-[13px] text-muted-foreground">
                        <span>Popular:</span>
                        {popularSearches.map((term) => (
                            <button
                                key={term}
                                type="button"
                                onClick={() => setSearchQuery(term)}
                                className="min-h-8 rounded-full border bg-card px-3 text-[13px] text-foreground transition-colors hover:border-primary"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Quick Links */}
                <div className="grid gap-3.5 md:grid-cols-3">
                    {quickLinks.map((link, index) => (
                        <Link
                            key={link.title}
                            href={link.href}
                            style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                            className="group flex animate-rise items-center gap-3.5 rounded-[14px] border bg-card p-[18px] transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-[3px] hover:border-primary hover:shadow-[0_18px_36px_-22px_rgb(15_23_41/0.45)]"
                        >
                            <span className="flex size-[42px] shrink-0 items-center justify-center rounded-[11px] bg-accent text-accent-foreground">
                                <link.icon className="size-5" />
                            </span>
                            <span className="flex-1 text-[15px] font-semibold">
                                {link.title}
                            </span>
                            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                        </Link>
                    ))}
                </div>

                {/* Categories */}
                <div className="flex items-baseline justify-between gap-3">
                    <h2 className="text-[17px] font-bold">
                        Browse by category
                    </h2>
                    <span className="text-[13px] text-muted-foreground">
                        {normalizedQuery
                            ? `${resultCount} results`
                            : `${helpCategories.length} categories`}
                    </span>
                </div>

                {filteredCategories.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {filteredCategories.map((category) => (
                            <section
                                key={category.title}
                                className="flex animate-rise flex-col gap-3.5 rounded-2xl border bg-card p-[22px] transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-[3px] hover:border-primary hover:shadow-[0_18px_36px_-22px_rgb(15_23_41/0.45)]"
                            >
                                <div className="flex items-start gap-3.5">
                                    <span className="flex size-[42px] shrink-0 items-center justify-center rounded-[11px] bg-accent text-accent-foreground">
                                        <category.icon className="size-5" />
                                    </span>
                                    <div className="flex flex-1 flex-col gap-1">
                                        <h3 className="text-[17px] font-bold">
                                            {category.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {category.description}
                                        </p>
                                    </div>
                                </div>
                                <ul className="flex flex-col border-t">
                                    {category.articles.map((article) => (
                                        <li key={article} className="border-b">
                                            <Link
                                                href="#"
                                                className="group -mx-2 flex min-h-[46px] items-center gap-2.5 rounded-lg px-2 text-sm font-medium transition-colors hover:bg-muted hover:text-highlight"
                                            >
                                                <FileText className="size-4 text-muted-foreground" />
                                                <span className="flex-1">
                                                    {article}
                                                </span>
                                                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        ))}
                    </div>
                ) : (
                    <div
                        role="status"
                        className="flex flex-col items-center gap-2.5 rounded-2xl border border-dashed bg-card px-6 py-10 text-center"
                    >
                        <span className="flex size-[42px] items-center justify-center rounded-[11px] bg-accent text-accent-foreground">
                            <Search className="size-5" />
                        </span>
                        <p className="text-base font-bold">
                            No articles match “{searchQuery}”
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Try another keyword, or ask our support team
                            directly.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => setSearchQuery('')}
                        >
                            Clear search
                        </Button>
                    </div>
                )}

                {/* Contact Section */}
                <section className="dark relative flex flex-wrap items-center justify-between gap-5 overflow-hidden rounded-[18px] border bg-ink p-7 text-foreground">
                    <div
                        aria-hidden="true"
                        className="absolute -top-32 -right-20 h-80 w-[420px] bg-[radial-gradient(closest-side,rgb(61_99_245/0.45),transparent)] blur-2xl"
                    />
                    <div className="relative flex max-w-xl flex-col gap-1">
                        <h2 className="text-xl font-bold text-white">
                            Still need help?
                        </h2>
                        <p className="text-[15px] leading-relaxed text-muted-foreground">
                            Can't find what you're looking for? Our support team
                            is here to help.
                        </p>
                    </div>
                    <Button
                        size="lg"
                        asChild
                        className="relative bg-white text-[#0f1729] hover:bg-white/90"
                    >
                        <Link href="/settings/tickets">
                            <Ticket />
                            Contact Support
                        </Link>
                    </Button>
                </section>
            </div>
        </AppLayout>
    );
}
