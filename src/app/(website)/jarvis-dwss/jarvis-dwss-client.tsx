"use client";

import * as m from "@/paraglide/messages";
import { JARVIS_VIDEOS, JARVIS_POSTERS } from "@/lib/media-config";
import { ProductPageLayout } from "@/components/product-template";

/**
 * JARVIS DWSS Client Component
 *
 * Executes all m.*() translations client-side to stay responsive to locale changes.
 */
export default function JarvisDwssClient() {
  const featureVideos = {
    compliance: JARVIS_VIDEOS.dwss,
    automation: JARVIS_VIDEOS.dwss,
    deployment: JARVIS_VIDEOS.dwss,
  };

  return (
    <ProductPageLayout
      productName="JARVIS DWSS"
      videoSrc={JARVIS_VIDEOS.dwss}
      posterSrc={JARVIS_POSTERS.dwss}
      metadata={[
        m.jarvis_dwss_hero_meta1(),
        m.jarvis_dwss_hero_meta2(),
        m.jarvis_dwss_hero_meta3(),
      ]}
      narrativeStage1={m.jarvis_dwss_narrative_stage1()}
      narrativeStage2={m.jarvis_dwss_narrative_stage2()}
      narrativeDesc={m.jarvis_dwss_narrative_desc()}
      narrativeHighlight={m.jarvis_dwss_narrative_highlight()}
      scrollPrompt={m.jarvis_dwss_scroll_prompt()}
      features={[
        {
          index: "0.1",
          title: [
            m.jarvis_dwss_feature1_title_line1(),
            m.jarvis_dwss_feature1_title_line2(),
          ],
          description: m.jarvis_dwss_feature1_desc(),
          mediaSrc: featureVideos.compliance,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.dwss,
          videoLabel: m.jarvis_dwss_toggle_video(),
          detailsLabel: m.jarvis_dwss_toggle_details(),
          details: [
            {
              title: m.jarvis_dwss_feature1_detail1_title(),
              description: m.jarvis_dwss_feature1_detail1_desc(),
            },
            {
              title: m.jarvis_dwss_feature1_detail2_title(),
              description: m.jarvis_dwss_feature1_detail2_desc(),
            },
            {
              title: m.jarvis_dwss_feature1_detail3_title(),
              description: m.jarvis_dwss_feature1_detail3_desc(),
            },
          ],
        },
        {
          index: "0.2",
          title: [
            m.jarvis_dwss_feature2_title_line1(),
            m.jarvis_dwss_feature2_title_line2(),
          ],
          description: m.jarvis_dwss_feature2_desc(),
          mediaSrc: featureVideos.automation,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.dwss,
          videoLabel: m.jarvis_dwss_toggle_video(),
          detailsLabel: m.jarvis_dwss_toggle_details(),
          details: [
            {
              title: m.jarvis_dwss_feature2_detail1_title(),
              description: m.jarvis_dwss_feature2_detail1_desc(),
            },
            {
              title: m.jarvis_dwss_feature2_detail2_title(),
              description: m.jarvis_dwss_feature2_detail2_desc(),
            },
            {
              title: m.jarvis_dwss_feature2_detail3_title(),
              description: m.jarvis_dwss_feature2_detail3_desc(),
            },
          ],
        },
        {
          index: "0.3",
          title: [
            m.jarvis_dwss_feature3_title_line1(),
            m.jarvis_dwss_feature3_title_line2(),
          ],
          description: m.jarvis_dwss_feature3_desc(),
          mediaSrc: featureVideos.deployment,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.dwss,
          videoLabel: m.jarvis_dwss_toggle_video(),
          detailsLabel: m.jarvis_dwss_toggle_details(),
          details: [
            {
              title: m.jarvis_dwss_feature3_detail1_title(),
              description: m.jarvis_dwss_feature3_detail1_desc(),
            },
            {
              title: m.jarvis_dwss_feature3_detail2_title(),
              description: m.jarvis_dwss_feature3_detail2_desc(),
            },
            {
              title: m.jarvis_dwss_feature3_detail3_title(),
              description: m.jarvis_dwss_feature3_detail3_desc(),
            },
          ],
        },
      ]}
    />
  );
}
