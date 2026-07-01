/** Google AdSense publisher ID (ca-pub-…). */
export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-1014488780102797";

/** Set to "true" once AdSense approves the site and ad unit IDs are configured. */
export const ADSENSE_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

/**
 * Ad unit slot IDs from AdSense → Ads → By ad unit.
 * Leave empty until units are created after approval.
 */
export const ADSENSE_SLOTS = {
  banner: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER ?? "",
  inline: process.env.NEXT_PUBLIC_ADSENSE_SLOT_INLINE ?? "",
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? "",
} as const;

export type AdSlotType = keyof typeof ADSENSE_SLOTS;

export function getAdSlotId(type: AdSlotType): string {
  return ADSENSE_SLOTS[type];
}

export function shouldShowAds(type: AdSlotType): boolean {
  return ADSENSE_ENABLED && Boolean(getAdSlotId(type));
}

export const COOKIE_CONSENT_KEY = "ptb-ad-consent";

export function hasAdConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
}

export function setAdConsent(accepted: boolean): void {
  localStorage.setItem(COOKIE_CONSENT_KEY, accepted ? "accepted" : "declined");
}
