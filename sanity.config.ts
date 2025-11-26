import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schemaTypes } from './src/sanity/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'isBIM Sanity Studio',

  projectId: '4y8vgu6z',
  dataset: 'production',

  basePath: '/studio',
  plugins: [deskTool()],

  schema: {
    types: schemaTypes,
  },
})
