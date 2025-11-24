/**
 * Navigation Menu Structure
 *
 * 用途：
 * - 定義全站導航菜單的層級結構
 * - 包含主菜單和子菜單（下拉菜單）的配置
 * - 用於Header和Footer的導航渲染
 *
 * 菜單結構：
 *
 * 主菜單項目：
 * - About Us（關於我們）
 * - Services and AI Products（服務與AI產品）
 *   └── 子菜單：
 *       - JARVIS AI Suite（總覽）
 *       - JARVIS Agent
 *       - JARVIS Pay
 *       - JARVIS Air
 *       - JARVIS Eagle Eye
 *       - JARVIS SSSS
 *       - JARVIS DWSS
 *       - JARVIS CDCP
 *       - JARVIS Assets
 *       - JARVIS Project Management (JPM)
 *       - BIM Consultancy
 *       - Project Finance
 *       - Venture Investments
 * - Newsroom（新聞中心）
 * - Careers（職位招聘）
 * - Contact Us（聯繫我們）
 *
 * 數據結構：
 * - label: 菜單顯示文字（支持i18n key）
 * - href: 鏈接路徑
 * - submenu: 子菜單數組（可選）
 * - icon: 菜單圖標（可選）
 * - description: 菜單描述（可選，用於mega menu）
 *
 * 使用場景：
 * - Header組件的主導航
 * - 移動端漢堡菜單
 * - Footer的快捷鏈接
 * - 面包屑導航（Breadcrumb）
 */

import { MenuItem } from "@/lib/types";

// TODO: 導出navigationMenu數組，包含完整的多級菜單結構
// TODO: 考慮是否需要為移動端單獨定義簡化版菜單
