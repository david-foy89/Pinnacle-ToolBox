"use client";

import { useCallback, useRef, useState } from "react";
import { ToolInput, ToolButton, ToolCheckbox, StatCard } from "@/components/tools/ui";
import { downloadBlob } from "@/lib/utils";
import { loadImageFromFile as loadImage } from "@/lib/image";

export default function ImageResizerTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [lockAspect, setLockAspect] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const aspect = origW && origH ? origW / origH : 1;

  const handleFile = useCallback(async (f: File) => {
    setError(null);
    if (!f.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    try {
      const img = await loadImage(f);
      setFile(f);
      setOrigW(img.width);
      setOrigH(img.height);
      setWidth(img.width);
      setHeight(img.height);
      const url = URL.createObjectURL(f);
      setPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    } catch {
      setError("Failed to load image.");
    }
  }, []);

  const handleWidthChange = (w: number) => {
    setWidth(w);
    if (lockAspect && origW) setHeight(Math.round(w / aspect));
  };

  const handleHeightChange = (h: number) => {
    setHeight(h);
    if (lockAspect && origH) setWidth(Math.round(h * aspect));
  };

  const resize = useCallback(() => {
    if (!file || !preview) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) downloadBlob(blob, `resized-${width}x${height}.png`);
      }, "image/png");
    };
    img.src = preview;
  }, [file, preview, width, height]);

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

          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard label="Original Width" value={origW} />
            <StatCard label="Original Height" value={origH} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ToolInput
              label="New Width (px)"
              type="number"
              value={width}
              min={1}
              onChange={(v) => handleWidthChange(Math.max(1, Number(v) || 1))}
            />
            <ToolInput
              label="New Height (px)"
              type="number"
              value={height}
              min={1}
              onChange={(v) => handleHeightChange(Math.max(1, Number(v) || 1))}
            />
          </div>

          <ToolCheckbox
            label="Lock aspect ratio"
            checked={lockAspect}
            onChange={setLockAspect}
          />

          <ToolButton onClick={resize} disabled={!file}>
            Download Resized Image
          </ToolButton>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </div>
  );
}
