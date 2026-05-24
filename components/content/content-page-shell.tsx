import type { ReactNode } from "react";

import { BlogBreadcrumbs } from "@/components/blog/blog-breadcrumbs";

interface ContentPageShellProps {
  breadcrumbs: Array<{
    href?: string;
    label: string;
  }>;
  children: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
}

// Shared shell for trust, policy, and methodology pages so they stay readable,
// consistent, and clearly navigable across desktop and mobile.
export function ContentPageShell({
  breadcrumbs,
  children,
  description,
  eyebrow,
  title,
}: ContentPageShellProps): JSX.Element {
  return (
    <div className="shell pb-16 pt-10">
      <div className="max-w-4xl">
        <BlogBreadcrumbs items={breadcrumbs} />
        <p className="eyebrow mt-5">{eyebrow}</p>
        <h1 className="mt-4 font-[var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-8 text-ink/68">{description}</p>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
