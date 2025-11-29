/**
 * Sanity Webhook 本地测试脚本
 * 模拟带 HMAC 签名的 webhook 请求
 */

const crypto = require('crypto');

// 配置
const WEBHOOK_URL = 'http://localhost:3004/api/revalidate';
const WEBHOOK_SECRET = 'a3f8c9d2e1b4567890abcdef1234567890abcdef1234567890abcdef12345678'; // 从 .env.local 读取

// 测试数据
const payload = {
  _type: 'news',
  _id: 'test-456',
  slug: { current: 'test-article-with-signature' }
};

const body = JSON.stringify(payload);

// 生成 HMAC SHA-256 签名（模拟 Sanity）
const signature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(body)
  .digest('hex');

console.log('🧪 测试 Sanity Webhook (带签名验证)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📦 Payload:', body);
console.log('🔐 Signature:', signature);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// 发送请求
fetch(WEBHOOK_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'sanity-webhook-signature': signature // Sanity 使用的 header 名称
  },
  body: body
})
  .then(res => {
    console.log('✅ HTTP Status:', res.status, res.statusText);
    return res.json();
  })
  .then(data => {
    console.log('📨 Response:', JSON.stringify(data, null, 2));
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
  });
