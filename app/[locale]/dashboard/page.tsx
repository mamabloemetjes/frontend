"use client";

import { useState } from "react";
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
  });

  const [images, setImages] = useState(
    (product?.images || []).map((img) => ({
      url: img.url,
      alt_text: img.alt_text || "",
      is_primary: img.is_primary,
    })),
  );

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
      subtotal:
        Math.round(parseFloat(formData.price) * 100) -
        Math.round(parseFloat(formData.discount) * 100) +
        tax,
      description: formData.description,
      is_active: formData.is_active,
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
      await updateProduct.mutateAsync({
        id: product.id,
        updates: productData,
      });
    } else {
      await createProduct.mutateAsync(productData);
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
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
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
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            required
          />
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
            onChange={(e) =>
              setFormData({ ...formData, discount: e.target.value })
            }
          />
        </div>

        <div>
          <Label className="block mb-1 font-semibold text-sm">Tax (€) *</Label>
          {/* Assuming a fixed tax rate of 21% for simplicity */}
          <Label className="block p-3 bg-muted rounded">
            €
            {formData.enableTax
              ? (parseFloat(formData.price || "0") * 0.21).toFixed(2)
              : "0.00"}
          </Label>
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
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          required
        />
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

export default DashboardPage;
