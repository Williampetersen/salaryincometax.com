interface SectionDefinition {
  bullets?: string[];
  paragraphs?: string[];
  title: string;
}

interface ContentSectionsProps {
  sections: SectionDefinition[];
}

// Renders long-form policy content with clear headings and readable spacing.
export function ContentSections({
  sections,
}: ContentSectionsProps): JSX.Element {
  return (
    <div className="panel p-5 sm:p-7">
      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-ink">
              {section.title}
            </h2>
            {section.paragraphs?.length ? (
              <div className="mt-4 space-y-4 text-base leading-8 text-ink/72">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : null}
            {section.bullets?.length ? (
              <ul className="mt-4 space-y-3 text-base leading-8 text-ink/72">
                {section.bullets.map((bullet) => (
                  <li className="flex gap-3" key={bullet}>
                    <span className="mt-3 h-2 w-2 rounded-full bg-coral" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}
