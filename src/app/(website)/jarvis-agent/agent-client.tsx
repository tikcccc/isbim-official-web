'use client';

import { ProductPageLayout } from '@/components/product-template';
import { JARVIS_VIDEOS, JARVIS_POSTERS } from '@/lib/media-config';

export default function AgentClient() {
  return (
    <ProductPageLayout
      productName="JARVIS Agent"
      productSubtitle="Operate every workflow with a governed AI assistant."
      videoSrc={JARVIS_VIDEOS.agent}
      posterSrc={JARVIS_POSTERS.agent}
      metadata={['Grounded responses', 'Tooled workflows', 'Governed rollout']}
      narrativeStage1="From inbox chaos"
      narrativeStage2="To agentic execution"
      narrativeDesc="Collect requests, ground answers in live context, and execute multi-step tasks with auditability."
      narrativeHighlight="Built for delivery, not demos."
      scrollPrompt="Scroll to explore"
      features={[
        {
          index: '0.1',
          title: ['Email Agent'],
          description:
            'CC Agent on any thread — it auto-files documents, extracts data, fills forms, and routes to JARVIS Pay for invoices or VOs. No more lost attachments or manual entry.',
          mediaSrc: JARVIS_VIDEOS.agent,
          mediaType: 'video',
          mediaPoster: JARVIS_POSTERS.agent,
          details: [
            { title: 'Auto-file & extract', description: 'Attachments and text are filed, parsed, and structured.' },
            { title: 'Form fill & routing', description: 'Populates forms and routes invoices/VOs into JARVIS Pay.' },
            { title: 'Thread-aware replies', description: 'Grounded responses with context from the entire thread.' },
          ],
        },
        {
          index: '0.2',
          title: ['Compliance Agent'],
          description:
            'Ask anytime — “Is this rebar schedule compliant?” or “Does this change order breach scope?” — and get instant, contract- and law-aligned answers with audit trails.',
          mediaSrc: JARVIS_VIDEOS.agent,
          mediaType: 'video',
          mediaPoster: JARVIS_POSTERS.agent,
          details: [
            { title: 'Spec & law grounded', description: 'Checks against contracts, standards, and regulations.' },
            { title: 'Scope guardrails', description: 'Flags scope creep and compliance gaps before approval.' },
            { title: 'Audit ready', description: 'Cited answers with trails for sign-off and governance.' },
          ],
        },
        {
          index: '0.3',
          title: ['Tendering Agent'],
          description:
            'Upload a 500-page tender — Agent digests it into bite-sized intel: scoring matrix, BOQ highlights, risk flags, scope gaps. Query it live to stress-test your bid.',
          mediaSrc: JARVIS_VIDEOS.agent,
          mediaType: 'video',
          mediaPoster: JARVIS_POSTERS.agent,
          details: [
            { title: 'Scoring matrix', description: 'Extracts criteria and weights for fast bid strategy.' },
            { title: 'Risk & scope gaps', description: 'Surfaces red flags, BOQ highlights, and missing scope.' },
            { title: 'Live Q&A', description: 'Query the tender to validate responses and assumptions.' },
          ],
        },
      ]}
      ctaTitle="Ready to deploy your agent?"
      ctaSubtitle="We help you ship governed, reliable assistants across planning, delivery, and operations."
      ctaButtonText="Talk to us"
      ctaButtonHref="/contact"
    />
  );
}
