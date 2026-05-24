import Link from "next/link";

import { BlogImage } from "@/components/blog/blog-image";
import { CountryFlag } from "@/components/shared/country-flag";
import type { BlogPost } from "@/data/blog/types";
import { getBlogCountry, getBlogCategory } from "@/lib/blog";
import { formatBlogDate } from "@/lib/blog";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps): JSX.Element {
  const country = getBlogCountry(post.countrySlug);
  const category = getBlogCategory(post.category);

  return (
    <article className="group h-full rounded-4xl border border-ink/10 bg-white/90 shadow-card transition hover:-translate-y-1 hover:border-coral/25">
      <Link className="flex h-full flex-col" href={`/blog/${post.slug}`}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-4xl bg-ink/5">
          <BlogImage
            alt={post.title}
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            fill
            sizes="(min-width: 1280px) 24rem, (min-width: 768px) 45vw, 100vw"
            src={post.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/88 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink/70">
              {category?.name ?? post.categoryLabel}
            </span>
            {post.templateStatus === "template" ? (
              <span className="rounded-full bg-sand/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink/70">
                Template
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-3 text-sm text-ink/60">
            {country ? (
              <span className="inline-flex items-center gap-2">
                <CountryFlag
                  className="h-5 w-5 rounded-full object-cover"
                  countryCode={country.slug.slice(0, 2).toUpperCase()}
                  countryName={country.name}
                  flagSrc={country.flagSrc}
                  size={20}
                />
                {post.cityName ? `${post.cityName}, ${country.name}` : country.name}
              </span>
            ) : null}
            <span>{post.readingTime}</span>
          </div>

          <h3 className="mt-4 font-[var(--font-display)] text-2xl font-bold leading-tight text-ink">
            {post.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-ink/68">{post.excerpt}</p>

          <div className="mt-5 flex items-center justify-between gap-3 text-sm">
            <span className="text-ink/56">Updated {formatBlogDate(post.updatedAt)}</span>
            <span className="font-semibold text-coral">Read article</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
