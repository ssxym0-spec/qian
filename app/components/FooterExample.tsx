'use client'

import Footer from './Footer'

/**
 * Footer 组件使用示例（重构后 - 使用 footerData 对象）
 * 
 * 这个文件展示了如何使用重构后的 Footer 组件，
 * 以及如何传入统一的 footerData 对象
 */

export default function FooterExample() {
  // 示例数据 - Footer 数据对象（从后端 API 获取）
  const exampleFooterData = {
    logoUrl: "/uploads/logo.png",
    gardenName: "云溯源茶园",
    copyrightText: "© 2025 云溯源茶园. 保留所有权利.",
    socialLinks: [
      { 
        platform: "weibo", 
        url: "https://weibo.com/teatrace" 
      },
      { 
        platform: "xiaohongshu", 
        url: "https://www.xiaohongshu.com/user/profile/teatrace" 
      },
      { 
        platform: "douyin", 
        url: "https://www.douyin.com/user/teatrace" 
      },
      { 
        platform: "wechat", 
        url: "/images/wechat-qrcode.jpg" 
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面内容 */}
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Footer 组件示例（重构后）</h1>
        <p className="text-gray-600 mb-8">
          向下滚动查看 Footer 组件的效果 - 现在完全使用动态数据
        </p>
        
        <div className="space-y-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">新的使用方式</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
{`import Footer from './components/Footer'

// 从后端 API 获取的 footer 数据对象
const footerData = {
  logoUrl: "/uploads/logo.png",
  gardenName: "云溯源茶园",
  copyrightText: "© 2025 云溯源茶园. 保留所有权利.",
  socialLinks: [
    { platform: "weibo", url: "https://weibo.com/your-id" },
    { platform: "xiaohongshu", url: "https://www.xiaohongshu.com/your-id" },
    { platform: "douyin", url: "..." },
    { platform: "wechat", url: "your-wechat-qrcode.jpg" }
  ]
}

// 传递整个 footer 对象
<Footer footerData={footerData} />`}
            </pre>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">数据结构</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>logoUrl</strong> - Logo 图片路径（支持本地路径或远程 URL）</li>
              <li><strong>gardenName</strong> - 茶园名称（完全动态）</li>
              <li><strong>copyrightText</strong> - 版权信息（完全动态）</li>
              <li><strong>socialLinks</strong> - 社交媒体链接数组</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">支持的平台</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>weibo</strong> - 微博（红色图标）</li>
              <li><strong>xiaohongshu</strong> - 小红书（玫瑰色图标）</li>
              <li><strong>douyin</strong> - 抖音（黑色图标）</li>
              <li><strong>wechat</strong> - 微信（绿色图标）</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">✨ 重构亮点</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>✅ <strong>完全动态化</strong> - 所有内容都从 footerData prop 获取</li>
              <li>✅ <strong>Logo 动态渲染</strong> - 支持自定义 Logo 图片</li>
              <li>✅ <strong>健壮性处理</strong> - 如果没有数据，使用优雅的备用方案</li>
              <li>✅ <strong>统一的数据结构</strong> - 所有 footer 数据集中在一个对象中</li>
              <li>✅ <strong>本地 SVG 图标</strong> - 从 app/assets/icons/ 导入彩色图标</li>
              <li>✅ <strong>TypeScript 类型安全</strong> - 完整的类型定义</li>
              <li>✅ <strong>无障碍支持</strong> - 包含 aria-label 属性</li>
              <li>✅ <strong>响应式设计</strong> - 完美适配各种屏幕尺寸</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">API 响应示例</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
{`// GET /api/public/landing-page
{
  "plot": { ... },
  "categories": [ ... ],
  "cta_bg": "...",
  "footer": {
    "logoUrl": "/uploads/logo.png",
    "gardenName": "云溯源茶园",
    "copyrightText": "© 2025 云溯源茶园. 保留所有权利.",
    "socialLinks": [
      { "platform": "weibo", "url": "https://weibo.com/your-id" },
      { "platform": "xiaohongshu", "url": "..." }
    ]
  }
}`}
            </pre>
          </div>
        </div>
      </main>

      {/* Footer 组件 - 使用示例数据 */}
      <Footer footerData={exampleFooterData} />
    </div>
  )
}