# 月度汇总组件使用指南

## 📦 组件概述

本项目新增了两个月度汇总组件，用于在"生长过程页"中展示月度总结数据：

1. **MonthlySummaryCard.tsx** - 月度汇总卡片（入口组件）
2. **MonthlyDetailPanel.tsx** - 月度汇总详情页（完整展示）

---

## 🎯 设计特点

### MonthlySummaryCard（月度汇总卡片）

- **布局**: 左侧1/3视频缩略图 + 右侧2/3内容区
- **视觉亮点**: 缩略图中央叠加醒目的播放按钮图标
- **内容**: 仅显示放大的标题（如"九月汇总记录"）
- **交互**: 整张卡片可点击，带有与"每日日志卡片"一致的悬停效果

### MonthlyDetailPanel（月度汇总详情）

- **布局**: 从右侧滑入的全屏面板
- **导航**: 固定顶部导航栏（含返回按钮）
- **内容模块**（按顺序）:
  1. **顶部影像画廊** - 支持轮播的图片展示
  2. **本月采摘统计** - 采摘次数 + 鲜叶总重量
  3. **本月农事日历** - 两栏布局（日期 | 农事活动，右对齐）
  4. **本月异常处理** - 条件显示，按日期列表展示
  5. **本月气候数据** - 月平均气温 + 总降水量
  6. **下月计划** - 带序号的列表展示

---

## 🔌 快速集成

### 第一步：在主页面导入组件

```tsx
import MonthlySummaryCard from './components/growth/MonthlySummaryCard';
import MonthlyDetailPanel from './components/growth/MonthlyDetailPanel';
import { MonthlySummary } from './components/growth/types';
```

### 第二步：状态管理

```tsx
const [selectedSummary, setSelectedSummary] = useState<MonthlySummary | null>(null);
```

### 第三步：渲染卡片

```tsx
{monthlySummary && (
  <MonthlySummaryCard
    summary={monthlySummary}
    onClick={() => setSelectedSummary(monthlySummary)}
  />
)}
```

### 第四步：渲染详情页

```tsx
{selectedSummary && (
  <MonthlyDetailPanel
    summary={selectedSummary}
    onClose={() => setSelectedSummary(null)}
  />
)}
```

---

## 📡 API 数据格式

### 后端 API 接口

```
GET /api/public/monthly-summary?month=YYYY-MM
```

### 响应数据结构（新 API）

```json
{
  "month": "2024-09",
  "video_url": "https://example.com/video.mp4",
  "video_thumbnail": "https://example.com/thumbnail.jpg",
  "detail_gallery": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "harvest_stats": {
    "count": 5,
    "total_weight": 120.5
  },
  "farm_calendar": [
    { "date": "09-05", "activity": "秋茶采摘" },
    { "date": "09-15", "activity": "土壤改良" }
  ],
  "abnormal_summary": [
    {
      "date": "09-10",
      "description": "发现病虫害",
      "solution": "喷洒生物农药"
    }
  ],
  "climate_summary": {
    "avg_temperature": 22.5,
    "total_rainfall": 85.3
  },
  "next_month_plan": [
    "计划进行深耕松土",
    "准备越冬管理措施"
  ]
}
```

---

## 🔄 数据适配（兼容性）

两个组件均支持**新旧两种 API 格式**，自动进行数据适配：

| 数据项 | 新 API 字段 | 旧 API 字段 |
|--------|-------------|-------------|
| 影像资料 | `detail_gallery` | `images` |
| 采摘统计 | `harvest_stats.count` / `harvest_stats.total_weight` | `harvest_count` / `total_harvest_weight` |
| 异常记录 | `abnormal_summary` | `abnormal_records` |
| 气候数据 | `climate_summary.avg_temperature` / `climate_summary.total_rainfall` | `avg_temperature` / `total_rainfall` |
| 下月计划 | `next_month_plan` (数组或字符串) | `next_month_plan` (字符串) |

---

## 🎨 样式说明

- 所有样式均使用 **Tailwind CSS**
- 遵循项目统一的设计规范：
  - 卡片圆角：`rounded-lg`
  - 阴影效果：`shadow-md` / `shadow-xl`
  - 悬停动画：`hover:-translate-y-1` + `hover:shadow-xl`
  - 主色调：品牌强调色（绿色、橙色、紫色等）

---

## ✨ 交互特性

### MonthlySummaryCard

- ✅ 鼠标悬停：卡片轻微上浮 + 阴影加深
- ✅ 点击反馈：轻微缩放效果
- ✅ 播放按钮：悬停时放大并加深背景

### MonthlyDetailPanel

- ✅ 滑入动画：从右侧平滑滑入
- ✅ 背景锁定：打开时禁用背景滚动
- ✅ 图片轮播：支持手动切换 + 5秒自动播放
- ✅ 半透明遮罩：点击遮罩可关闭面板

---

## 📝 注释说明

所有代码均包含详细的**中文注释**，方便理解和维护：

- **数据适配层**：说明新旧 API 格式的兼容处理
- **组件结构**：解释布局和样式选择原因
- **交互逻辑**：描述用户操作的响应机制

---

## 🔍 完整示例

参考 `app/components/growth/GrowthPageClientWrapper.tsx` 中的集成示例，查看完整的使用方式。

---

## 📌 注意事项

1. **图片资源**：确保提供的图片 URL 有效且可访问
2. **响应式布局**：组件已针对移动端和桌面端优化
3. **条件渲染**：异常处理和下月计划会根据数据是否存在自动显示/隐藏
4. **类型安全**：所有 props 和数据结构均已定义 TypeScript 类型

---

## 🆘 故障排查

### 问题：图片无法显示

- 检查 `next.config.js` 是否配置了图片域名白名单
- 确认图片 URL 格式正确且可访问

### 问题：面板无法关闭

- 确保 `onClose` 回调函数正确绑定
- 检查是否有其他组件阻止了点击事件

### 问题：数据格式错误

- 使用浏览器 DevTools 检查 API 响应数据
- 参考 `types.ts` 中的类型定义进行对比

---

**开发完成日期**: 2025-10-02  
**开发者备注**: 所有组件均严格遵循"1网站大纲.txt"中的设计规范开发 ✅

