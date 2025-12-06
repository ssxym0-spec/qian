# 头像尺寸统一标准化总结

## 🎯 标准化要求

将项目中所有的头像统一设置为：
- **形状**：圆形（`rounded-full`）
- **尺寸**：40x40 像素（`w-10 h-10` 或 `width={40} height={40}`）

## ✅ 已完成的统一化

### 1. 溯源页面组件

#### BatchCard.tsx（批次卡片 - 制茶师）
```jsx
<Image
  src={getFullImageUrl(teaMaster.avatar_url)}
  width={40}
  height={40}
  className="rounded-full object-cover"
/>
```
**位置**：第167-169行  
**状态**：✅ 已标准化（40x40 圆形）

---

#### BatchDetailHeader.tsx（批次详情头部 - 制茶大师）
```jsx
<Image
  src={getFullImageUrl(teaMaster.avatar_url)}
  width={40}
  height={40}
  className="rounded-full mx-auto mb-2 border-2 border-white shadow"
/>
```
**位置**：第128-130行  
**状态**：✅ 已标准化（40x40 圆形）

---

#### StoryTimeline.tsx（故事时间轴 - 采摘队长）
```jsx
<Image
  src={getFullImageUrl(leader.avatar_url)}
  width={40}
  height={40}
  className="rounded-full object-cover"
/>
```
**位置**：第161-163行  
**状态**：✅ 已标准化（40x40 圆形）

---

### 2. 生长页面组件

#### DailyLogCard.tsx（每日日志卡片 - 记录人）
```jsx
<div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
  <Image
    src={getFullImageUrl(recorderInfo.avatar_url)}
    width={40}
    height={40}
    className="w-full h-full object-cover"
  />
</div>
```
**位置**：第429-437行  
**状态**：✅ 已标准化（40x40 圆形）

---

#### DailyDetailPanel.tsx（每日详情面板 - 拍摄人）
```jsx
<div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
  <Image
    src={getFullImageUrl(photographerInfo.avatar_url)}
    width={40}
    height={40}
    className="w-full h-full object-cover"
  />
</div>
```
**位置**：第455-463行  
**状态**：✅ 本次修改（从 48x48 改为 40x40）

---

## 📊 修改对比

### DailyDetailPanel.tsx - 拍摄人头像

**修改前（48x48）**：
```jsx
{/* 头像 - 增大尺寸到 48x48，确保是正圆形 */}
<div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
  <Image
    src={getFullImageUrl(photographerInfo.avatar_url)}
    width={48}
    height={48}
    className="w-full h-full object-cover"
  />
</div>

{/* 占位符 */}
<div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-base text-gray-600 font-medium flex-shrink-0">
  {photographerInfo.name?.[0] || '拍'}
</div>
```

**修改后（40x40）**：
```jsx
{/* 头像 - 圆形 40x40 */}
<div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
  <Image
    src={getFullImageUrl(photographerInfo.avatar_url)}
    width={40}
    height={40}
    className="w-full h-full object-cover"
  />
</div>

{/* 占位符 */}
<div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm text-gray-600 font-medium flex-shrink-0">
  {photographerInfo.name?.[0] || '拍'}
</div>
```

**额外调整**：
- 占位符文字大小从 `text-base` 改为 `text-sm`，与其他占位符保持一致

---

## 🎨 统一的视觉效果

### 所有人物头像的标准样式

```jsx
// 1. 有头像时
<Image
  src={avatarUrl}
  alt={name}
  width={40}
  height={40}
  className="rounded-full object-cover"
  unoptimized
/>

// 2. 无头像时（占位符）
<div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">
  {name?.[0] || '默'}
</div>
```

### 关键样式要素

| 属性 | 值 | 说明 |
|------|-----|------|
| 宽度 | `40px` / `w-10` | 统一尺寸 |
| 高度 | `40px` / `h-10` | 统一尺寸 |
| 形状 | `rounded-full` | 完全圆形 |
| 图片适配 | `object-cover` | 裁剪并填充 |
| 占位符背景 | `bg-gray-300` | 灰色背景 |
| 占位符文字 | `text-gray-600` | 深灰色文字 |
| 占位符字号 | `text-sm` | 小号字体 |

---

## 📋 完整的头像使用清单

| 页面/组件 | 角色 | 尺寸 | 状态 |
|-----------|------|------|------|
| BatchCard | 制茶师 | 40x40 | ✅ |
| BatchDetailHeader | 制茶大师 | 40x40 | ✅ |
| StoryTimeline | 采摘队长 | 40x40 | ✅ |
| DailyLogCard | 记录人 | 40x40 | ✅ |
| DailyDetailPanel | 拍摄人 | 40x40 | ✅ 本次修改 |

---

## 🔍 非头像的圆形元素（不需要修改）

以下圆形元素不是人物头像，保持原有尺寸：

| 元素 | 尺寸 | 用途 |
|------|------|------|
| 时间轴节点 | 32x32 (`w-8 h-8`) | StoryTimeline 的日期节点 |
| 等级徽章 | 56x56 (`w-14 h-14`) | 批次卡片的等级标识 |
| 序号标记 | 24x24 (`w-6 h-6`) | 月度详情的序号 |
| 茶字Logo | 48x48 (`w-12 h-12`) | Footer 的品牌标识 |
| 返回按钮 | 40x40 (`w-10 h-10`) | 导航按钮容器 |
| 轮播指示点 | 8x8 (`w-2 h-2`) | 图片轮播指示器 |

---

## 🧪 验证步骤

### 1. 批次追溯页面
```
访问：/suyuan/[category]
检查：批次卡片中的制茶师头像 ✓
```

### 2. 批次详情页面
```
访问：/suyuan/batch/[batchId]
检查：
- 头部制茶大师头像 ✓
- 鲜叶采集部分的队长头像 ✓
```

### 3. 生长页面
```
访问：/shengzhang
检查：
- 日志卡片中的记录人头像 ✓
- 点击卡片查看详情面板
- 详情面板中的拍摄人头像 ✓
```

### 验证要点
- [ ] 所有头像都是正圆形
- [ ] 所有头像尺寸一致（40x40像素）
- [ ] 占位符样式统一（灰色背景、深灰文字）
- [ ] 图片不变形（object-cover 正常工作）
- [ ] 移动端和桌面端显示正常

---

## ✨ 标准化的好处

### 1. 视觉一致性
- 所有人物头像大小统一
- 提升整体设计的专业性
- 用户体验更加协调

### 2. 开发维护
- 统一的尺寸标准易于遵循
- 减少样式不一致的问题
- 便于后续新增头像功能

### 3. 性能优化
- 统一的图片尺寸便于缓存
- Next.js Image 优化更有效
- 减少布局偏移（CLS）

---

## 📝 开发规范

今后添加新的头像时，请遵循以下规范：

```jsx
// ✅ 正确示例
{avatarUrl ? (
  <Image
    src={getFullImageUrl(avatarUrl)}
    alt={name}
    width={40}
    height={40}
    className="rounded-full object-cover"
    unoptimized
  />
) : (
  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">
    {name?.[0] || '默'}
  </div>
)}

// ❌ 错误示例
<Image
  width={48}  // ❌ 尺寸不统一
  height={48}
  className="rounded-lg"  // ❌ 不是圆形
/>
```

---

## 🎯 完成状态

✅ **所有头像已统一为 40x40 圆形标准**

- ✅ 5个组件的头像已全部标准化
- ✅ 占位符样式统一
- ✅ 视觉效果协调一致
- ✅ 无 linter 错误

---

**标准化时间**：2025年10月6日  
**修改内容**：将拍摄人头像从 48x48 改为 40x40，实现全站头像尺寸统一  
**影响文件**：1个组件文件（DailyDetailPanel.tsx）

