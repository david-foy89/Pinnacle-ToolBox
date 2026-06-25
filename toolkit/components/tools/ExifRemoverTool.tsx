"use client";

import { useCallback, useRef, useState } from "react";
import exifr from "exifr";
import { ToolButton, OutputBox } from "@/components/tools/ui";
import { downloadBlob, formatBytes } from "@/lib/utils";
import { loadImageFromFile as loadImage } from "@/lib/image";

export default function ExifRemoverTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<string>("");
  const [hasExif, setHasExif] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (f: File) => {
    setError(null);
    if (!f.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    try {
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });

      const exif = await exifr.parse(f, { pick: ["Make", "Model", "DateTimeOriginal", "GPSLatitude", "GPSLongitude", "Orientation", "ExposureTime", "FNumber", "ISO", "FocalLength"] });
      if (exif && Object.keys(exif).length > 0) {
        setHasExif(true);
        setMetadata(JSON.stringify(exif, null, 2));
      } else {
        setHasExif(false);
        setMetadata("No EXIF metadata found in this image.");
      }
    } catch {
      setHasExif(false);
      setMetadata("No EXIF metadata found or unable to parse.");
    }
  }, []);

  const stripAndDownload = useCallback(async () => {
    if (!file) return;
    const img = await loadImage(file);
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
      if (blob) {
        const name = file.name.replace(/\.[^.]+$/, "") + `-no-exif.${ext}`;
        downloadBlob(blob, name);
      }
    }, mime, 0.92);
  }, [file]);

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

          {file && (
            <p className="text-sm text-gray-600">
              Original file size: {formatBytes(file.size)}
              {hasExif && <span className="ml-2 font-medium text-amber-700">EXIF data detected</span>}
            </p>
          )}

          <OutputBox label="EXIF Metadata" value={metadata} />

          <p className="text-sm text-gray-600">
            Re-encoding through canvas removes all EXIF, GPS, and other embedded metadata.
          </p>

          <ToolButton onClick={stripAndDownload} disabled={!file}>
            Download Image Without EXIF
          </ToolButton>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </div>
  );
}
