import { defineField, defineType } from "sanity";

export const careerTeamType = defineType({
  name: "careerTeam",
  title: "Career Team",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Team Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pillar",
      title: "Pillar (Column Header)",
      type: "string",
      description: "Which pillar this team appears under on the careers page.",
      options: {
        list: [
          { title: "Delivery & Success", value: "delivery-success" },
          { title: "Engineering", value: "engineering" },
          { title: "Strategy & Talent", value: "strategy-talent" },
        ],
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Optional blurb for hover/preview.",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers surface the team higher within a pillar.",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Hidden", value: "hidden" },
        ],
        layout: "radio",
      },
      initialValue: "active",
    }),
  ],
  preview: {
    select: {
      title: "title",
      pillar: "pillar",
      status: "status",
    },
    prepare({ title, pillar, status }) {
      const emoji = status === "hidden" ? "👁️‍🗨️" : "🧭";
      const subtitle = pillar ? pillar.replace(/-/g, " ") : "No pillar set";
      return {
        title,
        subtitle: `${emoji} ${subtitle}`,
      };
    },
  },
});
