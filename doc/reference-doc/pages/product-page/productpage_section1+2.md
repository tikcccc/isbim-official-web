# Role
您是一位精通 **React**, **Tailwind CSS**, **Framer Motion** 以及 **Creative Interaction** 的資深前端工程師。

# Task
請構建一個具有「電影級敘事感」的 Landing Page。核心互動邏輯是「堆疊式視差滾動 (Sticky Stacking)」結合「滾動驅動的內容漸顯 (Scroll-driven Reveal)」。

# Tech Stack
- **Framework**: React
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion (useScroll, useTransform)
- **Smooth Scroll**: Lenis (via CDN injection)
- **Icons**: Lucide React

# Detailed Requirements

## 1. Smooth Scrolling (Lenis)
- 使用 `useEffect` 動態載入 Lenis 腳本。
- 設定平滑滾動參數：`duration: 1.2`, 使用指數緩動曲線 (exponential easing) 以獲得高級的阻尼感。
- 必須建立 `requestAnimationFrame` 循環來驅動 Lenis。

## 2. Architecture: Sticky Stacking (關鍵結構)
頁面由兩個主要區塊組成，利用 CSS `sticky` 屬性創造「滑蓋」效果：

### Section A: The Hero (Underlayer)
- **Positioning**: `sticky top-0 h-screen`, `z-index: 0`。
- **Behavior**: 當使用者向下滾動時，此區塊**保持不動**，直到被下一個區塊完全覆蓋。
- **Content**:
  - 背景：全螢幕循環播放的抽象科技影片 (使用 `<video>` 標籤，object-cover)。
  - 疊加層：黑色半透明漸層 (Gradient Overlay) 以確保文字清晰度。
  - 文字：位於畫面中央的標題，以及底部的動態提示箭頭。

### Section B: The Narrative Track (Overlayer)
- **Positioning**: `relative`, `z-index: 10` (必須高於 Hero)。
- **Dimensions**: 高度設為 **300vh** (作為滾動軌道 Track)。
- **Background**: 淺灰色 (`bg-[#f2f2f2]`)，帶有頂部陰影以增強層次感。
- **Behavior**:
  - 隨著滾動，這個灰色區塊會像「蓋子」一樣從底部向上滑動，遮住 Hero Section。
  - **Inner Layout (The Stage)**: 在這個 300vh 的軌道內，放置一個 `sticky top-0 h-screen` 的容器。這確保了當灰色背景完全蓋住 Hero 後，內容會「釘」在畫面中央，等待滾動動畫播放。

## 3. Scrollytelling Animations (Section B Logic)
使用 Framer Motion 的 `useScroll` 監聽 Section B 的滾動進度 (Target: Section B ref, Offset: ["start start", "end end"])。
根據滾動進度 (scrollYProgress 0.0 -> 1.0) 依序觸發以下動畫：

- **0.0 - 0.1**: 緩衝區 (此時灰色背景正在向上滑動覆蓋 Hero)。
- **0.1 - 0.3**: 第一行標題 "Go beyond chat." 上浮並淡入。
- **0.3 - 0.5**: 第二行標題 (漸層色) "Enterprise Autonomy" 上浮並淡入。
- **0.5 - 0.7**: 描述文字段落上浮並淡入。
- **0.8 - 1.0**: 底部 Footer/Arrow 淡入。

## 4. Visual Style
- **Typography**: 類似 Palantir/Linear 的極簡風格，字體巨大且緊湊 (Tracking-tight)。
- **Colors**: 高對比度。Hero 為黑底白字；Section B 為灰底黑字。
- **Detail**: 箭頭圖標需自定義樣式（帶有裝飾線的 Chevron）。

請生成完整的單一文件代碼 (`.tsx`)。