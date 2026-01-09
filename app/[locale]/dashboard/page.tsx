"use client";

import { useState, useEffect } from "react";
import {
  useAdminProducts,
  useCreateProduct,
  useUpdateProduct,
} from "@/hooks/useAdminProducts";
import type { Product } from "@/lib/api";
import { ImageManager } from "@/components/admin/ImageManager";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  api,
  type Order,
  type OrderStatus,
  type PaymentStatus,
  getOrderStatusColor,
  getPaymentStatusColor,
} from "@/lib/api";
import {
  Package,
  ChevronRight,
  Filter,
  Search,
  Calendar,
  User,
} from "lucide-react";
import { productSchema, updateProductSchema } from "@/lib/validation/schemas";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type Tab = "products" | "orders";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const t = useTranslations("pages.dashboard");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

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
            {t("products")}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === "orders"
                ? "border-primary font-bold text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("orders")}
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
  const pageSize = 20;
  const t = useTranslations();

  const { data, isLoading, error } = useAdminProducts({
    page: 1,
    page_size: pageSize,
    include_images: true,
  });

  const updateProduct = useUpdateProduct();

  const handleMarkAsSold = async (id: string) => {
    await updateProduct.mutateAsync({
      id,
      updates: { is_active: false },
    });
  };

  const handleUndoMarkAsSold = async (id: string) => {
    await updateProduct.mutateAsync({
      id,
      updates: { is_active: true },
    });
  };

  const handleProductClick = async (product: Product) => {
    if (product.is_active) {
      await handleMarkAsSold(product.id);
    } else {
      await handleUndoMarkAsSold(product.id);
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: t("common.name"),
      cell: ({ row }) => {
        const primaryImage = row.original.images?.find((img) => img.is_primary);
        const imageUrl = primaryImage?.url || row.original.images?.[0]?.url;
        return (
          <div className="flex items-center gap-4">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={primaryImage?.alt_text || row.original.name}
                className="w-12 h-12 object-cover border border-border rounded"
                width={120}
                height={120}
                loading="lazy"
              />
            ) : (
              <div className="w-12 h-12 bg-muted border border-border rounded flex items-center justify-center text-xl">
                🌸
              </div>
            )}
            <span>{row.original.name}</span>
          </div>
        );
      },
    },
    // {
    //   accessorKey: "sku",
    //   header: "SKU",
    // },
    {
      accessorKey: "price",
      header: t("common.price"),
      cell: ({ row }) => `€${(row.original.subtotal / 100).toFixed(2)}`,
    },
    {
      accessorKey: "is_active",
      header: t("common.status"),
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            row.original.is_active
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {row.original.is_active
            ? t("pages.dashboard.active")
            : t("pages.dashboard.sold")}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingProduct(row.original)}
          >
            {t("common.edit")}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              {row.original.is_active ? (
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={!row.original.is_active}
                >
                  {t("pages.dashboard.markAsSold")}
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={row.original.is_active}
                >
                  {t("pages.dashboard.undoSold")}
                </Button>
              )}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {row.original.is_active
                    ? t("pages.dashboard.confirmMarkAsSoldTitle")
                    : t("pages.dashboard.confirmUndoSoldTitle")}
                </DialogTitle>
              </DialogHeader>
              <p>
                {row.original.is_active
                  ? t("pages.dashboard.confirmMarkAsSoldDescription")
                  : t("pages.dashboard.confirmUndoSoldDescription")}
              </p>
              <div className="flex justify-end gap-2">
                <DialogTrigger asChild>
                  <Button variant="outline">{t("common.cancel")}</Button>
                </DialogTrigger>
                <Button
                  variant="destructive"
                  onClick={() => handleProductClick(row.original)}
                >
                  {row.original.is_active
                    ? t("pages.dashboard.markAsSold")
                    : t("pages.dashboard.undoSold")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ),
    },
  ];

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("pages.dashboard.products")}</h2>
        <Button onClick={() => setShowCreateForm(true)}>
          {t("pages.dashboard.addProduct")}
        </Button>
      </div>

      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t("pages.dashboard.createProduct")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm
              onClose={() => setShowCreateForm(false)}
              onSuccess={() => setShowCreateForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {editingProduct && (
        <Dialog open onOpenChange={() => setEditingProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("pages.dashboard.editProduct")}</DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingProduct}
              onClose={() => setEditingProduct(null)}
              onSuccess={() => setEditingProduct(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      <ProductsTable columns={columns} data={products} />
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
  const t = useTranslations();

  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product ? (product.price / 100).toString() : "",
    discount: product ? ((product.discount || 0) / 100).toString() : "0",
    tax: product ? ((product.price * 0.21) / 100).toString() : "0",
    enableTax: product ? product.tax > 0 : true,
    description: product?.description || "",
    is_active: product?.is_active ?? true,
    product_type: product?.product_type || "",
  });

  const [images, setImages] = useState(
    (product?.images || []).map((img) => ({
      url: img.url,
      alt_text: img.alt_text || "",
      is_primary: img.is_primary,
    })),
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tax = formData.enableTax
      ? Math.round(parseFloat(formData.price) * 0.21 * 100)
      : 0;

    const productData = {
      name: formData.name,
      price: Math.round(parseFloat(formData.price) * 100),
      discount: Math.round(parseFloat(formData.discount) * 100),
      tax,
      description: formData.description,
      is_active: formData.is_active,
      product_type: formData.product_type || "",
      images:
        images.length > 0
          ? images.map((img) => ({
              url: img.url,
              alt_text: img.alt_text,
              is_primary: img.is_primary,
            }))
          : undefined,
    };

    if (isEditing) {
      // Validate the update data with Zod schema
      const validationResult = updateProductSchema.safeParse(productData);

      if (!validationResult.success) {
        // Extract errors and set them in state
        const fieldErrors: Record<string, string> = {};
        validationResult.error.issues.forEach((issue) => {
          const field = issue.path[0] as string;
          fieldErrors[field] = t(issue.message);
        });
        setErrors(fieldErrors);
        return;
      }

      // Clear errors on successful validation
      setErrors({});

      // Remove undefined values and empty strings before sending
      const cleanedData = Object.fromEntries(
        Object.entries(validationResult.data).filter(
          ([, v]) => v !== undefined && v !== "",
        ),
      );

      await updateProduct.mutateAsync({
        id: product.id,
        updates: cleanedData,
      });
    } else {
      // Validate the create data with Zod schema
      const validationResult = productSchema.safeParse(productData);

      if (!validationResult.success) {
        // Extract errors and set them in state
        const fieldErrors: Record<string, string> = {};
        validationResult.error.issues.forEach((issue) => {
          const field = issue.path[0] as string;
          fieldErrors[field] = t(issue.message);
        });
        setErrors(fieldErrors);
        return;
      }

      // Clear errors on successful validation
      setErrors({});

      // Ensure discount is always a number (default to 0)
      const createData = {
        ...validationResult.data,
        discount: validationResult.data.discount ?? 0,
      };

      await createProduct.mutateAsync(createData);
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="block mb-1 font-semibold text-sm">
          {t("pages.dashboard.formLabels.name")}
        </Label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) {
              setErrors({ ...errors, name: "" });
            }
          }}
          className={
            errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
          }
          required
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="block mb-1 font-semibold text-sm">
            {t("pages.dashboard.formLabels.price")}
          </Label>
          <Input
            type="number"
            step="0.50"
            max="9999.99"
            min="0.00"
            value={formData.price}
            onChange={(e) => {
              setFormData({ ...formData, price: e.target.value });
              if (errors.price) {
                setErrors({ ...errors, price: "" });
              }
            }}
            className={
              errors.price ? "border-red-500 focus-visible:ring-red-500" : ""
            }
            required
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>
        <div>
          <Label className="block mb-1 font-semibold text-sm">
            {t("common.discount")} (€)
          </Label>
          <Input
            type="number"
            step="0.50"
            max="9999.99"
            min="0.00"
            value={formData.discount}
            onChange={(e) => {
              setFormData({ ...formData, discount: e.target.value });
              if (errors.discount) {
                setErrors({ ...errors, discount: "" });
              }
            }}
            className={
              errors.discount ? "border-red-500 focus-visible:ring-red-500" : ""
            }
          />
          {errors.discount && (
            <p className="text-red-500 text-sm mt-1">{errors.discount}</p>
          )}
        </div>

        <div>
          <Label className="block mb-1 font-semibold text-sm">Tax (€) *</Label>
          {/* Assuming a fixed tax rate of 21% for simplicity */}
          <Label
            className={`block p-3 bg-muted rounded ${
              errors.tax ? "border border-red-500" : ""
            }`}
          >
            €
            {formData.enableTax
              ? (parseFloat(formData.price || "0") * 0.21).toFixed(2)
              : "0.00"}
          </Label>
          {errors.tax && (
            <p className="text-red-500 text-sm mt-1">{errors.tax}</p>
          )}
        </div>

        <Label className="col-span-3 text-right font-bold text-lg mt-2">
          {t("common.total")}: €
          {(
            parseFloat(formData.price || "0") -
            parseFloat(formData.discount || "0") +
            (formData.enableTax ? parseFloat(formData.price || "0") * 0.21 : 0)
          ).toFixed(2)}
        </Label>
      </div>

      <div className="flex flex-col items-start">
        <Label className="block mb-1 font-semibold text-sm">
          {t("pages.dashboard.formLabels.enableTax")}
        </Label>
        <Checkbox
          className="w-5 h-5 rounded border-border"
          checked={formData.enableTax}
          onClick={() =>
            setFormData({ ...formData, enableTax: !formData.enableTax })
          }
        />
      </div>

      <div>
        <Label className="block mb-1 font-semibold text-sm">
          {t("pages.dashboard.formLabels.description")}
        </Label>
        <Textarea
          value={formData.description}
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
            if (errors.description) {
              setErrors({ ...errors, description: "" });
            }
          }}
          className={
            errors.description
              ? "border-red-500 focus-visible:ring-red-500"
              : ""
          }
          rows={3}
          required
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Product Type */}
      <div>
        <Label className="block mb-1 font-semibold text-sm">
          {t("pages.dashboard.formLabels.productType")}
        </Label>
        <Select
          value={formData.product_type || undefined}
          onValueChange={(value) => {
            setFormData({ ...formData, product_type: value });
            if (errors.product_type) {
              setErrors({ ...errors, product_type: "" });
            }
          }}
          required
        >
          <SelectTrigger>
            <SelectValue
              placeholder={t("pages.dashboard.formLabels.selectProductType")}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="funeral">
              {t("pages.dashboard.productTypes.funeral")}
            </SelectItem>
            <SelectItem value="wedding">
              {t("pages.dashboard.productTypes.wedding")}
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.product_type && (
          <p className="text-red-500 text-sm mt-1">{errors.product_type}</p>
        )}
      </div>

      <div>
        <Label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={formData.is_active}
            className="pointer-events-none w-5 h-5 rounded border-border"
            onClick={() =>
              setFormData({ ...formData, is_active: !formData.is_active })
            }
          />
          <Label className="font-semibold text-sm">
            {t("pages.dashboard.formLabels.active")}
          </Label>
        </Label>
      </div>

      {/* Image Manager */}
      <div className="pt-4 border-t border-border">
        <ImageManager
          images={images}
          onChange={setImages}
          product_name={formData.name}
        />
        {errors.images && (
          <p className="text-red-500 text-sm mt-1">{errors.images}</p>
        )}
      </div>

      <div className="flex gap-2 justify-end pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={createProduct.isPending || updateProduct.isPending}
        >
          {t("common.cancel")}
        </Button>
        <Button
          type="submit"
          disabled={createProduct.isPending || updateProduct.isPending}
        >
          {createProduct.isPending || updateProduct.isPending
            ? t("common.saving")
            : isEditing
              ? t("common.update")
              : t("common.create")}
        </Button>
      </div>
    </form>
  );
}

function OrdersTab() {
  const t = useTranslations();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const pageSize = 20;

  // Filters
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | "">("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, paymentFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: {
        page: number;
        page_size: number;
        status?: OrderStatus;
        payment_status?: PaymentStatus;
      } = {
        page,
        page_size: pageSize,
      };

      if (statusFilter) {
        params.status = statusFilter;
      }

      if (paymentFilter) {
        params.payment_status = paymentFilter;
      }

      const response = await api.admin.orders.getAll(params);

      if (response.success) {
        setOrders(response.data.orders);
        setTotalPages(response.data.pagination.total_pages);
        setTotalOrders(response.data.pagination.total);
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      const error = err as { response?: { status?: number }; message?: string };
      if (error.response?.status === 401 || error.response?.status === 403) {
        router.push("/login?redirect=/dashboard");
      } else {
        setError(error.message || t("order.admin.dashboard.loading"));
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("nl-NL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const clearFilters = () => {
    setStatusFilter("");
    setPaymentFilter("");
    setSearchQuery("");
    setPage(1);
  };

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.order_number.toLowerCase().includes(query) ||
      order.name.toLowerCase().includes(query) ||
      order.email.toLowerCase().includes(query)
    );
  });

  if (loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">
          {t("order.admin.dashboard.loading")}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">
              {t("order.admin.dashboard.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("order.admin.dashboard.showingOrders", { count: totalOrders })}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by order number, name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as OrderStatus | "");
              setPage(1);
            }}
            className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">
              {t("order.admin.dashboard.filterByStatus")}
            </option>
            <option value="pending">{t("order.status.pending")}</option>
            <option value="paid">{t("order.status.paid")}</option>
            <option value="processing">{t("order.status.processing")}</option>
            <option value="shipped">{t("order.status.shipped")}</option>
            <option value="delivered">{t("order.status.delivered")}</option>
            <option value="cancelled">{t("order.status.cancelled")}</option>
            <option value="refunded">{t("order.status.refunded")}</option>
          </select>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value as PaymentStatus | "");
              setPage(1);
            }}
            className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">
              {t("order.admin.dashboard.filterByPayment")}
            </option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {(statusFilter || paymentFilter || searchQuery) && (
          <button
            onClick={clearFilters}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-semibold">{error}</p>
        </div>
      )}

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-card border rounded-lg">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {t("order.admin.dashboard.noOrders")}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery || statusFilter || paymentFilter
              ? "Try adjusting your filters"
              : "No orders have been placed yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/dashboard/orders/${order.id}`)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  {/* Order Number & Status */}
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">
                      {order.order_number}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getOrderStatusColor(order.status || "pending")}`}
                    >
                      {t(`order.status.${order.status || "pending"}`)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.payment_status)}`}
                    >
                      {t(
                        `order.paymentStatus.${order.payment_status || "unpaid"}`,
                      )}
                    </span>
                  </div>

                  {/* Customer & Date Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{order.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(order.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* View Button */}
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold">
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border border-input rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                    page === pageNum
                      ? "bg-primary text-primary-foreground"
                      : "border border-input hover:bg-accent"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 border border-input rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Page Info */}
      <p className="text-center text-sm text-muted-foreground mt-4">
        {t("order.admin.dashboard.page", { current: page, total: totalPages })}
      </p>
    </div>
  );
}

export default DashboardPage;
