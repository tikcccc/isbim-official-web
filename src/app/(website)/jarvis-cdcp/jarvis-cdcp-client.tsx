"use client";

import * as m from "@/paraglide/messages";
import { JARVIS_VIDEOS, JARVIS_POSTERS } from "@/lib/media-config";
import { ProductPageLayout } from "@/components/product-template";

/**
 * JARVIS CDCP Client Component
 *
 * Executes all m.*() translations client-side to stay responsive to locale changes.
 */
export default function JarvisCdcpClient() {
  const featureVideos = {
    singleSource: JARVIS_VIDEOS.cdcp,
    bim: JARVIS_VIDEOS.cdcp,
    availability: JARVIS_VIDEOS.cdcp,
  };

  return (
    <ProductPageLayout
      productName="JARVIS CDCP"
      videoSrc={JARVIS_VIDEOS.cdcp}
      posterSrc={JARVIS_POSTERS.cdcp}
      metadata={[
        m.jarvis_cdcp_hero_meta1(),
        m.jarvis_cdcp_hero_meta2(),
        m.jarvis_cdcp_hero_meta3(),
      ]}
      narrativeStage1={m.jarvis_cdcp_narrative_stage1()}
      narrativeStage2={m.jarvis_cdcp_narrative_stage2()}
      narrativeDesc={m.jarvis_cdcp_narrative_desc()}
      narrativeHighlight={m.jarvis_cdcp_narrative_highlight()}
      scrollPrompt={m.jarvis_cdcp_scroll_prompt()}
      features={[
        {
          index: "0.1",
          title: [
            m.jarvis_cdcp_feature1_title_line1(),
            m.jarvis_cdcp_feature1_title_line2(),
          ],
          description: m.jarvis_cdcp_feature1_desc(),
          mediaSrc: featureVideos.singleSource,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.cdcp,
          videoLabel: m.jarvis_cdcp_toggle_video(),
          detailsLabel: m.jarvis_cdcp_toggle_details(),
          details: [
            {
              title: m.jarvis_cdcp_feature1_detail1_title(),
              description: m.jarvis_cdcp_feature1_detail1_desc(),
            },
            {
              title: m.jarvis_cdcp_feature1_detail2_title(),
              description: m.jarvis_cdcp_feature1_detail2_desc(),
            },
            {
              title: m.jarvis_cdcp_feature1_detail3_title(),
              description: m.jarvis_cdcp_feature1_detail3_desc(),
            },
          ],
        },
        {
          index: "0.2",
          title: [
            m.jarvis_cdcp_feature2_title_line1(),
            m.jarvis_cdcp_feature2_title_line2(),
          ],
          description: m.jarvis_cdcp_feature2_desc(),
          mediaSrc: featureVideos.bim,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.cdcp,
          videoLabel: m.jarvis_cdcp_toggle_video(),
          detailsLabel: m.jarvis_cdcp_toggle_details(),
          details: [
            {
              title: m.jarvis_cdcp_feature2_detail1_title(),
              description: m.jarvis_cdcp_feature2_detail1_desc(),
            },
            {
              title: m.jarvis_cdcp_feature2_detail2_title(),
              description: m.jarvis_cdcp_feature2_detail2_desc(),
            },
            {
              title: m.jarvis_cdcp_feature2_detail3_title(),
              description: m.jarvis_cdcp_feature2_detail3_desc(),
            },
          ],
        },
        {
          index: "0.3",
          title: [
            m.jarvis_cdcp_feature3_title_line1(),
            m.jarvis_cdcp_feature3_title_line2(),
          ],
          description: m.jarvis_cdcp_feature3_desc(),
          mediaSrc: featureVideos.availability,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.cdcp,
          videoLabel: m.jarvis_cdcp_toggle_video(),
          detailsLabel: m.jarvis_cdcp_toggle_details(),
          details: [
            {
              title: m.jarvis_cdcp_feature3_detail1_title(),
              description: m.jarvis_cdcp_feature3_detail1_desc(),
            },
            {
              title: m.jarvis_cdcp_feature3_detail2_title(),
              description: m.jarvis_cdcp_feature3_detail2_desc(),
            },
            {
              title: m.jarvis_cdcp_feature3_detail3_title(),
              description: m.jarvis_cdcp_feature3_detail3_desc(),
            },
          ],
        },
      ]}
    />
  );
}
