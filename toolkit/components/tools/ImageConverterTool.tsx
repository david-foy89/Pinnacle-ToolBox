"use client";

import { useCallback, useRef, useState } from "react";
import { ToolSelect, ToolButton } from "@/components/tools/ui";
import { downloadBlob } from "@/lib/utils";
import { loadImageFromFile as loadImage } from "@/lib/image";

type OutputFormat = "image/png" | "image/jpeg" | "image/webp";

const FORMAT_OPTIONS = [
  { value: "image/png", label: "PNG" },
  { value: "image/jpeg", label: "JPG" },
  { value: "image/webp", label: "WEBP" },
];

const EXT_MAP: Record<OutputFormat, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export default function ImageConverterTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [format, setFormat] = useState<OutputFormat>("image/png");
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (f: File) => {
    setError(null);
    if (!f.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    try {
      await loadImage(f);
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load image.");
    }
  }, []);

  const convert = useCallback(async () => {
    if (!file) return;
    try {
      const img = await loadImage(file);
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (format === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);
      const ext = EXT_MAP[format];
      const quality = format === "image/png" ? undefined : 0.92;

      canvas.toBlob(
        (blob) => {
          if (blob) downloadBlob(blob, `converted.${ext}`);
        },
        format,
        quality
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed.");
    }
  }, [file, format]);

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
          className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
        />
      </div>

      <ToolSelect
        label="Output Format"
        value={format}
        onChange={(v) => setFormat(v as OutputFormat)}
        options={FORMAT_OPTIONS}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      {preview && (
        <>
          <img src={preview} alt="Preview" className="max-h-48 rounded-lg border border-gray-200" />
          <ToolButton onClick={convert} disabled={!file}>
            Download Converted Image
          </ToolButton>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </div>
  );
}
