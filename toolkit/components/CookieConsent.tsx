"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { COOKIE_CONSENT_KEY, setAdConsent } from "@/lib/ads";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = () => {
    setAdConsent(true);
    setVisible(false);
    window.dispatchEvent(new Event("ptb-ad-consent"));
  };

  const decline = () => {
    setAdConsent(false);
    setVisible(false);
    window.dispatchEvent(new Event("ptb-ad-consent"));
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[110] border-t border-brand-navy-light/50 bg-brand-navy/95 p-4 shadow-2xl backdrop-blur-md sm:p-5"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-brand-silver">
          We use cookies for site functionality and may show ads through Google AdSense. Ad partners
          may use cookies to serve relevant ads. See our{" "}
          <Link href="/privacy" className="link-brand underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={decline} className="btn-secondary px-4 py-2 text-sm">
            Decline
          </button>
          <button type="button" onClick={accept} className="btn-primary px-4 py-2 text-sm">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
