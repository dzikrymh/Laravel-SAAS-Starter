const stack = [
    'Laravel 13',
    'Inertia.js v3',
    'React 19',
    'Tailwind CSS v4',
    'Stripe · Cashier',
    'Fortify',
    'Pennant',
    'shadcn/ui',
    'MIT License',
];

export function LandingMarquee() {
    return (
        <section
            aria-label="Built with"
            className="dark border-t border-white/10 bg-ink py-7"
        >
            <div className="group overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
                <div className="flex w-max gap-14 pr-14 text-lg font-semibold whitespace-nowrap text-muted-foreground/80 group-hover:[animation-play-state:paused] motion-safe:animate-marquee">
                    {[...stack, ...stack].map((item, index) => (
                        <span key={index} aria-hidden={index >= stack.length}>
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
