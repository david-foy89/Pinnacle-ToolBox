"use client";

import { useState, useRef } from "react";
import { ToolTextarea, ToolButton, OutputBox } from "@/components/tools/ui";
import CopyButton from "@/components/CopyButton";
import { cn, formatBytes } from "@/lib/utils";
import { encodeBase64Unicode, decodeBase64Unicode } from "@/lib/encoding";

type Tab = "text" | "file";

export default function Base64EncoderTool() {
  const [tab, setTab] = useState<Tab>("text");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const processText = () => {
    setError(null);
    try {
      if (mode === "encode") {
        setOutput(encodeBase64Unicode(input));
      } else {
        setOutput(decodeBase64Unicode(input));
      }
    } catch {
      setError(mode === "decode" ? "Invalid Base64 string" : "Unable to encode text");
      setOutput("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileSize(file.size);
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] ?? result;
      setOutput(base64);
    };
    reader.onerror = () => setError("Failed to read file");
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-gray-200">
        {(["text", "file"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2 text-sm font-medium capitalize transition",
              tab === t
                ? "border-b-2 border-accent text-accent"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "text" ? (
        <>
          <div className="flex gap-2">
            <ToolButton
              onClick={() => setMode("encode")}
              variant={mode === "encode" ? "primary" : "secondary"}
            >
              Encode
            </ToolButton>
            <ToolButton
              onClick={() => setMode("decode")}
              variant={mode === "decode" ? "primary" : "secondary"}
            >
              Decode
            </ToolButton>
          </div>

          <ToolTextarea
            label={mode === "encode" ? "Text to Encode" : "Base64 to Decode"}
            value={input}
            onChange={setInput}
            rows={8}
          />

          <div className="flex flex-wrap gap-2">
            <ToolButton onClick={processText}>
              {mode === "encode" ? "Encode" : "Decode"}
            </ToolButton>
            {output && <CopyButton text={output} />}
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Upload File</label>
            <input
              ref={fileRef}
              type="file"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-accent/90"
            />
          </div>
          {fileName && (
            <p className="text-sm text-gray-600">
              {fileName} ({formatBytes(fileSize)})
            </p>
          )}
        </>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {output && <OutputBox label="Base64 Output" value={output} />}
    </div>
  );
}
