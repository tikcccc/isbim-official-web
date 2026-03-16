import { defineField, defineType } from "sanity";
import {
  CONTACT_COMPANY_TYPE_TITLES,
  CONTACT_COMPANY_TYPE_VALUES,
  CONTACT_SERVICE_TITLES,
  CONTACT_SERVICE_VALUES,
  getContactServiceTitle,
} from "@/lib/contact-form-options";

const submissionStatusOptions = [
  { title: "New", value: "new" },
  { title: "In Progress", value: "in-progress" },
  { title: "Closed", value: "closed" },
];

const notificationStatusOptions = [
  { title: "Pending", value: "pending" },
  { title: "Sent", value: "sent" },
  { title: "Failed", value: "failed" },
];

export const contactFormSubmissionType = defineType({
  name: "contactFormSubmission",
  title: "Contact Form",
  type: "document",
  initialValue: {
    status: "new",
    notificationStatus: "pending",
  },
  fields: [
    defineField({
      name: "firstName",
      title: "First Name",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: "lastName",
      title: "Last Name",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: "companyName",
      title: "Company Name",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "companyType",
      title: "Company Type",
      type: "string",
      readOnly: true,
      options: {
        list: CONTACT_COMPANY_TYPE_VALUES.map((value) => ({
          title: CONTACT_COMPANY_TYPE_TITLES[value],
          value,
        })),
      },
    }),
    defineField({
      name: "jobTitle",
      title: "Job Title",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "service",
      title: "Required Solution",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required(),
      options: {
        list: CONTACT_SERVICE_VALUES.map((value) => ({
          title: CONTACT_SERVICE_TITLES[value],
          value,
        })),
      },
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "phoneNumber",
      title: "Phone",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "marketingConsent",
      title:
        "I agree to receive technical updates, product news, and events from isBIM.",
      type: "boolean",
      readOnly: true,
      description: "Data processed in accordance with privacy policy.",
      initialValue: false,
    }),
    defineField({
      name: "locale",
      title: "Submission Locale",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "Traditional Chinese", value: "zh" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      readOnly: true,
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: submissionStatusOptions,
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
      initialValue: "new",
    }),
    defineField({
      name: "notificationStatus",
      title: "Email Notification Status",
      type: "string",
      readOnly: true,
      options: {
        list: notificationStatusOptions,
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
      initialValue: "pending",
    }),
    defineField({
      name: "notificationError",
      title: "Notification Error (Optional)",
      type: "text",
      readOnly: true,
      rows: 3,
    }),
    defineField({
      name: "internalNotes",
      title: "Internal Notes (Optional)",
      type: "text",
      rows: 4,
    }),
  ],
  orderings: [
    {
      title: "Newest First",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
    {
      title: "Oldest First",
      name: "submittedAtAsc",
      by: [{ field: "submittedAt", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      firstName: "firstName",
      lastName: "lastName",
      email: "email",
      companyName: "companyName",
      service: "service",
      status: "status",
      submittedAt: "submittedAt",
    },
    prepare({ firstName, lastName, email, companyName, service, status, submittedAt }) {
      const title = [firstName, lastName].filter(Boolean).join(" ") || email || "Contact submission";
      const subtitleParts = [
        companyName,
        email,
        service ? getContactServiceTitle(service) : undefined,
        status,
      ].filter(Boolean);
      const dateLabel = submittedAt
        ? new Date(submittedAt).toLocaleString()
        : "No submission time";

      return {
        title,
        subtitle: [...subtitleParts, dateLabel].join(" • "),
      };
    },
  },
});
