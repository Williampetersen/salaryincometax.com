import Link from "next/link";

import { CountryFlag } from "@/components/shared/country-flag";
import type { BlogPost } from "@/data/blog/types";
import { getBlogCountry } from "@/lib/blog";

interface RelatedCalculatorBoxProps {
  post: BlogPost;
}

export function RelatedCalculatorBox({
  post,
}: RelatedCalculatorBoxProps): JSX.Element {
  const country = getBlogCountry(post.countrySlug);

  if (!country) {
    return <></>;
  }

  return (
    <aside className="rounded-4xl border border-coral/20 bg-coral/8 p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
        Salary calculator
      </p>
      <div className="mt-4 flex items-center gap-3">
        <CountryFlag
          className="h-11 w-11 rounded-full border border-ink/10 object-cover"
          countryCode={country.slug.slice(0, 2).toUpperCase()}
          countryName={country.name}
          flagSrc={country.flagSrc}
          size={44}
        />
        <div>
          <p className="font-semibold text-ink">{country.name} salary calculator</p>
          <p className="text-sm leading-6 text-ink/66">
            Estimate gross salary, net salary, total tax, and monthly take-home pay.
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-coral"
          href={country.calculatorUrl}
        >
          Open calculator
        </Link>
        <Link
          className="rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-coral/25 hover:text-coral"
          href={`/blog/category/${post.category}`}
        >
          More {post.categoryLabel}
        </Link>
      </div>
    </aside>
  );
}
