import type { BlogFaqItem } from "@/data/blog/types";

interface BlogFaqProps {
  items: BlogFaqItem[];
}

export function BlogFaq({ items }: BlogFaqProps): JSX.Element {
  return (
    <div className="space-y-3" id="faq">
      {items.map((item) => (
        <details
          className="group rounded-3xl border border-ink/10 bg-white px-5 py-4"
          key={item.question}
        >
          <summary className="cursor-pointer list-none font-semibold text-ink marker:hidden">
            <span className="flex items-center justify-between gap-4">
              <span>{item.question}</span>
              <span className="rounded-full border border-ink/10 px-2 py-1 text-xs uppercase tracking-[0.18em] text-ink/45 transition group-open:rotate-180">
                +
              </span>
            </span>
          </summary>
          <p className="mt-4 text-sm leading-7 text-ink/68">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
