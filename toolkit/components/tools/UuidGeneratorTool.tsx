"use client";

import { useState } from "react";
import { ToolInput, ToolButton } from "@/components/tools/ui";
import CopyButton from "@/components/CopyButton";
import { generateUuidV4, hasRandomValues, SECURE_CONTEXT_MESSAGE } from "@/lib/browser";

export default function UuidGeneratorTool() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!hasRandomValues()) {
      setError(SECURE_CONTEXT_MESSAGE);
      setUuids([]);
      return;
    }
    setError(null);
    const n = Math.min(100, Math.max(1, count));
    try {
      setUuids(Array.from({ length: n }, () => generateUuidV4()));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to generate UUIDs");
      setUuids([]);
    }
  };

  const allText = uuids.join("\n");

  return (
    <div className="space-y-4">
      <ToolInput
        label="Number of UUIDs (1–100)"
        type="number"
        value={count}
        onChange={(v) => setCount(Math.min(100, Math.max(1, parseInt(v, 10) || 1)))}
        min={1}
        max={100}
      />

      <div className="flex flex-wrap gap-2">
        <ToolButton onClick={handleGenerate}>Generate UUIDs</ToolButton>
        {uuids.length > 0 && <CopyButton text={allText} label="Copy All" />}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {uuids.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">
            Generated {uuids.length} UUID{uuids.length === 1 ? "" : "s"}
          </p>
          <ul className="max-h-96 space-y-1 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
            {uuids.map((id, i) => (
              <li key={i} className="flex items-center justify-between gap-2 font-mono text-sm">
                <span className="break-all">{id}</span>
                <CopyButton text={id} label="Copy" className="shrink-0 px-2 py-1 text-xs" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
