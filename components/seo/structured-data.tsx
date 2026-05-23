interface StructuredDataProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

export function StructuredData({ data }: StructuredDataProps): JSX.Element {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      type="application/ld+json"
    />
  );
}
