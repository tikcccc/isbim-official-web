import { defineField, defineType } from 'sanity';

export const newsType = defineType({
  name: 'news',
  title: 'News Post',
  type: 'document',
  fields: [
    // Basic fields
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Brief subtitle (optional, max 200 chars)',
      validation: (Rule) => Rule.max(200),
    }),

    // Category and tags
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'newsCategory' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),

    // Content
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short excerpt for list view (optional, falls back to subtitle)',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    // Metadata
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'isBIM Team',
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time (minutes)',
      type: 'number',
      description: 'Estimated reading time in minutes',
      validation: (Rule) => Rule.required().min(1).max(60),
      initialValue: 5,
    }),

    // SEO fields
    defineField({
      name: 'seo',
      title: 'SEO & Social',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'SEO title (max 60 chars, defaults to title)',
          validation: (Rule) => Rule.max(60).warning('Keep under 60 characters'),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'SEO description (max 160 chars, defaults to subtitle/excerpt)',
          validation: (Rule) => Rule.max(160).warning('Keep under 160 characters'),
        }),
        defineField({
          name: 'openGraphImage',
          title: 'Open Graph Image',
          type: 'image',
          description: 'Image for social sharing (1200x630 recommended, defaults to mainImage)',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
            }),
          ],
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          options: { layout: 'tags' },
        }),
      ],
    }),

    // Status control
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show as featured article (top of list)',
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      categoryTitle: 'category.title',
      publishedAt: 'publishedAt',
    },
    prepare({ title, media, categoryTitle, publishedAt }) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Not published';

      return {
        title,
        media,
        subtitle: `${categoryTitle || 'No category'} • ${date}`,
      };
    },
  },
});
