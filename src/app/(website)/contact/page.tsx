"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  MapPin,
  Globe,
  ChevronDown,
  ExternalLink,
  Layers,
  Box,
  Navigation,
  ArrowRight,
  Check,
} from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
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

// Service options for the dropdown
const serviceOptions = [
  { value: "BIM Consultancy", label: "BIM Consultancy" },
  { value: "AI Solutions", label: "AI Construction Solutions" },
  { value: "Software Training", label: "Software Training" },
  { value: "3D Modeling", label: "3D Modeling & Coordination" },
  { value: "jarvis-desktop", label: "JARVIS Desktop" },
  { value: "jarvis-cloud", label: "JARVIS Cloud" },
  { value: "support", label: "Technical Support" },
  { value: "other", label: "Other" },
];

// Company type options
const companyTypeOptions = [
  { value: "Architectural", label: "Architectural Firm" },
  { value: "Engineering", label: "Engineering Consultant" },
  { value: "Contractor", label: "Main Contractor" },
  { value: "Developer", label: "Property Developer" },
  { value: "Government", label: "Government / Public Sector" },
];

// Map coordinates for 430 Nathan Road, Yau Ma Tei
const lat = 22.3117;
const lon = 114.1715;
const delta = 0.0025;
const bbox = `${lon - delta}%2C${lat - delta}%2C${lon + delta}%2C${lat + delta}`;
const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [titleAnimating, setTitleAnimating] = useState(false);
  const locale = useLocale();

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

  const onSubmit = async (data: ContactFormInput) => {
    setIsSubmitting(true);
    try {
      const result = await submitContactForm(data, locale);
      if (result.success) {
        setIsSuccess(true);
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
    <div
      className={`contact-page transition-opacity duration-1000 ${mounted ? "opacity-100" : "opacity-0"}`}
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
        <div className="absolute top-1/2 left-10 text-[--contact-muted-lighter] font-mono text-[10px] hidden lg:block tracking-widest -rotate-90 origin-left">
          COORD: 22.3117° N
        </div>
        <div className="absolute bottom-10 left-1/2 text-[--contact-muted-lighter] font-mono text-[10px] hidden lg:block tracking-widest">
          COORD: 114.1715° E
        </div>

        {/* Floating BIM Objects */}
        <div className="absolute top-[10%] left-[15%] text-gray-200/50 animate-pulse">
          <Box size={120} strokeWidth={0.5} />
        </div>
        <div className="absolute bottom-[20%] right-[10%] text-gray-200/50 animate-bounce duration-[3000ms]">
          <Layers size={96} strokeWidth={0.5} />
        </div>

        {/* Subtle radial accents to avoid tinting the whole canvas */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_12%,rgba(15,23,42,0.08),transparent_55%)]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_75%,rgba(14,165,233,0.08),transparent_50%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-[90%] 2xl:max-w-[1600px] mx-auto pt-32 md:pt-40 pb-24">
        {/* Header Section */}
        <div className="mb-24 relative pl-4 border-l-4 border-[--contact-accent]/30 max-w-[1100px]">
          <div className="overflow-hidden">
            <h1
              className={`text-5xl md:text-7xl xl:text-7xl 2xl:text-8xl font-light tracking-tighter leading-[0.9] transform transition-transform duration-1000 delay-300 contact-hero-title ${mounted ? "translate-y-0" : "translate-y-[150%]"} ${titleAnimating ? "is-animating" : ""}`}
            >
              {locale === "zh" ? "共建" : "Let's Build"}{" "}
              <br className="md:hidden" />
              {locale === "zh" ? "" : "the "}
              <span className="font-semibold">{locale === "zh" ? "未來" : "Future"}</span>
            </h1>
          </div>

          <div className="mt-8 max-w-3xl overflow-hidden">
            <p
              className={`text-lg md:text-xl text-[--contact-muted] font-light leading-relaxed transform transition-transform duration-1000 delay-500 ${mounted ? "translate-y-0" : "translate-y-[150%]"}`}
            >
              {locale === "zh" ? (
                <>
                  整合 <span className="font-medium text-[--contact-text-light]">AI</span> 和{" "}
                  <span className="font-medium text-[--contact-text-light]">BIM技術</span>
                  ，為您的工程專案注入數據驅動的數位靈魂。
                </>
              ) : (
                <>
                  Integrating{" "}
                  <span className="font-medium text-[--contact-text-light]">AI</span> and{" "}
                  <span className="font-medium text-[--contact-text-light]">
                    BIM technology
                  </span>{" "}
                  to infuse your engineering projects with a data-driven digital
                  soul.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          {/* Left Column: Contact Info & Map */}
          <div
            className={`lg:col-span-4 space-y-12 transform transition-all duration-1000 delay-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            {/* Info Block 1: Address */}
            <div className="group cursor-default relative">
              <div className="contact-vertical-line" />

              <div className="flex items-center gap-4 mb-3 text-[--contact-muted] group-hover:text-[--contact-accent] transition-colors duration-300">
                <MapPin size={18} />
                <span className="contact-info-text">
                  {locale === "zh" ? "位置資料" : "Address"}
                </span>
              </div>
              <div className="pl-2">
                <h3 className="text-xl font-medium text-[--contact-text] mb-2">
                  {locale === "zh" ? "香港總部" : "Hong Kong"}
                </h3>
                <p className="text-[--contact-muted] leading-relaxed font-light">
                  {locale === "zh" ? (
                    <>
                      九龍油麻地
                      <br />
                      彌敦道430號
                      <br />
                      彌敦商業大廈19樓
                    </>
                  ) : (
                    <>
                      19/F, Nathan Commercial Building,
                      <br />
                      430 Nathan Road,
                      <br />
                      Yau Ma Tei, Kowloon
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Info Block 2: Contact */}
            <div className="group cursor-default relative">
              <div className="contact-vertical-line" />

              <div className="flex items-center gap-4 mb-3 text-[--contact-muted] group-hover:text-[--contact-accent] transition-colors duration-300">
                <Globe size={18} />
                <span className="contact-info-text">
                  {locale === "zh" ? "數位連結" : "Digital Link"}
                </span>
              </div>
              <div className="pl-2 space-y-4">
                <div>
                  <p className="text-xs font-bold text-[--contact-muted] uppercase mb-1 tracking-wider">
                    {locale === "zh" ? "直線電話" : "Direct Line"}
                  </p>
                  <a
                    href="tel:+85223828380"
                    className="text-xl font-medium text-[--contact-text] font-mono tracking-tight hover:text-[--contact-accent] transition-colors cursor-pointer"
                  >
                    +852 2382 8380
                  </a>
                </div>
                <div>
                  <p className="text-xs font-bold text-[--contact-muted] uppercase mb-1 tracking-wider">
                    {locale === "zh" ? "查詢郵箱" : "Inquiry Channel"}
                  </p>
                  <a
                    href="mailto:solution@isbim.com.hk"
                    className="text-xl font-medium text-[--contact-text] hover:text-[--contact-accent] transition-colors contact-accent-underline"
                  >
                    solution@isbim.com.hk
                  </a>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="pt-4 relative">
              {/* Decorative corners for map */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-[--contact-muted] z-10" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-[--contact-muted] z-10" />

              <div className="contact-map-container group">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`}
                  className="opacity-90 hover:opacity-100 transition-all duration-700"
                  title="isBIM Office Location"
                />

                {/* Overlay noise texture */}
                <div className="absolute inset-0 pointer-events-none bg-[url('/images/noise.svg')] opacity-10" />

                {/* Overlay Button */}
                <a
                  href={googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-map-btn translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-20"
                >
                  <ExternalLink size={12} />
                  {locale === "zh" ? "在 Google Maps 查看" : "Locate on Google Maps"}
                </a>
              </div>

              <div className="flex justify-between items-center mt-2 px-1">
                <p className="text-[10px] font-mono text-[--contact-muted]">
                  LAT: {lat} | LON: {lon}
                </p>
                <div className="flex gap-2 items-center">
                  <Navigation size={12} className="text-[--contact-muted]" />
                  <span className="text-[10px] font-medium text-[--contact-muted] uppercase tracking-wider">
                    {locale === "zh" ? "策略位置" : "Strategic Location"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form Section */}
          <div
            className={`lg:col-span-8 transform transition-all duration-1000 delay-900 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="contact-panel rounded-sm p-8 md:p-12 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
              {/* Structural Border */}
              <div className="contact-structural-border" />

              {/* Architectural Hatching Patterns */}
              <div className="contact-hatching contact-hatching--tr" />
              <div className="contact-hatching contact-hatching--bl" />

              {isSuccess ? (
                <SuccessState
                  locale={locale}
                  onReset={() => setIsSuccess(false)}
                />
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-10 relative z-10 pl-6"
                >
                  {/* Form Header */}
                  <div className="contact-section-divider">
                    <h2 className="text-3xl font-light text-[--contact-text]">
                      {locale === "zh" ? "啟動專案" : "Initialize Project"}
                    </h2>
                    <p className="text-sm text-[--contact-muted] mt-2 font-light">
                      {locale === "zh"
                        ? "告訴我們您的願景"
                        : "Tell us about your vision"}
                    </p>
                  </div>

                  {/* Section 1: Identity */}
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      <FormInput
                        label={locale === "zh" ? "名字" : "First Name"}
                        required
                        error={errors.firstName?.message}
                        {...register("firstName")}
                        placeholder={locale === "zh" ? "大明" : "John"}
                      />
                      <FormInput
                        label={locale === "zh" ? "姓氏" : "Last Name"}
                        required
                        error={errors.lastName?.message}
                        {...register("lastName")}
                        placeholder={locale === "zh" ? "陳" : "Doe"}
                      />
                    </div>
                  </div>

                  {/* Section 2: Organization */}
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      <FormInput
                        label={locale === "zh" ? "公司名稱" : "Company Name"}
                        error={errors.companyName?.message}
                        {...register("companyName")}
                        placeholder={
                          locale === "zh"
                            ? "建築事務所有限公司"
                            : "Architecture Studio Ltd."
                        }
                        accentColor="alt"
                      />
                      <FormSelect
                        label={locale === "zh" ? "公司類型" : "Company Type"}
                        value={selectedCompanyType || ""}
                        onChange={(value) =>
                          setValue(
                            "companyType",
                            value as ContactFormInput["companyType"],
                            { shouldValidate: true, shouldDirty: true }
                          )
                        }
                        options={companyTypeOptions}
                        placeholder={
                          locale === "zh" ? "選擇結構" : "Select Structure"
                        }
                        accentColor="alt"
                      />
                    </div>
                  </div>

                  {/* Section 3: Context */}
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      <FormInput
                        label={locale === "zh" ? "職位" : "Job Title"}
                        error={errors.jobTitle?.message}
                        {...register("jobTitle")}
                        placeholder={
                          locale === "zh" ? "例如：BIM經理" : "e.g. BIM Manager"
                        }
                        accentColor="alt"
                      />
                      <FormSelect
                        label={
                          locale === "zh" ? "所需服務" : "Required Solution"
                        }
                        value={selectedService || ""}
                        onChange={(value) =>
                          setValue("service", value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        options={serviceOptions}
                        placeholder={
                          locale === "zh" ? "選擇模組" : "Select Module"
                        }
                        required
                        error={errors.service?.message}
                        accentColor="alt"
                      />
                    </div>
                  </div>

                  {/* Section 4: Contact & Action */}
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      <FormInput
                        label={locale === "zh" ? "電郵" : "Email"}
                        type="email"
                        required
                        error={errors.email?.message}
                        {...register("email")}
                        placeholder="email@example.com"
                      />
                      <FormInput
                        label={locale === "zh" ? "電話" : "Phone"}
                        type="tel"
                        error={errors.phoneNumber?.message}
                        {...register("phoneNumber")}
                        placeholder="+852"
                      />
                    </div>

                    {/* Marketing Consent */}
                    <div className="pt-4 relative z-20">
                      <button
                        type="button"
                        className="flex items-start gap-4 cursor-pointer group/checkbox text-left"
                        onClick={() =>
                          setValue("marketingConsent", !marketingConsent, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                      >
                        <div className="relative flex-shrink-0 mt-0.5">
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
                        <span className="text-xs text-[--contact-muted] font-light group-hover/checkbox:text-[--contact-muted-light] transition-colors leading-relaxed select-none">
                          {locale === "zh" ? (
                            <>
                              我同意接收來自 isBIM 的技術更新、產品資訊和活動通知。
                              <br />
                              <span className="text-[--contact-muted-lighter] text-[10px]">
                                數據處理符合隱私政策。
                              </span>
                            </>
                          ) : (
                            <>
                              I agree to receive technical updates, product
                              news, and events from isBIM.
                              <br />
                              <span className="text-[--contact-muted-lighter] text-[10px]">
                                Data processed in accordance with privacy
                                policy.
                              </span>
                            </>
                          )}
                        </span>
                      </button>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-8 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group/btn relative px-8 py-4 text-white font-medium text-sm tracking-wide uppercase overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed"
                        style={{ backgroundColor: "var(--contact-accent, #0ea5e9)" }}
                      >
                        <span className="relative z-10 flex items-center gap-3 group-hover/btn:tracking-wider transition-all duration-300">
                          {isSubmitting ? (
                            <span className="font-mono text-xs animate-pulse">
                              {locale === "zh"
                                ? "上傳資料中..."
                                : "UPLOADING_DATA..."}
                            </span>
                          ) : (
                            <>
                              <span className="text-xs font-bold tracking-widest uppercase">
                                {locale === "zh" ? "提交查詢" : "Submit Inquiry"}
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
                          className="absolute inset-0 transform scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-500"
                          style={{ backgroundColor: "var(--contact-text, #111827)" }}
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
  locale,
  onReset,
}: {
  locale: string;
  onReset: () => void;
}) {
  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-700">
      <div className="relative">
        <div className="absolute inset-0 bg-[--contact-accent] blur-xl opacity-30 animate-pulse" />
        <div className="relative w-24 h-24 contact-gradient-bg rounded-full flex items-center justify-center mb-8 shadow-lg">
          <Check className="w-10 h-10 text-white" />
        </div>
      </div>
      <h3 className="text-4xl font-light text-[--contact-text] mb-4">
        {locale === "zh" ? "傳輸完成" : "Transmission Received"}
      </h3>
      <p className="text-[--contact-muted] max-w-md text-lg font-light leading-relaxed">
        {locale === "zh"
          ? "我們的 AI 顧問正在分析您的請求。稍後將與您進行數位握手。"
          : "Our AI consultants are analyzing your request. Expect a digital handshake shortly."}
      </p>
      <button
        onClick={onReset}
        className="mt-12 px-8 py-3 rounded-none border border-[--contact-muted-lighter] text-[--contact-muted] hover:border-[--contact-text] hover:text-[--contact-text] hover:bg-[--contact-border-light] transition-all uppercase text-xs font-bold tracking-widest"
      >
        {locale === "zh" ? "重設表單" : "Reset Form"}
      </button>
    </div>
  );
}

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
        className={`contact-label ${labelFocusColor}`}
      >
        {label}
        {required && " *"}
      </label>
      <input
        className={`contact-input ${focusColor}`}
        {...props}
      />
      <div
        className={`absolute bottom-0 left-0 h-[1px] w-0 group-focus-within:w-full transition-all duration-500 ${accentColor === "alt" ? "bg-[--contact-accent-alt]" : "bg-[--contact-accent]"}`}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
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
        className={`contact-label ${labelFocusColor}`}
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
            "contact-select w-full justify-between items-center text-lg px-0 py-3 rounded-none border-0 border-b bg-transparent h-auto min-h-[52px]",
            "transition-all duration-300 focus-visible:ring-0 focus-visible:ring-offset-0",
            focusColor,
            hoverIconColor,
            "[&_svg]:transition-transform [&_[data-slot=select-icon]]:transition-transform data-[state=open]:[&_svg]:-rotate-180",
            "data-[state=open]:border-b data-[state=open]:border-[--contact-accent]"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          side="bottom"
          align="start"
          position="popper"
          sideOffset={6}
          avoidCollisions={false}
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
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};
