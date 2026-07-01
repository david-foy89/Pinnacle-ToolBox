"use client";

import { useEffect, useRef, useState } from "react";
import {
  ADSENSE_CLIENT,
  COOKIE_CONSENT_KEY,
  getAdSlotId,
  shouldShowAds,
  type AdSlotType,
} from "@/lib/ads";
import { cn } from "@/lib/utils";

interface AdSlotProps {
  size: AdSlotType;
  className?: string;
}

const sizeClasses: Record<AdSlotType, string> = {
  banner: "min-h-[90px] w-full md:min-h-[100px]",
  sidebar: "min-h-[250px] w-full md:min-h-[600px]",
  inline: "min-h-[90px] w-full md:min-h-[120px]",
};

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export default function AdSlot({ size, className }: AdSlotProps) {
  const slotId = getAdSlotId(size);
  const active = shouldShowAds(size);
  const pushed = useRef(false);
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted");

    const onConsent = () => {
      setConsented(localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted");
    };
    window.addEventListener("ptb-ad-consent", onConsent);
    return () => window.removeEventListener("ptb-ad-consent", onConsent);
  }, []);

  useEffect(() => {
    if (!active || !consented || pushed.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense script may still be loading
    }
  }, [active, consented, slotId]);

  if (!active) {
    return null;
  }

  if (!consented) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl border border-brand-navy-light/25 bg-brand-navy/10 text-xs text-brand-silver-muted",
          sizeClasses[size],
          className
        )}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={cn("ad-slot overflow-hidden", sizeClasses[size], className)}
      role="complementary"
      aria-label="Advertisement"
    >
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
