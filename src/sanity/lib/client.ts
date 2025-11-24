import { createClient } from 'next-sanity'
import { sanityConfig } from '@/lib/env'

export const projectId = sanityConfig.projectId || '4y8vgu6z'
export const dataset = sanityConfig.dataset
export const apiVersion = sanityConfig.apiVersion

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
})
