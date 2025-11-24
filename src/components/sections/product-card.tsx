/**
 * ProductCard Component
 *
 * 用途：
 * - 單個產品/服務的卡片展示
 * - 顯示產品標題、描述、圖標
 * - 點擊跳轉到產品詳情頁
 *
 * 使用場景：
 * - Home頁的"Our AI Platforms"網格（8個JARVIS產品）
 * - Services頁面的服務展示
 * - 產品推薦模塊
 *
 * Props：
 * - title: string (產品名稱)
 * - description: string (產品簡介)
 * - href: string (詳情頁鏈接)
 * - icon?: ReactNode (產品圖標或圖片)
 * - className?: string
 *
 * 設計要點：
 * - 使用Shadcn Card組件作為基礎
 * - 懸停時有elevation/陰影增強效果
 * - 圖標或圖片在頂部
 * - 標題粗體，描述使用muted color
 * - 底部有"Explore"或箭頭圖標暗示可點擊
 *
 * 動畫：
 * - 懸停時scale(1.02)和shadow增強（Framer Motion）
 * - 點擊時scale(0.98)
 * - 在ProductGrid中使用stagger動畫逐個淡入
 *
 * 示例（JARVIS Agent）：
 * <ProductCard
 *   title="JARVIS Agent"
 *   description="Domain-specific generative AI agent for every construction stakeholder..."
 *   href="/jarvis-agent"
 *   icon={<AgentIcon />}
 * />
 */

// TODO: 實現ProductCard組件
// TODO: 使用Shadcn Card
// TODO: 添加Framer Motion hover動畫
// TODO: 添加Link組件跳轉
