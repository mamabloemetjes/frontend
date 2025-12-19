import { useAtom, useSetAtom } from "jotai";
import { Routes, Route, Link } from "react-router-dom";
import { useActiveProducts } from "@/hooks/useProducts";
import {
  cartItemsAtom,
  cartTotalAtom,
  cartCountAtom,
  cartDiscountAtom,
  addToCartAtom,
  removeFromCartAtom,
  clearCartAtom,
} from "@/store/cart";
import type { Product } from "@/lib/api";
import {
  DashboardPage,
  LoginPage,
  RegisterPage,
  EmailVerificationPage,
} from "@/pages";
import { useAuthStatus, useLogout } from "@/hooks/useAuth";
import { AdminRoute } from "./components/ProtectedRoute";
import { TokenRefreshHandler } from "./components/TokenRefreshHandler";
import { useCSRF } from "@/hooks/useCSRF";
import { Toaster } from "@/components/ui/sonner";

function App() {
  // Initialize CSRF token on app startup
  useCSRF();

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <TokenRefreshHandler />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/email-verification" element={<EmailVerificationPage />} />
        <Route path="/email-verified" element={<EmailVerificationPage />} />
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <DashboardPage />
            </AdminRoute>
          }
        />
        {/* 404 route */}
        <Route
          path="*"
          element={
            <div className="container mx-auto px-4 py-16 text-center">
              <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
              <p className="text-muted-foreground mb-8">
                The page you are looking for does not exist.
              </p>
              <Link
                to="/"
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded hover:bg-primary/90 transition-colors"
              >
                Go to Home
              </Link>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

function Header() {
  const [cartCount] = useAtom(cartCountAtom);
  const { user, isAuthenticated } = useAuthStatus();
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          🌸 Mama Bloemetjes
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="hover:underline">
            Products
          </Link>
          <Link to="/cart" className="relative hover:underline">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">
                {user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="hover:underline"
                disabled={logout.isPending}
              >
                {logout.isPending ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Sign Up
              </Link>
            </>
          )}
          {isAuthenticated && user?.role === "admin" && (
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function HomePage() {
  // Fetch active products with images
  const { data, isLoading, error } = useActiveProducts(1, 20, true);
  const addToCart = useSetAtom(addToCartAtom);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
          <p className="font-medium">Error loading products</p>
          <p className="text-sm mt-1">
            Please try again later or contact support.
          </p>
          <p className="text-xs mt-2 font-mono">{error.message}</p>
        </div>
      </div>
    );
  }

  const products = data?.products || [];

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground mb-8">
          No products found.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Our Products</h1>
        {data?.pagination && (
          <p className="text-sm text-muted-foreground">
            Showing {products.length} of {data.pagination.total_items} products
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price / 100, // Convert cents to euros
                discount: (product.discount || 0) / 100, // Convert cents to euros
                image: product.images?.[0]?.url,
                availableStock: product.stock || 0,
              })
            }
          />
        ))}
      </div>

      {data?.meta && (
        <p className="text-xs text-muted-foreground text-center mt-8">
          Query took {data.meta.query_time_ms}ms
        </p>
      )}
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.is_primary);
  const imageUrl = primaryImage?.url || product.images?.[0]?.url;

  // Convert cents to euros for display
  const priceInEuros = (product.price - (product.discount || 0)) / 100;
  const originalPrice = product.price / 100;
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
          {product.product_type && (
            <span className="text-xs bg-secondary px-2 py-1 rounded">
              {product.product_type}
            </span>
          )}
        </div>

        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}

        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color}
                className="text-xs px-2 py-0.5 bg-accent rounded capitalize"
              >
                {color}
              </span>
            ))}
          </div>
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
            disabled={product.stock === 0 || !product.is_active}
            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

function CartPage() {
  const [cartItems] = useAtom(cartItemsAtom);
  const [cartTotal] = useAtom(cartTotalAtom);
  const [totalDiscount] = useAtom(cartDiscountAtom);
  const removeFromCart = useSetAtom(removeFromCartAtom);
  const clearCart = useSetAtom(clearCartAtom);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground text-xl mb-4">Your cart is empty</p>
        <Link
          to="/"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded hover:bg-primary/90 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <button
          onClick={() => clearCart()}
          className="text-destructive hover:underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
              ) : (
                <div className="w-20 h-20 bg-muted rounded flex items-center justify-center text-2xl">
                  🌸
                </div>
              )}
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">
                    €{(item.price - item.discount).toFixed(2)}
                  </span>
                  {item.discount > 0 && (
                    <span className="text-muted-foreground line-through">
                      €{item.price.toFixed(2)}
                    </span>
                  )}
                  <span>× {item.quantity}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-lg">
                €{((item.price - item.discount) * item.quantity).toFixed(2)}
              </span>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-destructive hover:underline text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-4">
        <div className="space-y-2">
          {totalDiscount > 0 && (
            <div className="flex items-center justify-between text-lg">
              <span className="text-muted-foreground">Total Discount:</span>
              <span className="font-semibold text-green-600">
                -€{totalDiscount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-2xl font-bold">
            <span>Total:</span>
            <span>€{cartTotal.toFixed(2)}</span>
          </div>
        </div>
        <button className="w-full mt-4 bg-primary text-primary-foreground py-3 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default App;
