"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  MapPin,
  Globe,
  ExternalLink,
  Layers,
  Box,
  Navigation,
  ArrowRight,
  Check,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/lib/i18n/locale-context";
import * as messages from "@/paraglide/messages";
import { submitContactForm } from "@/app/actions/contact-form.action";
import {
  contactFormSchema,
  type ContactFormInput,
} from "@/schemas/contact-form.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Map coordinates for 430 Nathan Road, Yau Ma Tei
const lat = 22.30973871039109;
const lon = 114.17166002409992;
const displayLat = lat.toFixed(2);
const displayLon = lon.toFixed(2);
// Expand the bounding box so the embed shows a broader, almost continental view around Hong Kong
const mapViewDelta = 50;
const bbox = `${Math.max(-180, lon - mapViewDelta)}%2C${Math.max(-85, lat - mapViewDelta)}%2C${Math.min(180, lon + mapViewDelta)}%2C${Math.min(85, lat + mapViewDelta)}`;
const googleMapsQuery = encodeURIComponent(
  "Hong Kong, 19/F, Nathan Commercial Building, 430 Nathan Road, Yau Ma Tei, Kowloon"
);
const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${googleMapsQuery}`;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [titleAnimating, setTitleAnimating] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const searchParams = useSearchParams();
  const serviceOptions = [
    {
      value: "BIM Consultancy",
      label: messages.contact_service_option_bim_consultancy(),
    },
    {
      value: "AI Solutions",
      label: messages.contact_service_option_ai_solutions(),
    },
    {
      value: "Software Training",
      label: messages.contact_service_option_training(),
    },
    {
      value: "3D Modeling",
      label: messages.contact_service_option_modeling(),
    },
    {
      value: "jarvis-desktop",
      label: messages.contact_service_option_jarvis_desktop(),
    },
    {
      value: "jarvis-cloud",
      label: messages.contact_service_option_jarvis_cloud(),
    },
    {
      value: "support",
      label: messages.contact_service_option_support(),
    },
    {
      value: "other",
      label: messages.contact_service_option_other(),
    },
  ];
  const companyTypeOptions = [
    {
      value: "Architectural",
      label: messages.contact_company_type_architectural(),
    },
    {
      value: "Engineering",
      label: messages.contact_company_type_engineering(),
    },
    {
      value: "Contractor",
      label: messages.contact_company_type_contractor(),
    },
    {
      value: "Developer",
      label: messages.contact_company_type_developer(),
    },
    {
      value: "Government",
      label: messages.contact_company_type_government(),
    },
    {
      value: "IT",
      label: messages.contact_company_type_it(),
    },
    {
      value: "Other",
      label: messages.contact_company_type_other(),
    },
  ];

  useEffect(() => {
    setMounted(true);
    // 滑入动画完成后立即开始上色 (delay 300ms + duration 1000ms = 1300ms)
    const timer = setTimeout(() => {
      setTitleAnimating(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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
      service: "",
      marketingConsent: false,
    },
  });

  const selectedService = watch("service");
  const selectedCompanyType = watch("companyType");
  const marketingConsent = watch("marketingConsent");
  const prefillEmail =
    searchParams.get("email") ?? searchParams.get("prefillEmail");

  useEffect(() => {
    if (prefillEmail) {
      setValue("email", prefillEmail);
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [prefillEmail, setValue]);

  const onSubmit = async (data: ContactFormInput) => {
    setIsSubmitting(true);
    try {
      const result = await submitContactForm(data, locale);
      if (result.success) {
        setIsSuccess(true);
        reset();
      } else {
        toast.error(messages.contact_error_title(), {
          description: result.error,
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(messages.contact_error_title(), {
        description: messages.contact_error_generic(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`contact-page contact-transition-base ${mounted ? "opacity-100" : "opacity-0"}`}
      style={{ transitionDuration: "var(--contact-motion-slow)" }}
    >
      {/* Background Layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Technical Grid */}
        <div className="absolute inset-0 contact-grid-bg" />

        {/* CAD Corner Markers */}
        <div className="contact-cad-corner contact-cad-corner--tl" />
        <div className="contact-cad-corner contact-cad-corner--tr" />
        <div className="contact-cad-corner contact-cad-corner--bl" />
        <div className="contact-cad-corner contact-cad-corner--br" />

        {/* Coordinate Labels */}
        <div className="absolute top-1/2 left-10 contact-label-sm text-[--contact-muted] hidden lg:block -rotate-90 origin-left">
          COORD: {displayLat}° N
        </div>
        <div className="absolute bottom-10 left-1/2 contact-label-sm text-[--contact-muted] hidden lg:block">
          COORD: {displayLon}° E
        </div>

        {/* Floating BIM Objects */}
        <div className="absolute top-[10%] left-[15%] text-gray-200/50 animate-pulse">
          <Box size={120} strokeWidth={0.5} />
        </div>
        <div className="absolute bottom-[20%] right-[10%] text-gray-200/50 animate-bounce duration-[3000ms]">
          <Layers size={96} strokeWidth={0.5} />
        </div>

      </div>

      {/* Main Content */}
      <div className="relative z-10 contact-container contact-section-padding contact-hero-padding">
        {/* Header Section */}
        <div
          className="relative max-w-[1100px]"
          style={{
            marginBottom: "var(--contact-stack-lg)",
            paddingLeft: "var(--contact-container-padding)",
          }}
        >
          <div className="contact-title-border" aria-hidden="true" />
          <div className="overflow-hidden">
            <h1
            className={`contact-hero-title transform ${mounted ? "translate-y-0" : "translate-y-[150%]"} ${titleAnimating ? "is-animating" : ""}`}
            style={{
              transitionDuration: "var(--contact-motion-slow)",
              transitionTimingFunction: "var(--contact-motion-ease)",
              transitionDelay: "var(--contact-motion-delay-hero)",
            }}
          >
              {messages.contact_hero_title_prefix()}
              <br className="md:hidden" />
              <span className="font-semibold">
                {messages.contact_hero_title_highlight()}
              </span>
            </h1>
          </div>

          <div
            className="max-w-3xl overflow-hidden"
            style={{ marginTop: "var(--contact-stack-md)" }}
          >
            <p
              className={`contact-hero-subtitle text-[--contact-muted] transform ${mounted ? "translate-y-0" : "translate-y-[150%]"}`}
              style={{
                transitionDuration: "var(--contact-motion-slow)",
                transitionTimingFunction: "var(--contact-motion-ease)",
                transitionDelay: "var(--contact-motion-delay-sub)",
              }}
            >
              <>
                {messages.contact_hero_body_prefix()}{" "}
                <span className="font-medium text-[--contact-text-light]">
                  {messages.contact_hero_body_ai()}
                </span>{" "}
                {messages.contact_hero_body_connector()}{" "}
                <span className="font-medium text-[--contact-text-light]">
                  {messages.contact_hero_body_bim()}
                </span>
                {messages.contact_hero_body_suffix()}
              </>
            </p>
          </div>
        </div>

        <div className="contact-layout-grid items-start">
          {/* Left Column: Contact Info & Map */}
          <div
            className={`lg:col-span-4 contact-stack-lg transform contact-transition-base ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            style={{ transitionDuration: "var(--contact-motion-slow)", transitionDelay: "var(--contact-motion-delay-sub)" }}
          >
            {/* Info Block 1: Address */}
            <div className="group cursor-default relative">
              <div className="contact-vertical-line" />

              <div className="flex items-center contact-gap-sm contact-stack-sm text-[--contact-muted] group-hover:text-[--contact-accent] contact-transition-base">
                <MapPin size={18} className="contact-icon" />
                <span className="contact-info-text">
                  {messages.contact_label_address()}
                </span>
              </div>
              <div className="pl-2 contact-stack-sm">
                <h3
                  className="contact-location-title"
                  style={{ marginBottom: "var(--contact-stack-sm)" }}
                >
                  {messages.contact_address_city()}
                </h3>
                <p className="contact-body text-[--contact-muted] leading-relaxed font-light">
                  <>
                    {messages.contact_address_line1()}
                    <br />
                    {messages.contact_address_line2()}
                    <br />
                    {messages.contact_address_line3()}
                  </>
                </p>
              </div>
            </div>

            {/* Info Block 2: Contact */}
            <div className="group cursor-default relative">
              <div className="contact-vertical-line" />

              <div className="flex items-center contact-gap-sm contact-stack-sm text-[--contact-muted] group-hover:text-[--contact-accent] contact-transition-base">
                <Globe size={18} className="contact-icon" />
                <span className="contact-info-text">
                  {messages.contact_label_digital_link()}
                </span>
              </div>
              <div className="pl-2 contact-stack-sm">
                <div className="contact-stack-sm">
                  <p
                    className="contact-label text-[--contact-muted]"
                    style={{ marginBottom: "var(--contact-stack-sm)" }}
                  >
                    {messages.contact_label_direct_line()}
                  </p>
                  <a
                    href="tel:+85223828380"
                  className="contact-emphasis text-[--contact-text] hover:text-[--contact-accent] contact-transition-base cursor-pointer"
                >
                    +852 2382 8380
                  </a>
                </div>
                <div className="contact-stack-sm">
                  <p
                    className="contact-label text-[--contact-muted]"
                    style={{ marginBottom: "var(--contact-stack-sm)" }}
                  >
                    {messages.contact_label_inquiry()}
                  </p>
                  <a
                    href="mailto:solution@isbim.com.hk"
                  className="contact-emphasis text-[--contact-text] hover:text-[--contact-accent] contact-transition-base contact-accent-underline"
                >
                    solution@isbim.com.hk
                  </a>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="relative" style={{ paddingTop: "var(--contact-stack-sm)" }}>
              {/* Decorative corners for map */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-[--contact-muted] z-10" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-[--contact-muted] z-10" />

              <div className="contact-map-container group contact-radius-md contact-shadow-soft">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`}
                  className="opacity-90 hover:opacity-100 transition-all"
                  style={{ transitionDuration: "var(--contact-motion-slow)" }}
                  title={messages.contact_map_title()}
                />

                {/* Overlay noise texture */}
                <div className="absolute inset-0 pointer-events-none bg-[url('/images/noise.svg')] opacity-10" />

                {/* Overlay Button */}
                <a
                  href={googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-map-btn translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-20 contact-radius-pill contact-transition-base"
                >
                  <ExternalLink size={12} />
                  {messages.contact_map_cta()}
                </a>
              </div>

              <div
                className="flex justify-between items-center"
                style={{ marginTop: "var(--contact-stack-sm)", paddingInline: "0.25rem" }}
              >
                <p className="contact-label-sm text-[--contact-muted]">
                  LAT: {displayLat} | LON: {displayLon}
                </p>
                <div className="flex contact-gap-sm items-center">
                  <Navigation size={12} className="text-[--contact-muted]" />
                  <span className="contact-label-sm text-[--contact-muted]">
                    {messages.contact_map_tagline()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Right Column: Form Section */}
          <div
            className={`lg:col-span-8 transform contact-transition-base ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            style={{ transitionDuration: "var(--contact-motion-slow)", transitionDelay: "var(--contact-motion-delay-sub)" }}
          >
            <div
              id="contact-form"
              ref={formRef}
              className="contact-panel contact-radius-md contact-panel-padding hover:shadow-2xl contact-transition-base relative overflow-hidden group"
              >
              {/* Structural Border */}
              <div className="contact-structural-border" />

              {/* Architectural Hatching Patterns */}
              <div className="contact-hatching contact-hatching--tr" />
              <div className="contact-hatching contact-hatching--bl" />

              {isSuccess ? (
                <SuccessState onReset={() => setIsSuccess(false)} />
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                    className="contact-stack-md relative z-10 pl-2 md:pl-6"
                >
                  {/* Form Header */}
                  <div className="contact-section-divider">
                    <h2 className="text-4xl font-light text-[--contact-text]">
                      {messages.contact_form_heading()}
                    </h2>
                  <p className="text-base text-[--contact-muted] font-light" style={{ marginTop: "var(--contact-stack-sm)" }}>
                      {messages.contact_form_subheading()}
                    </p>
                  </div>

                  {/* Section 1: Identity */}
                  <div className="contact-stack-md">
                    <div className="contact-form-grid text-base md:text-lg">
                      <FormInput
                        label={messages.contact_label_first_name()}
                        required
                        error={errors.firstName?.message}
                        {...register("firstName")}
                        placeholder={messages.contact_placeholder_first_name()}
                      />
                      <FormInput
                        label={messages.contact_label_last_name()}
                        required
                        error={errors.lastName?.message}
                        {...register("lastName")}
                        placeholder={messages.contact_placeholder_last_name()}
                      />
                    </div>
                  </div>

                  {/* Section 2: Organization */}
                  <div className="contact-stack-md">
                    <div className="contact-form-grid text-base md:text-lg">
                      <FormInput
                        label={messages.contact_label_company_name()}
                        error={errors.companyName?.message}
                        {...register("companyName")}
                        placeholder={messages.contact_placeholder_company_name()}
                        accentColor="alt"
                      />
                      <FormSelect
                        label={messages.contact_label_company_type()}
                        value={selectedCompanyType || ""}
                        onChange={(value) =>
                          setValue(
                            "companyType",
                            value as ContactFormInput["companyType"],
                            { shouldValidate: true, shouldDirty: true }
                          )
                        }
                        options={companyTypeOptions}
                        placeholder={messages.contact_placeholder_company_type()}
                        accentColor="alt"
                      />
                    </div>
                  </div>

                  {/* Section 3: Context */}
                  <div className="contact-stack-md">
                      <div className="contact-form-grid text-base md:text-lg">
                      <FormInput
                        label={messages.contact_label_job_title()}
                        error={errors.jobTitle?.message}
                        {...register("jobTitle")}
                        placeholder={messages.contact_placeholder_job_title()}
                        accentColor="alt"
                      />
                      <FormSelect
                        label={messages.contact_label_service()}
                        value={selectedService || ""}
                        onChange={(value) =>
                          setValue("service", value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        options={serviceOptions}
                        placeholder={messages.contact_placeholder_service()}
                        required
                        error={errors.service?.message}
                        accentColor="alt"
                      />
                    </div>
                  </div>

                  {/* Section 4: Contact & Action */}
                  <div className="contact-stack-md">
                      <div className="contact-form-grid text-base md:text-lg">
                      <FormInput
                        label={messages.contact_label_email()}
                        type="email"
                        required
                        error={errors.email?.message}
                        {...register("email")}
                        placeholder="email@example.com"
                      />
                      <FormInput
                        label={messages.contact_label_phone()}
                        type="tel"
                        error={errors.phoneNumber?.message}
                        {...register("phoneNumber")}
                        placeholder={messages.contact_placeholder_phone()}
                      />
                    </div>

                    {/* Marketing Consent */}
                    <div className="relative z-20" style={{ paddingTop: "var(--contact-stack-sm)" }}>
                      <button
                        type="button"
                        className="flex items-start contact-gap-sm cursor-pointer group/checkbox text-left"
                        onClick={() =>
                          setValue("marketingConsent", !marketingConsent, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                      >
                        <div className="relative flex-shrink-0" style={{ marginTop: "var(--contact-stack-xs)" }}>
                          <div
                            className="w-5 h-5 border rounded-sm transition-all flex items-center justify-center"
                            style={{
                              backgroundColor: marketingConsent ? "#111827" : "#ffffff",
                              borderColor: marketingConsent ? "#111827" : "#d1d5db",
                            }}
                          >
                            {marketingConsent && (
                              <Check size={12} className="text-white" />
                            )}
                          </div>
                        </div>
                        <span className="text-lg text-[--contact-text] font-normal group-hover/checkbox:text-[--contact-accent] transition-colors leading-relaxed select-none">
                          <>
                            {messages.contact_marketing_consent()}
                            <br />
                            <span className="text-[--contact-muted] text-base font-light tracking-wide">
                              {messages.contact_marketing_privacy()}
                            </span>
                          </>
                        </span>
                      </button>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end" style={{ paddingTop: "var(--contact-stack-md)" }}>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group/btn contact-btn-primary text-[11px] uppercase cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        style={{ backgroundColor: "var(--contact-text, #111827)" }}
                      >
                        <span className="relative z-10 flex items-center gap-3 group-hover/btn:tracking-wider transition-all"
                          style={{ transitionDuration: "var(--contact-motion-base)", transitionTimingFunction: "var(--contact-motion-ease)" }}>
                          {isSubmitting ? (
                            <span className="contact-label text-white animate-pulse">
                              {messages.contact_submit_loading()}
                            </span>
                          ) : (
                            <>
                              <span className="contact-button-label text-white">
                                {messages.contact_submit_label()}
                              </span>
                              <ArrowRight
                                size={16}
                                className="transition-transform duration-300 group-hover/btn:translate-x-1"
                              />
                            </>
                          )}
                        </span>
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 transform scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform"
                          style={{
                            backgroundColor: "var(--contact-accent, #0ea5e9)",
                            transitionDuration: "var(--contact-motion-slow)",
                            transitionTimingFunction: "var(--contact-motion-ease-soft)",
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Success State Component
function SuccessState({
  onReset,
}: {
  onReset: () => void;
}) {
  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-700">
      <div className="relative">
        <div className="absolute inset-0 bg-[--contact-accent] blur-xl opacity-30 animate-pulse" />
        <div
          className="relative w-24 h-24 contact-gradient-bg rounded-full flex items-center justify-center shadow-lg"
          style={{ marginBottom: "var(--contact-stack-lg)" }}
        >
          <Check className="w-10 h-10 text-white" />
        </div>
      </div>
      <h3
        className="text-4xl font-light text-[--contact-text]"
        style={{ marginBottom: "var(--contact-stack-sm)" }}
      >
        {messages.contact_success_title()}
      </h3>
      <p className="text-[--contact-muted] max-w-md text-lg font-light leading-relaxed">
        {messages.contact_success_message()}
      </p>
      <button
        onClick={onReset}
        className="contact-radius-md border border-[--contact-muted-lighter] text-[--contact-muted] hover:border-[--contact-text] hover:text-[--contact-text] hover:bg-[--contact-border-light] contact-transition-base uppercase text-xs font-bold tracking-widest cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
        style={{
          marginTop: "var(--contact-stack-lg)",
          paddingInline: "var(--contact-btn-secondary-x)",
          paddingBlock: "var(--contact-btn-secondary-y)",
        }}
      >
        {messages.contact_reset_button()}
      </button>
    </div>
  );
}

// Form Input Component
// Form Input Component
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  accentColor?: "primary" | "alt";
}

const FormInput = ({
  label,
  error,
  required,
  accentColor = "primary",
  ...props
}: FormInputProps) => {
  const focusColor =
    accentColor === "alt"
      ? "focus:border-[--contact-accent-alt]"
      : "focus:border-[--contact-accent]";
  const labelFocusColor =
    accentColor === "alt"
      ? "group-focus-within:text-[--contact-accent-alt]"
      : "group-focus-within:text-[--contact-accent]";

  return (
    <div className="group relative">
      <label
        className={`contact-label text-xs md:text-sm ${labelFocusColor}`}
      >
        {label}
        {required && " *"}
      </label>
      <input
        className={`contact-input text-lg md:text-xl ${focusColor}`}
        {...props}
      />
      <div
        className={`absolute bottom-0 left-0 w-0 group-focus-within:w-full transition-all ${accentColor === "alt" ? "bg-[--contact-accent-alt]" : "bg-[--contact-accent]"}`}
        style={{
          height: "var(--contact-underline-height)",
          transitionDuration: "var(--contact-underline-duration)",
          transitionTimingFunction: "var(--contact-motion-ease)",
        }}
      />
      {error && (
        <p className="text-red-500 text-base mt-1">{error}</p>
      )}
    </div>
  );
};

// Form Select Component
interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  required?: boolean;
  error?: string;
  accentColor?: "primary" | "alt";
}

const FormSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
        accentColor = "primary",
}: FormSelectProps) => {
  const focusColor =
    accentColor === "alt"
      ? "focus:border-[--contact-accent-alt]"
      : "focus:border-[--contact-accent]";
  const labelFocusColor =
    accentColor === "alt"
      ? "group-focus-within:text-[--contact-accent-alt]"
      : "group-focus-within:text-[--contact-accent]";
  const hoverIconColor =
    accentColor === "alt"
      ? "group-hover:text-[--contact-accent-alt]"
      : "group-hover:text-[--contact-accent]";

  return (
    <div className="group relative">
      <label
        className={`contact-label text-xs md:text-sm ${labelFocusColor}`}
      >
        {label}
        {required && " *"}
      </label>
          <Select
            value={value || ""}
            onValueChange={(val) =>
              onChange(val)
            }
          >
            <SelectTrigger
              className={cn(
                "contact-select w-full justify-between items-center text-xl leading-tight px-0 rounded-none border-0 border-b bg-transparent h-auto min-h-[50px]",
            "transition-all focus-visible:ring-0 focus-visible:ring-offset-0",
            focusColor,
            hoverIconColor,
            "[&_svg]:transition-transform [&_[data-slot=select-icon]]:transition-transform data-[state=open]:[&_svg]:-rotate-180",
            "data-[state=open]:border-b data-[state=open]:border-[--contact-accent]"
              )}
              style={{
                paddingBlock: "var(--contact-input-padding-y)",
                transitionDuration: "var(--contact-motion-base)",
                transitionTimingFunction: "var(--contact-motion-ease)",
              }}
            >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          side="bottom"
          align="start"
          position="popper"
          sideOffset={6}
          avoidCollisions={false}
          unconstrained
          className="contact-select-content"
        >
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="contact-select-item"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-red-500 text-base mt-1">{error}</p>
      )}
    </div>
  );
};
