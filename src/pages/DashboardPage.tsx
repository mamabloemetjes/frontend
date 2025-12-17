import { useState } from "react";
import {
  useAdminProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useUpdateProductStock,
} from "@/hooks/useAdminProducts";
import type { Product, Color, Size, ProductType } from "@/lib/api";
import { Pencil } from "lucide-react";

type Tab = "products" | "orders";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("products");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="border-b border-border mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === "products"
                ? "border-primary font-bold text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === "orders"
                ? "border-primary font-bold text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Orders
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "products" && <ProductsTab />}
      {activeTab === "orders" && <OrdersTab />}
    </div>
  );
};

function ProductsTab() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading, error } = useAdminProducts({
    page,
    page_size: pageSize,
    include_images: true,
  });

  const deleteProduct = useDeleteProduct();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
        Error: {error.message}
      </div>
    );
  }

  const products = data?.products || [];
  const pagination = data?.pagination;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded"
        >
          Create New Product
        </button>
      </div>

      {showCreateForm && (
        <ProductForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => setShowCreateForm(false)}
        />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => setEditingProduct(null)}
        />
      )}

      {/* Products Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 border-b border-border font-semibold">
                Image
              </th>
              <th className="text-left p-3 border-b border-border font-semibold">
                Name
              </th>
              <th className="text-left p-3 border-b border-border font-semibold">
                SKU
              </th>
              <th className="text-left p-3 border-b border-border font-semibold">
                Price
              </th>
              <th className="text-left p-3 border-b border-border font-semibold">
                Stock
              </th>
              <th className="text-left p-3 border-b border-border font-semibold">
                Type
              </th>
              <th className="text-left p-3 border-b border-border font-semibold">
                Active
              </th>
              <th className="text-left p-3 border-b border-border font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const primaryImage = product.images?.find(
                (img) => img.is_primary,
              );
              const imageUrl = primaryImage?.url || product.images?.[0]?.url;

              return (
                <tr
                  key={product.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="p-3">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={primaryImage?.alt_text || product.name}
                        className="w-12 h-12 object-cover border border-border rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted border border-border rounded flex items-center justify-center text-xl">
                        🌸
                      </div>
                    )}
                  </td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3 text-muted-foreground">{product.sku}</td>
                  <td className="p-3">
                    €{(product.subtotal / 100).toFixed(2)}
                  </td>
                  <td className="p-3">
                    <StockEditor product={product} />
                  </td>
                  <td className="p-3 capitalize text-muted-foreground">
                    {product.product_type || "-"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        product.is_active
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {product.is_active ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="px-3 py-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded transition-colors disabled:opacity-50"
                        disabled={deleteProduct.isPending}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border border-border rounded hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-muted-foreground">
            Page {pagination.page} of {pagination.total_pages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.total_pages}
            className="px-4 py-2 border border-border rounded hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function StockEditor({ product }: { product: Product }) {
  const [isEditing, setIsEditing] = useState(false);
  const [stock, setStock] = useState(product.stock?.toString() || "0");
  const updateStock = useUpdateProductStock();

  const handleSave = async () => {
    await updateStock.mutateAsync({
      id: product.id,
      stock: parseInt(stock, 10),
    });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <span
        onClick={() => setIsEditing(true)}
        className="cursor-pointer hover:bg-muted px-2 py-1 rounded transition-colors inline-flex items-center gap-2"
      >
        {product.stock || 0}
        <Pencil className="w-4 h-4 text-muted-foreground" />
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type="number"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        className="w-20 border border-border bg-background text-foreground px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-ring"
        autoFocus
      />
      <button
        onClick={handleSave}
        className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
        disabled={updateStock.isPending}
      >
        ✓
      </button>
      <button
        onClick={() => setIsEditing(false)}
        className="px-2 py-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded transition-colors"
      >
        ✗
      </button>
    </div>
  );
}

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
  onSuccess: () => void;
}

function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const isEditing = !!product;
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [formData, setFormData] = useState({
    name: product?.name || "",
    sku: product?.sku || "",
    price: product ? (product.price / 100).toString() : "",
    discount: product ? ((product.discount || 0) / 100).toString() : "0",
    tax: product ? (product.tax / 100).toString() : "",
    description: product?.description || "",
    is_active: product?.is_active ?? true,
    size: (product?.size || "") as Size | "",
    product_type: (product?.product_type || "") as ProductType | "",
    stock: product?.stock?.toString() || "0",
    colors: (product?.colors || []).map((c) => c.toLowerCase() as Color),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      sku: formData.sku,
      price: Math.round(parseFloat(formData.price) * 100),
      discount: Math.round(parseFloat(formData.discount) * 100),
      tax: Math.round(parseFloat(formData.tax) * 100),
      description: formData.description,
      is_active: formData.is_active,
      size: formData.size || undefined,
      product_type: formData.product_type || undefined,
      stock: parseInt(formData.stock, 10),
      colors:
        formData.colors.length > 0
          ? formData.colors.map((c) => c.toLowerCase() as Color)
          : undefined,
    };

    if (isEditing) {
      await updateProduct.mutateAsync({
        id: product.id,
        updates: productData,
      });
    } else {
      await createProduct.mutateAsync(productData);
    }
    onSuccess();
  };

  const handleColorToggle = (color: Color) => {
    if (formData.colors.includes(color)) {
      setFormData({
        ...formData,
        colors: formData.colors.filter((c) => c !== color),
      });
    } else {
      setFormData({
        ...formData,
        colors: [...formData.colors, color],
      });
    }
  };

  const allColors: Color[] = [
    "red",
    "blue",
    "green",
    "yellow",
    "black",
    "white",
    "purple",
    "orange",
    "pink",
  ];

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-background border border-border rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto shadow-xl">
        <h3 className="text-xl font-bold mb-4">
          {isEditing ? "Edit Product" : "Create New Product"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-sm">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-border bg-background text-foreground px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm">SKU *</label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
              className="w-full border border-border bg-background text-foreground px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 font-semibold text-sm">
                Price (€) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full border border-border bg-background text-foreground px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-sm">
                Discount (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
                className="w-full border border-border bg-background text-foreground px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-sm">
                Tax (€) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.tax}
                onChange={(e) =>
                  setFormData({ ...formData, tax: e.target.value })
                }
                className="w-full border border-border bg-background text-foreground px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border border-border bg-background text-foreground px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold text-sm">Type</label>
              <select
                value={formData.product_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    product_type: e.target.value as ProductType | "",
                  })
                }
                className="w-full border border-border bg-background text-foreground px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">None</option>
                <option value="flower">Flower</option>
                <option value="bouquet">Bouquet</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold text-sm">Size</label>
              <select
                value={formData.size}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    size: e.target.value as Size | "",
                  })
                }
                className="w-full border border-border bg-background text-foreground px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">None</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm">Stock</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              className="w-full border border-border bg-background text-foreground px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-sm">Colors</label>
            <div className="flex flex-wrap gap-2">
              {allColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorToggle(color)}
                  className={`px-3 py-1 border border-border rounded capitalize transition-colors ${
                    formData.colors.includes(color)
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="w-4 h-4 rounded border-border"
              />
              <span className="font-semibold text-sm">Active</span>
            </label>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded hover:bg-muted transition-colors disabled:opacity-50"
              disabled={createProduct.isPending || updateProduct.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
              disabled={createProduct.isPending || updateProduct.isPending}
            >
              {createProduct.isPending || updateProduct.isPending
                ? "Saving..."
                : isEditing
                  ? "Update"
                  : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function OrdersTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Orders</h2>
      <div className="border border-border rounded-lg p-8 text-center bg-muted/50">
        <p className="text-lg text-muted-foreground">
          Orders management coming soon...
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          This section will include order viewing, processing, and status
          updates.
        </p>
      </div>

      {/* Placeholder structure for future implementation */}
      <div className="mt-8 space-y-4 opacity-50 pointer-events-none">
        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold">Order #12345</div>
              <div className="text-sm text-muted-foreground">
                Customer: John Doe
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold">€45.99</div>
              <div className="text-sm text-muted-foreground">
                Status: Pending
              </div>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold">Order #12344</div>
              <div className="text-sm text-muted-foreground">
                Customer: Jane Smith
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold">€78.50</div>
              <div className="text-sm text-muted-foreground">
                Status: Shipped
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { DashboardPage };
