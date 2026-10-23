import { useTranslations } from '@/hooks/use-translations';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Reveal } from './reveal';

export function LandingFaq() {
    const { t } = useTranslations();
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: t(
                'landing.faq.items.what_is.question',
                'What is Laravel SAAS Starter?',
            ),
            answer: t(
                'landing.faq.items.what_is.answer',
                'Laravel SAAS Starter is a production-ready Laravel SaaS starter kit that includes authentication, multi-tenant workspaces, team management, Stripe billing, and more. It helps you launch your SaaS product 10x faster by providing all the essential features out of the box. Built by XCO Agency.',
            ),
        },
        {
            question: t(
                'landing.faq.items.tech_stack.question',
                'What tech stack does Laravel SAAS Starter use?',
            ),
            answer: t(
                'landing.faq.items.tech_stack.answer',
                'Laravel SAAS Starter is built with Laravel 13, Inertia.js v3, React 19, and Tailwind CSS v4. It uses Laravel Fortify for authentication, Laravel Cashier for Stripe billing, and shadcn/ui-inspired components for the UI.',
            ),
        },
        {
            question: t(
                'landing.faq.items.multiple_projects.question',
                'Can I use Laravel SAAS Starter for multiple projects?',
            ),
            answer: t(
                'landing.faq.items.multiple_projects.answer',
                'Yes! Laravel SAAS Starter is open source and free to use for unlimited personal and commercial projects. There are no per-project fees or royalties.',
            ),
        },
        {
            question: t(
                'landing.faq.items.production_ready.question',
                'Is Laravel SAAS Starter suitable for production?',
            ),
            answer: t(
                'landing.faq.items.production_ready.answer',
                'Absolutely. Laravel SAAS Starter is built with production in mind, following Laravel best practices, security guidelines, and performance optimizations. Many successful SaaS products are already running on Laravel SAAS Starter.',
            ),
        },
        {
            question: t(
                'landing.faq.items.customization.question',
                'How do I customize the design?',
            ),
            answer: t(
                'landing.faq.items.customization.answer',
                'Laravel SAAS Starter uses Tailwind CSS v4 with a well-organized theme system. You can easily customize colors, fonts, and spacing through the CSS variables. All components are built with shadcn/ui patterns, making them easy to modify.',
            ),
        },
        {
            question: t(
                'landing.faq.items.support.question',
                'Do you offer support?',
            ),
            answer: t(
                'landing.faq.items.support.answer',
                'Yes! We provide community support through GitHub Discussions and Issues. You can ask questions, report bugs, or request features. The community is very active and helpful.',
            ),
        },
        {
            question: t(
                'landing.faq.items.getting_started.question',
                'How do I get started?',
            ),
            answer: t(
                'landing.faq.items.getting_started.answer',
                "Getting started is easy! Clone the repository, follow the installation instructions in the README, and you'll have a fully functional SaaS application running in minutes. No complex setup required.",
            ),
        },
    ];

    return (
        <section id="faq" className="px-4 pt-10 pb-28 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:gap-16">
                <Reveal className="flex flex-col gap-3.5 lg:flex-1">
                    <h2 className="text-4xl leading-[1.1] font-extrabold tracking-[-0.03em] sm:text-[44px]">
                        {t('landing.faq.title.part1', 'Frequently Asked')}{' '}
                        {t('landing.faq.title.part2', 'Questions')}
                    </h2>
                    <p className="leading-relaxed text-muted-foreground">
                        {t(
                            'landing.faq.description',
                            "Everything you need to know about Laravel SAAS Starter. Can't find the answer you're looking for? Contact our support team.",
                        )}
                    </p>
                </Reveal>

                <div className="flex flex-col border-t lg:flex-[2]">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <Reveal key={index} className="border-b">
                                <button
                                    type="button"
                                    aria-expanded={isOpen}
                                    onClick={() =>
                                        setOpenIndex(isOpen ? null : index)
                                    }
                                    className="flex min-h-11 w-full items-center justify-between gap-4 py-5 text-left text-lg font-semibold"
                                >
                                    <span>{faq.question}</span>
                                    <Plus
                                        aria-hidden="true"
                                        className={`size-6 shrink-0 text-highlight transition-transform duration-300 ${
                                            isOpen ? 'rotate-45' : ''
                                        }`}
                                    />
                                </button>
                                <div
                                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                                        isOpen
                                            ? 'grid-rows-[1fr]'
                                            : 'grid-rows-[0fr]'
                                    }`}
                                >
                                    <div className="overflow-hidden">
                                        <p className="pb-5 leading-relaxed text-muted-foreground">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
