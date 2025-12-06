# 高端茶叶品牌落地页

这是一个使用 Next.js (App Router)、React、TypeScript 和 Tailwind CSS 构建的高端茶叶品牌溯源网站落地页。

## 技术栈

- **Next.js 14** - React 框架，使用 App Router
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Noto Sans SC & Noto Serif SC** - 思源黑体和思源宋体

## 功能特性

### 已实现的模块

1. **欢迎词模块**
   - 优雅的标题设计
   - "安心"二字的品质辉光渐变效果

2. **地块信息模块**
   - 自动轮播的图片画廊（每5秒切换）
   - 支持触摸手势滑动切换
   - 详细的地块信息列表（图标+标签+数值）
   - 价值点总结
   - CTA按钮（带呼吸动效）

3. **品类信息模块**
   - 响应式两列网格布局
   - 四个品类卡片（明前茶、雨前茶、春茶、夏茶）
   - 动态产量占比进度条（带渐变色）
   - 悬停效果和点击交互

4. **云养茶园CTA横幅**
   - 全屏横幅设计
   - 背景图片缩放效果
   - 渐变叠加层
   - 呼吸动效的CTA按钮

5. **页脚**
   - Logo和品牌信息
   - 核心链接导航
   - 社交媒体图标
   - 版权信息

6. **底部导航栏**
   - 固定在页面底部
   - 磨砂玻璃效果
   - 四个导航项（首页、溯源、生长、认养）
   - 激活状态高亮

### 设计亮点

- ✨ **品牌色系**：完全遵循设计规范，使用墨石黑、深橄榄绿、谷雨金等品牌色
- 🎨 **渐变效果**：多处使用精心设计的渐变（品质辉光、产量占比等）
- 💫 **微交互**：呼吸动效、悬停效果、平滑过渡
- 📱 **响应式设计**：完美适配移动端和桌面端
- 🖼️ **图片容错**：自动处理图片加载失败，切换到备用图片
- 🔄 **自动轮播**：图片自动播放，同时支持手动滑动

## 安装和运行

1. **安装依赖**

```bash
npm install
```

2. **启动后端服务**

确保你的 Express 后端服务正在运行：
- 地址：`http://localhost:3000`
- 接口：`GET /api/public/landing-page`

3. **启动开发服务器**

```bash
npm run dev
```

4. **访问应用**

打开浏览器访问 [http://localhost:3001](http://localhost:3001)（或你配置的端口）

## 数据格式

后端 API (`http://localhost:3000/api/public/landing-page`) 应返回以下格式的 JSON：

```json
{
  "plot": {
    "name": "台地三号",
    "carousel_images": [
      "http://localhost:3000/images/plot1.jpg",
      "http://localhost:3000/images/plot2.jpg"
    ],
    "info_list": [
      { "label": "地块名", "value": "台地三号", "icon": "tag" },
      { "label": "位置", "value": "XX省XX市XX村XX组", "icon": "location", "sub_text": "- 北纬30度 \"黄金产茶带\"" },
      { "label": "主栽品种", "value": "本地群体种", "icon": "leaf" },
      { "label": "面积", "value": "1亩", "icon": "expand" },
      { "label": "海拔", "value": "850米", "icon": "mountain" },
      { "label": "土壤质地", "value": "砂质壤土", "icon": "layers" },
      { "label": "年均日照", "value": "1800小时", "icon": "sun" },
      { "label": "年均降水", "value": "1500毫米", "icon": "droplet" },
      { "label": "管理者", "value": "王师傅", "icon": "user", "sub_text": "- 三代茶人" }
    ],
    "value_summary": "得天独厚的砂质壤土与高山气候，孕育出鲜爽甘醇、独具兰花香的至臻好茶。"
  },
  "categories": [
    {
      "name": "明前茶",
      "image_url": "http://localhost:3000/images/category1.jpg",
      "description": "清明节前采摘，嫩芽初绽，香气清雅",
      "percentage": 9,
      "harvest_period": "3.20 - 4.04"
    },
    {
      "name": "雨前茶",
      "image_url": "http://localhost:3000/images/category2.jpg",
      "description": "谷雨前采摘，滋味醇厚，回甘持久",
      "percentage": 16,
      "harvest_period": "4.05 - 4.19"
    },
    {
      "name": "春茶",
      "image_url": "http://localhost:3000/images/category3.jpg",
      "description": "春季采摘，鲜爽甘醇，营养丰富",
      "percentage": 24,
      "harvest_period": "2.20 - 5.20"
    },
    {
      "name": "夏茶",
      "image_url": "http://localhost:3000/images/category4.jpg",
      "description": "夏季采摘，浓郁饱满，耐冲泡",
      "percentage": 51,
      "harvest_period": "5.21 - 8.31"
    }
  ],
  "cta_bg": "http://localhost:3000/images/tea-garden-bg.jpg"
}
```

## 项目结构

```
.
├── app/
│   ├── layout.tsx          # 全局布局（字体配置）
│   ├── page.tsx            # 主页面（包含所有组件）
│   └── globals.css         # 全局样式
├── public/                 # 静态资源
├── tailwind.config.ts      # Tailwind 配置（品牌色系）
├── tsconfig.json           # TypeScript 配置
├── next.config.js          # Next.js 配置
└── package.json            # 项目依赖
```

## 组件说明

### InteractiveImage
- 客户端组件
- 处理图片加载失败，自动切换到备用图片
- 使用 Next.js 的 Image 组件优化

### WelcomeSection
- 欢迎词模块
- 包含品质辉光渐变效果

### ImageCarousel
- 图片轮播组件
- 支持自动播放和手动滑动
- 带有指示点

### PlotInfo
- 地块信息展示
- 包含轮播图、信息列表、价值总结和CTA

### CategoryList
- 品类卡片网格
- 动态产量占比进度条

### CloudTeaGardenCTA
- 云养茶园转化入口
- 带有背景图片和叠加层

### Footer
- 页脚组件
- Logo、链接、社交媒体、版权信息

### BottomNavigation
- 底部导航栏
- 固定定位，磨砂玻璃效果

## 构建生产版本

```bash
npm run build
npm start
```

## 后续开发

当前只实现了落地页（Page 1）。后续页面包括：
- 批次追溯页（Page 2）
- 生长过程页（Page 3）
- 云养茶园页（Page 4）

这些页面的设计规范已在 `1网站大纲 .txt` 中详细说明。

## 注意事项

1. 确保后端 API 正常运行并返回正确的数据格式
2. 图片 URL 必须可访问，或者会自动切换到备用图片
3. Next.js 配置中已添加 `localhost:3000` 的图片域名白名单
4. 所有数据都是动态获取的，没有硬编码内容

## License

MIT
