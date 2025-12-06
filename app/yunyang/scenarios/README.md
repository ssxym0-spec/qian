# 场景化应用展示页面

## 📋 功能说明

此模块实现了云养茶园认养页面的场景化应用探索功能，用于展示私人定制和企业领养的各种应用场景。

## 📂 文件结构

```
app/yunyang/
├── scenarios/
│   ├── page.tsx              # 场景展示主页面
│   ├── scenarios.css         # 场景展示样式
│   └── README.md            # 本文档
├── components/
│   ├── ScenarioCard.tsx     # 场景卡片组件
│   └── ScenarioModal.tsx    # 场景详情弹窗组件
└── types/
    └── scenario.ts          # TypeScript类型定义
```

## 🚀 使用方法

### 访问页面

```
# 私人定制场景
http://localhost:3000/yunyang/scenarios?type=private

# 企业领养场景
http://localhost:3000/yunyang/scenarios?type=enterprise
```

### 组件使用

```tsx
import ScenarioCard from '@/app/yunyang/components/ScenarioCard';
import ScenarioModal from '@/app/yunyang/components/ScenarioModal';
import { Scenario, PlanType } from '@/app/yunyang/types/scenario';

// 在你的组件中使用
<ScenarioCard 
  scenario={scenarioData} 
  type="private" 
  index={0}
  onClick={() => handleClick()}
/>

<ScenarioModal
  scenario={selectedScenario}
  type="private"
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

## 📊 数据结构

### Scenario 类型

```typescript
interface Scenario {
  id?: string;
  title: string;                    // 场景标题
  icon?: string;                    // 场景图标 (Emoji)
  pain_point?: string;              // 用户痛点
  solution?: string;                // 解决方案
  background_image?: string;        // 背景图片URL
  core_values?: CoreValue[];        // 核心价值列表
}
```

### CoreValue 类型

```typescript
interface CoreValue {
  icon: string;                     // 价值图标 (Emoji)
  title: string;                    // 价值标题
  description?: string;             // 价值描述
}
```

## 🎨 样式定制

### 主题色配置

```css
/* 私人定制主题 */
.scenario-card-private {
  border-top-color: #3498db;  /* 蓝色 */
}

/* 企业领养主题 */
.scenario-card-enterprise {
  border-top-color: #9b59b6;  /* 紫色 */
}
```

### 自定义样式

可以通过修改 `scenarios.css` 文件来自定义样式：
- 卡片布局和间距
- 颜色主题
- 动画效果
- 响应式断点

## 🔌 API 集成

### 接口地址

```
GET /api/adoption-plans/{type}
```

### 参数说明

- `type`: `private` (私人定制) 或 `enterprise` (企业领养)

### 返回数据格式

```json
{
  "type": "private",
  "scenario_applications": [
    {
      "title": "场景名称",
      "icon": "🎯",
      "pain_point": "用户痛点描述",
      "solution": "解决方案描述",
      "background_image": "图片URL",
      "core_values": [
        {
          "icon": "✨",
          "title": "核心价值",
          "description": "价值描述"
        }
      ]
    }
  ]
}
```

## ✨ 功能特性

### 1. 场景卡片展示
- 网格布局展示所有场景
- 卡片hover效果
- 响应式设计
- 主题色区分

### 2. 场景详情弹窗
- 完整展示场景信息
- 平滑动画效果
- ESC键关闭支持
- 防止背景滚动

### 3. 交互功能
- 点击卡片查看详情
- 立即咨询按钮
- 关闭弹窗
- 键盘导航支持

### 4. 状态管理
- 加载状态显示
- 错误处理
- 空状态展示
- 数据缓存

## 📱 响应式支持

### 桌面端 (≥1200px)
- 3列网格布局
- 完整功能展示

### 平板端 (768px - 1199px)
- 2列网格布局
- 优化的卡片尺寸

### 移动端 (<768px)
- 1列网格布局
- 简化的交互方式
- 全屏弹窗

## 🔧 开发说明

### 本地开发

```bash
# 启动开发服务器
npm run dev

# 访问页面
http://localhost:3000/yunyang/scenarios
```

### 类型检查

```bash
# 运行TypeScript类型检查
npm run type-check
```

### 代码规范

```bash
# 运行ESLint
npm run lint
```

## 🎯 TODO

- [ ] 添加场景搜索功能
- [ ] 添加场景分类筛选
- [ ] 添加场景收藏功能
- [ ] 集成客服系统
- [ ] 添加分享功能
- [ ] 性能优化（图片懒加载）

## 📝 更新日志

### v1.0.0 (2025-10-13)
- ✅ 初始版本发布
- ✅ 场景卡片展示功能
- ✅ 场景详情弹窗功能
- ✅ 响应式设计
- ✅ TypeScript类型定义

## 💡 提示

1. **自定义联系方式**: 修改 `ScenarioModal.tsx` 中的 `handleContactUs` 函数
2. **样式调整**: 在 `scenarios.css` 中修改对应的CSS类
3. **数据源**: 确保后端API返回正确格式的数据
4. **图片优化**: 建议使用CDN并启用图片压缩

---

**开发完成日期**: 2025年10月13日  
**适用版本**: Next.js 13+  
**状态**: ✅ 已完成

