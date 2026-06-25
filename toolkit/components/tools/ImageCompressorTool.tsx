"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ToolButton, StatCard } from "@/components/tools/ui";
import { downloadBlob, formatBytes } from "@/lib/utils";
import { loadImageFromFile } from "@/lib/image";

export default function ImageCompressorTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [originalSize, setOriginalSize] = useState(0);
  const [estimatedSize, setEstimatedSize] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const estimateSize = useCallback(async (f: File, q: number) => {
    const img = await loadImageFromFile(f);
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const mime = f.type === "image/png" ? "image/png" : "image/jpeg";
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, mime, q / 100)
    );
    if (blob) setEstimatedSize(blob.size);
  }, []);

  const handleFile = useCallback(async (f: File) => {
    setError(null);
    if (!f.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    try {
      setFile(f);
      setOriginalSize(f.size);
      const url = URL.createObjectURL(f);
      setPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      await estimateSize(f, quality);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load image.");
    }
  }, [quality, estimateSize]);

  useEffect(() => {
    if (file) estimateSize(file, quality);
  }, [file, quality, estimateSize]);

  const compress = useCallback(async () => {
    if (!file) return;
    const img = await loadImageFromFile(file);
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
    const ext = mime === "image/png" ? "png" : "jpg";
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, `compressed.${ext}`);
    }, mime, quality / 100);
  }, [file, quality]);

  const savings = originalSize > 0 ? Math.round((1 - estimatedSize / originalSize) * 100) : 0;
  const isPng = file?.type === "image/png";

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

      {error && <p className="text-sm text-red-600">{error}</p>}

      {preview && (
        <>
          <img src={preview} alt="Preview" className="max-h-48 rounded-lg border border-gray-200" />

          <div>
            <label className="mb-1 flex justify-between text-sm font-medium text-gray-700">
              <span>Quality</span>
              <span>{quality}%</span>
            </label>
            <input
              type="range"
              min={10}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              disabled={isPng}
              className="w-full accent-accent disabled:opacity-50"
            />
            {isPng && (
              <p className="mt-1 text-xs text-brand-silver-muted">
                PNG is lossless — quality only applies when exporting as JPEG. Download still saves PNG.
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Original Size" value={formatBytes(originalSize)} />
            <StatCard label="Estimated Size" value={formatBytes(estimatedSize)} />
            <StatCard label="Savings" value={savings > 0 ? `${savings}%` : "—"} />
          </div>

          <ToolButton onClick={compress}>Download Compressed Image</ToolButton>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </div>
  );
}
