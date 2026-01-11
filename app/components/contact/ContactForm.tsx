"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { env } from "@/lib/env";
import {
  contactFormSchema,
  type ContactFormData,
} from "@/lib/validation/schemas";
import { showSuccess } from "@/lib/validation/utils";

const ContactForm = () => {
  const t = useTranslations();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
    defaultValues: {
      subject: "generalInquiry",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedSubject = watch("subject");
  const deadlineDate = watch("deadlineDate");

  const onSubmit = (data: ContactFormData) => {
    const to = env.shopOwnerEmail;

    const subject =
      data.subject === "generalInquiry"
        ? "General Inquiry"
        : "Custom Order Request";

    let body = `
Naam: ${data.name}
Email: ${data.email}
Onderwerp: ${subject}
Bericht:
${data.message}
`;

    if (data.subject === "customOrder" && data.deadlineDate) {
      body += `\nDeadline: ${format(data.deadlineDate, "PPP")}`;
    }

    const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;

    showSuccess(
      t("pages.contact.success"),
      t("pages.contact.successDescription"),
    );
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold">
          {t("pages.contact.title")}
        </CardTitle>
        <CardDescription className="text-base">
          {t("pages.contact.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <FormInput
            label={t("pages.contact.name")}
            type="text"
            placeholder={t("pages.contact.yourName")}
            error={errors.name?.message}
            required
            {...register("name")}
          />

          {/* Email Field */}
          <FormInput
            label={t("pages.contact.email")}
            type="email"
            placeholder={t("pages.contact.yourEmail")}
            error={errors.email?.message}
            required
            {...register("email")}
          />

          {/* Subject Field */}
          <div className="space-y-2">
            <Label
              htmlFor="subject"
              className={cn(
                "block text-sm font-medium",
                errors.subject && "text-red-500",
              )}
            >
              {t("pages.contact.subject")}
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={selectedSubject}
              onValueChange={(value) =>
                setValue("subject", value as "generalInquiry" | "customOrder", {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                id="subject"
                className={cn(
                  errors.subject && "border-red-500 focus-visible:ring-red-500",
                )}
              >
                <SelectValue placeholder={t("pages.contact.selectSubject")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="generalInquiry">
                  {t("pages.contact.generalInquiry")}
                </SelectItem>
                <SelectItem value="customOrder">
                  {t("pages.contact.customOrder")}
                </SelectItem>
                <SelectItem value="accountAction">
                  {t("pages.contact.accountAction")}
                </SelectItem>
                <SelectItem value="other">
                  {t("pages.contact.other")}
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.subject && (
              <p className="text-sm text-red-500 font-medium animate-in fade-in-50 duration-200">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Message Field */}
          <FormTextarea
            label={t("pages.contact.message")}
            rows={5}
            placeholder={t("pages.contact.yourMessage")}
            error={errors.message?.message}
            required
            className="resize-none"
            {...register("message")}
          />

          {/* Deadline Date Field - only show if subject is custom order */}
          {selectedSubject === "customOrder" && (
            <div className="space-y-2">
              <Label
                className={cn(
                  "block text-sm font-medium",
                  errors.deadlineDate && "text-red-500",
                )}
              >
                {t("pages.contact.deadlineDateQuestion")}
              </Label>
              <Label className="text-sm text-muted-foreground block max-w-md">
                {t("pages.contact.deadlineDateDescription")}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !deadlineDate && "text-muted-foreground",
                      errors.deadlineDate &&
                        "border-red-500 focus-visible:ring-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadlineDate ? (
                      format(deadlineDate, "PPP")
                    ) : (
                      <span>{t("pages.contact.pickDate")}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={deadlineDate}
                    onSelect={(date) =>
                      setValue("deadlineDate", date, {
                        shouldValidate: true,
                      })
                    }
                    disabled={(date) => date < new Date()}
                    className="p-4"
                    classNames={{
                      months: "flex flex-col gap-y-6",
                      month: "flex flex-col gap-y-4",
                      table: "w-full border-collapse space-y-1",
                      week: "flex w-full mt-2 first:mt-0",
                      weekday:
                        "text-muted-foreground w-9 font-normal text-[0.8rem]",
                      day: "h-9 w-9 text-center text-sm p-0 relative",
                      today: "bg-accent text-accent-foreground rounded-md",
                      selected: "bg-primary text-primary-foreground rounded-md",
                    }}
                  />
                </PopoverContent>
              </Popover>
              {errors.deadlineDate && (
                <p className="text-sm text-red-500 font-medium animate-in fade-in-50 duration-200">
                  {errors.deadlineDate.message}
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t("pages.contact.sending")
              : t("pages.contact.sendMessage")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
