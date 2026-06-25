export function hasSecureCrypto(): boolean {
  return typeof window !== "undefined" && window.isSecureContext && !!window.crypto?.subtle;
}

export function hasRandomValues(): boolean {
  return typeof window !== "undefined" && typeof window.crypto?.getRandomValues === "function";
}

export function generateUuidV4(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  if (!hasRandomValues()) {
    throw new Error("Secure random values are unavailable in this browser context.");
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export const SECURE_CONTEXT_MESSAGE =
  "This tool requires a secure connection (HTTPS). Open the site over HTTPS or use localhost.";
