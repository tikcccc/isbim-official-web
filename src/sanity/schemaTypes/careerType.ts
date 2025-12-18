import { defineField, defineType } from "sanity";

export const careerType = defineType({
  name: "career",
  title: "Career Position",
  type: "document",
  groups: [
    { name: "listing", title: "Listing" },
    { name: "content", title: "Content" },
    { name: "application", title: "Application" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // Listing & filters
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Open", value: "open" },
          { title: "Draft", value: "draft" },
          { title: "Closed", value: "closed" },
        ],
        layout: "radio",
      },
      initialValue: "open",
      validation: (Rule) => Rule.required(),
      group: "listing",
    }),
    defineField({
      name: "title",
      title: "Role Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      group: "listing",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
      group: "listing",
    }),
    defineField({
      name: "pillar",
      title: "Pillar (Column Header)",
      type: "string",
      description: "Maps to the primary grouping in the newspaper/table layouts.",
      options: {
        list: [
          { title: "Delivery & Success", value: "delivery-success" },
          { title: "Engineering", value: "engineering" },
          { title: "Strategy & Talent", value: "strategy-talent" },
        ],
      },
      group: "listing",
    }),
    defineField({
      name: "team",
      title: "Team / Subgroup",
      type: "string",
      description: "Shown under each pillar (e.g. AI & Software Engineering Team).",
      validation: (Rule) => Rule.required(),
      group: "listing",
    }),
    defineField({
      name: "locations",
      title: "Locations",
      type: "array",
      of: [{ type: "string" }],
      description: "Display order matches listing layouts; first item is the primary location.",
      validation: (Rule) => Rule.min(1),
      group: "listing",
    }),
    defineField({
      name: "workModel",
      title: "Work Model",
      type: "string",
      options: {
        list: [
          { title: "On-site", value: "onsite" },
          { title: "Hybrid", value: "hybrid" },
          { title: "Remote", value: "remote" },
        ],
        layout: "radio",
      },
      initialValue: "onsite",
      group: "listing",
    }),
    defineField({
      name: "employmentType",
      title: "Employment Type",
      type: "string",
      options: {
        list: [
          { title: "Full-time", value: "full-time" },
          { title: "Part-time", value: "part-time" },
          { title: "Contract", value: "contract" },
          { title: "Internship", value: "internship" },
          { title: "Temporary", value: "temporary" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
      initialValue: "full-time",
      group: "listing",
    }),
    defineField({
      name: "experienceLevel",
      title: "Seniority",
      type: "string",
      options: {
        list: [
          { title: "Intern", value: "intern" },
          { title: "Junior", value: "junior" },
          { title: "Mid", value: "mid" },
          { title: "Senior", value: "senior" },
          { title: "Lead", value: "lead" },
          { title: "Director", value: "director" },
        ],
      },
      group: "listing",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "Free-form labels for search/filter (e.g. AI, BIM, FinOps).",
      group: "listing",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers surface first in the listing layouts.",
      group: "listing",
    }),

    // Detail content
    defineField({
      name: "summary",
      title: "Listing Summary",
      type: "text",
      rows: 3,
      description: "Short blurb for cards/newspaper layout (max ~200 chars).",
      validation: (Rule) => Rule.max(200),
      group: "content",
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 4,
      description: "Optional hero paragraph for the detail view.",
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [{ name: "href", type: "url", title: "URL" }],
              },
            ],
          },
        },
      ],
      description: "Rich content for the detail page; supports headings, lists, and links.",
      validation: (Rule) => Rule.required(),
      group: "content",
    }),
    defineField({
      name: "sections",
      title: "Structured Sections",
      type: "array",
      description: "Optional structured blocks for responsibilities, requirements, benefits, etc.",
      of: [
        defineField({
          name: "section",
          title: "Section",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "kind",
              title: "Section Type",
              type: "string",
              options: {
                list: [
                  { title: "Overview", value: "overview" },
                  { title: "Responsibilities", value: "responsibilities" },
                  { title: "Requirements", value: "requirements" },
                  { title: "Benefits", value: "benefits" },
                  { title: "Custom", value: "custom" },
                ],
              },
            }),
            defineField({
              name: "content",
              title: "Content",
              type: "array",
              of: [{ type: "block" }],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "title", kind: "kind" },
            prepare: ({ title, kind }) => ({
              title,
              subtitle: kind ? `${kind}` : "Section",
            }),
          },
        }),
      ],
      group: "content",
    }),
    defineField({
      name: "perks",
      title: "Perks & Benefits",
      type: "array",
      of: [{ type: "string" }],
      group: "content",
    }),
    defineField({
      name: "postedAt",
      title: "Posted At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      group: "content",
    }),
    defineField({
      name: "expiresAt",
      title: "Expires At",
      type: "datetime",
      group: "content",
    }),

    // Application & contact
    defineField({
      name: "application",
      title: "Application",
      type: "object",
      fields: [
        defineField({
          name: "applyUrl",
          title: "Apply URL",
          type: "url",
          description: "External ATS link if applicable.",
        }),
        defineField({
          name: "applyEmail",
          title: "Apply Email",
          type: "string",
          description: "Fallback email for applications.",
        }),
        defineField({
          name: "instructions",
          title: "Application Notes",
          type: "text",
          rows: 3,
        }),
      ],
      options: { collapsible: true, collapsed: false },
      group: "application",
    }),
    defineField({
      name: "hiringManager",
      title: "Hiring Manager",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Name", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "email", title: "Email", type: "string" }),
        defineField({
          name: "photo",
          title: "Photo",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alt Text",
            }),
          ],
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "application",
    }),

    // SEO
    defineField({
      name: "seo",
      title: "SEO & Social",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
          validation: (Rule) => Rule.max(60).warning("Keep under 60 characters"),
        }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.max(160).warning("Keep under 160 characters"),
        }),
        defineField({
          name: "openGraphImage",
          title: "Open Graph Image",
          type: "image",
          description: "1200x630 recommended; defaults to a generic careers image if not set.",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alt Text",
            }),
          ],
        }),
        defineField({
          name: "keywords",
          title: "Keywords",
          type: "array",
          of: [{ type: "string" }],
          options: { layout: "tags" },
        }),
      ],
      group: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      team: "team",
      location: "locations.0",
      status: "status",
    },
    prepare({ title, team, location, status }) {
      const statusEmoji = status === "open" ? "🟢" : status === "draft" ? "📝" : "⛔️";
      const subtitle = [team, location].filter(Boolean).join(" • ");
      return {
        title,
        subtitle: `${statusEmoji} ${subtitle || "No location"}`,
      };
    },
  },
});
