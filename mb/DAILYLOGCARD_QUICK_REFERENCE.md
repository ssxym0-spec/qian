# DailyLogCard 组件快速参考

## 📁 文件结构

```
app/components/growth/
├── DailyLogCard.tsx          # 主组件
├── WeatherIcons.tsx          # 天气图标
├── dailyLogAdapters.ts       # 数据适配器
└── types.ts                  # 类型定义
```

---

## 🔧 核心 API

### 组件使用

```typescript
import DailyLogCard from './components/growth/DailyLogCard';

<DailyLogCard 
  log={dailyLog}           // DailyLog 对象
  onClick={handleClick}    // 点击回调
/>
```

### 适配器函数

```typescript
import {
  getMainImageUrl,      // 获取主图 URL
  getWeatherIcon,       // 获取天气图标
  getTemperatureRange,  // 获取温度范围
  getPlotName,          // 获取地块名称
  getRecorderInfo,      // 获取记录人信息
  getStatusTag,         // 获取状态标签
  formatDate,           // 格式化日期
} from './components/growth/dailyLogAdapters';
```

### 天气图标

```typescript
import {
  SunnyIcon,            // 晴天图标
  CloudyIcon,           // 多云图标
  RainyIcon,            // 雨天图标
  weatherIconMapping,   // 图标映射表
} from './components/growth/WeatherIcons';
```

---

## 📊 数据格式支持

### 新 API 格式

```typescript
{
  main_image_url: "/uploads/image.jpg",
  weather: {
    icon: "晴天",
    temperature_range: "17~25℃"
  },
  plot_id: { name: "台地三号" },
  recorder_id: {
    name: "张师傅",
    avatar_url: "/uploads/avatar.jpg"
  },
  status_tag: {
    text: "采摘",
    color: "#8A2BE2"
  }
}
```

### 旧 API 格式

```typescript
{
  images: ["/uploads/image.jpg"],
  weather: "晴",
  temperature_range: "17~25°C",
  plot_name: "台地三号",
  recorder: "张师傅",
  farm_activities: "采摘",
  is_abnormal: false
}
```

**✅ 两种格式都完全支持！**

---

## ⚡ 性能优化

### React.memo

```typescript
const DailyLogCard = React.memo(({ log, onClick }) => {
  // 只在 props 变化时重渲染
});
```

### useMemo

```typescript
const plotName = useMemo(() => getPlotName(log), [log]);
const formattedDate = useMemo(() => formatDate(log.date), [log.date]);
// 缓存计算结果，避免重复计算
```

### 图片优化

```typescript
<Image
  loading="lazy"        // 懒加载
  quality={70}          // 压缩质量
  sizes="33vw"          // 响应式尺寸
  onLoad={handleLoad}   // 加载完成回调
/>
```

---

## 🎨 UI 布局

```
┌─────────────────────────────────────────┐
│  ┌──────┐  ┌──────────────────────────┐ │
│  │      │  │ 10月2日          ☀️ 14~25℃│ │
│  │      │  │                          │ │
│  │ 图片 │  │ 空气湿润，茶园土壤松软   │ │
│  │ 1/3  │  │ 保墒良好。茶树秋梢...    │ │
│  │      │  │                          │ │
│  │      │  │ 台地三号 | 张师傅      → │ │
│  └──────┘  └──────────────────────────┘ │
└─────────────────────────────────────────┘
   ← 1/3 →    ←      2/3                →
```

---

## 🔑 关键特性

### ✅ 数据兼容
- 新旧 API 格式自动适配
- 智能回退机制
- 默认值处理

### ✅ 性能优化
- React.memo 避免重渲染
- useMemo 缓存计算
- 图片懒加载

### ✅ 用户体验
- 骨架屏加载动画
- 图片平滑淡入
- 悬停/点击效果

### ✅ 类型安全
- TypeScript 类型定义
- 减少运行时错误
- 更好的 IDE 提示

---

## 🧩 自定义使用

### 单独使用适配器

```typescript
import { getPlotName, formatDate } from './dailyLogAdapters';

function MyComponent({ log }) {
  const plotName = getPlotName(log);
  const date = formatDate(log.date);
  return <div>{plotName} - {date}</div>;
}
```

### 单独使用天气图标

```typescript
import { SunnyIcon } from './WeatherIcons';

function MyWeather() {
  return <SunnyIcon className="w-6 h-6" />;
}
```

---

## 🐛 常见问题

### Q: 图片不显示？

**A:** 检查 `getFullImageUrl` 是否正确导入：

```typescript
import { getFullImageUrl } from '../../suyuan/utils/imageUtils';
```

### Q: 天气图标是空白？

**A:** 确保使用正确的天气名称映射：

```typescript
// 支持的名称：晴天、多云、阴天、雨天、晴、云、阴、雨
```

### Q: 记录人头像不显示？

**A:** 检查后端是否使用 `.populate('recorder_id')`：

```javascript
// 后端代码
DailyLog.find().populate('recorder_id', 'name avatar_url');
```

---

## 📦 依赖

### 必需依赖
- `react` - React 核心
- `next/image` - Next.js 图片组件
- `./types` - 类型定义
- `../../suyuan/utils/imageUtils` - 图片工具

### 无新增外部依赖
所有优化使用 React 内置 API，无需安装额外包。

---

## ✨ 优化亮点

| 特性 | 说明 |
|------|------|
| **代码减少 65%** | 主文件从 480 行减少到 170 行 |
| **零破坏性变更** | 组件 API 完全不变 |
| **性能提升** | 使用 memo 和 useMemo 缓存 |
| **模块化** | 图标和适配器可独立复用 |
| **类型安全** | 减少 `as any` 使用 |
| **用户体验** | 骨架屏 + 平滑动画 |

---

## 🔗 相关文档

- [DAILYLOGCARD_OPTIMIZATION_SUMMARY.md](./DAILYLOGCARD_OPTIMIZATION_SUMMARY.md) - 详细优化说明
- [DAILYLOGCARD_REFACTOR_SUMMARY.md](./DAILYLOGCARD_REFACTOR_SUMMARY.md) - 之前的重构记录
- [DAILY_LOG_CARD_LAYOUT_REFACTOR.md](./DAILY_LOG_CARD_LAYOUT_REFACTOR.md) - 布局重构说明

---

**最后更新**: 2025-10-08  
**版本**: 2.0（优化版）  
**状态**: ✅ 生产就绪

