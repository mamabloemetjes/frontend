"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();
  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-2 group-[.toaster]:border-foreground group-[.toaster]:shadow-lg font-medium",
          description: "group-[.toast]:text-muted-foreground font-medium",
          actionButton:
            "group-[.toast]:bg-pastel-peach group-[.toast]:text-foreground group-[.toast]:font-bold group-[.toast]:border-2 group-[.toast]:border-foreground",
          cancelButton:
            "group-[.toast]:bg-transparent group-[.toast]:text-foreground group-[.toast]:border-2 group-[.toast]:border-foreground group-[.toast]:font-bold hover:group-[.toast]:bg-muted/50",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-5 text-pastel-sage" />,
        info: <InfoIcon className="size-5 text-pastel-mint" />,
        warning: <TriangleAlertIcon className="size-5 text-pastel-peach" />,
        error: <OctagonXIcon className="size-5 text-pastel-rose" />,
        loading: (
          <Loader2Icon className="size-5 text-pastel-lavender animate-spin" />
        ),
      }}
      {...props}
    />
  );
};

export { Toaster };
