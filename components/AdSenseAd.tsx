"use client";

import { useEffect } from "react";

import { ADSENSE_CLIENT_ID, hasAdvertisingConsent } from "@/lib/gtag";

interface AdSenseAdProps {
  slot?: string;
}

const ADSENSE_APPROVAL_ENABLED = false;

// Placeholder component for future AdSense placements. It intentionally renders
// nothing until the site is approved and advertising consent is granted.
export function AdSenseAd({ slot }: AdSenseAdProps): null {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[adsense] placeholder active", {
        approved: ADSENSE_APPROVAL_ENABLED,
        clientIdConfigured: Boolean(ADSENSE_CLIENT_ID),
        hasAdvertisingConsent: hasAdvertisingConsent(),
        slot,
      });
    }
  }, [slot]);

  // To activate real ads after approval:
  // 1. Set ADSENSE_APPROVAL_ENABLED to true.
  // 2. Keep NEXT_PUBLIC_ADSENSE_CLIENT_ID configured.
  // 3. Only render/load ad scripts when hasAdvertisingConsent() is true.
  // 4. Place approved ad slots in content areas that do not disrupt navigation.
  if (!ADSENSE_APPROVAL_ENABLED || !ADSENSE_CLIENT_ID || !hasAdvertisingConsent()) {
    return null;
  }

  return null;
}
