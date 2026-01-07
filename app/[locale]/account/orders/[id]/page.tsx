"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  api,
  type OrderDetails,
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
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AccountOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const orderId = params.id as string;

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.orders.getMyOrderById(orderId);

        if (response.success) {
          setOrderDetails(response.data);
        } else {
          setError(response.message);
        }
      } catch (err: unknown) {
        console.error("Failed to fetch order details:", err);
        const error = err as {
          response?: { status?: number };
          message?: string;
        };
        if (error.response?.status === 401 || error.response?.status === 403) {
          router.push("/login?redirect=/account");
        } else {
          setError(error.message || t("account.orderDetails.error"));
        }
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, router, t]);

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
            {t("account.orderDetails.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LanguageAwareLink href="/account">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("account.orderDetails.backToAccount")}
          </Button>
        </LanguageAwareLink>

        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-6 text-center">
          <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
            {t("account.orderDetails.error")}
          </p>
          <p className="text-red-600 dark:text-red-400 text-sm">
            {error || t("account.orderDetails.notFound")}
          </p>
        </div>
      </div>
    );
  }

  const { order, order_lines, address, total } = orderDetails;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <LanguageAwareLink href="/account">
        <Button variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("account.orderDetails.backToAccount")}
        </Button>
      </LanguageAwareLink>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {t("account.orderDetails.title")} {order.order_number}
          </h1>
          <p className="text-muted-foreground">
            {t("account.orderDetails.placedOn")} {formatDate(order.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${getOrderStatusColor(order.status || "pending")}`}
          >
            {t(`order.status.${order.status || "pending"}`)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                {t("account.orderDetails.items")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order_lines.map((line) => (
                  <div
                    key={line.id}
                    className="flex items-start gap-4 p-4 bg-muted rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">
                        {line.product_name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          {t("account.orderDetails.quantity")}: {line.quantity}
                        </span>
                        <span className="text-muted-foreground">
                          {formatOrderTotal(line.unit_price)}{" "}
                          {t("account.orderDetails.each")}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {formatOrderTotal(line.line_total)}
                      </p>
                      {line.unit_discount > 0 && (
                        <p className="text-xs text-green-600 dark:text-green-400">
                          {t("account.orderDetails.discount")}:{" "}
                          {formatOrderTotal(line.unit_discount * line.quantity)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    {t("account.orderDetails.total")}
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {formatOrderTotal(total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Note */}
          {order.note && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t("account.orderDetails.customerNote")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">{order.note}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                {t("account.orderDetails.payment")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">
                  {t("account.orderDetails.paymentStatus")}
                </label>
                <div className="mt-1">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.payment_status)}`}
                  >
                    {order.payment_status === "paid"
                      ? t("account.orderDetails.paid")
                      : t("account.orderDetails.unpaid")}
                  </span>
                </div>
              </div>

              {order.payment_link && order.payment_status === "unpaid" && (
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    {t("account.orderDetails.paymentLink")}
                  </label>
                  <a
                    href={order.payment_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
                  >
                    {t("account.orderDetails.payNow")}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {t("account.orderDetails.customerInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("account.orderDetails.name")}
                  </p>
                  <p className="font-medium">{order.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("account.orderDetails.email")}
                  </p>
                  <p className="font-medium">{order.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("account.orderDetails.phone")}
                  </p>
                  <p className="font-medium">{order.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {t("account.orderDetails.deliveryAddress")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p className="font-medium">
                  {address.street} {address.house_no}
                </p>
                <p>
                  {address.postal_code} {address.city}
                </p>
                <p className="text-muted-foreground">{address.country}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {t("account.orderDetails.timeline")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("account.orderDetails.orderPlaced")}
                </p>
                <p className="font-medium">{formatDate(order.created_at)}</p>
              </div>
              {order.updated_at !== order.created_at && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("account.orderDetails.lastUpdated")}
                  </p>
                  <p className="font-medium">{formatDate(order.updated_at)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
