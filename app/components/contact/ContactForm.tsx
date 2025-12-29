"use client";

import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useTranslations } from "next-intl";

interface ContactFormState {
  name: string;
  email: string;
  subject: "generalInquiry" | "customOrder";
  message: string;
  deadlineDate?: Date | undefined;
}

const ContactForm = () => {
  const [form, setForm] = useState<ContactFormState>({
    name: "",
    email: "",
    subject: "generalInquiry",
    message: "",
    deadlineDate: undefined,
  });
  const t = useTranslations();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
  };

  const handleSubjectSelect = (subject: ContactFormState["subject"]) => {
    setForm((prevForm) => ({
      ...prevForm,
      subject,
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setForm((prevForm) => ({
      ...prevForm,
      deadlineDate: date || undefined,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const to = env.shopOwnerEmail;

    const subject =
      form.subject === "generalInquiry"
        ? "General Inquiry"
        : "Custom Order Request";

    let body = `
  Naam: ${form.name}
  Email: ${form.email}
  Onderwerp: ${subject}
  Bericht:
  ${form.message}
  `;

    if (form.subject === "customOrder" && form.deadlineDate) {
      body += `\nDeadline: ${format(form.deadlineDate, "PPP")}`;
    }

    const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">{t("pages.contact.name")}</Label>
            <Input
              type="text"
              id="name"
              placeholder={t("pages.contact.yourName")}
              value={form.name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">{t("pages.contact.email")}</Label>
            <Input
              type="email"
              id="email"
              placeholder={t("pages.contact.yourEmail")}
              value={form.email}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Subject Field */}
          <div className="space-y-2">
            <Label htmlFor="subject">{t("pages.contact.subject")}</Label>
            <Select
              value={form.subject}
              onValueChange={(value) =>
                handleSubjectSelect(value as ContactFormState["subject"])
              }
            >
              <SelectTrigger id="subject">
                <SelectValue placeholder={t("pages.contact.selectSubject")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="generalInquiry">
                  {t("pages.contact.generalInquiry")}
                </SelectItem>
                <SelectItem value="customOrder">
                  {t("pages.contact.customOrder")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message">{t("pages.contact.message")}</Label>
            <Textarea
              id="message"
              rows={5}
              placeholder={t("pages.contact.yourMessage")}
              value={form.message}
              onChange={handleInputChange}
              required
              className="resize-none"
            />
          </div>

          {/* Deadline Date Field - only show if subject is custom order */}
          {form.subject === "customOrder" && (
            <div className="space-y-2">
              <Label>{t("pages.contact.deadlineDateQuestion")}</Label>
              <Label className="text-sm text-muted-foreground block max-w-md">
                {t("pages.contact.deadlineDateDescription")}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.deadlineDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.deadlineDate ? (
                      format(form.deadlineDate, "PPP")
                    ) : (
                      <span>{t("pages.contact.pickDate")}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.deadlineDate} // Date | undefined
                    onSelect={(date) => handleDateSelect(date)}
                    autoFocus={true} // should be boolean
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
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg">
            {t("pages.contact.sendMessage")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
