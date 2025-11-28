"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useLocale } from "@/lib/i18n/locale-context";
import { submitContactForm } from "@/app/actions/contact-form.action";
import {
  contactFormSchema,
  type ContactFormInput,
} from "@/schemas/contact-form.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const serviceOptions = [
  { value: "jarvis-desktop", label: "JARVIS Desktop" },
  { value: "jarvis-cloud", label: "JARVIS Cloud" },
  { value: "jarvis-mobile", label: "JARVIS Mobile" },
  { value: "jarvis-viewer", label: "JARVIS Viewer" },
  { value: "jarvis-mesh", label: "JARVIS Mesh" },
  { value: "consulting", label: "Consulting Services" },
  { value: "training", label: "Training" },
  { value: "support", label: "Technical Support" },
  { value: "other", label: "Other" },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const locale = useLocale();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      marketingConsent: false,
    },
  });

  const selectedService = watch("service");
  const marketingConsent = watch("marketingConsent");

  const onSubmit = async (data: ContactFormInput) => {
    setIsSubmitting(true);
    try {
      const result = await submitContactForm(data, locale);
      if (result.success) {
        toast.success("Success", {
          description: result.message,
        });
        reset();
      } else {
        toast.error("Error", {
          description: result.error,
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Error", {
        description:
          locale === "zh"
            ? "發送失敗,請稍後再試。"
            : "Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[600px]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Contact Us - Test Page</h1>
          <p className="text-gray-600">
            Simple contact form to test Resend email functionality
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* First Name */}
          <div>
            <Label htmlFor="firstName">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              {...register("firstName")}
              placeholder="John"
              className="mt-1"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <Label htmlFor="lastName">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              {...register("lastName")}
              placeholder="Doe"
              className="mt-1"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="john.doe@example.com"
              className="mt-1"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="phoneNumber">Phone Number (optional)</Label>
            <Input
              id="phoneNumber"
              {...register("phoneNumber")}
              placeholder="+852 1234 5678"
              className="mt-1"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Company Name */}
          <div>
            <Label htmlFor="companyName">Company Name (optional)</Label>
            <Input
              id="companyName"
              {...register("companyName")}
              placeholder="Acme Inc."
              className="mt-1"
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.companyName.message}
              </p>
            )}
          </div>

          {/* Job Title */}
          <div>
            <Label htmlFor="jobTitle">Job Title (optional)</Label>
            <Input
              id="jobTitle"
              {...register("jobTitle")}
              placeholder="Project Manager"
              className="mt-1"
            />
            {errors.jobTitle && (
              <p className="text-red-500 text-sm mt-1">
                {errors.jobTitle.message}
              </p>
            )}
          </div>

          {/* Service */}
          <div>
            <Label htmlFor="service">
              What service are you looking for?{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedService}
              onValueChange={(value) => setValue("service", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {serviceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.service && (
              <p className="text-red-500 text-sm mt-1">
                {errors.service.message}
              </p>
            )}
          </div>

          {/* Marketing Consent */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="marketingConsent"
              checked={marketingConsent}
              onCheckedChange={(checked) =>
                setValue("marketingConsent", checked === true)
              }
            />
            <Label
              htmlFor="marketingConsent"
              className="text-sm font-normal leading-relaxed cursor-pointer"
            >
              Yes, I want to get emails from isBIM about products, promotions,
              events, and featured content at the email address above.
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? "Sending..." : "Submit"}
          </Button>
        </form>

        {/* Test Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-2">Test Information:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Internal notification will be sent to solution@isbim.com.hk</li>
            <li>• User confirmation email will be sent to your email address</li>
            <li>• Rate limit: 3 submissions per 5 minutes per IP</li>
            <li>• Check Resend dashboard for sent emails</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
