/**
 * Image Optimization Utility
 *
 * Cost control measures for image analysis:
 * - Resize images to max resolution
 * - Strip EXIF metadata
 * - Compress to reduce token usage
 * - Generate content hash for caching
 */

// Maximum dimensions for image analysis (keeps API costs low)
const MAX_WIDTH = 1024;
const MAX_HEIGHT = 1024;
const JPEG_QUALITY = 0.8;

export interface OptimizedImage {
  dataUrl: string;        // Base64 data URL for API
  hash: string;           // Content hash for caching
  originalSize: number;   // Original file size in bytes
  optimizedSize: number;  // Optimized size in bytes
  width: number;
  height: number;
  mimeType: string;
}

/**
 * Optimize an image for vision API analysis
 * - Resizes to max resolution
 * - Strips EXIF metadata
 * - Compresses to JPEG
 */
export async function optimizeImageForAnalysis(file: File): Promise<OptimizedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        try {
          // Calculate new dimensions maintaining aspect ratio
          let { width, height } = img;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          // Create canvas and draw resized image (strips EXIF)
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Draw image (this strips EXIF metadata)
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to JPEG for smaller size
          const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);

          // Calculate optimized size (base64 is ~33% larger than binary)
          const base64Data = dataUrl.split(',')[1];
          const optimizedSize = Math.round(base64Data.length * 0.75);

          // Generate content hash for caching
          const hash = generateSimpleHash(base64Data);

          resolve({
            dataUrl,
            hash,
            originalSize: file.size,
            optimizedSize,
            width,
            height,
            mimeType: 'image/jpeg',
          });
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Generate a simple hash for caching purposes
 * Uses a fast, non-cryptographic hash
 */
function generateSimpleHash(str: string): string {
  let hash = 0;
  const len = str.length;

  // Sample the string at intervals for speed
  const sampleSize = Math.min(10000, len);
  const step = Math.max(1, Math.floor(len / sampleSize));

  for (let i = 0; i < len; i += step) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36);
}

/**
 * Extract base64 data from data URL for API submission
 */
export function extractBase64(dataUrl: string): string {
  const parts = dataUrl.split(',');
  return parts.length > 1 ? parts[1] : dataUrl;
}

/**
 * Get media type from data URL
 */
export function getMediaType(dataUrl: string): string {
  const match = dataUrl.match(/data:([^;]+);/);
  return match ? match[1] : 'image/jpeg';
}

/**
 * Check if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
