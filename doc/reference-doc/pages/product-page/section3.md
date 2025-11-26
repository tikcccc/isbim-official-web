Role

You are a Senior Creative Developer specializing in React, Framer Motion, and Scrollytelling Interfaces.

Task

Construct the "Chapter 2: Operational Intelligence" section of a landing page. This is a Multi-Scene Scrollytelling Experience where the user scrolls through a timeline to control a video-based dashboard.

Core Architecture: The Sticky Track

To create the illusion of time passing while the interface stays fixed:

Outer Track: Create a div with a height of 600vh. This provides the physical scrolling space.

Inner Stage: Inside the track, create a sticky top-0 h-screen container. This holds the videos and UI.

Z-Index Strategy: Set z-index: 20 and a background color (e.g., #0a0a0a) so this section slides over and covers the previous section (Chapter 1).

Feature 1: The Dual-Video Engine (Crossfade)

Instead of a single video, implement a seamless transition between two distinct "Scenes":

Scene A (Cyber Defense): Active during the first half of the scroll (Steps 1-3).

Scene B (Global Supply): Active during the second half (Steps 4-6).

Implementation:

Place two <video> elements (wrapped in motion.div) on top of each other using absolute inset-0.

Use a state variable activeVideo (1 or 2).

Use Framer Motion to animate opacity between 0 and 1 based on the active state.

Crucial: Ensure videos are muted, loop, playsInline, and object-cover.

Feature 2: The "CSS Spotlight" Technique

Create a spotlight effect that highlights specific parts of the video without using canvas or heavy libraries.

The Mask: Create a transparent motion.div floating on top of the videos (z-index: 20).

The Shadow: Apply a massive box-shadow to this div: boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.75)". This dims everything outside the div, creating a spotlight effect.

Positioning:

Define a spotlightConfig object mapping each "Step" to specific { top, left, width, height } percentages.

Animate the div to these coordinates using Framer Motion whenever the current Step changes.

Feature 3: The Scroll Logic (Timeline)

Use useScroll to track the progress of the Outer Track (0.0 to 1.0) and map it to discrete "Steps":

0.00 - 0.15: Reset / Intro.

0.15 - 0.45 (Phase 1):

Step 1: Highlight Top-Left (Alerts).

Step 2: Highlight Bottom-Right (Logs).

Step 3: Highlight Center (Threat).

0.45 - 0.55 (Transition):

Fade out Video 1, Fade in Video 2.

Hide Spotlight temporarily.

0.55 - 1.00 (Phase 2):

Step 4: Highlight Top-Right (Nodes).

Step 5: Highlight Bottom-Left (Routes).

Step 6: Highlight Center (Execution).

Feature 4: UI Syncing

Ensure the UI elements update in sync with the video:

Header Title: Use AnimatePresence to crossfade the header text from "CYBER_DEFENSE" to "GLOBAL_SUPPLY" when the video changes.

Status Indicator: Change the "LIVE" dot color (Red for Alert, Green for Stable).

Captions: Display a floating glassmorphism card at the bottom with text descriptions corresponding to the current Step.

Technical Constraints

Use Tailwind CSS for styling.

Use Lucide React for icons.

Ensure the transition between videos is smooth (no black flashes).

将文字直接关联在聚光灯旁边（Contextual Labeling），能让用户的视线更集中，无需在“画面”和“底部字幕”之间来回切换，沉浸感会大幅增强。

为了实现这个效果，我们需要对 VideoDashboard 组件进行改造：

数据结构升级：将原本分散在外部的 Captions 文字数据整合进 spotlightConfig 中，并增加 labelPos 属性（如 'right', 'left', 'top', 'bottom'）来指定文字相对于框框的位置。

动态定位逻辑：使用 CSS calc() 动态计算文字的位置。例如，如果位置是 right，由于 left 和 width 都是百分比，我们可以设置文字的 left 为 calc(${l} + ${w} + 24px)。