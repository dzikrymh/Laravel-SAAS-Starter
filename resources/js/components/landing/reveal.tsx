import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'motion/react';
import { type ReactNode } from 'react';

const ease = [0.2, 0.7, 0.2, 1] as const;

interface RevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    from?: 'bottom' | 'left';
    as?: 'div' | 'figure' | 'li';
}

/**
 * Fades and slides content in the first time it scrolls into view.
 */
export function Reveal({
    children,
    className,
    delay = 0,
    from = 'bottom',
    as = 'div',
}: RevealProps) {
    const prefersReducedMotion = useReducedMotion() ?? false;
    const Component = motion[as];

    if (prefersReducedMotion) {
        return <Component className={className}>{children}</Component>;
    }

    return (
        <Component
            initial={{
                opacity: 0,
                x: from === 'left' ? -48 : 0,
                y: from === 'bottom' ? 48 : 0,
            }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay, ease }}
            className={cn(className)}
        >
            {children}
        </Component>
    );
}
