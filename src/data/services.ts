/**
 * Services Data
 *
 * 用途：
 * - 存儲isBIM提供的額外服務的靜態數據
 * - 除了JARVIS產品外的其他業務服務
 *
 * 包含的服務：
 * 1. JARVIS Project Management (JPM) - 項目管理服務
 * 2. BIM Consultancy - BIM咨詢服務
 * 3. Project Finance - 項目融資服務
 * 4. Venture Investments - 風險投資服務
 *
 * 數據結構：
 * - id: 服務唯一標識符
 * - title: 服務名稱
 * - description: 服務簡介
 * - href: 服務詳情頁路徑
 * - icon: 服務圖標（可選）
 * - category: 服務分類
 *
 * 使用場景：
 * - Services & Products頁面展示
 * - 導航菜單中的服務列表
 * - 相關服務推薦模塊
 */

import { Product } from "@/lib/types";

// TODO: 導出services數組，包含全部4個服務的完整信息
// TODO: 可考慮將JARVIS JPM同時放在products和services中，或單獨分類
