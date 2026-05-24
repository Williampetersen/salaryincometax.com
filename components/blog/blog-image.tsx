"use client";

import Image from "next/image";
import { useState } from "react";

import { SITE_DEFAULT_OG_IMAGE } from "@/lib/site";

interface BlogImageProps {
  alt: string;
  className?: string;
  fill?: boolean;
  height?: number;
  priority?: boolean;
  sizes?: string;
  src: string;
  width?: number;
}

export function BlogImage({
  alt,
  className,
  fill = false,
  height,
  priority,
  sizes,
  src,
  width,
}: BlogImageProps): JSX.Element {
  const [currentSrc, setCurrentSrc] = useState(src || SITE_DEFAULT_OG_IMAGE);

  if (fill) {
    return (
      <Image
        alt={alt}
        className={className}
        fill
        onError={() => setCurrentSrc(SITE_DEFAULT_OG_IMAGE)}
        priority={priority}
        sizes={sizes}
        src={currentSrc}
      />
    );
  }

  return (
    <Image
      alt={alt}
      className={className}
      height={height ?? 630}
      onError={() => setCurrentSrc(SITE_DEFAULT_OG_IMAGE)}
      priority={priority}
      sizes={sizes}
      src={currentSrc}
      width={width ?? 1200}
    />
  );
}
