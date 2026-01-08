import { type Product } from "@/lib/api";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { LanguageAwareLink } from "./LanguageAwareLink";
import AddToCart from "./AddToCart";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
  onRemove?: () => void;
  quantity?: number;
  removeLabel?: string;
}

const ProductCard = ({
  product,
  variant = "default",
  onRemove,
  quantity = 1,
  removeLabel = "Remove",
}: ProductCardProps) => {
  const primaryImage = product.images?.find((img) => img.is_primary);
  const imageUrl = primaryImage?.url || product.images?.[0]?.url;

  const hasDiscount = product.discount > 0;
  const originalPrice = product.subtotal + product.discount;

  // Compact variant for cart
  if (variant === "compact") {
    return (
      <div className="border rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-4 flex-1">
          <LanguageAwareLink href={`/products/${product.id}`}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={primaryImage?.alt_text || product.name}
                className="w-20 h-20 object-cover rounded"
                width={80}
                height={142}
                loading="eager"
              />
            ) : (
              <div className="w-20 h-20 bg-muted rounded flex items-center justify-center text-2xl">
                🌸
              </div>
            )}
          </LanguageAwareLink>
          <div className="flex-1">
            <LanguageAwareLink
              href={`/products/${product.id}`}
              className="hover:underline"
            >
              <h3 className="font-semibold">{product.name}</h3>
            </LanguageAwareLink>
            <div className="flex items-center gap-2 text-sm mt-1">
              <span className="text-muted-foreground">
                {formatPrice(product.subtotal)}
              </span>
              {hasDiscount && (
                <span className="text-muted-foreground line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
              <span>× {quantity}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg">
            {formatPrice(product.subtotal * quantity)}
          </span>
          {onRemove && (
            <button
              onClick={onRemove}
              className="text-destructive hover:underline text-sm"
            >
              {removeLabel}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Default variant for product listings
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-all">
      <LanguageAwareLink
        href={`/products/${product.id}`}
        aria-label={product.name}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={primaryImage?.alt_text || product.name}
            className="w-full h-96 object-cover rounded mb-4"
            height={400}
            width={300}
            loading="eager"
          />
        ) : (
          <div className="w-full h-48 bg-muted rounded mb-4 flex items-center justify-center text-4xl">
            🌸
          </div>
        )}
      </LanguageAwareLink>

      <div className="space-y-2">
        <LanguageAwareLink
          href={`/products/${product.id}`}
          className="flex items-start justify-between gap-2 hover:underline"
        >
          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
        </LanguageAwareLink>

        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold">
                {formatPrice(product.subtotal)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>

          <AddToCart title={<ShoppingCart />} product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
