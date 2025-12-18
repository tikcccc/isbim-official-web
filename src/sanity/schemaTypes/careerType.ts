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
      type: "reference",
      to: [{ type: "careerPillar" }],
      description: "Optional override. Defaults to the pillar on the selected team.",
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
        layout: "dropdown",
      },
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
      teamTitle: "team.title",
      pillarTitle: "pillar.title",
      teamPillarTitle: "team.pillar.title",
      location: "locations.0.title",
      status: "status",
    },
    prepare({ title, teamTitle, pillarTitle, teamPillarTitle, location, status }) {
      const statusEmoji = status === "open" ? "🟢" : status === "draft" ? "📝" : "⛔️";
      const pillar = pillarTitle || teamPillarTitle;
      const subtitle = [teamTitle || pillar, location].filter(Boolean).join(" • ");
      return {
        title,
        subtitle: `${statusEmoji} ${subtitle || "No location"}`,
      };
    },
  },
});
