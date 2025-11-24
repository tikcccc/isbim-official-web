/**
 * ProductGrid Component
 *
 * 用途：
 * - 產品/服務卡片的網格佈局容器
 * - 管理多個ProductCard的排列和動畫
 *
 * 使用場景：
 * - Home頁展示8個JARVIS產品
 * - Services頁展示所有服務
 * - About頁展示相關案例（可選）
 *
 * Props：
 * - products: Product[] (產品數組，從data/products.ts導入)
 * - columns?: 2 | 3 | 4 (列數，默認3)
 * - className?: string
 *
 * 設計要點：
 * - 使用CSS Grid佈局
 * - 響應式：
 *   - mobile: 1列
 *   - tablet: 2列
 *   - desktop: 3-4列（根據props.columns）
 * - gap適中（gap-6或gap-8）
 * - 統一card高度（使用grid-auto-rows或flex）
 *
 * 動畫：
 * - Stagger animation（卡片逐個淡入）
 * - 使用Framer Motion的staggerChildren
 * - 延遲遞增（第一個0s, 第二個0.1s, 第三個0.2s...）
 * - 配合ScrollReveal在進入視口時觸發
 *
 * 示例：
 * <ProductGrid
 *   products={jarvisProducts}
 *   columns={3}
 * />
 */

// TODO: 實現ProductGrid組件
// TODO: 導入Product類型和數據
// TODO: 使用Grid佈局並實現響應式
// TODO: 添加stagger動畫（Framer Motion）
// TODO: map渲染ProductCard組件
