import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TypeWriterProps {
    phrases: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseTime?: number;
    className?: string;
    cursorClassName?: string;
}

export function TypeWriter({
    phrases,
    typingSpeed = 80,
    deletingSpeed = 50,
    pauseTime = 2000,
    className,
    cursorClassName,
}: TypeWriterProps) {
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const currentPhrase = phrases[currentPhraseIndex];

    const handleTyping = useCallback(() => {
        if (isPaused) {
            // Wait during pause, then start deleting
            const pauseTimeout = setTimeout(() => {
                setIsPaused(false);
                setIsDeleting(true);
            }, pauseTime);
            return () => clearTimeout(pauseTimeout);
        }

        if (isDeleting) {
            // Deleting characters
            if (displayText.length > 0) {
                const deleteTimeout = setTimeout(() => {
                    setDisplayText(displayText.slice(0, -1));
                }, deletingSpeed);
                return () => clearTimeout(deleteTimeout);
            } else {
                // Finished deleting, move to next phrase
                setIsDeleting(false);
                setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
            }
        } else {
            // Typing characters
            if (displayText.length < currentPhrase.length) {
                const typeTimeout = setTimeout(() => {
                    setDisplayText(currentPhrase.slice(0, displayText.length + 1));
                }, typingSpeed);
                return () => clearTimeout(typeTimeout);
            } else {
                // Finished typing, pause before deleting
                setIsPaused(true);
            }
        }
    }, [displayText, isDeleting, isPaused, currentPhrase, phrases.length, typingSpeed, deletingSpeed, pauseTime]);

    useEffect(() => {
        const cleanup = handleTyping();
        return cleanup;
    }, [handleTyping]);

    return (
        <span className={cn("inline-flex items-baseline", className)}>
            <span>{displayText}</span>
            <span
                className={cn(
                    "inline-block w-[3px] h-[0.9em] bg-white ml-1 animate-blink",
                    cursorClassName
                )}
            />
        </span>
    );
}
