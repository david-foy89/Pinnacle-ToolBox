"use client";

import { useCallback, useRef, useState } from "react";
import { ToolInput, ToolButton } from "@/components/tools/ui";
import { downloadBlob } from "@/lib/utils";
import { loadImageFromFile as loadImage } from "@/lib/image";

export default function ImageCropperTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imgW, setImgW] = useState(0);
  const [imgH, setImgH] = useState(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (f: File) => {
    setError(null);
    if (!f.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    try {
      const img = await loadImage(f);
      setFile(f);
      setImgW(img.width);
      setImgH(img.height);
      setX(0);
      setY(0);
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

  const crop = useCallback(async () => {
    if (!file) return;
    const img = await loadImage(file);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cx = Math.max(0, Math.min(x, img.width - 1));
    const cy = Math.max(0, Math.min(y, img.height - 1));
    const cw = Math.max(1, Math.min(width, img.width - cx));
    const ch = Math.max(1, Math.min(height, img.height - cy));

    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, cx, cy, cw, ch, 0, 0, cw, ch);
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, `cropped-${cw}x${ch}.png`);
    }, "image/png");
  }, [file, x, y, width, height]);

  const cropPreviewStyle =
    preview && imgW && imgH
      ? {
          backgroundImage: `url(${preview})`,
          backgroundSize: `${imgW}px ${imgH}px`,
          backgroundPosition: `-${x}px -${y}px`,
          width: `${Math.min(width, 320)}px`,
          height: `${Math.min(height, 320)}px`,
        }
      : undefined;

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
          <div className="flex flex-wrap gap-6">
            <img src={preview} alt="Full preview" className="max-h-48 rounded-lg border border-gray-200" />
            {cropPreviewStyle && (
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">Crop Preview</p>
                <div
                  className="overflow-hidden rounded-lg border-2 border-accent"
                  style={cropPreviewStyle}
                />
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ToolInput label="X (left)" type="number" value={x} min={0} onChange={(v) => setX(Number(v) || 0)} />
            <ToolInput label="Y (top)" type="number" value={y} min={0} onChange={(v) => setY(Number(v) || 0)} />
            <ToolInput label="Width" type="number" value={width} min={1} onChange={(v) => setWidth(Number(v) || 1)} />
            <ToolInput label="Height" type="number" value={height} min={1} onChange={(v) => setHeight(Number(v) || 1)} />
          </div>

          <p className="text-xs text-gray-500">
            Image dimensions: {imgW} × {imgH}px
          </p>

          <ToolButton onClick={crop} disabled={!file}>
            Download Cropped Image
          </ToolButton>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </div>
  );
}
