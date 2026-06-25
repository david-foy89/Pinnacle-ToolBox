"use client";

import { useMemo, useState } from "react";
import { ToolInput, ToolButton, ToolCheckbox } from "@/components/tools/ui";
import CopyButton from "@/components/CopyButton";
import { cn } from "@/lib/utils";
import { hasRandomValues, SECURE_CONTEXT_MESSAGE } from "@/lib/browser";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

type Strength = "weak" | "fair" | "good" | "strong";

function generatePassword(
  length: number,
  useUpper: boolean,
  useLower: boolean,
  useDigits: boolean,
  useSymbols: boolean
): string {
  let charset = "";
  const required: string[] = [];

  if (useUpper) { charset += UPPER; required.push(UPPER); }
  if (useLower) { charset += LOWER; required.push(LOWER); }
  if (useDigits) { charset += DIGITS; required.push(DIGITS); }
  if (useSymbols) { charset += SYMBOLS; required.push(SYMBOLS); }

  if (!charset) return "";

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  const chars: string[] = required.map((set) => set[array[required.indexOf(set)] % set.length]);

  for (let i = required.length; i < length; i++) {
    chars.push(charset[array[i] % charset.length]);
  }

  for (let i = chars.length - 1; i > 0; i--) {
    const j = array[i] % (i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
}

function calcStrength(
  length: number,
  useUpper: boolean,
  useLower: boolean,
  useDigits: boolean,
  useSymbols: boolean
): { strength: Strength; score: number; label: string } {
  let pool = 0;
  if (useLower) pool += 26;
  if (useUpper) pool += 26;
  if (useDigits) pool += 10;
  if (useSymbols) pool += SYMBOLS.length;

  const entropy = pool > 0 ? length * Math.log2(pool) : 0;
  let strength: Strength = "weak";
  let label = "Weak";

  if (entropy >= 80) { strength = "strong"; label = "Strong"; }
  else if (entropy >= 60) { strength = "good"; label = "Good"; }
  else if (entropy >= 40) { strength = "fair"; label = "Fair"; }

  return { strength, score: Math.min(100, Math.round((entropy / 100) * 100)), label };
}

const STRENGTH_COLORS: Record<Strength, string> = {
  weak: "bg-red-500",
  fair: "bg-orange-400",
  good: "bg-yellow-400",
  strong: "bg-green-500",
};

export default function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { strength, score, label } = useMemo(
    () => calcStrength(length, useUpper, useLower, useDigits, useSymbols),
    [length, useUpper, useLower, useDigits, useSymbols]
  );

  const handleGenerate = () => {
    if (!hasRandomValues()) {
      setError(SECURE_CONTEXT_MESSAGE);
      setPassword("");
      return;
    }
    setError(null);
    setPassword(generatePassword(length, useUpper, useLower, useDigits, useSymbols));
  };

  const hasCharset = useUpper || useLower || useDigits || useSymbols;

  return (
    <div className="space-y-4">
      <ToolInput
        label="Password Length"
        type="number"
        value={length}
        onChange={(v) => setLength(Math.min(128, Math.max(4, parseInt(v, 10) || 16)))}
        min={4}
        max={128}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <ToolCheckbox label="Uppercase (A–Z)" checked={useUpper} onChange={setUseUpper} />
        <ToolCheckbox label="Lowercase (a–z)" checked={useLower} onChange={setUseLower} />
        <ToolCheckbox label="Numbers (0–9)" checked={useDigits} onChange={setUseDigits} />
        <ToolCheckbox label="Symbols (!@#…)" checked={useSymbols} onChange={setUseSymbols} />
      </div>

      <div>
        <div className="mb-1 flex justify-between text-sm">
          <span className="font-medium text-gray-700">Strength</span>
          <span className="text-gray-600">{label}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className={cn("h-full transition-all", STRENGTH_COLORS[strength])}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <ToolButton onClick={handleGenerate} disabled={!hasCharset}>
          Generate Password
        </ToolButton>
        {password && <CopyButton text={password} />}
      </div>

      {!hasCharset && (
        <p className="text-sm text-amber-700">Select at least one character set.</p>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {password && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="break-all font-mono text-lg tracking-wide">{password}</p>
        </div>
      )}
    </div>
  );
}
