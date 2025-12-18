import { defineField, defineType } from "sanity";

export const careerPillarType = defineType({
  name: "careerPillar",
  title: "Career Pillar",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Pillar Title",
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Optional blurb for UI hover/preview.",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Priority for columns: High shows first, Low shows last.",
      options: {
        list: [
          { title: "High (top)", value: 1 },
          { title: "Medium", value: 2 },
          { title: "Low (bottom)", value: 3 },
        ],
        layout: "dropdown",
      },
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
      status: "status",
      sortOrder: "sortOrder",
    },
    prepare({ title, status, sortOrder }) {
      const emoji = status === "hidden" ? "👁️‍🗨️" : "🧭";
      const order = typeof sortOrder === "number" ? `#${sortOrder}` : "no order";
      return {
        title,
        subtitle: `${emoji} ${order}`,
      };
    },
  },
});
