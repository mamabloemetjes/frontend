import { useState } from "react";
import { X, Star, Upload, Image as ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { UploadResponse } from "@/types/auth";

interface ImageData {
  url: string;
  alt_text: string;
  is_primary: boolean;
  // Base name returned by the server. Store this in the DB, not the URL.
  name?: string;
  // For temporary IDs before upload
  tempId?: string;
}

interface ImageManagerProps {
  images: ImageData[];
  onChange: (images: ImageData[]) => void;
  maxImages?: number;
  product_name?: string;
}

async function uploadImage(file: File): Promise<UploadResponse> {
  const res = await api.admin.filesystem.uploadImage(file);

  console.log(res)
  return {
      name: res.data.name,
      url: res.data.url,
      srcset: res.data.srcset,
  }
}

export function ImageManager({
  images,
  onChange,
  maxImages = 10,
}: ImageManagerProps) {
  const [dragOver, setDragOver] = useState(false);
  const t = useTranslations();

  const uploadMutation = useMutation({
    mutationFn: uploadImage,
    onError: (error) => {
      // TODO: Show error toast/notification to user
      console.error("Failed to upload image:", error);
    },
  });

  const uploading = uploadMutation.isPending;

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const newImages: ImageData[] = [];
    const filesArray = Array.from(files);

    // Upload one at a time so the primary flag and ordering stay predictable
    for (let i = 0; i < filesArray.length; i++) {
      if (images.length + newImages.length >= maxImages) break;

      const file = filesArray[i];

      try {
        const result = await uploadMutation.mutateAsync(file);

        newImages.push({
          url: result.url,
          name: result.name,
          alt_text: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          is_primary: images.length === 0 && newImages.length === 0,
          tempId: `temp-${Date.now()}-${i}`,
        });
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    if (newImages.length > 0) {
      onChange([...images, ...newImages]);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    await handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);

    // If we removed the primary image and there are still images left,
    // make the first one primary
    if (images[index].is_primary && newImages.length > 0) {
      newImages[0] = { ...newImages[0], is_primary: true };
    }

    onChange(newImages);
  };

  const setPrimaryImage = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));
    onChange(newImages);
  };

  const updateAltText = (index: number, altText: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], alt_text: altText };
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block font-semibold text-sm">
          {t("pages.dashboard.imageManager.title")} ({images.length}/{maxImages}
          )
        </label>
        <label
          htmlFor="image-upload"
          className={`px-3 py-1.5 text-sm border border-border rounded hover:bg-muted transition-colors inline-flex items-center gap-2 ${
            uploading || images.length >= maxImages
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          <Upload className="w-4 h-4" />
          {uploading
            ? "Uploading..."
            : t("pages.dashboard.imageManager.uploadImages")}
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/jpeg,image/png"
          multiple
          onChange={(e) => {
            handleFileSelect(e.target.files);
            e.target.value = ""; // allow re-selecting the same file
          }}
          className="hidden"
          disabled={uploading || images.length >= maxImages}
        />
      </div>

      {/* Drop Zone */}
      {images.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            uploading
              ? "border-border bg-muted/20 opacity-50 cursor-not-allowed"
              : dragOver
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/20"
          }`}
        >
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-1">
            {uploading
              ? t("pages.dashboard.imageManager.uploading")
              : t("pages.dashboard.imageManager.dropZone")}
          </p>
          <p className="text-xs text-muted-foreground">
            {uploading
              ? t("pages.dashboard.imageManager.pleaseWait")
              : t("pages.dashboard.imageManager.orClickToUpload")}
          </p>
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div
              key={image.tempId || image.url}
              className="border border-border rounded-lg p-3 space-y-2 bg-background"
            >
              {/* Image Preview */}
              <div className="relative aspect-square bg-muted rounded flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground" />
                <div className="absolute inset-0 flex items-center justify-center rounded">
                  <Image
                    src={image.url}
                    alt={image.alt_text || "Product Image"}
                    className="max-h-full max-w-full object-contain rounded"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    unoptimized // server already made the WebP variants
                  />
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Primary Badge */}
                {image.is_primary && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    {t("pages.dashboard.imageManager.primary")}
                  </div>
                )}
              </div>

              {/* Alt Text Input */}
              <div>
                <label className="block text-xs font-medium mb-1 text-muted-foreground">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={image.alt_text}
                  onChange={(e) => updateAltText(index, e.target.value)}
                  placeholder="Describe this image"
                  className="w-full text-sm border border-border bg-background text-foreground px-2 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Set Primary Button */}
              {!image.is_primary && (
                <button
                  type="button"
                  onClick={() => setPrimaryImage(index)}
                  className="w-full text-sm px-3 py-1.5 border border-border rounded hover:bg-muted transition-colors flex items-center justify-center gap-2"
                >
                  <Star className="w-3 h-3" />
                  {t("pages.dashboard.imageManager.setAsPrimary")}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          {t("pages.dashboard.imageManager.noImagesUploaded")}
        </p>
      )}
    </div>
  );
}
