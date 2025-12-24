import { useState } from "react";
import { X, Star, Upload, Image as ImageIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { client } from "@/lib/supabase";

interface ImageData {
  url: string;
  alt_text: string;
  is_primary: boolean;
  // For temporary IDs before upload
  tempId?: string;
}

interface ImageManagerProps {
  images: ImageData[];
  onChange: (images: ImageData[]) => void;
  maxImages?: number;
  product_name: string;
}

const BUCKET_NAME = "product_images";

export function ImageManager({
  images,
  onChange,
  maxImages = 10,
  product_name,
}: ImageManagerProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadImageFile = async (
    file: File,
    productName: string,
  ): Promise<string> => {
    if (!file) {
      throw new Error("No file provided");
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (!fileExt) {
      throw new Error("Invalid file extension");
    }

    const id = uuidv4();
    const sanitizedName = productName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const filePath = `${sanitizedName}-${id}.${fileExt}`;

    const { error: uploadError } = await client.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "86400",
        upsert: true,
        contentType: file.type, // keeps correct MIME type
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      throw new Error("Failed to upload image");
    }

    const { data } = client.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new Error("Failed to retrieve public image URL");
    }

    return data.publicUrl;
  };

  const handleFileSelect = async (
    files: FileList | null,
    product_name: string,
  ) => {
    if (!files) return;

    setUploading(true);
    const newImages: ImageData[] = [];
    const filesArray = Array.from(files);

    try {
      for (let i = 0; i < filesArray.length; i++) {
        if (images.length + newImages.length >= maxImages) break;

        const file = filesArray[i];

        // Upload the file and get the URL
        const url = await uploadImageFile(file, product_name);

        newImages.push({
          url: url,
          alt_text: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          is_primary: images.length === 0 && newImages.length === 0,
          tempId: `temp-${Date.now()}-${i}`,
        });
      }

      if (newImages.length > 0) {
        onChange([...images, ...newImages]);
      }
    } catch (error) {
      console.error("Failed to upload images:", error);
      // TODO: Show error toast/notification to user
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent, product_name: string) => {
    e.preventDefault();
    setDragOver(false);
    await handleFileSelect(e.dataTransfer.files, product_name);
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
      newImages[0].is_primary = true;
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
          Product Images ({images.length}/{maxImages})
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
          {uploading ? "Uploading..." : "Add Images"}
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files, product_name)}
          className="hidden"
          disabled={uploading || images.length >= maxImages}
        />
      </div>

      {/* Drop Zone */}
      {images.length < maxImages && (
        <div
          onDrop={(e) => handleDrop(e, product_name)}
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
            {uploading ? "Uploading images..." : "Drag and drop images here"}
          </p>
          <p className="text-xs text-muted-foreground">
            {uploading
              ? "Please wait..."
              : 'or click "Add Images" button above'}
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
              {/* Image Preview Placeholder */}
              <div className="relative aspect-square bg-muted rounded flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded">
                  <img
                    src={image.url}
                    alt={image.alt_text || "Product Image"}
                    className="max-h-full max-w-full object-contain rounded"
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
                    Primary
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
                  Set as Primary
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No images added yet. Add some images to showcase your product!
        </p>
      )}
    </div>
  );
}
