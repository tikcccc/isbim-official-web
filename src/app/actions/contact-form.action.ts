/**
 * Contact Form Server Action
 *
 * Purpose:
 * - Handle contact form submissions server-side
 * - Validate form data with Zod
 * - Implement rate limiting (IP-based)
 * - Send emails via Resend
 * - Provide typed responses for client-side handling
 *
 * Usage:
 * ```tsx
 * import { submitContactForm } from "@/app/actions/contact-form.action";
 *
 * const result = await submitContactForm(formData, locale);
 * if (result.success) {
 *   // Show success message
 * }
 * ```
 */

"use server";

import { headers } from "next/headers";
import { sanityConfig } from "@/lib/env";
import { sendContactFormEmails } from "@/lib/email";
import { contactFormSchema, type ContactFormInput } from "@/schemas/contact-form.schema";
import { writeClient } from "@/sanity/lib";

/**
 * Server action response type
 */
interface SubmitContactFormResponse {
  success: boolean;
  message?: string;
  error?: string;
}

type ContactFormNotificationStatus = "pending" | "sent" | "failed";

/**
 * Rate limiter using in-memory Map
 * Key: IP address, Value: Array of submission timestamps
 *
 * Note: This is a simple implementation suitable for single-instance deployments.
 * For multi-instance/serverless environments, consider using:
 * - Vercel KV
 * - Upstash Redis
 * - Other distributed rate limiting solutions
 */
const submissionTracker = new Map<string, number[]>();

/**
 * Rate limit configuration
 */
const RATE_LIMIT = {
  /** Maximum submissions per time window */
  MAX_SUBMISSIONS: 3,
  /** Time window in milliseconds (5 minutes) */
  TIME_WINDOW: 5 * 60 * 1000,
};

/**
 * Check if IP has exceeded rate limit
 *
 * @param ip - Client IP address
 * @returns true if within rate limit, false if exceeded
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = submissionTracker.get(ip) || [];

  // Remove timestamps older than the time window
  const recentTimestamps = timestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT.TIME_WINDOW
  );

  // Check if rate limit exceeded
  if (recentTimestamps.length >= RATE_LIMIT.MAX_SUBMISSIONS) {
    return false; // Rate limit exceeded
  }

  // Add current timestamp
  recentTimestamps.push(now);
  submissionTracker.set(ip, recentTimestamps);

  return true; // Within rate limit
}

/**
 * Get client IP address from request headers
 *
 * @returns Client IP address or "unknown"
 */
async function getClientIp(): Promise<string> {
  const headersList = await headers();

  // Try various headers that might contain the client IP
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const cfConnectingIp = headersList.get("cf-connecting-ip"); // Cloudflare

  // Return first available IP
  if (forwardedFor) {
    // x-forwarded-for can be a comma-separated list, take the first one
    return forwardedFor.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback to "unknown" if no IP headers found
  return "unknown";
}

async function createContactFormSubmission(
  data: ContactFormInput,
  locale: "en" | "zh"
): Promise<string> {
  if (!sanityConfig.token) {
    throw new Error("SANITY_API_TOKEN is not configured.");
  }

  const submission = await writeClient.create({
    _type: "contactFormSubmission",
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    companyName: data.companyName,
    service: data.service,
    marketingConsent: data.marketingConsent ?? false,
    locale,
    submittedAt: new Date().toISOString(),
    status: "new",
    notificationStatus: "pending",
    ...(data.phoneNumber ? { phoneNumber: data.phoneNumber } : {}),
    ...(data.companyType ? { companyType: data.companyType } : {}),
    ...(data.jobTitle ? { jobTitle: data.jobTitle } : {}),
  });

  return submission._id;
}

async function updateContactFormNotificationStatus(
  submissionId: string,
  status: ContactFormNotificationStatus,
  error?: string
): Promise<void> {
  if (!sanityConfig.token) {
    return;
  }

  const patch = writeClient.patch(submissionId).set({
    notificationStatus: status,
  });

  if (status === "failed" && error) {
    patch.set({ notificationError: error });
  } else {
    patch.unset(["notificationError"]);
  }

  await patch.commit();
}

/**
 * Submit contact form
 *
 * Server action for handling contact form submissions.
 * Validates data, checks rate limits, and sends emails.
 *
 * @param formData - Raw form data (unknown type for safety)
 * @param locale - User's locale for i18n error messages
 * @returns Promise with success status and optional message/error
 */
export async function submitContactForm(
  formData: unknown,
  locale: "en" | "zh"
): Promise<SubmitContactFormResponse> {
  try {
    // Get client IP for rate limiting
    const clientIp = await getClientIp();

    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      return {
        success: false,
        error:
          locale === "zh"
            ? "提交次數過多,請稍後再試。"
            : "Too many submissions. Please try again in a few minutes.",
      };
    }

    // Validate form data with Zod
    const validation = contactFormSchema.safeParse(formData);

    if (!validation.success) {
      // Return first validation error
      const firstError = validation.error.issues[0];
      return {
        success: false,
        error: firstError?.message || "Validation failed",
      };
    }

    // Extract validated data
    const validatedData = validation.data;

    // Persist lead data when Sanity write permissions are available, but do not block email delivery if CMS persistence fails.
    let submissionId: string | null = null;
    try {
      submissionId = await createContactFormSubmission(validatedData, locale);
    } catch (persistenceError) {
      console.error(
        "Failed to persist contact form submission to Sanity. Email delivery will continue:",
        persistenceError
      );
    }

    // Send emails
    const emailResult = await sendContactFormEmails(validatedData, locale);

    if (!emailResult.success) {
      if (submissionId) {
        console.error(
          `Contact form email failed for Sanity submission ${submissionId}:`,
          emailResult.error
        );

        try {
          await updateContactFormNotificationStatus(
            submissionId,
            "failed",
            emailResult.error
          );
        } catch (notificationError) {
          console.error(
            `Failed to update notification status for submission ${submissionId}:`,
            notificationError
          );
        }
      }

      return {
        success: false,
        error: emailResult.error,
      };
    }

    if (submissionId) {
      try {
        await updateContactFormNotificationStatus(submissionId, "sent");
      } catch (notificationError) {
        console.error(
          `Failed to update notification status for submission ${submissionId}:`,
          notificationError
        );
      }
    }

    // Success response
    return {
      success: true,
      message:
        locale === "zh"
          ? "感謝您!我們已收到您的訊息,並將盡快回覆。"
          : "Thank you! We've received your message and will get back to you shortly.",
    };
  } catch (error) {
    // Log unexpected errors
    console.error("Unexpected error in submitContactForm:", error);

    // Return generic error message
    return {
      success: false,
      error:
        locale === "zh"
          ? "發送失敗,請稍後再試。"
          : "Failed to send message. Please try again later.",
    };
  }
}
