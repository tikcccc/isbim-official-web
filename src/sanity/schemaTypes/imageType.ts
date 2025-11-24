import { defineField, defineType } from "sanity";

export const imageType = defineType({
  name: "imageAsset",
  title: "Image",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alternative Text",
      type: "string",
    }),
    defineField({
      name: "file",
      title: "Image File",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "file",
      subtitle: "alt",
    },
  },
});
