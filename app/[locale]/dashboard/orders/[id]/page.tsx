"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  api,
  type OrderDetails,
  type OrderStatus,
  getOrderStatusColor,
  getPaymentStatusColor,
  formatOrderTotal,
} from "@/lib/api";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  Link as LinkIcon,
  Trash2,
} from "lucide-react";
import type { AxiosError } from "axios";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const orderId = params.id as string;

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentLink, setPaymentLink] = useState("");
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.admin.orders.getById(orderId);

      if (response.success) {
        setOrderDetails(response.data);
        setPaymentLink(response.data.order.payment_link || "");
      } else {
        setError(response.message);
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error("Failed to fetch order details:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        router.push("/login?redirect=/dashboard");
      } else {
        setError(error.message || t("order.admin.details.loadError"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAttachPaymentLink = async () => {
    if (!paymentLink.trim()) {
      alert(t("order.admin.details.paymentLinkRequired"));
      return;
    }

    setIsUpdatingPayment(true);
    try {
      const response = await api.admin.orders.attachPaymentLink(
        orderId,
        paymentLink,
      );

      if (response.success) {
        alert(t("order.admin.details.paymentLinkAttached"));
        fetchOrderDetails();
      } else {
        alert(response.message);
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error("Failed to attach payment link:", error);
      alert(
        error.response?.data?.message ||
          t("order.admin.details.paymentLinkError"),
      );
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!confirm(t("order.admin.details.confirmMarkPaid"))) {
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const response = await api.admin.orders.markAsPaid(orderId);

      if (response.success) {
        alert(t("order.admin.details.markedAsPaid"));
        fetchOrderDetails();
      } else {
        alert(response.message);
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error("Failed to mark as paid:", error);
      alert(
        error.response?.data?.message || t("order.admin.details.markPaidError"),
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    if (!confirm(t("order.admin.details.confirmStatusChange"))) {
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const response = await api.admin.orders.updateStatus(orderId, newStatus);

      if (response.success) {
        alert(t("order.admin.details.statusUpdated"));
        fetchOrderDetails();
      } else {
        alert(response.message);
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error("Failed to update status:", error);
      alert(
        error.response?.data?.message ||
          t("order.admin.details.statusUpdateError"),
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!confirm(t("order.admin.details.confirmDelete"))) {
      return;
    }

    try {
      const response = await api.admin.orders.delete(orderId);

      if (response.success) {
        alert(t("order.admin.details.orderDeleted"));
        router.push("/dashboard");
      } else {
        alert(response.message);
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error("Failed to delete order:", error);
      alert(
        error.response?.data?.message || t("order.admin.details.deleteError"),
      );
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("nl-NL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">
            {t("order.admin.details.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t("order.admin.details.error")}
          </h1>
          <p className="text-muted-foreground mb-8">{error}</p>
          <LanguageAwareLink
            href="/dashboard"
            className="inline-block text-primary hover:underline"
          >
            {t("order.admin.details.backToDashboard")}
          </LanguageAwareLink>
        </div>
      </div>
    );
  }

  const { order, order_lines, address, total } = orderDetails;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{order.order_number}</h1>
          <p className="text-sm text-muted-foreground">
            {t("order.admin.details.orderDetails")}
          </p>
        </div>
        <button
          onClick={handleDeleteOrder}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          {t("order.admin.details.delete")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">
                {t("order.admin.details.orderInformation")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t("order.admin.details.status")}
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getOrderStatusColor(order.status || "pending")}`}
                >
                  {t(`order.status.${order.status || "pending"}`)}
                </span>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t("order.admin.details.paymentStatus")}
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(order.payment_status)}`}
                >
                  {t(`order.paymentStatus.${order.payment_status || "unpaid"}`)}
                </span>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  {t("order.admin.details.orderDate")}
                </p>
                <p className="font-medium">{formatDate(order.created_at)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t("order.admin.details.total")}
                </p>
                <p className="text-2xl font-bold text-primary">
                  {formatOrderTotal(total)}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("order.admin.details.items")}
            </h2>
            <div className="space-y-3">
              {order_lines.map((line) => (
                <div
                  key={line.id}
                  className="flex justify-between items-start border-b pb-3 last:border-b-0"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{line.product_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      SKU: {line.product_sku}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {line.quantity} × {formatOrderTotal(line.unit_subtotal)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {formatOrderTotal(line.line_total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer & Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">
                  {t("order.admin.details.customer")}
                </h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("order.admin.details.name")}
                  </p>
                  <p className="font-medium">{order.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    <Mail className="inline w-4 h-4 mr-1" />
                    {t("order.admin.details.email")}
                  </p>
                  <p className="font-medium">{order.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    <Phone className="inline w-4 h-4 mr-1" />
                    {t("order.admin.details.phone")}
                  </p>
                  <p className="font-medium">{order.phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">
                  {t("order.admin.details.deliveryAddress")}
                </h2>
              </div>
              <div>
                <p className="font-medium">
                  {address.street} {address.house_no}
                </p>
                <p className="font-medium">
                  {address.postal_code} {address.city}
                </p>
                <p className="font-medium">{address.country}</p>
              </div>
            </div>
          </div>

          {/* Customer Note */}
          {order.note && (
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">
                  {t("order.admin.details.customerNote")}
                </h2>
              </div>
              <p className="text-muted-foreground">{order.note}</p>
            </div>
          )}
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {/* Update Status */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-4">
              {t("order.admin.details.updateStatus")}
            </h3>
            <select
              value={order.status}
              onChange={(e) =>
                handleUpdateStatus(e.target.value as OrderStatus)
              }
              disabled={isUpdatingStatus}
              className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-4"
            >
              <option value="pending">{t("order.status.pending")}</option>
              <option value="paid">{t("order.status.paid")}</option>
              <option value="processing">{t("order.status.processing")}</option>
              <option value="shipped">{t("order.status.shipped")}</option>
              <option value="delivered">{t("order.status.delivered")}</option>
              <option value="cancelled">{t("order.status.cancelled")}</option>
              <option value="refunded">{t("order.status.refunded")}</option>
            </select>
          </div>

          {/* Payment Actions */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-primary" />
              <h3 className="font-semibold">
                {t("order.admin.details.payment")}
              </h3>
            </div>

            {order.payment_status === "unpaid" && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    <LinkIcon className="inline w-4 h-4 mr-1" />
                    {t("order.admin.details.paymentLink")}
                  </label>
                  <input
                    type="url"
                    value={paymentLink}
                    onChange={(e) => setPaymentLink(e.target.value)}
                    placeholder="https://tikkie.me/..."
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleAttachPaymentLink}
                  disabled={isUpdatingPayment}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 mb-3"
                >
                  {isUpdatingPayment
                    ? t("order.admin.details.attaching")
                    : t("order.admin.details.attachPaymentLink")}
                </button>
                <button
                  onClick={handleMarkAsPaid}
                  disabled={isUpdatingStatus}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {t("order.admin.details.markAsPaid")}
                </button>
              </>
            )}

            {order.payment_status === "paid" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-semibold text-center">
                  ✓ {t("order.admin.details.paidStatus")}
                </p>
              </div>
            )}

            {order.payment_link && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  {t("order.admin.details.currentPaymentLink")}
                </p>
                <a
                  href={order.payment_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline break-all text-sm"
                >
                  {order.payment_link}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
