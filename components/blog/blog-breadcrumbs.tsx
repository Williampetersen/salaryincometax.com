import Link from "next/link";

interface BlogBreadcrumbsProps {
  items: Array<{
    href?: string;
    label: string;
  }>;
}

export function BlogBreadcrumbs({
  items,
}: BlogBreadcrumbsProps): JSX.Element {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 text-sm text-ink/55"
    >
      {items.map((item, index) => (
        <span className="flex items-center gap-2" key={`${item.label}-${index}`}>
          {item.href ? (
            <Link className="transition hover:text-coral" href={item.href}>
              {item.label}
            </Link>
          ) : (
            <span className="text-ink/78">{item.label}</span>
          )}
          {index < items.length - 1 ? <span>/</span> : null}
        </span>
      ))}
    </nav>
  );
}
