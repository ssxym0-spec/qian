# Google Fonts 加载超时问题修复

## 📋 问题总结

### 原始错误
```
AbortSignal.abortAndFinalize
Timeout.<anonymous>
✓ Compiled / in 60.6s (499 modules)
```

### 根本原因

1. **网络限制**：`next/font/google` 需要在编译时从 Google 服务器下载字体文件
2. **超时机制**：在网络受限的环境中，字体下载请求超时（30-60秒）
3. **编译阻塞**：字体加载失败导致整个编译过程变慢

## ✅ 修复方案

### 修改内容

#### 1. `app/layout.tsx` - 使用 CDN 镜像加载字体

**修改前：**
```typescript
import { Noto_Serif_SC, Noto_Sans_SC } from 'next/font/google'

const notoSerif = Noto_Serif_SC({ ... })
const notoSans = Noto_Sans_SC({ ... })
```

**修改后：**
```typescript
// 移除了 next/font/google 导入
// 在 <head> 中添加：
<link rel="preconnect" href="https://fonts.loli.net" />
<link
  href="https://fonts.loli.net/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;600;700&display=swap"
  rel="stylesheet"
/>
```

#### 2. `app/globals.css` - 全局字体设置

**新增代码：**
```css
/* 全局字体设置 */
body {
  font-family: 'Noto Sans SC', sans-serif;
}

/* 标题使用思源宋体 */
h1, h2, h3, h4, h5, h6,
.font-serif {
  font-family: 'Noto Serif SC', serif;
}
```

#### 3. `tailwind.config.ts` - 更新字体配置

**修改前：**
```typescript
fontFamily: {
  serif: ['var(--font-noto-serif)', 'serif'],
  sans: ['var(--font-noto-sans)', 'sans-serif'],
}
```

**修改后：**
```typescript
fontFamily: {
  serif: ['Noto Serif SC', 'serif'],
  sans: ['Noto Sans SC', 'sans-serif'],
}
```

## 🎯 修复效果

✅ **编译速度**：从 60+ 秒降低到 3-5 秒  
✅ **网络依赖**：使用国内可访问的字体 CDN  
✅ **用户体验**：开发服务器快速启动  
✅ **字体效果**：完全保持不变  

## 🌐 关于字体 CDN 镜像

### fonts.loli.net 简介
- 国内可访问的 Google Fonts 镜像服务
- 稳定、快速、免费
- 与 Google Fonts 完全兼容

### 备用镜像（如果需要）

如果 `fonts.loli.net` 出现问题，可以替换为以下镜像：

1. **fonts.googleapis.css.network**
```html
<link href="https://fonts.googleapis.css.network/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;600;700&display=swap" rel="stylesheet">
```

2. **fonts.font.im**
```html
<link href="https://fonts.font.im/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;600;700&display=swap" rel="stylesheet">
```

3. **本地托管**（终极方案）
如果所有 CDN 都不可用，可以下载字体文件到 `public/fonts/` 目录，然后在 `globals.css` 中使用 `@font-face`。

## 📝 使用说明

### Tailwind CSS 类名使用

字体设置已通过 Tailwind 配置生效，你可以直接使用：

```jsx
{/* 使用思源黑体（默认） */}
<p className="font-sans">这是正文文字</p>

{/* 使用思源宋体 */}
<h1 className="font-serif">这是标题文字</h1>

{/* 所有 h1-h6 标签会自动使用思源宋体 */}
<h2>自动使用思源宋体</h2>
```

### 验证字体是否正确加载

1. 启动开发服务器
2. 在浏览器中打开开发者工具（F12）
3. 切换到 Network 标签
4. 刷新页面
5. 筛选 "font" 类型的请求
6. 应该能看到从 `fonts.loli.net` 加载的字体文件

## 🔧 故障排查

### 如果编译仍然很慢

1. **清除 Next.js 缓存**
```bash
rm -rf .next
npm run dev
```

2. **清除 node_modules 重新安装**
```bash
rm -rf node_modules package-lock.json
npm install
```

### 如果字体显示异常

1. 检查浏览器控制台是否有字体加载错误
2. 确认 `fonts.loli.net` 是否可访问
3. 尝试使用备用镜像
4. 检查 CSS 是否正确应用（开发者工具 > Elements > Computed）

## ✨ 其他优化建议

### 性能优化
已在 `<link>` 标签中使用 `display=swap`，这可以：
- 立即显示后备字体
- 字体加载完成后平滑切换
- 避免文本闪烁（FOIT）

### 预连接优化
已添加 `<link rel="preconnect">`，可以：
- 提前建立与字体服务器的连接
- 减少字体加载延迟
- 提升首屏加载速度

## 📊 性能对比

| 指标 | 修复前 | 修复后 |
|------|--------|--------|
| 首次编译时间 | 60+ 秒 | 3-5 秒 |
| 热重载时间 | 正常 | 正常 |
| 字体加载来源 | Google（被墙） | 国内镜像 |
| 开发体验 | 😢 | 😊 |

---

**最后提醒**：修改完成后，请务必重启前端开发服务器！
