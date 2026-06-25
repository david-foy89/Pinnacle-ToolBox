"use client";

import { useMemo, useState } from "react";
import { cn, simplifyFraction } from "@/lib/utils";
import CopyButton from "@/components/CopyButton";
import { ToolInput, OutputBox } from "@/components/tools/ui";

type Tab = "to-decimal" | "to-fraction";

function decimalToFraction(decimal: number, maxDenominator = 10_000): { num: number; den: number } | null {
  if (!Number.isFinite(decimal)) return null;
  if (decimal === 0) return { num: 0, den: 1 };

  const sign = decimal < 0 ? -1 : 1;
  const x = Math.abs(decimal);

  let prevNum = 0;
  let num = 1;
  let prevDen = 1;
  let den = 0;
  let fraction = x;

  for (let i = 0; i < 32; i++) {
    const whole = Math.floor(fraction);
    const nextNum = whole * num + prevNum;
    const nextDen = whole * den + prevDen;

    if (nextDen > maxDenominator) break;

    prevNum = num;
    num = nextNum;
    prevDen = den;
    den = nextDen;

    if (Math.abs(x - num / den) < 1e-10) break;

    const remainder = fraction - whole;
    if (remainder < 1e-12) break;
    fraction = 1 / remainder;
  }

  return simplifyFraction(sign * num, den);
}

export default function FractionToDecimalTool() {
  const [tab, setTab] = useState<Tab>("to-decimal");
  const [numerator, setNumerator] = useState("3");
  const [denominator, setDenominator] = useState("4");
  const [decimal, setDecimal] = useState("0.75");

  const fractionResult = useMemo(() => {
    const num = parseFloat(numerator);
    const den = parseFloat(denominator);
    if (Number.isNaN(num) || Number.isNaN(den)) return { error: "Enter valid numbers", value: "" };
    if (den === 0) return { error: "Denominator cannot be zero", value: "" };
    const simplified = simplifyFraction(num, den);
    const dec = simplified.num / simplified.den;
    return {
      error: "",
      value: dec.toLocaleString("en-US", { maximumFractionDigits: 12 }),
      simplified: `${simplified.num}/${simplified.den}`,
      percent: `${((simplified.num / simplified.den) * 100).toFixed(4)}%`,
    };
  }, [numerator, denominator]);

  const decimalResult = useMemo(() => {
    const num = parseFloat(decimal);
    if (decimal.trim() === "" || Number.isNaN(num)) return { error: "Enter a valid decimal", fraction: "" };
    const frac = decimalToFraction(num);
    if (!frac) return { error: "Could not convert", fraction: "" };
    return {
      error: "",
      fraction: `${frac.num}/${frac.den}`,
      mixed: formatMixed(frac.num, frac.den),
    };
  }, [decimal]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab("to-decimal")}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition",
            tab === "to-decimal" ? "bg-accent text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          )}
        >
          Fraction → Decimal
        </button>
        <button
          type="button"
          onClick={() => setTab("to-fraction")}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition",
            tab === "to-fraction" ? "bg-accent text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          )}
        >
          Decimal → Fraction
        </button>
      </div>

      {tab === "to-decimal" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <ToolInput label="Numerator" type="number" value={numerator} onChange={setNumerator} />
            <ToolInput label="Denominator" type="number" value={denominator} onChange={setDenominator} step={1} />
          </div>
          {fractionResult.error ? (
            <p className="text-sm text-red-600">{fractionResult.error}</p>
          ) : (
            <div className="space-y-3">
              <OutputBox label="Decimal" value={fractionResult.value} />
              <p className="text-sm text-gray-600">Simplified: {fractionResult.simplified} ({fractionResult.percent})</p>
              <CopyButton text={fractionResult.value} />
            </div>
          )}
        </>
      ) : (
        <>
          <ToolInput label="Decimal" type="number" value={decimal} onChange={setDecimal} step={0.000001} />
          {decimalResult.error ? (
            <p className="text-sm text-red-600">{decimalResult.error}</p>
          ) : (
            <div className="space-y-3">
              <OutputBox label="Fraction" value={decimalResult.fraction} />
              {decimalResult.mixed && <OutputBox label="Mixed number" value={decimalResult.mixed} />}
              <CopyButton text={decimalResult.fraction} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function formatMixed(num: number, den: number): string {
  if (den === 0) return "";
  const absNum = Math.abs(num);
  const whole = Math.floor(absNum / den);
  const rem = absNum % den;
  const sign = num < 0 ? "-" : "";
  if (whole === 0) return `${sign}${rem}/${den}`;
  if (rem === 0) return `${sign}${whole}`;
  return `${sign}${whole} ${rem}/${den}`;
}
