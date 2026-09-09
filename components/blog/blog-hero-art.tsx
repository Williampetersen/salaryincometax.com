import Image from "next/image";

import { getBlogCountry } from "@/data/blog/countries";
import type { BlogCategorySlug, BlogPost } from "@/data/blog/types";

interface BlogHeroArtProps {
  className?: string;
  post: BlogPost;
  priority?: boolean;
}

// The blog has never had real per-article photography (every post.image path
// pointed at a file that was never committed to the repo, silently masked by
// a client-side image-error fallback). Rather than source stock photos -
// which would need real licensing checks before an AdSense resubmission -
// this builds a hero/thumbnail from assets the site already owns: the
// category palette used elsewhere in the design system, and the real country
// flag files in public/flag.
const CATEGORY_GRADIENTS: Record<BlogCategorySlug, string> = {
  "cost-of-living": "from-sky/45 via-paper to-sand/60",
  "income-tax": "from-ink via-ink/90 to-moss/70",
  "minimum-wage": "from-moss via-moss/80 to-sand/70",
  "salary-guides": "from-coral/75 via-coral/50 to-sand/60",
};

const CATEGORY_TEXT_TONE: Record<BlogCategorySlug, string> = {
  "cost-of-living": "text-ink/70",
  "income-tax": "text-white/70",
  "minimum-wage": "text-white/80",
  "salary-guides": "text-white/85",
};

export function BlogHeroArt({ className, post, priority }: BlogHeroArtProps): JSX.Element {
  const country = getBlogCountry(post.countrySlug);
  const gradient = CATEGORY_GRADIENTS[post.category];
  const textTone = CATEGORY_TEXT_TONE[post.category];

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className ?? ""}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        {country?.flagSrc ? (
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white/80 bg-white shadow-lg sm:h-24 sm:w-24">
            <Image
              alt={`${country.name} flag`}
              className="h-full w-full object-cover"
              height={96}
              priority={priority}
              src={country.flagSrc}
              width={96}
            />
          </div>
        ) : (
          <p
            className={`px-6 text-center text-lg font-semibold uppercase tracking-[0.2em] ${textTone}`}
          >
            {post.categoryLabel}
          </p>
        )}
      </div>
    </div>
  );
}
