"use client";

import * as m from "@/paraglide/messages";
import { JARVIS_VIDEOS, JARVIS_POSTERS, getVideoUrl } from "@/lib/media-config";
import { ProductPageLayout } from "@/components/product-template";

/**
 * JARVIS Pay Client Component
 *
 * Client-side wrapper that executes all m.*() translations in the browser.
 * This ensures translations respond to locale changes in real-time.
 *
 * Architecture:
 * - page.tsx (Server): SEO metadata + JSON-LD only
 * - jarvis-pay-client.tsx (Client): All content and translations
 */
export default function JarvisPayClient() {
  const featureVideos = {
    feature1: getVideoUrl("jarvis-pay-feature1.mp4"),
    feature2: getVideoUrl("jarvis-pay-feature2.mp4"),
    feature3: getVideoUrl("jarvis-pay-feature3.mp4"),
  };

  return (
    <ProductPageLayout
      productName="JARVIS Pay"
      videoSrc={JARVIS_VIDEOS.pay}
      posterSrc={JARVIS_POSTERS.pay}
      metadata={[
        m.jarvis_pay_hero_meta1(),
        m.jarvis_pay_hero_meta2(),
        m.jarvis_pay_hero_meta3(),
      ]}
      narrativeStage1={m.jarvis_pay_narrative_stage1()}
      narrativeStage2={m.jarvis_pay_narrative_stage2()}
      narrativeDesc={m.jarvis_pay_narrative_desc()}
      scrollPrompt={m.jarvis_pay_scroll_prompt()}
      features={[
        {
          index: "0.1",
          title: [
            m.jarvis_pay_feature1_title_line1(),
            m.jarvis_pay_feature1_title_line2(),
          ],
          description: m.jarvis_pay_feature1_desc(),
          mediaSrc: featureVideos.feature1,
          mediaType: "video",
          videoLabel: m.jarvis_pay_toggle_video(),
          detailsLabel: m.jarvis_pay_toggle_details(),
          details: [
            {
              title: m.jarvis_pay_feature1_detail1_title(),
              description: m.jarvis_pay_feature1_detail1_desc(),
            },
            {
              title: m.jarvis_pay_feature1_detail2_title(),
              description: m.jarvis_pay_feature1_detail2_desc(),
            },
            {
              title: m.jarvis_pay_feature1_detail3_title(),
              description: m.jarvis_pay_feature1_detail3_desc(),
            },
          ],
        },
        {
          index: "0.2",
          title: [
            m.jarvis_pay_feature2_title_line1(),
            m.jarvis_pay_feature2_title_line2(),
          ],
          description: m.jarvis_pay_feature2_desc(),
          mediaSrc: featureVideos.feature2,
          mediaType: "video",
          videoLabel: m.jarvis_pay_toggle_video(),
          detailsLabel: m.jarvis_pay_toggle_details(),
          details: [
            {
              title: m.jarvis_pay_feature2_detail1_title(),
              description: m.jarvis_pay_feature2_detail1_desc(),
            },
            {
              title: m.jarvis_pay_feature2_detail2_title(),
              description: m.jarvis_pay_feature2_detail2_desc(),
            },
            {
              title: m.jarvis_pay_feature2_detail3_title(),
              description: m.jarvis_pay_feature2_detail3_desc(),
            },
          ],
        },
        {
          index: "0.3",
          title: [
            m.jarvis_pay_feature3_title_line1(),
            m.jarvis_pay_feature3_title_line2(),
          ],
          description: m.jarvis_pay_feature3_desc(),
          mediaSrc: featureVideos.feature3,
          mediaType: "video",
          videoLabel: m.jarvis_pay_toggle_video(),
          detailsLabel: m.jarvis_pay_toggle_details(),
          details: [
            {
              title: m.jarvis_pay_feature3_detail1_title(),
              description: m.jarvis_pay_feature3_detail1_desc(),
            },
            {
              title: m.jarvis_pay_feature3_detail2_title(),
              description: m.jarvis_pay_feature3_detail2_desc(),
            },
            {
              title: m.jarvis_pay_feature3_detail3_title(),
              description: m.jarvis_pay_feature3_detail3_desc(),
            },
          ],
        },
      ]}
      ctaTitle={m.jarvis_pay_cta_title()}
      ctaSubtitle={m.jarvis_pay_cta_subtitle()}
      ctaButtonText={m.jarvis_pay_cta_button()}
      ctaButtonHref="/contact"
    />
  );
}
