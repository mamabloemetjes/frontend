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
      <div className="border-b mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 border-b-2 ${
              activeTab === "products"
                ? "border-black font-bold"
                : "border-transparent"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 border-b-2 ${
              activeTab === "orders"
                ? "border-black font-bold"
                : "border-transparent"
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
      try {
        await deleteProduct.mutateAsync(id);
      } catch {
        alert("Failed to delete product");
      }
    }
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error.message}</div>;
  }

  const products = data?.products || [];
  const pagination = data?.pagination;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-black text-white"
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
      <div className="border">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 border-b">Image</th>
              <th className="text-left p-3 border-b">Name</th>
              <th className="text-left p-3 border-b">SKU</th>
              <th className="text-left p-3 border-b">Price</th>
              <th className="text-left p-3 border-b">Stock</th>
              <th className="text-left p-3 border-b">Type</th>
              <th className="text-left p-3 border-b">Active</th>
              <th className="text-left p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const primaryImage = product.images?.find(
                (img) => img.is_primary,
              );
              const imageUrl = primaryImage?.url || product.images?.[0]?.url;

              return (
                <tr key={product.id} className="border-b">
                  <td className="p-3">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={primaryImage?.alt_text || product.name}
                        className="w-12 h-12 object-cover border"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 border flex items-center justify-center text-xl">
                        🌸
                      </div>
                    )}
                  </td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.sku}</td>
                  <td className="p-3">
                    €{(product.subtotal / 100).toFixed(2)}
                  </td>
                  <td className="p-3">
                    <StockEditor product={product} />
                  </td>
                  <td className="p-3">{product.product_type || "-"}</td>
                  <td className="p-3">{product.is_active ? "Yes" : "No"}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="px-3 py-1 bg-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 bg-red-600 text-white"
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
            className="px-4 py-2 border disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {pagination.page} of {pagination.total_pages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.total_pages}
            className="px-4 py-2 border disabled:opacity-50"
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
    try {
      await updateStock.mutateAsync({
        id: product.id,
        stock: parseInt(stock, 10),
      });
      setIsEditing(false);
    } catch {
      alert("Failed to update stock");
    }
  };

  if (!isEditing) {
    return (
      <span
        onClick={() => setIsEditing(true)}
        className="cursor-pointer hover:bg-gray-100 px-2 py-1"
      >
        {product.stock || 0}
        <Pencil className="inline-block ml-2 w-4 h-4 text-gray-500" />
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type="number"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        className="w-20 border px-2 py-1"
        autoFocus
      />
      <button
        onClick={handleSave}
        className="px-2 py-1 bg-green-600 text-white"
      >
        ✓
      </button>
      <button
        onClick={() => setIsEditing(false)}
        className="px-2 py-1 bg-gray-200"
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

    try {
      if (isEditing) {
        await updateProduct.mutateAsync({
          id: product.id,
          updates: productData,
        });
      } else {
        await createProduct.mutateAsync(productData);
      }
      onSuccess();
    } catch {
      alert(`Failed to ${isEditing ? "update" : "create"} product`);
    }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">
          {isEditing ? "Edit Product" : "Create New Product"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-bold">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-bold">SKU *</label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
              className="w-full border px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 font-bold">Price (€) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full border px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-bold">Discount (€)</label>
              <input
                type="number"
                step="0.01"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
                className="w-full border px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-bold">Tax (€) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.tax}
                onChange={(e) =>
                  setFormData({ ...formData, tax: e.target.value })
                }
                className="w-full border px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-bold">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border px-3 py-2"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-bold">Type</label>
              <select
                value={formData.product_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    product_type: e.target.value as ProductType | "",
                  })
                }
                className="w-full border px-3 py-2"
              >
                <option value="">None</option>
                <option value="flower">Flower</option>
                <option value="bouquet">Bouquet</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-bold">Size</label>
              <select
                value={formData.size}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    size: e.target.value as Size | "",
                  })
                }
                className="w-full border px-3 py-2"
              >
                <option value="">None</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-bold">Stock</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              className="w-full border px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-2 font-bold">Colors</label>
            <div className="flex flex-wrap gap-2">
              {allColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorToggle(color)}
                  className={`px-3 py-1 border capitalize ${
                    formData.colors.includes(color)
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
              />
              <span className="font-bold">Active</span>
            </label>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border"
              disabled={createProduct.isPending || updateProduct.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white"
              disabled={createProduct.isPending || updateProduct.isPending}
            >
              {isEditing ? "Update" : "Create"}
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
      <div className="border p-8 text-center text-gray-500">
        <p className="text-lg">Orders management coming soon...</p>
        <p className="mt-2 text-sm">
          This section will include order viewing, processing, and status
          updates.
        </p>
      </div>

      {/* Placeholder structure for future implementation */}
      <div className="mt-8 space-y-4 opacity-50 pointer-events-none">
        <div className="border p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold">Order #12345</div>
              <div className="text-sm text-gray-600">Customer: John Doe</div>
            </div>
            <div className="text-right">
              <div className="font-bold">€45.99</div>
              <div className="text-sm text-gray-600">Status: Pending</div>
            </div>
          </div>
        </div>

        <div className="border p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold">Order #12344</div>
              <div className="text-sm text-gray-600">Customer: Jane Smith</div>
            </div>
            <div className="text-right">
              <div className="font-bold">€78.50</div>
              <div className="text-sm text-gray-600">Status: Shipped</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { DashboardPage };
