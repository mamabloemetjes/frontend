"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuthStatus } from "@/hooks/useAuth";
import { api, type Order, getOrderStatusColor } from "@/lib/api";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import {
  User,
  Package,
  Calendar,
  CreditCard,
  ChevronRight,
  ShoppingBag,
  Mail,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Tab = "profile" | "orders";

export default function AccountPage() {
  const t = useTranslations();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStatus();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/account");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <User className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">{t("account.title")}</h1>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === "profile"
                ? "border-primary font-bold text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{t("account.tabs.profile")}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === "orders"
                ? "border-primary font-bold text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>{t("account.tabs.orders")}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && <ProfileTab user={user} />}
      {activeTab === "orders" && <OrdersTab />}
    </div>
  );
}

function ProfileTab({
  user,
}: {
  user: { id: string; username: string; email: string; role: string };
}) {
  const t = useTranslations();

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {t("account.profile.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t("account.profile.username")}
            </label>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <User className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{user.username}</span>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t("account.profile.email")}
            </label>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{user.email}</span>
            </div>
          </div>

          {/* Role */}
          {user.role === "admin" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t("account.profile.role")}
              </label>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium capitalize">{user.role}</span>
                {user.role === "admin" && (
                  <span className="ml-auto px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                    {t("account.profile.adminBadge")}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Admin Dashboard Link */}
          {user.role === "admin" && (
            <div className="pt-4 border-t">
              <LanguageAwareLink href="/dashboard">
                <Button className="w-full">
                  {t("account.profile.goToDashboard")}
                </Button>
              </LanguageAwareLink>
            </div>
          )}

          {/* Info Note */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {t("account.profile.updateNote")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OrdersTab() {
  const t = useTranslations();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.orders.getMyOrders();
        if (response.success) {
          setOrders(response.data.orders);
        } else {
          setError(response.message);
        }
      } catch (err: unknown) {
        console.error("Failed to fetch orders:", err);
        setError(
          err instanceof Error ? err.message : t("account.orders.error"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [t]);

  const formatDate = (dateString: string): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("nl-NL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">{t("account.orders.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-6 text-center">
        <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
          {t("account.orders.error")}
        </p>
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-4">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">
          {t("account.orders.noOrders")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t("account.orders.noOrdersDescription")}
        </p>
        <LanguageAwareLink href="/products">
          <Button>{t("account.orders.startShopping")}</Button>
        </LanguageAwareLink>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {t("account.orders.totalOrders", { count: orders.length })}
        </p>
      </div>

      {orders.map((order) => (
        <Card
          key={order.id}
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push(`/account/orders/${order.id}`)}
        >
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold">
                    {t("account.orders.orderNumber")} {order.order_number}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getOrderStatusColor(order.status || "pending")}`}
                  >
                    {t(`order.status.${order.status || "pending"}`)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(order.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span
                      className={`font-semibold ${
                        order.payment_status === "paid"
                          ? "text-green-600 dark:text-green-400"
                          : "text-yellow-600 dark:text-yellow-400"
                      }`}
                    >
                      {order.payment_status === "paid"
                        ? t("account.orders.paid")
                        : t("account.orders.pendingPayment")}
                    </span>
                  </div>
                </div>

                {order.note && (
                  <p className="mt-3 text-sm text-muted-foreground italic">
                    {t("account.orders.note")}: {order.note}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  className="flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/account/orders/${order.id}`);
                  }}
                >
                  {t("account.orders.viewDetails")}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
