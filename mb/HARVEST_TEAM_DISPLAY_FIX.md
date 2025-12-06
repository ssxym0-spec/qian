# 鲜叶采集团队显示优化总结

## 🎯 优化需求

将鲜叶采集部分的团队显示方式优化为：
1. **队长头像**：改为圆形，大小与制茶师一致（40x40像素）
2. **显示逻辑**：队长名字 + 团队（人数），例如"高师傅团队（5人）"
3. **布局样式**：与制茶师信息保持一致的视觉风格

## 📝 修改内容

### 修改文件：`app/suyuan/components/StoryTimeline.tsx`

**位置**：第143-181行

### 修改前的显示方式

```jsx
{/* 显示前3个队员的头像（重叠显示） */}
<div className="flex -space-x-2">
  {record.team.members.slice(0, 3).map((member, idx) => (
    <Image
      src={member.avatar_url}
      width={28}
      height={28}
      className="rounded-full border-2 border-white"
    />
  ))}
</div>
{/* 显示团队名称 */}
<p>
  <span>{record.team.team_name}</span>
  {` (${record.team.members.length}人)`}
</p>
```

**显示效果**：
- 3个小头像重叠显示（28x28像素）
- 团队名称 + 人数

---

### 修改后的显示方式

```jsx
{/* 显示队长头像 */}
{(() => {
  const leader = record.team.members[0]; // 第一个成员是队长
  return leader.avatar_url ? (
    <Image
      src={getFullImageUrl(leader.avatar_url)}
      alt={leader.name}
      width={40}
      height={40}
      className="rounded-full object-cover"
      unoptimized
    />
  ) : (
    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">
      {leader.name?.[0] || '队'}
    </div>
  );
})()}

{/* 显示队长名字和团队信息 */}
<div>
  <p className="text-xs text-gray-500">采摘团队</p>
  <p className="text-sm font-semibold text-gray-900">
    {record.team.members[0].name}团队（{record.team.members.length}人）
  </p>
</div>
```

**显示效果**：
- 1个队长头像（40x40像素，圆形）
- 标签："采摘团队"
- 队长名字 + "团队" + 人数，例如："高师傅团队（5人）"

---

## 🎨 视觉对比

### 修改前
```
👤👤👤 高师傅团队 (5人)
(3个小头像重叠)
```

### 修改后
```
    👤      采摘团队
(40x40)    高师傅团队（5人）
```

与制茶师信息的显示风格完全一致：
```
    👤      制茶师
(40x40)    李师傅
```

---

## ✨ 优化亮点

### 1. 统一视觉风格
- 队长头像大小与制茶师一致（40x40像素）
- 布局结构相同：头像 + 标签 + 名字
- 圆形头像设计，专业美观

### 2. 信息更清晰
- 突出显示队长（团队负责人）
- 明确标注"采摘团队"
- 人数统计更直观："高师傅团队（5人）"

### 3. 一致性设计
- 与制茶师信息区域保持相同的设计语言
- 头像、文字大小、间距都保持统一
- 提升整体页面的专业度和美感

---

## 🧪 验证步骤

1. **启动开发服务器**：
   ```bash
   npm run dev
   ```

2. **访问批次详情页**：
   - 访问任意批次，如 `http://localhost:3000/suyuan/batch/[batchId]`
   - 滚动到"鲜叶采集"部分

3. **检查队长显示**：
   - ✓ 队长头像是圆形的
   - ✓ 头像大小为 40x40 像素（与制茶师一致）
   - ✓ 显示格式："队长名字团队（人数）"
   - ✓ 有"采摘团队"标签

4. **对比制茶师信息**：
   - ✓ 视觉风格保持一致
   - ✓ 布局结构相同
   - ✓ 整体协调美观

---

## 📊 技术实现细节

### 队长头像渲染逻辑

```jsx
const leader = record.team.members[0]; // 取第一个成员作为队长

// 有头像时
<Image
  src={getFullImageUrl(leader.avatar_url)}
  alt={leader.name}
  width={40}
  height={40}
  className="rounded-full object-cover"
  unoptimized
/>

// 无头像时（占位符）
<div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">
  {leader.name?.[0] || '队'}
</div>
```

### 布局结构

```jsx
<div className="flex items-center gap-3">
  {/* 头像区域：40x40 圆形 */}
  <Image ... />
  
  {/* 文字区域 */}
  <div>
    <p className="text-xs text-gray-500">采摘团队</p>  {/* 标签 */}
    <p className="text-sm font-semibold text-gray-900">  {/* 队长+团队信息 */}
      {leader.name}团队（{members.length}人）
    </p>
  </div>
</div>
```

---

## 📱 响应式设计

- **桌面端**：头像 40x40，文字清晰可读
- **移动端**：头像大小保持不变，布局自适应
- **所有设备**：圆形头像始终保持正确的纵横比

---

## ✅ 完成状态

- ✅ 队长头像改为圆形
- ✅ 头像大小与制茶师一致（40x40像素）
- ✅ 显示逻辑优化为："队长名字团队（人数）"
- ✅ 添加"采摘团队"标签
- ✅ 与制茶师信息保持一致的视觉风格
- ✅ 无头像时显示优雅的占位符

---

**优化时间**：2025年10月6日  
**优化内容**：统一采摘团队和制茶师的显示风格，突出队长信息  
**影响文件**：1个组件文件（StoryTimeline.tsx）

