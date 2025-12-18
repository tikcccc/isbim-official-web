import { defineField, defineType } from "sanity";

export const careerLocationType = defineType({
  name: "careerLocation",
  title: "Career Location",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Location Name",
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
      name: "city",
      title: "City / Region",
      type: "string",
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
    }),
    defineField({
      name: "timezone",
      title: "Timezone",
      type: "string",
      description: "Optional display hint (e.g. GMT+8).",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Priority in location lists: High shows first, Low shows last.",
      options: {
        list: [
          { title: "High (top)", value: 1 },
          { title: "Medium", value: 2 },
          { title: "Low (bottom)", value: 3 },
        ],
        layout: "radio",
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      city: "city",
      country: "country",
    },
    prepare({ title, city, country }) {
      const parts = [city, country].filter(Boolean).join(", ");
      return {
        title,
        subtitle: `${parts || "Location"}`,
      };
    },
  },
});
