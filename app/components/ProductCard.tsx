import { type Product } from "@/lib/api";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { LanguageAwareLink } from "./LanguageAwareLink";
import AddToCart from "./AddToCart";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const primaryImage = product.images?.find((img) => img.is_primary);
  const imageUrl = primaryImage?.url || product.images?.[0]?.url;

  // Convert cents to euros for display
  const priceInEuros = (product.subtotal - (product.discount || 0)) / 100;
  const originalPrice = product.subtotal / 100;
  const hasDiscount = product.discount && product.discount > 0;

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
            className="w-full h-48 object-cover rounded mb-4"
            width={400}
            height={400}
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
                €{priceInEuros.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  €{originalPrice.toFixed(2)}
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
