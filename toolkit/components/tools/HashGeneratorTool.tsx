"use client";

import { useState } from "react";
import { ToolTextarea, ToolSelect, ToolButton, OutputBox } from "@/components/tools/ui";
import CopyButton from "@/components/CopyButton";
// spark-md5 has no bundled types
import SparkMD5 from "spark-md5";
import { hasSecureCrypto, SECURE_CONTEXT_MESSAGE } from "@/lib/browser";

type Algorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512" | "MD5";

const ALGORITHMS: { value: Algorithm; label: string }[] = [
  { value: "MD5", label: "MD5" },
  { value: "SHA-1", label: "SHA-1" },
  { value: "SHA-256", label: "SHA-256" },
  { value: "SHA-384", label: "SHA-384" },
  { value: "SHA-512", label: "SHA-512" },
];

async function hashWithSubtleCrypto(text: string, algorithm: Algorithm): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function HashGeneratorTool() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<Algorithm>("SHA-256");
  const [hash, setHash] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleHash = async () => {
    setError(null);
    setLoading(true);
    try {
      if (algorithm === "MD5") {
        setHash(SparkMD5.hash(input));
      } else {
        if (!hasSecureCrypto()) {
          setError(SECURE_CONTEXT_MESSAGE);
          setHash("");
          return;
        }
        setHash(await hashWithSubtleCrypto(input, algorithm));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hashing failed");
      setHash("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <ToolSelect
        label="Algorithm"
        value={algorithm}
        onChange={(v) => setAlgorithm(v as Algorithm)}
        options={ALGORITHMS}
      />

      <ToolTextarea
        label="Input Text"
        value={input}
        onChange={setInput}
        rows={8}
        placeholder="Enter text to hash..."
      />

      <div className="flex flex-wrap gap-2">
        <ToolButton onClick={handleHash} disabled={loading || !input}>
          {loading ? "Hashing…" : "Generate Hash"}
        </ToolButton>
        {hash && <CopyButton text={hash} />}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {hash && <OutputBox label={`${algorithm} Hash`} value={hash} />}
    </div>
  );
}
