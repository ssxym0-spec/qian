# 生长过程页 - 快速入门指南

## 📋 概述

生长过程页是茶叶溯源网站的核心功能页面，展示茶园的每日生长记录和月度汇总报告。

## 🚀 快速开始

### 1. 前置要求

确保以下服务正在运行：

- ✅ **前端开发服务器**: Next.js 应该运行在 `http://localhost:3001`（或其他端口）
- ✅ **后端 API 服务**: Express 应该运行在 `http://localhost:3000`

### 2. 启动前端服务

在项目根目录运行：

```bash
npm run dev
```

### 3. 访问页面

在浏览器中打开：

```
http://localhost:3001/shengzhang
```

或访问特定月份：

```
http://localhost:3001/shengzhang?month=2024-09
```

## 🔌 API 集成

### 后端 API 端点

页面需要以下 API 端点：

```
GET http://localhost:3000/api/public/growth-data?month=YYYY-MM
```

### API 响应格式

请参考以下示例文件了解完整的数据格式：

1. **当月记录（无月度汇总）**: `growth-data-example.json`
2. **上月记录（包含月度汇总）**: `growth-monthly-summary-example.json`

### 示例响应结构

```json
{
  "daily_logs": [
    {
      "date": "2024-09-05",
      "plot_name": "A区东坡",
      "recorder": "张师傅",
      "weather": "晴",
      "temperature_range": "18~26°C",
      "summary": "茶树生长态势良好...",
      "full_description": "今日天气晴朗，光照充足...",
      "images": ["url1", "url2"],
      "sunlight_hours": 8.5,
      "rainfall": 0,
      "avg_temperature": 22,
      "humidity": 65,
      "farm_activities": "灌溉：...",
      "phenological_observation": "新芽萌发整齐...",
      "is_abnormal": false,
      "abnormal_description": null,
      "abnormal_solution": null
    }
  ],
  "monthly_summary": null  // 或包含完整的月度汇总对象
}
```

## 📁 项目结构

```
app/
├── shengzhang/
│   └── page.tsx                    # 主页面（服务器组件）
└── components/
    └── growth/
        ├── types.ts                # TypeScript 类型定义
        ├── GrowthPageClientWrapper.tsx  # 客户端交互容器
        ├── MonthSelector.tsx       # 月份选择器
        ├── CardStream.tsx          # 卡片流
        ├── DailyLogCard.tsx        # 每日日志卡片
        ├── MonthlySummaryCard.tsx  # 月度汇总卡片
        ├── DailyDetailPanel.tsx    # 每日详情面板
        ├── MonthlyDetailPanel.tsx  # 月度汇总详情面板
        └── README.md               # 详细组件文档
```

## 🎨 核心功能

### 1. 月份切换
- 点击底部的月份数字（1-12）
- 页面自动刷新，显示对应月份的数据
- 当前选中月份会高亮显示（橘黄色、加粗）

### 2. 查看每日记录
- 点击任意每日日志卡片
- 详情面板从右侧滑入
- 显示完整的生长记录、环境数据、农事活动等
- 支持图片轮播（如果有多张图片）

### 3. 查看月度汇总
- 月度汇总卡片仅在上月记录完成后显示
- 点击月度汇总卡片
- 查看本月统计、农事日历、气候数据、下月计划等

### 4. 状态标签优先级
卡片左上角的状态标签按以下优先级显示：
1. **异常**（红色）- 最高优先级
2. **农事活动**（多色）
   - 施肥（绿色）
   - 修剪（蓝色）
   - 灌溉（青色）
   - 采摘（琥珀色）

## 🐛 常见问题

### 1. 页面显示"数据加载失败"

**原因**: 后端 API 服务未运行或无法访问

**解决方法**:
```bash
# 检查后端服务是否运行在 http://localhost:3000
# 如果没有，启动后端服务
cd [后端项目目录]
npm start
```

### 2. 图片无法显示

**原因**: Next.js 的图片域名配置

**解决方法**: 在 `next.config.js` 中添加图片域名：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      // 添加你的图片服务器域名
    ],
  },
};

module.exports = nextConfig;
```

### 3. 页面空白或无内容

**原因**: API 返回的数据为空

**解决方法**: 
- 确认后端数据库中有对应月份的数据
- 使用示例数据文件测试 API 响应格式是否正确
- 检查浏览器控制台的错误信息

### 4. 详情面板无法关闭

**原因**: 可能是 JavaScript 错误

**解决方法**:
- 刷新页面
- 检查浏览器控制台的错误信息
- 点击遮罩层（面板外的半透明区域）关闭

## 📱 响应式设计

页面完全支持移动端和桌面端：

- **移动端** (`< 768px`): 
  - 详情面板全屏显示
  - 卡片垂直堆叠
  - 月份选择器紧凑布局

- **桌面端** (`>= 768px`):
  - 详情面板占屏幕一半宽度
  - 卡片采用水平布局
  - 更大的间距和字体

## 🎯 测试建议

### 1. 功能测试
- [ ] 访问默认页面（当前月份）
- [ ] 切换不同月份
- [ ] 打开每日详情面板
- [ ] 浏览图片轮播
- [ ] 查看月度汇总（如果有）
- [ ] 测试异常记录的显示

### 2. 交互测试
- [ ] 卡片悬停效果
- [ ] 详情面板滑入动画
- [ ] 背景滚动锁定
- [ ] 点击遮罩关闭面板
- [ ] 图片左右切换

### 3. 响应式测试
- [ ] 在手机上测试
- [ ] 在平板上测试
- [ ] 在不同浏览器测试（Chrome、Firefox、Safari）

## 📚 进一步阅读

- 详细组件文档：`app/components/growth/README.md`
- 类型定义：`app/components/growth/types.ts`
- API 数据示例：
  - `growth-data-example.json`（当月记录）
  - `growth-monthly-summary-example.json`（包含月度汇总）

## 💡 开发提示

### 修改样式
所有样式使用 Tailwind CSS，主要颜色变量在 `tailwind.config.ts` 中定义。

### 添加新功能
1. 在对应的组件文件中修改
2. 保持服务器组件和客户端组件的清晰分离
3. 遵循现有的代码风格和注释规范

### 调试技巧
- 使用 React Developer Tools 查看组件状态
- 检查 Network 面板确认 API 请求
- 使用 `console.log` 输出关键数据

## 🆘 需要帮助？

如果遇到问题：

1. 查看浏览器控制台的错误信息
2. 检查后端 API 的响应数据
3. 参考示例数据文件确认数据格式
4. 阅读组件详细文档 `README.md`

## ✅ 下一步

页面已经可以正常使用！建议：

1. 连接真实的后端 API
2. 准备真实的茶园图片和数据
3. 根据实际需求调整样式
4. 添加更多交互功能（如分享、导出等）

祝你使用愉快！🍃

