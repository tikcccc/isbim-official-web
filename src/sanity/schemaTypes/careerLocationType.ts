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
      description: "Lower numbers surface higher in location lists.",
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
      city: "city",
      country: "country",
      status: "status",
    },
    prepare({ title, city, country, status }) {
      const flag = status === "hidden" ? "👁️‍🗨️" : "📍";
      const parts = [city, country].filter(Boolean).join(", ");
      return {
        title,
        subtitle: `${flag} ${parts || "Location"}`,
      };
    },
  },
});
