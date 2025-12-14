"use client";

import * as m from "@/paraglide/messages";
import { JARVIS_VIDEOS, JARVIS_POSTERS } from "@/lib/media-config";
import { ProductPageLayout } from "@/components/product-template";

/**
 * JARVIS Air Client Component
 *
 * Client-side wrapper that executes all m.*() translations in the browser.
 * This ensures translations respond to locale changes in real time.
 *
 * Architecture:
 * - page.tsx (Server): SEO metadata + JSON-LD only
 * - jarvis-air-client.tsx (Client): All content and translations
 */
export default function JarvisAirClient() {
  const featureVideos = {
    masterPlanning: JARVIS_VIDEOS.air,
    landscape: JARVIS_VIDEOS.air,
    interiors: JARVIS_VIDEOS.air,
  };

  return (
    <ProductPageLayout
      productName="JARVIS Air"
      videoSrc={JARVIS_VIDEOS.air}
      posterSrc={JARVIS_POSTERS.air}
      metadata={[
        m.jarvis_air_hero_meta1(),
        m.jarvis_air_hero_meta2(),
        m.jarvis_air_hero_meta3(),
      ]}
      narrativeStage1={m.jarvis_air_narrative_stage1()}
      narrativeStage2={m.jarvis_air_narrative_stage2()}
      narrativeDesc={m.jarvis_air_narrative_desc()}
      narrativeHighlight={m.jarvis_air_narrative_highlight()}
      scrollPrompt={m.jarvis_air_scroll_prompt()}
      features={[
        {
          index: "0.1",
          title: [
            m.jarvis_air_feature1_title_line1(),
            m.jarvis_air_feature1_title_line2(),
          ],
          description: m.jarvis_air_feature1_desc(),
          mediaSrc: featureVideos.masterPlanning,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.air,
          videoLabel: m.jarvis_air_toggle_video(),
          detailsLabel: m.jarvis_air_toggle_details(),
          details: [
            {
              title: m.jarvis_air_feature1_detail1_title(),
              description: m.jarvis_air_feature1_detail1_desc(),
            },
            {
              title: m.jarvis_air_feature1_detail2_title(),
              description: m.jarvis_air_feature1_detail2_desc(),
            },
            {
              title: m.jarvis_air_feature1_detail3_title(),
              description: m.jarvis_air_feature1_detail3_desc(),
            },
          ],
        },
        {
          index: "0.2",
          title: [
            m.jarvis_air_feature2_title_line1(),
            m.jarvis_air_feature2_title_line2(),
          ],
          description: m.jarvis_air_feature2_desc(),
          mediaSrc: featureVideos.landscape,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.air,
          videoLabel: m.jarvis_air_toggle_video(),
          detailsLabel: m.jarvis_air_toggle_details(),
          details: [
            {
              title: m.jarvis_air_feature2_detail1_title(),
              description: m.jarvis_air_feature2_detail1_desc(),
            },
            {
              title: m.jarvis_air_feature2_detail2_title(),
              description: m.jarvis_air_feature2_detail2_desc(),
            },
            {
              title: m.jarvis_air_feature2_detail3_title(),
              description: m.jarvis_air_feature2_detail3_desc(),
            },
          ],
        },
        {
          index: "0.3",
          title: [
            m.jarvis_air_feature3_title_line1(),
            m.jarvis_air_feature3_title_line2(),
          ],
          description: m.jarvis_air_feature3_desc(),
          mediaSrc: featureVideos.interiors,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.air,
          videoLabel: m.jarvis_air_toggle_video(),
          detailsLabel: m.jarvis_air_toggle_details(),
          details: [
            {
              title: m.jarvis_air_feature3_detail1_title(),
              description: m.jarvis_air_feature3_detail1_desc(),
            },
            {
              title: m.jarvis_air_feature3_detail2_title(),
              description: m.jarvis_air_feature3_detail2_desc(),
            },
            {
              title: m.jarvis_air_feature3_detail3_title(),
              description: m.jarvis_air_feature3_detail3_desc(),
            },
          ],
        },
      ]}
    />
  );
}
