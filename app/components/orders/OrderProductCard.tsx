"use client";

import Image from "next/image";
import type { OrderLine } from "@/lib/api";
import { formatOrderTotal } from "@/lib/api";
import { getImageUrl } from "@/lib/image-url";

interface OrderProductCardProps {
  line: OrderLine;
  eachLabel?: string;
  discountLabel?: string;
  unitAmount?: number;
  showDiscount?: boolean;
}

export function OrderProductCard({
  line,
  eachLabel,
  discountLabel,
  unitAmount = line.unit_subtotal,
  showDiscount = false,
}: OrderProductCardProps) {
  const imageUrl = line.product_image_name
    ? getImageUrl({ name: line.product_image_name })
    : undefined;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={line.product_name}
          width={128}
          height={128}
          className="h-16 w-16 shrink-0 rounded-md border border-border object-cover"
        />
      ) : (
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border border-border bg-background text-xl"
          aria-hidden="true"
        >
          🌸
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold">{line.product_name}</h3>
        <p className="text-sm text-muted-foreground">
          SKU: {line.product_sku}
        </p>
        <p className="text-sm text-muted-foreground">
          {line.quantity} × {formatOrderTotal(unitAmount)}
          {eachLabel ? ` ${eachLabel}` : ""}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-bold">{formatOrderTotal(line.line_total)}</p>
        {showDiscount && line.unit_discount > 0 && discountLabel && (
          <p className="text-xs text-green-600 dark:text-green-400">
            {discountLabel}:{" "}
            {formatOrderTotal(line.unit_discount * line.quantity)}
          </p>
        )}
      </div>
    </div>
  );
}
