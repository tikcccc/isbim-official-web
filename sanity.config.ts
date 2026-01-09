import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schemaTypes } from './src/sanity/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'isBIM Sanity Studio',

  projectId: 'racyn2dq',
  dataset: 'production',

  basePath: '/studio',
  plugins: [deskTool()],

  schema: {
    types: schemaTypes,
  },
})
