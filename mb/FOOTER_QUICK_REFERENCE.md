# Footer 组件快速参考卡

## 📋 快速开始

### 1. 导入组件

```tsx
import Footer from '@/components/Footer'
```

### 2. 使用组件

```tsx
<Footer footerData={data.footer} />
```

---

## 🎯 数据结构

### TypeScript 接口

```typescript
interface FooterData {
  logoUrl: string           // Logo 图片路径（如 "/uploads/logo.png"）
  gardenName: string        // 茶园名称（如 "云溯源茶园"）
  copyrightText: string     // 版权信息（如 "© 2025 云溯源茶园. 保留所有权利."）
  socialLinks: SocialLink[] // 社交媒体链接数组
}

interface SocialLink {
  platform: string  // "weibo" | "xiaohongshu" | "douyin" | "wechat"
  url: string       // 链接地址
}
```

### JSON 示例

```json
{
  "footer": {
    "logoUrl": "/uploads/logo.png",
    "gardenName": "云溯源茶园",
    "copyrightText": "© 2025 云溯源茶园. 保留所有权利.",
    "socialLinks": [
      { "platform": "weibo", "url": "https://weibo.com/your-id" },
      { "platform": "xiaohongshu", "url": "https://www.xiaohongshu.com/your-id" },
      { "platform": "douyin", "url": "https://www.douyin.com/your-id" },
      { "platform": "wechat", "url": "/images/wechat-qrcode.jpg" }
    ]
  }
}
```

---

## 🎨 支持的社交平台

| platform | 显示效果 | 颜色 |
|----------|---------|------|
| `weibo` | 🔴 微博图标 | 红色 (`text-red-500`) |
| `xiaohongshu` | 🌹 小红书图标 | 玫瑰色 (`text-rose-500`) |
| `douyin` | ⚫ 抖音图标 | 黑色 (`text-gray-800`) |
| `wechat` | 🟢 微信图标 | 绿色 (`text-green-500`) |

---

## 💡 使用示例

### 完整示例（从 API 获取数据）

```tsx
'use client'

import { useState, useEffect } from 'react'
import Footer from '@/components/Footer'

export default function HomePage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3000/api/public/landing-page')
      .then(res => res.json())
      .then(data => setData(data))
  }, [])

  if (!data) return <div>加载中...</div>

  return (
    <main>
      {/* 页面其他内容 */}
      <Footer footerData={data.footer} />
    </main>
  )
}
```

### 静态数据示例

```tsx
import Footer from '@/components/Footer'

export default function MyPage() {
  const footerData = {
    logoUrl: "/uploads/logo.png",
    gardenName: "云溯源茶园",
    copyrightText: "© 2025 云溯源茶园. 保留所有权利.",
    socialLinks: [
      { platform: "weibo", url: "https://weibo.com/your-id" },
      { platform: "xiaohongshu", url: "https://www.xiaohongshu.com/your-id" }
    ]
  }

  return <Footer footerData={footerData} />
}
```

### 无数据示例（使用默认值）

```tsx
import Footer from '@/components/Footer'

export default function MyPage() {
  return <Footer />  {/* 将使用默认备用数据 */}
}
```

---

## 🛡️ 健壮性处理

| 场景 | 行为 |
|------|------|
| 没有传入 `footerData` | ✅ 使用默认备用数据 |
| `logoUrl` 为空字符串 | ✅ 显示备用 Logo（茶字图标） |
| `socialLinks` 为空数组 | ✅ 不显示社交媒体区域 |
| 未知的 `platform` 值 | ✅ 自动跳过，不显示 |

---

## 🔧 自定义

### 修改图标大小

在 `Footer.tsx` 中修改：

```tsx
<IconComponent className="w-8 h-8" />  // 改为 32px
```

### 修改颜色

在 `Footer.tsx` 中修改 `socialColorMapping`：

```tsx
const socialColorMapping = {
  'weibo': 'text-blue-500 hover:text-blue-600',  // 改为蓝色
  // ...
}
```

### 添加新平台

1. 将 SVG 图标放入 `app/assets/icons/`
2. 导入图标：`import BilibiliIcon from '../assets/icons/bilibili.svg'`
3. 添加到映射：`'bilibili': BilibiliIcon`
4. 添加颜色：`'bilibili': 'text-pink-500 hover:text-pink-600'`

---

## 📁 文件位置

```
app/
├── assets/
│   └── icons/
│       ├── WeChat.svg       ← 微信图标
│       ├── Weibo.svg        ← 微博图标
│       ├── xiaohongshu.svg  ← 小红书图标
│       └── douyin.svg       ← 抖音图标
└── components/
    └── Footer.tsx           ← Footer 组件
```

---

## 🐛 常见问题

### Q: 图标不显示？

**A:** 检查：
1. `platform` 值是否正确（区分大小写）
2. SVG 文件是否存在于 `app/assets/icons/`
3. 是否已重启开发服务器

### Q: Logo 图片不显示？

**A:** 检查：
1. `logoUrl` 路径是否正确
2. 图片文件是否存在
3. Next.js 图片域名是否已配置（`next.config.js`）

### Q: TypeScript 报错？

**A:** 确保：
1. `svg.d.ts` 文件存在于项目根目录
2. 已重启 TypeScript 服务器

---

## 📚 完整文档

- **详细文档**: `app/components/Footer.README.md`
- **重构总结**: `FOOTER_REFACTOR_V2_SUMMARY.md`
- **使用示例**: `app/components/FooterExample.tsx`
- **测试数据**: `test-footer-data.json`

---

## ✅ 核心要点

1. ✅ 使用 `footerData` prop 传递所有数据
2. ✅ 所有内容（Logo、名称、版权、社交链接）都是动态的
3. ✅ 支持优雅降级（没有数据时使用默认值）
4. ✅ 从 `app/assets/icons/` 导入真实的 SVG 图标
5. ✅ TypeScript 类型安全

---

**最后更新**: 2025年9月30日
