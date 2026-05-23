import type { FAQItem } from "@/lib/country-catalog";

interface FAQSectionProps {
  items: FAQItem[];
}

export function FAQSection({ items }: FAQSectionProps): JSX.Element {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="panel p-6 sm:p-8">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        type="application/ld+json"
      />
      <div className="mb-6">
        <p className="eyebrow">FAQ</p>
        <h2 className="mt-4 font-[var(--font-display)] text-3xl font-bold">
          Salary calculator questions
        </h2>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <details
            className="rounded-3xl border border-ink/10 bg-white/75 p-5"
            key={item.question}
          >
            <summary className="cursor-pointer list-none font-semibold text-ink">
              {item.question}
            </summary>
            <p className="mt-3 text-sm leading-7 text-ink/70">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
