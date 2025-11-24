/**
 * JARVIS Products Data
 *
 * 用途：
 * - 存儲所有JARVIS AI Suite產品的靜態數據
 * - 包含8個JARVIS產品的基本信息
 * - 用於產品卡片、產品列表、導航等組件
 *
 * 數據結構：
 * - id: 產品唯一標識符
 * - title: 產品名稱（支持i18n key）
 * - description: 產品簡介
 * - href: 產品詳情頁路徑
 * - icon: 產品圖標（可選）
 * - category: 產品分類
 *
 * 包含的產品：
 * 1. JARVIS Agent - AI助手代理
 * 2. JARVIS Pay - 支付認證系統
 * 3. JARVIS Air - 生成式設計
 * 4. JARVIS Eagle Eye - 數字孿生監控
 * 5. JARVIS SSSS - 智能工地安全系統
 * 6. JARVIS DWSS - 數字工程監督系統
 * 7. JARVIS CDCP - 通用數據協作平台
 * 8. JARVIS Assets - 智能設施管理
 *
 * 使用場景：
 * - Home頁面的"Our AI Platforms"產品網格
 * - Services頁面的產品展示
 * - 導航下拉菜單的JARVIS產品列表
 */

import { Product } from "@/lib/types";

// TODO: 導出jarvisProducts數組，包含全部8個JARVIS產品的完整信息
