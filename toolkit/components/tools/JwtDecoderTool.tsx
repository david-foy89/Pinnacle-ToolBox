"use client";

import { useMemo, useState } from "react";
import { ToolTextarea, OutputBox } from "@/components/tools/ui";
import { cn } from "@/lib/utils";

import { decodeBase64Url } from "@/lib/encoding";

function parseJwtPart(part: string): { json: string; error: string | null } {
  try {
    const decoded = decodeBase64Url(part);
    const parsed = JSON.parse(decoded);
    return { json: JSON.stringify(parsed, null, 2), error: null };
  } catch {
    return { json: "", error: "Unable to decode segment" };
  }
}

type ExpiryStatus = "none" | "valid" | "expired" | "not-yet-valid";

export default function JwtDecoderTool() {
  const [token, setToken] = useState("");

  const decoded = useMemo(() => {
    const trimmed = token.trim();
    if (!trimmed) {
      return null;
    }

    const parts = trimmed.split(".");
    if (parts.length < 2) {
      return { error: "Invalid JWT: expected at least header and payload segments" };
    }

    const [headerPart, payloadPart, signaturePart] = parts;
    const header = parseJwtPart(headerPart);
    const payload = parseJwtPart(payloadPart);

    if (header.error || payload.error) {
      return { error: header.error ?? payload.error };
    }

    let expiryStatus: ExpiryStatus = "none";
    let expiryDate: Date | null = null;
    let notBeforeDate: Date | null = null;

    try {
      const payloadObj = JSON.parse(decodeBase64Url(payloadPart)) as {
        exp?: number;
        nbf?: number;
      };
      const now = Date.now() / 1000;

      if (payloadObj.exp !== undefined) {
        expiryDate = new Date(payloadObj.exp * 1000);
        expiryStatus = payloadObj.exp < now ? "expired" : "valid";
      }

      if (payloadObj.nbf !== undefined) {
        notBeforeDate = new Date(payloadObj.nbf * 1000);
        if (payloadObj.nbf > now) {
          expiryStatus = "not-yet-valid";
        }
      }
    } catch {
      /* payload already validated */
    }

    return {
      header: header.json,
      payload: payload.json,
      hasSignature: !!signaturePart,
      signatureLength: signaturePart?.length ?? 0,
      expiryStatus,
      expiryDate,
      notBeforeDate,
    };
  }, [token]);

  const expiryLabels: Record<ExpiryStatus, { text: string; className: string }> = {
    none: { text: "No expiry claim", className: "bg-gray-100 text-gray-700" },
    valid: { text: "Token is valid (not expired)", className: "bg-green-100 text-green-800" },
    expired: { text: "Token has expired", className: "bg-red-100 text-red-800" },
    "not-yet-valid": { text: "Token is not yet valid (nbf)", className: "bg-amber-100 text-amber-800" },
  };

  return (
    <div className="space-y-4">
      <ToolTextarea
        label="JWT Token"
        value={token}
        onChange={setToken}
        rows={6}
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      />

      {decoded && "error" in decoded && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{decoded.error}</p>
      )}

      {decoded && !("error" in decoded) && (
        <>
          <div className="flex flex-wrap gap-2">
            <span
              className={cn(
                "rounded-full px-3 py-1 text-sm font-medium",
                expiryLabels[decoded.expiryStatus].className
              )}
            >
              {expiryLabels[decoded.expiryStatus].text}
            </span>
            {decoded.expiryDate && (
              <span className="text-sm text-gray-600">
                Expires: {decoded.expiryDate.toLocaleString()}
              </span>
            )}
            {decoded.notBeforeDate && (
              <span className="text-sm text-gray-600">
                Not before: {decoded.notBeforeDate.toLocaleString()}
              </span>
            )}
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <strong>Signature warning:</strong> This tool only decodes JWTs client-side.
            {decoded.hasSignature
              ? ` A signature is present (${decoded.signatureLength} chars) but cannot be verified without the secret key. Do not trust decoded claims without verification.`
              : " No signature segment found — this token cannot be verified."}
          </div>

          <OutputBox label="Header" value={decoded.header} />
          <OutputBox label="Payload" value={decoded.payload} />
        </>
      )}
    </div>
  );
}
