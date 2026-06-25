export const MAX_IMAGE_PIXELS = 16_777_216; // 4096 × 4096

export function validateImageDimensions(width: number, height: number): string | null {
  if (width <= 0 || height <= 0) {
    return "Invalid image dimensions.";
  }
  const pixels = width * height;
  if (pixels > MAX_IMAGE_PIXELS) {
    return `Image is too large (${width}×${height}). Maximum supported size is 4096×4096 pixels.`;
  }
  return null;
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const dimensionError = validateImageDimensions(img.width, img.height);
      if (dimensionError) {
        reject(new Error(dimensionError));
        return;
      }
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}
