"use client";

import { useEffect, useState } from "react";

export function TypewriterHeading({
  text,
  className,
}: {
  text: string;
  className?: string;
}): JSX.Element {
  const [visibleLength, setVisibleLength] = useState(0);
  const [showCaret, setShowCaret] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let typingTimer: number | undefined;
    let caretTimer: number | undefined;

    if (reducedMotion.matches) {
      setVisibleLength(text.length);
      setShowCaret(false);
      return;
    }

    const startTimer = window.setTimeout(() => {
      typingTimer = window.setInterval(() => {
        setVisibleLength((current) => {
          if (current >= text.length) {
            if (typingTimer) {
              window.clearInterval(typingTimer);
            }
            caretTimer = window.setTimeout(() => {
              setShowCaret(false);
            }, 900);
            return current;
          }

          return current + 1;
        });
      }, 55);
    }, 180);

    return () => {
      window.clearTimeout(startTimer);
      if (typingTimer) {
        window.clearInterval(typingTimer);
      }
      if (caretTimer) {
        window.clearTimeout(caretTimer);
      }
    };
  }, [text]);

  return (
    <span
      aria-label={text}
      className={className}
      data-text={text}
      role="text"
    >
      {text.slice(0, visibleLength)}
      <span
        aria-hidden="true"
        className={`ml-1 inline-block h-[0.95em] w-[2px] translate-y-[0.08em] rounded-full bg-coral align-middle ${
          showCaret ? "animate-typewriter-caret" : "opacity-0"
        }`}
      />
    </span>
  );
}
