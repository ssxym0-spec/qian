# PlotInfo 组件使用文档

## 概述

`PlotInfo` 是一个用于显示地块信息的 React 组件，支持 **emoji 图标**和**传统图标库**两种渲染方式，能够智能识别图标类型并自动选择最佳展示方案。

## 功能特点

- ✅ **Emoji 图标支持**：直接显示 emoji 表情符号（🏔️、🌱、☀️ 等）
- ✅ **向后兼容**：继续支持旧的 Lucide 图标名称（mountain、leaf、sun 等）
- ✅ **智能识别**：自动判断图标类型并选择对应的渲染方式
- ✅ **副值支持**：可显示额外的副值信息
- ✅ **预设颜色方案**：传统图标有专属颜色，提升视觉辨识度
- ✅ **TypeScript 支持**：完整的类型定义
- ✅ **响应式设计**：适配各种屏幕尺寸

## 安装依赖

```bash
npm install lucide-react
```

## 数据结构

组件接收一个 `plotData` prop，其结构如下：

```typescript
interface InfoItem {
  label: string;      // 标签名称，如 "海拔"
  value: string;      // 对应的值，如 "850米"
  icon: string;       // 图标：可以是emoji（🏔️）或图标名称（mountain）
  sub_value?: string; // 可选的副值，如 "适合高山茶生长"
}

interface PlotData {
  info_list: InfoItem[];
}
```

## 支持的图标映射

| 图标名称 | 对应图标 | 颜色 | 适用场景 |
|---------|---------|------|---------|
| `tag` | 标签图标 | 灰色 | 编号、标识 |
| `location` | 地图定位 | 蓝色 | 地理位置 |
| `leaf` | 叶子 | 青色 | 植物、茶树品种 |
| `maximize` | 最大化 | 橙色 | 面积、规模 |
| `mountain` | 山峰 | 绿色 | 海拔、地形 |
| `layers` | 图层 | 琥珀色 | 土壤、分层信息 |
| `sun` | 太阳 | 黄色 | 日照、光照 |
| `cloud-rain` | 云雨 | 天蓝色 | 降雨量、天气 |
| `user` | 用户 | 靛蓝色 | 管理人、负责人 |
| `default` | 帮助圆圈 | 浅灰 | 未匹配图标的备用 |

## 使用示例

### 基础用法（使用 Emoji 图标 - 推荐）

```tsx
import PlotInfo from './components/PlotInfo';

function MyPage() {
  const plotData = {
    info_list: [
      {
        label: "海拔",
        value: "1200米",
        icon: "🏔️",
        sub_value: "适合高山茶生长"
      },
      {
        label: "位置",
        value: "云南省西双版纳",
        icon: "📍"
      },
      {
        label: "主栽品种",
        value: "大叶种",
        icon: "🌱"
      },
      {
        label: "年均日照",
        value: "2000小时",
        icon: "☀️"
      },
      {
        label: "管理者",
        value: "张师傅",
        icon: "👤"
      }
    ]
  };

  return <PlotInfo plotData={plotData} />;
}
```

### 使用传统图标（向后兼容）

```tsx
import PlotInfo from './components/PlotInfo';

function MyPage() {
  const plotData = {
    info_list: [
      {
        label: "海拔",
        value: "850米",
        icon: "mountain"  // 使用图标名称
      },
      {
        label: "位置",
        value: "云南省西双版纳",
        icon: "location"
      },
      {
        label: "面积",
        value: "15亩",
        icon: "maximize"
      }
    ]
  };

  return <PlotInfo plotData={plotData} />;
}
```

### 混合使用（Emoji + 传统图标）

```tsx
const plotData = {
  info_list: [
    {
      label: "海拔",
      value: "1200米",
      icon: "🏔️"  // Emoji
    },
    {
      label: "土壤质地",
      value: "红壤",
      icon: "layers"  // 传统图标名称
    }
  ]
};
```

### 从 API 获取数据

```tsx
import { useState, useEffect } from 'react';
import PlotInfo from './components/PlotInfo';

function PlotDetailPage() {
  const [plotData, setPlotData] = useState(null);

  useEffect(() => {
    // 从后端 API 获取数据
    fetch('/api/plot/123')
      .then(res => res.json())
      .then(data => setPlotData(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>地块详情</h1>
      <PlotInfo plotData={plotData} />
    </div>
  );
}
```

### 处理空数据

组件内置了空数据处理，当 `plotData` 为 `null` 或 `info_list` 为空时，会显示友好的提示信息：

```tsx
<PlotInfo plotData={null} />
// 显示: "暂无地块信息"
```

## 自定义扩展

### 添加新图标

如果需要添加更多图标，只需修改 `iconMapping` 对象：

```typescript
import { NewIcon } from 'lucide-react';

const iconMapping = {
  // ... 现有图标
  'new-icon-name': { 
    component: NewIcon, 
    color: 'text-purple-500' 
  }
};
```

### 自定义样式

组件使用 Tailwind CSS，你可以通过修改类名来调整样式：

```tsx
// 在 PlotInfo.tsx 中找到对应的元素
<div className="p-6 bg-white rounded-lg shadow-sm">
  {/* 修改这些类名以自定义外观 */}
</div>
```

## 注意事项

1. **推荐使用 Emoji**：新数据建议使用 emoji 图标（🏔️、🌱、☀️），视觉效果更好且无需额外依赖
2. **向后兼容**：旧的图标名称（mountain、leaf、sun）仍然有效，组件会自动识别
3. **图标识别逻辑**：
   - 如果 `icon` 值在 `iconMapping` 中存在 → 渲染 Lucide 图标组件
   - 如果 `icon` 值不在 `iconMapping` 中 → 视为 emoji 直接显示
4. **副值显示**：`sub_value` 字段为可选，会显示在值的后面，用小括号包裹
5. **Tailwind CSS**：确保项目已正确配置 Tailwind CSS
6. **类型安全**：在 TypeScript 项目中使用时，会有完整的类型检查

## 故障排查

### 图标不显示

- 检查 `lucide-react` 是否已安装
- 确认 `icon` 字段的值是否在 `iconMapping` 中定义

### 颜色未生效

- 确认项目中已配置 Tailwind CSS
- 检查 `tailwind.config.ts` 中是否包含了对应的颜色类

### TypeScript 报错

- 确保传入的数据结构符合 `PlotData` 接口定义
- 检查 `info_list` 是否为数组类型

## 版本信息

- React: ^18.3.1
- Next.js: ^14.2.15
- lucide-react: 最新版本
- TypeScript: ^5

## 许可证

根据项目许可证使用
