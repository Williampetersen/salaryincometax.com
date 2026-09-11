"use client";

import { useState } from "react";

import { event as trackEvent } from "@/lib/gtag";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps): JSX.Element {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    },
  ];

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackEvent({ action: "share_link_copied", category: "blog", label: url });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">
        Share
      </span>
      {links.map((link) => (
        <a
          className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-sm font-medium text-ink/70 transition hover:border-coral/35 hover:text-coral"
          href={link.href}
          key={link.label}
          onClick={() =>
            trackEvent({ action: "share_click", category: "blog", label: link.label })
          }
          rel="noopener noreferrer"
          target="_blank"
        >
          {link.label}
        </a>
      ))}
      <button
        className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-sm font-medium text-ink/70 transition hover:border-coral/35 hover:text-coral"
        onClick={() => void handleCopy()}
        type="button"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
