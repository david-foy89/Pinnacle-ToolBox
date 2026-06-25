"use client";

import { useCallback, useRef, useState } from "react";
import JSZip from "jszip";
import { ToolButton } from "@/components/tools/ui";
import { downloadBlob } from "@/lib/utils";
import { loadImageFromFile as loadImage } from "@/lib/image";

const SIZES = [
  { size: 16, name: "favicon-16x16.png" },
  { size: 32, name: "favicon-32x32.png" },
  { size: 48, name: "favicon-48x48.png" },
  { size: 180, name: "apple-touch-icon.png" },
] as const;

function renderToBlob(img: HTMLImageElement, size: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Canvas not supported"));
      return;
    }
    ctx.drawImage(img, 0, 0, size, size);
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to render"));
    }, "image/png");
  });
}

export default function FaviconGeneratorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [previews, setPreviews] = useState<{ size: number; url: string }[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = useCallback(async (f: File) => {
    setError(null);
    if (!f.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    try {
      const img = await loadImage(f);
      imgRef.current = img;
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });

      const thumbs: { size: number; url: string }[] = [];
      for (const { size } of SIZES) {
        const blob = await renderToBlob(img, size);
        thumbs.push({ size, url: URL.createObjectURL(blob) });
      }
      setPreviews((prev) => {
        prev.forEach((p) => URL.revokeObjectURL(p.url));
        return thumbs;
      });
    } catch {
      setError("Failed to load image.");
    }
  }, []);

  const downloadZip = useCallback(async () => {
    if (!imgRef.current) return;
    setGenerating(true);
    try {
      const zip = new JSZip();
      for (const { size, name } of SIZES) {
        const blob = await renderToBlob(imgRef.current, size);
        zip.file(name, blob);
      }
      const content = await zip.generateAsync({ type: "blob" });
      downloadBlob(content, "favicons.zip");
    } catch {
      setError("Failed to generate ZIP.");
    } finally {
      setGenerating(false);
    }
  }, []);

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
          <img src={preview} alt="Source preview" className="max-h-32 rounded-lg border border-gray-200" />

          {previews.length > 0 && (
            <div>
              <p className="mb-3 text-sm font-medium text-gray-700">Generated Sizes</p>
              <div className="flex flex-wrap gap-6">
                {previews.map(({ size, url }) => (
                  <div key={size} className="text-center">
                    <img
                      src={url}
                      alt={`${size}x${size} favicon`}
                      width={size}
                      height={size}
                      className="mx-auto rounded border border-gray-200"
                      style={{ imageRendering: size <= 32 ? "pixelated" : "auto" }}
                    />
                    <p className="mt-1 text-xs text-gray-600">{size}×{size}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ToolButton onClick={downloadZip} disabled={!file || generating}>
            {generating ? "Generating…" : "Download ZIP (16, 32, 48, 180)"}
          </ToolButton>
        </>
      )}
    </div>
  );
}
