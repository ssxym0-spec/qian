# 快速启动指南

## 第一步：安装依赖

在项目根目录打开终端，运行：

```bash
npm install
```

这将安装所有必需的依赖包，包括：
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

## 第二步：启动后端服务

**重要：** 确保你的 Express 后端服务正在运行！

后端服务应该：
- 监听在 `http://localhost:3000`
- 提供 API 接口：`GET /api/public/landing-page`
- 返回符合格式的 JSON 数据（参考 `test-data-example.json`）

## 第三步：启动开发服务器

```bash
npm run dev
```

前端服务将在 `http://localhost:3001` 启动（避免与后端 3000 端口冲突）

## 第四步：在浏览器中访问

打开浏览器，访问：

```
http://localhost:3001
```

你应该能看到完整的茶叶品牌落地页！

## 🎨 设计亮点预览

1. **欢迎词** - "安心"二字带有粉橙渐变效果
2. **地块信息** - 图片自动轮播，支持触摸滑动
3. **品类卡片** - 动态产量占比条，带有精美渐变色
4. **呼吸动效** - CTA 按钮有持续的呼吸动画
5. **底部导航** - 磨砂玻璃效果，固定在底部

## 📱 响应式测试

- 在浏览器中打开开发者工具（F12）
- 切换到移动设备模式
- 测试不同屏幕尺寸（iPhone、iPad 等）

## 🐛 常见问题

### 问题1：npm install 失败

**解决方案：**
```bash
# 清除缓存重试
npm cache clean --force
npm install
```

### 问题2：看不到图片

**原因：** 后端 API 返回的图片 URL 无法访问

**解决方案：**
- 检查后端返回的图片 URL 是否正确
- 图片加载失败会自动显示备用图片
- 可以使用 `test-data-example.json` 中的示例数据（使用 Unsplash 图片）

### 问题3：页面显示"加载失败"

**原因：** 无法连接到后端 API

**检查项：**
1. 后端服务是否在运行？
2. 后端监听在 `http://localhost:3000` 吗？
3. API 接口路径是否正确：`/api/public/landing-page`
4. 浏览器控制台有什么错误信息？

**临时解决方案：**

如果后端暂时不可用，你可以修改 `app/page.tsx`，使用测试数据：

```typescript
// 在 useEffect 中，临时替换为：
useEffect(() => {
  // 使用测试数据
  import('./test-data-example.json').then(data => {
    setData(data as any)
    setLoading(false)
  })
}, [])
```

### 问题4：端口被占用

**错误信息：** `Port 3001 is already in use`

**解决方案：**
```bash
# 方法1: 使用其他端口
npm run dev -- -p 3002

# 方法2: 找出并终止占用 3001 端口的进程
# Windows:
netstat -ano | findstr :3001
taskkill /PID <进程ID> /F

# Mac/Linux:
lsof -ti:3001 | xargs kill -9
```

## 📦 构建生产版本

```bash
# 构建
npm run build

# 启动生产服务器
npm start
```

生产版本将在 `http://localhost:3001` 运行

## 🔍 查看构建产物

```bash
# 构建后查看 .next 文件夹
ls -la .next

# 查看优化后的页面
ls -la .next/server/app
```

## 🎯 下一步

当前只实现了落地页。根据设计规范，后续需要开发：

- [ ] 批次追溯页（Page 2）
- [ ] 生长过程页（Page 3）  
- [ ] 云养茶园页（Page 4）

所有设计规范都在 `1网站大纲 .txt` 中。

## 💡 开发提示

1. **热重载**：修改代码后，页面会自动刷新
2. **TypeScript 检查**：运行 `npm run lint` 检查类型错误
3. **样式调试**：使用 Tailwind CSS 的类名，避免自定义 CSS
4. **图片优化**：Next.js 的 Image 组件会自动优化图片

## 📞 需要帮助？

如果遇到问题：
1. 查看浏览器控制台的错误信息
2. 查看终端的错误日志
3. 检查 `README.md` 中的详细文档
4. 参考 `test-data-example.json` 确认数据格式

祝开发顺利！🍵
