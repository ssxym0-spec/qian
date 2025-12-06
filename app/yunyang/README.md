# 云养茶园页面

## 页面概述

云养茶园页面是一个场景化营销页面，旨在连接品牌与核心粉丝，将一次性的购买行为转化为长期的、情感化的深度参与。本页面针对不同客群（私人、企业、B端）提供场景化的解决方案。

## 技术架构

### 技术栈
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**

### 组件结构

```
app/yunyang/
├── page.tsx                              # 主页面（服务器组件）
├── types.ts                              # TypeScript 类型定义
├── components/
│   ├── AdoptionPageClientWrapper.tsx     # 客户端交互容器（管理Tab和粘性头部）
│   ├── PrivatePlan.tsx                   # 私人定制方案
│   ├── EnterprisePlan.tsx                # 企业领养方案
│   ├── B2BPlan.tsx                       # B端合作方案
│   ├── ValuePropositionCard.tsx          # 核心价值主张卡片
│   ├── StackedCards.tsx                  # 卡片堆叠交互组件
│   ├── ScenarioCarousel.tsx              # 场景轮播组件（支持手势滑动）
│   ├── PackageTabs.tsx                   # 套餐选项卡组件
│   └── ProcessTimeline.tsx               # 流程时间轴组件
```

## 核心功能

### 1. 粘性Tab导航
- 页面滚动时，客群切换Tab会固定在顶部
- 使用 `IntersectionObserver` 实现精准的粘性定位检测
- 首次切换后隐藏主副标题，最大化内容展示区域

### 2. 三个方案切换
- **私人定制**：面向高端个人客户
- **企业领养**：面向企业客户
- **B端合作**：面向商业合作伙伴

### 3. 复杂交互组件

#### StackedCards（卡片堆叠）
- 客户案例的展示方式
- 点击最上方的卡片，它会移到堆叠底部
- 支持平滑的动画过渡

#### ScenarioCarousel（场景轮播）
- 支持触摸/鼠标拖拽切换
- 7秒自动播放（用户交互时暂停）
- 动态胶囊指示器（当前场景高亮并拉长）
- 完全响应式设计

#### PackageTabs（套餐选项卡）
- 展示不同等级的套餐（标准、尊享、VIP）
- 默认选中"尊享套餐"
- 每个套餐的权益配有独特图标

#### ProcessTimeline（流程时间轴）
- 视觉化展示领养/合作流程
- 每个步骤配有图标和详细说明
- 步骤之间用连接线串联

## 数据流

### 服务器端数据获取
```typescript
// app/yunyang/page.tsx
const response = await fetch('http://localhost:3000/api/public/adoption-plans', {
  cache: 'no-store',
});
const adoptionPlans = await response.json();
```

### API 响应格式
```json
[
  {
    "type": "private",
    // ... 私人定制方案数据
  },
  {
    "type": "enterprise",
    // ... 企业领养方案数据
  },
  {
    "type": "b2b",
    // ... B端合作方案数据
  }
]
```

## 响应式设计

### 断点策略
- **移动端**：< 768px
- **平板**：768px - 1024px
- **桌面**：> 1024px

### 关键响应式处理
1. **标题文字**：在移动端自动换行和缩小
2. **卡片布局**：从2列网格到单列
3. **轮播容器**：支持触摸手势
4. **Tab导航**：缩小间距和字体

## 样式规范

### 颜色
- **品牌主色（谷雨金）**：`#C5A572`
- **悬停色**：`#B89562`
- **文字主色**：`stone-800`
- **文字次要色**：`stone-600`
- **背景色**：`stone-50` 到 `white` 渐变

### 字体
- **标题字体**：思源宋体 (`'Noto Serif SC', serif`)
- **正文字体**：系统默认字体

### 间距
- **组件间距**：`16-20` (移动端) / `16-20` (桌面)
- **内边距**：`4-8` (移动端) / `8-12` (桌面)

## 使用说明

### 访问页面
在浏览器中访问：`http://localhost:3000/yunyang`

### 开发调试
```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行生产版本
npm start
```

## 浏览器兼容性
- Chrome/Edge (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- 移动端浏览器

## 性能优化
- 服务器组件（RSC）用于初始数据获取
- 客户端组件仅用于交互逻辑
- 图片懒加载（如需添加图片）
- Tailwind CSS 的 JIT 编译

## 未来扩展
- [ ] 连接真实的后端API数据
- [ ] 添加茶园实景图片
- [ ] 集成在线咨询系统
- [ ] 添加表单提交功能
- [ ] SEO优化

## 注意事项
1. 确保后端API服务在 `http://localhost:3000` 运行
2. API返回的数据结构需要符合 `types.ts` 中定义的类型
3. 所有交互都已经实现，无需额外JavaScript库
4. 粘性定位需要浏览器支持 `position: sticky`

