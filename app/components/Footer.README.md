# Footer 组件使用文档

## 概述

重构后的 `Footer` 组件是一个现代化的页脚组件，**使用本地 SVG 图标文件**动态渲染社交媒体链接。所有图标都从 `app/assets/icons/` 目录导入，无需手动创建 SVG 组件。

---

## ✨ 核心特性

- ✅ **导入本地 SVG 文件**：直接从 `app/assets/icons/` 导入 SVG 作为 React 组件
- ✅ **动态图标渲染**：根据后端传来的 `platform` 字段自动匹配对应的图标
- ✅ **预设颜色方案**：每个社交平台都有专属的品牌颜色
- ✅ **安全的外部链接**：使用 `target="_blank"` 和 `rel="noopener noreferrer"` 确保安全性
- ✅ **响应式设计**：完美适配各种屏幕尺寸
- ✅ **无障碍支持**：包含 `aria-label` 属性
- ✅ **健壮性处理**：空数组时不会报错

---

## 📁 项目结构

```
app/
├── assets/
│   └── icons/
│       ├── WeChat.svg       ← 微信图标
│       ├── Weibo.svg        ← 微博图标
│       ├── xiaohongshu.svg  ← 小红书图标
│       └── douyin.svg       ← 抖音图标
└── components/
    ├── Footer.tsx           ← Footer 组件
    ├── FooterExample.tsx    ← 使用示例
    └── Footer.README.md     ← 本文档
```

---

## 🚀 快速开始

### 1. 数据结构

Footer 组件接收一个 `social_links` prop，其结构如下：

```typescript
interface SocialLink {
  platform: string  // 平台名称，如 "weibo", "xiaohongshu"
  url: string       // 链接地址
}

interface FooterProps {
  social_links: SocialLink[]
}
```

### 2. 后端 API 数据格式

从 API 端点 `GET /api/public/landing-page` 返回的数据应包含：

```json
{
  "plot": { ... },
  "categories": [ ... ],
  "cta_bg": "...",
  "social_links": [
    { "platform": "weibo", "url": "https://weibo.com/your-id" },
    { "platform": "xiaohongshu", "url": "https://www.xiaohongshu.com/your-id" },
    { "platform": "douyin", "url": "https://www.douyin.com/your-id" },
    { "platform": "wechat", "url": "your-wechat-qrcode.jpg" }
  ]
}
```

### 3. 使用示例

```tsx
import Footer from '@/components/Footer'

export default function HomePage() {
  const socialLinks = [
    { platform: "weibo", url: "https://weibo.com/teatrace" },
    { platform: "xiaohongshu", url: "https://www.xiaohongshu.com/user/profile/teatrace" },
    { platform: "douyin", url: "https://www.douyin.com/user/teatrace" },
    { platform: "wechat", url: "/images/wechat-qrcode.jpg" }
  ]

  return (
    <main>
      {/* 其他内容 */}
      <Footer social_links={socialLinks} />
    </main>
  )
}
```

---

## 🎨 支持的社交平台

| 平台名称 | platform 值 | 图标文件 | 颜色 |
|---------|------------|---------|------|
| 微博 | `weibo` | `Weibo.svg` | 红色 (`text-red-500`) |
| 小红书 | `xiaohongshu` | `xiaohongshu.svg` | 玫瑰色 (`text-rose-500`) |
| 抖音 | `douyin` | `douyin.svg` | 黑色 (`text-gray-800`) |
| 微信 | `wechat` | `WeChat.svg` | 绿色 (`text-green-500`) |

---

## 🔧 核心实现原理

### 1. 导入本地 SVG 图标

在 `Footer.tsx` 文件顶部，使用 `import` 语句导入 SVG 文件：

```tsx
import WechatIcon from '../assets/icons/WeChat.svg'
import WeiboIcon from '../assets/icons/Weibo.svg'
import XiaohongshuIcon from '../assets/icons/xiaohongshu.svg'
import DouyinIcon from '../assets/icons/douyin.svg'
```

> **注意**：使用相对路径从 `app/components/` 导入 `app/assets/icons/` 中的 SVG 文件。这需要在 `next.config.js` 中配置 `@svgr/webpack` 来支持 SVG 作为 React 组件导入。

### 2. 图标映射字典

```tsx
const socialIconMapping = {
  'weibo': WeiboIcon,
  'xiaohongshu': XiaohongshuIcon,
  'douyin': DouyinIcon,
  'wechat': WechatIcon,
}
```

### 3. 颜色映射字典

```tsx
const socialColorMapping = {
  'weibo': 'text-red-500 hover:text-red-600',
  'xiaohongshu': 'text-rose-500 hover:text-rose-600',
  'douyin': 'text-gray-800 hover:text-black',
  'wechat': 'text-green-500 hover:text-green-600',
}
```

### 4. 动态渲染逻辑

```tsx
{social_links && social_links.length > 0 && (
  <div className="flex items-center gap-6">
    {social_links.map((social, index) => {
      const IconComponent = socialIconMapping[social.platform]
      const colorClass = socialColorMapping[social.platform] || 'text-gray-500 hover:text-amber-500'
      
      if (!IconComponent) return null

      return (
        <a 
          key={index}
          href={social.url} 
          target="_blank"
          rel="noopener noreferrer"
          className={`transition-colors ${colorClass}`}
          aria-label={`访问我们的${social.platform}`}
        >
          <IconComponent className="w-6 h-6" />
        </a>
      )
    })}
  </div>
)}
```

---

## ⚙️ 配置说明

### Next.js 配置

在 `next.config.js` 中添加 SVGR 支持：

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... 其他配置
  webpack(config) {
    // 支持导入 SVG 作为 React 组件
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
}

module.exports = nextConfig
```

### TypeScript 声明

在项目根目录创建 `svg.d.ts` 文件：

```typescript
declare module '*.svg' {
  import React from 'react'
  const SVGComponent: React.FC<React.SVGProps<SVGSVGElement>>
  export default SVGComponent
}
```

---

## 🎯 扩展新的社交平台

如果需要添加新的社交平台（如 B站、知乎等），按以下步骤操作：

### 步骤 1：添加 SVG 图标文件

将新平台的 SVG 图标文件放入 `app/assets/icons/` 目录，例如 `bilibili.svg`。

### 步骤 2：导入图标

在 `Footer.tsx` 顶部添加导入语句：

```tsx
import BilibiliIcon from '@/assets/icons/bilibili.svg'
```

### 步骤 3：更新映射字典

```tsx
const socialIconMapping = {
  // ... 现有图标
  'bilibili': BilibiliIcon,
}

const socialColorMapping = {
  // ... 现有颜色
  'bilibili': 'text-pink-500 hover:text-pink-600',
}
```

### 步骤 4：更新后端数据

确保后端返回的 `social_links` 数组中包含新平台：

```json
{
  "platform": "bilibili",
  "url": "https://space.bilibili.com/your-id"
}
```

---

## 🐛 故障排查

### 问题 1：图标不显示

**可能原因**：
- 后端返回的 `social_links` 数据格式不正确
- `platform` 值不在 `socialIconMapping` 中定义

**解决方案**：
1. 使用浏览器开发者工具查看控制台错误
2. 检查 `social_links` 数据是否正确传递
3. 确认 `platform` 值与映射字典的键名一致（区分大小写）

### 问题 2：TypeScript 报错 "Cannot find module '*.svg'"

**可能原因**：
- 缺少 `svg.d.ts` 类型声明文件
- TypeScript 未识别到类型声明

**解决方案**：
1. 确保项目根目录有 `svg.d.ts` 文件
2. 重启 TypeScript 服务器（VS Code: `Ctrl+Shift+P` -> "TypeScript: Restart TS Server"）

### 问题 3：SVG 作为文本导入而非组件

**可能原因**：
- `next.config.js` 未正确配置 SVGR
- 未安装 `@svgr/webpack` 依赖

**解决方案**：
1. 确认 `package.json` 中有 `@svgr/webpack` 依赖
2. 检查 `next.config.js` 是否添加了 webpack 配置
3. 重启开发服务器

### 问题 4：颜色未生效

**可能原因**：
- Tailwind CSS 未正确配置
- SVG 内部有 `fill` 属性覆盖了颜色

**解决方案**：
1. 确认 Tailwind CSS 已正确安装并配置
2. 检查 SVG 文件，移除硬编码的 `fill` 或 `stroke` 属性
3. 使用 `currentColor` 让 SVG 继承文本颜色

---

## 📦 依赖项

```json
{
  "dependencies": {
    "next": "14.2.15",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@svgr/webpack": "^8.1.0",
    "typescript": "^5"
  }
}
```

---

## 🌟 设计亮点

### 1. 简洁优雅
- 移除了所有冗余的文本链接
- 只保留品牌 Logo、名称和社交图标
- 视觉焦点清晰

### 2. 品牌色彩
- 每个社交平台使用其品牌色
- hover 时颜色加深，提供视觉反馈

### 3. 容错处理
- 如果 `platform` 不匹配，自动跳过
- 使用默认值 `= []` 处理空数据情况
- 条件渲染避免显示空白区域

### 4. 性能优化
- 使用 `map` 而非手动创建多个元素
- 条件渲染避免无效元素
- SVG 作为组件导入，支持代码分割

---

## 📝 注意事项

1. **平台名称一致性**：确保后端返回的 `platform` 值与前端映射字典的键名完全一致（区分大小写）
2. **URL 有效性**：确保后端返回的 URL 有效且可访问
3. **图标大小**：当前设置为 `w-6 h-6`（24px），可根据需要调整
4. **备用机制**：如果某个平台找不到图标，该项会被跳过，不会显示
5. **外部链接安全**：已包含 `rel="noopener noreferrer"` 防止安全问题
6. **SVG 文件质量**：确保 SVG 文件使用 `currentColor` 而非硬编码颜色，以便支持动态着色

---

## 📄 许可证

根据项目许可证使用。

---

## 🙋 常见问题 (FAQ)

### Q: 如何更改图标大小？

A: 修改 `IconComponent` 的 `className` 属性：

```tsx
<IconComponent className="w-8 h-8" />  // 32px
```

### Q: 如何更改品牌颜色？

A: 修改 `socialColorMapping` 字典中的 Tailwind CSS 类名：

```tsx
const socialColorMapping = {
  'weibo': 'text-blue-500 hover:text-blue-600',  // 改为蓝色
}
```

### Q: 如何支持多个微信群或公众号？

A: 后端可以返回多个微信链接，只要 `platform` 值相同：

```json
[
  { "platform": "wechat", "url": "/qrcode1.jpg" },
  { "platform": "wechat", "url": "/qrcode2.jpg" }
]
```

所有相同平台的链接都会显示相同的图标。

### Q: 如何添加图标动画效果？

A: 在 `<a>` 标签的 `className` 中添加动画类：

```tsx
className={`transition-all duration-300 hover:scale-110 ${colorClass}`}
```

---

**最后更新**：2025年9月30日