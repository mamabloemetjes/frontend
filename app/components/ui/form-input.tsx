"use client";

import * as React from "react";
import { Input } from "./input";
import { Label } from "./label";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  containerClassName?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      required,
      containerClassName,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    const hasError = !!error;
    const t = useTranslations();

    return (
      <div className={cn("space-y-2", containerClassName)}>
        <Label
          htmlFor={inputId}
          className={cn(
            "block text-sm font-medium",
            hasError && "text-red-500",
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Input
          ref={ref}
          id={inputId}
          className={cn(
            hasError &&
              "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500",
            className,
          )}
          aria-invalid={hasError}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-red-500 font-medium animate-in fade-in-50 duration-200"
          >
            {t(error)}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-sm text-muted-foreground">
            {t(helperText)}
          </p>
        )}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";

export { FormInput };
