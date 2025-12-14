"use client";

import * as m from "@/paraglide/messages";
import { JARVIS_VIDEOS, JARVIS_POSTERS } from "@/lib/media-config";
import { ProductPageLayout } from "@/components/product-template";

/**
 * JARVIS SSSS Client Component
 *
 * Executes all m.*() translations client-side to stay in sync with locale changes.
 */
export default function JarvisSsssClient() {
  const featureVideos = {
    compliance: JARVIS_VIDEOS.ssss,
    modules: JARVIS_VIDEOS.ssss,
    dashboard: JARVIS_VIDEOS.ssss,
  };

  return (
    <ProductPageLayout
      productName="JARVIS SSSS"
      videoSrc={JARVIS_VIDEOS.ssss}
      posterSrc={JARVIS_POSTERS.ssss}
      metadata={[
        m.jarvis_ssss_hero_meta1(),
        m.jarvis_ssss_hero_meta2(),
        m.jarvis_ssss_hero_meta3(),
      ]}
      narrativeStage1={m.jarvis_ssss_narrative_stage1()}
      narrativeStage2={m.jarvis_ssss_narrative_stage2()}
      narrativeDesc={m.jarvis_ssss_narrative_desc()}
      narrativeHighlight={m.jarvis_ssss_narrative_highlight()}
      scrollPrompt={m.jarvis_ssss_scroll_prompt()}
      features={[
        {
          index: "0.1",
          title: [
            m.jarvis_ssss_feature1_title_line1(),
            m.jarvis_ssss_feature1_title_line2(),
          ],
          description: m.jarvis_ssss_feature1_desc(),
          mediaSrc: featureVideos.compliance,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.ssss,
          videoLabel: m.jarvis_ssss_toggle_video(),
          detailsLabel: m.jarvis_ssss_toggle_details(),
          details: [
            {
              title: m.jarvis_ssss_feature1_detail1_title(),
              description: m.jarvis_ssss_feature1_detail1_desc(),
            },
            {
              title: m.jarvis_ssss_feature1_detail2_title(),
              description: m.jarvis_ssss_feature1_detail2_desc(),
            },
            {
              title: m.jarvis_ssss_feature1_detail3_title(),
              description: m.jarvis_ssss_feature1_detail3_desc(),
            },
          ],
        },
        {
          index: "0.2",
          title: [
            m.jarvis_ssss_feature2_title_line1(),
            m.jarvis_ssss_feature2_title_line2(),
          ],
          description: m.jarvis_ssss_feature2_desc(),
          mediaSrc: featureVideos.modules,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.ssss,
          videoLabel: m.jarvis_ssss_toggle_video(),
          detailsLabel: m.jarvis_ssss_toggle_details(),
          details: [
            {
              title: m.jarvis_ssss_feature2_detail1_title(),
              description: m.jarvis_ssss_feature2_detail1_desc(),
            },
            {
              title: m.jarvis_ssss_feature2_detail2_title(),
              description: m.jarvis_ssss_feature2_detail2_desc(),
            },
            {
              title: m.jarvis_ssss_feature2_detail3_title(),
              description: m.jarvis_ssss_feature2_detail3_desc(),
            },
          ],
        },
        {
          index: "0.3",
          title: [
            m.jarvis_ssss_feature3_title_line1(),
            m.jarvis_ssss_feature3_title_line2(),
          ],
          description: m.jarvis_ssss_feature3_desc(),
          mediaSrc: featureVideos.dashboard,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.ssss,
          videoLabel: m.jarvis_ssss_toggle_video(),
          detailsLabel: m.jarvis_ssss_toggle_details(),
          details: [
            {
              title: m.jarvis_ssss_feature3_detail1_title(),
              description: m.jarvis_ssss_feature3_detail1_desc(),
            },
            {
              title: m.jarvis_ssss_feature3_detail2_title(),
              description: m.jarvis_ssss_feature3_detail2_desc(),
            },
            {
              title: m.jarvis_ssss_feature3_detail3_title(),
              description: m.jarvis_ssss_feature3_detail3_desc(),
            },
          ],
        },
      ]}
    />
  );
}
