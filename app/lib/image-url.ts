import { env } from "@/lib/env";

interface ImageReference {
  name: string;
}

const uploadsUrl = `${env.apiUrl.replace(/\/+$/, "")}/uploads`;

/**
 * Resolve the server-side image name to the public WebP variant.
 * The URL field is retained as a fallback for legacy images without a name.
 */
export function getImageUrl(image?: ImageReference): string | undefined {
  if (!image) {
    return undefined;
  }

  if (image.name) {
    return `${uploadsUrl}/${image.name}-800.webp`;
  }

  return undefined;
}
