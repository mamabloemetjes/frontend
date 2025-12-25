import { type Product } from "@/lib/api";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.is_primary);
  const imageUrl = primaryImage?.url || product.images?.[0]?.url;

  // Convert cents to euros for display
  const priceInEuros = (product.subtotal - (product.discount || 0)) / 100;
  const originalPrice = product.subtotal / 100;
  const hasDiscount = product.discount && product.discount > 0;

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={primaryImage?.alt_text || product.name}
          className="w-full h-48 object-cover rounded mb-4"
        />
      ) : (
        <div className="w-full h-48 bg-muted rounded mb-4 flex items-center justify-center text-4xl">
          🌸
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
        </div>

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

          <button
            onClick={onAddToCart}
            disabled={!product.is_active}
            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
