# 批次追溯页 - 快速参考文档

## 📋 项目概述

批次追溯页是一个完整的、沉浸式的故事线页面系统，用于展示茶叶从鲜叶采集到匠心制作的全过程。该系统包含两个核心视图：

1. **批次列表视图**：展示指定品类的所有批次
2. **批次详情视图**：展示单个批次的完整故事线

## 🗂️ 文件结构

```
app/
├── components/
│   └── BottomNav.tsx                    # ✅ 已更新 - 全局底部导航栏
└── suyuan/                              # 📁 批次追溯页目录（新建）
    ├── types.ts                         # 类型定义
    ├── components/                      # 子组件目录
    │   ├── CategoryFilter.tsx           # 品类筛选器（客户端组件）
    │   ├── BatchCard.tsx                # 批次卡片
    │   ├── BatchDetailHeader.tsx        # 批次详情头部
    │   ├── StoryTimeline.tsx            # 故事时间轴
    │   ├── ProductionSteps.tsx          # 制作工艺步骤（客户端组件）
    │   └── ProductDisplay.tsx           # 成品鉴赏
    ├── [category]/
    │   └── page.tsx                     # 批次列表页面（服务器组件）
    └── batch/
        └── [batchId]/
            └── page.tsx                 # 批次详情页面（服务器组件）
```

## 🌐 路由说明

### 1. 批次列表页面
- **路径格式**: `/suyuan/[category]`
- **示例路径**:
  - `/suyuan/mingqian` - 明前茶
  - `/suyuan/yuqian` - 雨前茶
  - `/suyuan/chuncha` - 春茶
  - `/suyuan/xiacha` - 夏茶
  - `/suyuan/qiucha` - 秋茶

### 2. 批次详情页面
- **路径格式**: `/suyuan/batch/[batchId]`
- **示例路径**: `/suyuan/batch/673abc123def456789012345`

### 3. 底部导航
- **溯源导航项** 现在指向: `/suyuan/mingqian`（默认显示明前茶）
- **激活状态**: 所有 `/suyuan/*` 路径下都会高亮"溯源"导航项

## 🔌 API 集成

### 后端服务地址
```
http://localhost:3000
```

### API 接口

#### 1. 获取批次列表
```
GET /api/public/batches?category=[categoryName]
```
- **参数**: `category` - 品类中文名称（如：明前茶、雨前茶等）
- **返回**: 批次列表数组 `BatchListItem[]`

#### 2. 获取批次详情
```
GET /api/public/batches/[batchId]
```
- **参数**: `batchId` - 批次的唯一标识符
- **返回**: 完整的批次详情 `BatchDetail`
- **重要**: `harvest_records_ids` 字段已被后端填充为完整的采摘记录数组

## 🎨 核心组件说明

### 1. CategoryFilter（品类筛选器）
- **类型**: 客户端组件 (`'use client'`)
- **功能**: 
  - 五列网格布局，展示所有品类
  - 根据当前路径高亮选中的品类
  - 点击切换不同品类，URL 会相应更新

### 2. BatchCard（批次卡片）
- **类型**: 服务器组件
- **功能**:
  - 展示批次的核心信息（批次号、摘要、等级、制茶师等）
  - 整个卡片可点击，跳转到批次详情页
  - 等级徽章采用图章化设计

### 3. StoryTimeline（故事时间轴）
- **类型**: 服务器组件
- **功能**:
  - 垂直时间轴展示每日采摘记录
  - 展示每日影像（图片/视频）、团队信息
  - 提供"回溯当日生长记录"链接，自动解析日期跳转到生长页面
  - 最后一个节点汇总采集信息

### 4. ProductionSteps（制作工艺步骤）
- **类型**: 客户端组件 (`'use client'`)
- **功能**:
  - 步骤导航（摊晾、杀青、揉捻、干燥、分拣）
  - 工艺切换器（手工匠心 / 现代工艺）
  - 根据选择动态展示对应的图片和描述
  - 使用 `useState` 管理交互状态

### 5. ProductDisplay（成品鉴赏）
- **类型**: 服务器组件
- **功能**:
  - 两列网格展示干茶和泡开后的图片
  - 卡片化展示品鉴笔记、冲泡建议、储存建议

### 6. BatchDetailHeader（批次详情头部）
- **类型**: 服务器组件
- **功能**:
  - 返回按钮（固定左上角）
  - 沉浸式背景媒体（视频或大图）
  - 三列网格展示核心信息（等级、产量、制茶师）

## 🔗 页面间跳转逻辑

### 从列表到详情
```tsx
// BatchCard.tsx
<Link href={`/suyuan/batch/${batch._id}`}>
  {/* 卡片内容 */}
</Link>
```

### 从详情返回列表
```tsx
// BatchDetailHeader.tsx
<Link href={`/suyuan/${categorySlug}`}>
  {/* 返回按钮 */}
</Link>
```

### 跳转到生长日记
```tsx
// StoryTimeline.tsx
const getGrowthLink = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `/shengzhang?month=${month}&date=${day}`;
};
```

## 📱 响应式设计要点

### 五列网格布局（品类筛选器、步骤导航）
```tsx
<div className="grid grid-cols-5 gap-1 md:gap-2">
  {/* 移动端也保持5列，字体和间距调小 */}
</div>
```

### 三列网格布局（核心信息卡片）
```tsx
<div className="grid grid-cols-3 gap-3 md:gap-6">
  {/* 移动端也保持3列，调整间距 */}
</div>
```

### 批次卡片列表
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 移动端单列，桌面端多列 */}
</div>
```

## 🎯 数据流说明

### 批次列表页面
```
URL参数 → 服务器组件
    ↓
解析 category
    ↓
调用 API: GET /api/public/batches?category=...
    ↓
渲染 BatchCard 组件（循环）
```

### 批次详情页面
```
URL参数 → 服务器组件
    ↓
解析 batchId
    ↓
调用 API: GET /api/public/batches/[batchId]
    ↓
分发数据到各个子组件
    ├── BatchDetailHeader
    ├── StoryTimeline
    ├── ProductionSteps（客户端交互）
    └── ProductDisplay
```

## ✨ 关键交互特性

1. **粘性顶部导航**: `CategoryFilter` 使用 `sticky top-0` 保持固定
2. **磨砂玻璃效果**: 底部导航使用 `backdrop-blur-lg` 实现
3. **悬停动画**: 卡片使用 `hover:-translate-y-1` 实现微妙的上浮效果
4. **等级徽章**: 采用渐变背景 + 旋转 + 阴影的图章化设计
5. **时间轴动画**: 使用 `animate-ping` 实现脉动效果
6. **状态管理**: `ProductionSteps` 使用 `useState` 管理步骤和工艺类型

## 🎨 设计规范遵循

### 颜色体系
- **琥珀金**: `#F59E0B` (text-amber-600) - 品牌强调色，用于激活状态
- **等级徽章**:
  - 臻: `from-yellow-400 to-amber-600`
  - 匠: `from-purple-400 to-purple-700`
  - 优: `from-blue-400 to-blue-600`

### 字体
- **标题**: `font-serif` (思源宋体)
- **正文**: `font-sans` (思源黑体)

### 布局
- **最大宽度**: `max-w-5xl` / `max-w-6xl`
- **底部间距**: `pb-20`（为底部导航留出空间）

## 🚀 使用方法

### 1. 启动后端服务
确保后端服务运行在 `http://localhost:3000`

### 2. 启动前端应用
```bash
npm run dev
```

### 3. 访问页面
- 首页导航: 点击底部导航栏的"溯源"按钮
- 直接访问: 浏览器输入 `http://localhost:3001/suyuan/mingqian`

## 🛡️ 错误处理

### 已实现的安全措施

1. **API 响应格式兼容**: 自动处理多种 API 响应格式
2. **空值检查**: 所有可能为空的字段都有防御性检查
3. **占位符 UI**: 缺失媒体时显示优雅的占位符
4. **空状态**: 无数据时显示友好的提示
5. **调试日志**: 控制台输出帮助排查问题

### 常见问题排查

#### 问题: 页面显示"暂无批次数据"
**检查**:
1. 后端服务是否运行在 `http://localhost:3000`
2. 品类名称是否完全匹配（如：`明前茶`）
3. 查看浏览器控制台的 API 响应日志

#### 问题: 图片不显示
**检查**:
1. `hero_media` 字段是否存在且有效
2. 图片 URL 是否可访问
3. 是否有 CORS 问题

#### 问题: 视频不播放
**检查**:
1. 视频格式是否为 `.mp4`、`.webm`、`.ogg` 或 `.mov`
2. 视频 URL 是否可访问
3. 浏览器是否支持该视频格式

---

## 📝 后续扩展建议

1. **加载状态**: 添加骨架屏提升用户体验
2. **图片优化**: 使用 Next.js Image 优化和懒加载
3. **SEO优化**: 添加动态 metadata 和 OpenGraph 标签
4. **动画优化**: 使用 Framer Motion 添加页面过渡动画
5. **离线支持**: 添加 Service Worker 支持离线访问

---

## 📚 相关文档

- **快速参考**: 本文档
- **Bug 修复记录**: `BATCH_TRACING_BUG_FIXES.md`
- **类型定义**: `app/suyuan/types.ts`

---

**创建时间**: 2025年10月3日  
**最后更新**: 2025年10月3日  
**版本**: v1.1
