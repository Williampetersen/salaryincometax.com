import type { BlogSection } from "@/data/blog/types";

interface TableOfContentsProps {
  sections: BlogSection[];
}

export function TableOfContents({
  sections,
}: TableOfContentsProps): JSX.Element {
  return (
    <div className="rounded-4xl border border-ink/10 bg-white/90 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/50">
        On this page
      </p>
      <nav aria-label="Table of contents" className="mt-4">
        <ul className="space-y-2 text-sm text-ink/66">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                className="transition hover:text-coral"
                href={`#${section.id}`}
              >
                {section.title}
              </a>
            </li>
          ))}
          <li>
            <a className="transition hover:text-coral" href="#faq">
              FAQ
            </a>
          </li>
          <li>
            <a className="transition hover:text-coral" href="#verdict">
              Final verdict
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
