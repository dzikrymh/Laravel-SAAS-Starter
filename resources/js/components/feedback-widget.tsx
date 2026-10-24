import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import http from '@/lib/http';
import { cn } from '@/lib/utils';
import {
    Bug,
    CheckCircle,
    Lightbulb,
    MessageCircle,
    MessageSquare,
    Send,
    X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

type FeedbackType = 'bug' | 'idea' | 'general';

const TYPES: {
    value: FeedbackType;
    label: string;
    icon: typeof Bug;
    iconClassName: string;
    placeholder: string;
}[] = [
    {
        value: 'bug',
        label: 'Bug Report',
        icon: Bug,
        iconClassName:
            'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300',
        placeholder: 'Describe the bug and how to reproduce it…',
    },
    {
        value: 'idea',
        label: 'Feature Idea',
        icon: Lightbulb,
        iconClassName:
            'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
        placeholder: 'Describe your feature idea…',
    },
    {
        value: 'general',
        label: 'General',
        icon: MessageCircle,
        iconClassName: 'bg-accent text-accent-foreground',
        placeholder: 'Share your thoughts…',
    },
];

const MIN_LENGTH = 10;
const MAX_LENGTH = 2000;
const ease = [0.2, 0.7, 0.2, 1] as const;

export function FeedbackWidget() {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<FeedbackType>('general');
    const [message, setMessage] = useState('');
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<{ message?: string; type?: string }>(
        {},
    );
    const panelRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const prefersReducedMotion = useReducedMotion() ?? false;

    const activeType = TYPES.find((option) => option.value === type)!;
    const trimmedLength = message.trim().length;
    const canSubmit = !processing && trimmedLength >= MIN_LENGTH;

    // Close on outside click and on Escape
    useEffect(() => {
        if (!open) {
            return;
        }
        const handleClick = (e: MouseEvent) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, [open]);

    // Focus the message field when the panel opens
    useEffect(() => {
        if (open && !success) {
            textareaRef.current?.focus();
        }
    }, [open, success]);

    const submitFeedback = async () => {
        if (!canSubmit) {
            return;
        }

        setErrors({});
        setProcessing(true);

        try {
            const { data, response } = await http.post<{
                errors?: { message?: string; type?: string };
            }>('/feedback', {
                body: { type, message },
            });

            if (response.status === 422) {
                setErrors(data.errors ?? {});
                return;
            }

            setSuccess(true);
            setMessage('');
            setType('general');
            setTimeout(() => {
                setSuccess(false);
                setOpen(false);
            }, 2500);
        } catch {
            // Network error — silently ignore
        } finally {
            setProcessing(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitFeedback();
    };

    const toggle = () => {
        setOpen((isOpen) => !isOpen);
        setSuccess(false);
        setErrors({});
    };

    return (
        <div
            className="fixed inset-e-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:inset-e-6 sm:bottom-6"
            ref={panelRef}
        >
            <AnimatePresence>
                {open && (
                    <motion.div
                        role="dialog"
                        aria-modal="false"
                        aria-labelledby="feedback-widget-title"
                        initial={
                            prefersReducedMotion
                                ? { opacity: 0 }
                                : { opacity: 0, y: 16, scale: 0.97 }
                        }
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={
                            prefersReducedMotion
                                ? { opacity: 0 }
                                : { opacity: 0, y: 12, scale: 0.98 }
                        }
                        transition={{ duration: 0.28, ease }}
                        className="w-[360px] max-w-[calc(100vw-2rem)] origin-bottom-right overflow-hidden rounded-[18px] border bg-popover text-popover-foreground shadow-[0_30px_70px_-25px_rgb(15_23_41/0.45)]"
                    >
                        {/* Header */}
                        <div className="relative flex items-start justify-between gap-3 overflow-hidden px-5 pt-5 pb-4">
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -top-20 -right-16 h-44 w-64 bg-[radial-gradient(closest-side,var(--accent),transparent)]"
                            />
                            <div className="relative flex items-start gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-[11px] bg-primary text-primary-foreground">
                                    <MessageSquare className="size-[18px]" />
                                </span>
                                <div className="flex flex-col gap-0.5">
                                    <h2
                                        id="feedback-widget-title"
                                        className="text-base font-bold"
                                    >
                                        Send Feedback
                                    </h2>
                                    <p className="text-[13px] text-muted-foreground">
                                        We read every message.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Close feedback"
                                className="relative -mt-1 -mr-1 flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        {success ? (
                            <div
                                role="status"
                                className="flex flex-col items-center gap-3 px-6 pt-4 pb-10 text-center"
                            >
                                <motion.span
                                    initial={
                                        prefersReducedMotion
                                            ? false
                                            : { scale: 0.6, opacity: 0 }
                                    }
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.4, ease }}
                                    className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                                >
                                    <CheckCircle className="size-7" />
                                </motion.span>
                                <div className="flex flex-col gap-1">
                                    <p className="text-base font-bold">
                                        Thank you!
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Your feedback has been received.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-4 px-5 pb-5"
                            >
                                {/* Type selector */}
                                <div
                                    role="radiogroup"
                                    aria-label="Feedback type"
                                    className="grid grid-cols-3 gap-2"
                                >
                                    {TYPES.map((option) => {
                                        const isSelected =
                                            type === option.value;

                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                role="radio"
                                                aria-checked={isSelected}
                                                onClick={() =>
                                                    setType(option.value)
                                                }
                                                className={cn(
                                                    'flex flex-col items-center gap-2 rounded-xl border px-2 py-3 text-xs font-semibold transition-colors',
                                                    isSelected
                                                        ? 'border-primary bg-accent/60 text-foreground ring-1 ring-primary'
                                                        : 'bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        'flex size-8 items-center justify-center rounded-[9px]',
                                                        option.iconClassName,
                                                    )}
                                                >
                                                    <option.icon className="size-4" />
                                                </span>
                                                {option.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Message */}
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="feedback-message"
                                        className="sr-only"
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        id="feedback-message"
                                        ref={textareaRef}
                                        value={message}
                                        onChange={(e) =>
                                            setMessage(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === 'Enter' &&
                                                (e.metaKey || e.ctrlKey)
                                            ) {
                                                e.preventDefault();
                                                submitFeedback();
                                            }
                                        }}
                                        placeholder={activeType.placeholder}
                                        rows={4}
                                        maxLength={MAX_LENGTH}
                                        aria-invalid={!!errors.message}
                                        className="w-full resize-none rounded-xl border bg-background px-3.5 py-3 text-sm leading-relaxed transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-ring/20 focus:outline-none aria-invalid:border-destructive"
                                    />
                                    <div className="flex items-center justify-between gap-3 text-xs">
                                        {errors.message ? (
                                            <p className="text-destructive">
                                                {errors.message}
                                            </p>
                                        ) : (
                                            <span className="text-muted-foreground">
                                                {trimmedLength < MIN_LENGTH
                                                    ? `At least ${MIN_LENGTH} characters`
                                                    : 'Looks good'}
                                            </span>
                                        )}
                                        <span className="shrink-0 text-muted-foreground tabular-nums">
                                            {message.length}/{MAX_LENGTH}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button
                                        type="submit"
                                        disabled={!canSubmit}
                                        className="flex-1"
                                    >
                                        {processing ? <Spinner /> : <Send />}
                                        {processing
                                            ? 'Sending…'
                                            : 'Send Feedback'}
                                    </Button>
                                    <kbd className="hidden rounded-md border px-1.5 py-0.5 font-mono text-muted-foreground sm:inline">
                                        ⌘ ↵
                                    </kbd>
                                </div>
                            </form>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating button */}
            <button
                type="button"
                onClick={toggle}
                aria-expanded={open}
                aria-label={open ? 'Close feedback' : 'Send feedback'}
                className={cn(
                    'flex items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-[0_14px_30px_-12px_var(--primary)] transition-[transform,box-shadow,width] duration-300 hover:-translate-y-0.5 active:scale-95',
                    open ? 'size-12' : 'h-11 px-4',
                )}
            >
                {open ? (
                    <X className="size-5" />
                ) : (
                    <>
                        <MessageSquare className="size-4" />
                        <span>Feedback</span>
                    </>
                )}
            </button>
        </div>
    );
}
