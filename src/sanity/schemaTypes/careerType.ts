import { defineField, defineType } from "sanity";

export const careerType = defineType({
  name: "career",
  title: "Career Position",
  type: "document",
  groups: [
    { name: "listing", title: "Listing" },
    { name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // Listing & filters
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
      name: "team",
      title: "Team / Subgroup",
      type: "reference",
      to: [{ type: "careerTeam" }],
      description: "Pick from Career Teams (add new teams in that collection).",
      validation: (Rule) => Rule.required(),
      group: "listing",
    }),
    defineField({
      name: "locations",
      title: "Locations",
      type: "array",
      of: [{ type: "reference", to: [{ type: "careerLocation" }] }],
      description: "Pick one or more locations; first item is treated as primary.",
      validation: (Rule) => Rule.required().min(1),
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
        layout: "radio",
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
      description: "Priority: High shows first, Low shows last.",
      options: {
        list: [
          { title: "High (top)", value: 1 },
          { title: "Medium", value: 2 },
          { title: "Low (bottom)", value: 3 },
        ],
        layout: "radio",
      },
      group: "listing",
    }),

    // Detail content
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
              name: "content",
              title: "Content",
              type: "array",
              of: [{ type: "block" }],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "title" },
            prepare: ({ title }) => ({
              title,
              subtitle: "Section",
            }),
          },
        }),
      ],
      initialValue: [
        {
          _type: "section",
          title: "The Role",
          content: [],
        },
        {
          _type: "section",
          title: "Core Responsibilities",
          content: [],
        },
        {
          _type: "section",
          title: "Requirements",
          content: [],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
      group: "content",
    }),
    defineField({
      name: "applicationUrl",
      title: "Application URL",
      type: "url",
      description: "External form/ATS link for this role.",
      group: "content",
    }),
    defineField({
      name: "contentImage",
      title: "Content Image (Optional)",
      type: "image",
      description: "Optional image to accompany the content.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
        }),
      ],
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
          description: "Optional. Defaults to the job title if left blank.",
          validation: (Rule) => Rule.max(60).warning("Keep under 60 characters"),
        }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          rows: 3,
          description: "Optional. Auto-generated from content if left blank.",
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
      teamTitle: "team.title",
      teamPillarTitle: "team.pillar.title",
      location: "locations.0.title",
    },
    prepare({ title, teamTitle, teamPillarTitle, location }) {
      const pillar = teamPillarTitle;
      const subtitle = [teamTitle || pillar, location].filter(Boolean).join(" • ");
      return {
        title,
        subtitle: subtitle || "No location",
      };
    },
  },
});
