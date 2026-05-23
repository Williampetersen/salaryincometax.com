import type { MetadataRoute } from "next";

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "salaryincometax",
    description: SITE_DESCRIPTION,
    start_url: SITE_URL,
    display: "standalone",
    background_color: "#fbf7ef",
    theme_color: "#122029",
    icons: [
      {
        src: "/websitelogo/logo transparent.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
