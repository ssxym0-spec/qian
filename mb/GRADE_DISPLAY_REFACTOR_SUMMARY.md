# 等级显示重构总结

## 📝 概述

本次重构实现了批次卡片和批次详情页中关于"等级"的差异化显示：
- **批次卡片**：显示徽章图片（`badge_url`）
- **批次详情页**：显示等级名称（`name`）

## 🔄 API 数据结构变更

### 新的 `grade_id` 对象结构

```json
{
  "grade_id": {
    "_id": "...",
    "name": "优选",
    "badge_url": "/uploads/badges/youxuan-badge.png"
  }
}
```

## ✅ 修改清单

### 1. **types.ts** - 类型定义更新

#### 新增 Grade 接口
```typescript
export interface Grade {
  _id: string;
  name: string; // 等级名称：优选、匠作、臻品等
  badge_url?: string; // 徽章图片URL
}
```

#### 更新 BatchDetail 和 BatchListItem
```typescript
export interface BatchDetail {
  // ...
  grade?: string; // 成品等级（旧字段，兼容性保留）
  grade_id?: Grade; // 成品等级对象（新字段）
  // ...
}

export interface BatchListItem {
  // ...
  grade?: string; // 成品等级（旧字段，兼容性保留）
  grade_id?: Grade; // 成品等级对象（新字段）
  // ...
}
```

### 2. **BatchCard.tsx** - 批次卡片组件

#### 主要变更
1. **新增状态管理**
   ```typescript
   const [badgeError, setBadgeError] = useState(false);
   ```

2. **数据处理逻辑**
   ```typescript
   // 优先使用新的 grade_id 对象，回退到旧的 grade 字段
   const gradeName = batch.grade_id?.name || batch.grade;
   const gradeBadgeUrl = batch.grade_id?.badge_url;
   ```

3. **徽章渲染逻辑**
   - 如果 `gradeBadgeUrl` 存在且未加载失败 → 显示**徽章图片**
   - 否则 → 回退显示**文字徽章**（原有样式）

#### 徽章图片显示代码
```tsx
{gradeBadgeUrl && !badgeError ? (
  // 显示徽章图片
  <div className="w-16 h-16 transform rotate-12">
    <Image
      src={getFullImageUrl(gradeBadgeUrl)}
      alt={gradeName || '等级徽章'}
      width={64}
      height={64}
      className="w-full h-full object-contain drop-shadow-lg"
      onError={() => {
        console.error('Badge image failed to load:', gradeBadgeUrl);
        setBadgeError(true);
      }}
      unoptimized
    />
  </div>
) : (
  // 回退：显示文字徽章
  <div className={`
    ${gradeConfig.color} 
    text-white font-bold text-lg
    w-14 h-14 rounded-full
    flex items-center justify-center
    shadow-lg
    transform rotate-12
    border-2 border-white
  `}>
    {gradeConfig.label}
  </div>
)}
```

### 3. **BatchDetailHeader.tsx** - 批次详情页头部组件

#### 主要变更
1. **Props 接口更新**
   ```typescript
   interface BatchDetailHeaderProps {
     // ...
     grade?: Grade | string; // 支持新的 Grade 对象或旧的字符串格式
     // ...
   }
   ```

2. **等级名称提取逻辑**
   ```typescript
   // 判断 grade 是对象还是字符串
   const gradeName = typeof grade === 'object' ? grade?.name : grade;
   const gradeKey = gradeName || '优';
   
   const gradeConfig = GRADE_CONFIG[gradeKey] || {
     label: gradeKey,
     color: 'from-gray-400 to-gray-600',
   };
   ```

3. **显示效果**
   - 继续显示等级名称文本（如"臻品"、"匠作"、"优选"）
   - 保持原有的样式和渐变色背景

### 4. **page.tsx** - 批次详情页

#### 主要变更
1. **数据转换逻辑**
   ```typescript
   const data: BatchDetail = {
     // ...
     grade: rawData.grade, // 旧字段，兼容性保留
     grade_id: rawData.grade_id, // 新字段：完整的等级对象
     // ...
   };
   ```

2. **Props 传递逻辑**
   ```typescript
   const headerProps = {
     // ...
     // 优先使用 grade_id 对象，回退到旧的 grade 字符串
     grade: batch.grade_id || batch.grade || '优',
     // ...
   };
   ```

## 🎯 实现特性

### ✨ 向后兼容
- 保留了旧的 `grade` 字段支持
- 新旧数据格式都能正常工作

### 🔄 回退机制
- **BatchCard**: 如果 `badge_url` 不存在或加载失败 → 显示文字徽章
- **BatchDetailHeader**: 如果 `grade_id` 不存在 → 使用旧的 `grade` 字段

### 🎨 视觉效果
- **批次卡片**: 徽章图片使用 `w-16 h-16`，带旋转效果 (`rotate-12`)，阴影效果 (`drop-shadow-lg`)
- **批次详情页**: 等级名称文本显示在卡片中，带渐变色背景

### 🔍 调试支持
- 添加了详细的 console.log 日志
- 图片加载失败时会记录错误信息

## 📊 数据流

```
后端 API
  ↓
  grade_id: {
    _id: "...",
    name: "优选",
    badge_url: "/uploads/badges/youxuan-badge.png"
  }
  ↓
page.tsx (数据转换)
  ↓
  ├─→ BatchCard (列表页)
  │     ↓
  │   显示: badge_url 图片
  │   回退: name 文字徽章
  │
  └─→ BatchDetailHeader (详情页)
        ↓
      显示: name 文本
```

## 🚀 使用示例

### 批次卡片显示效果
```tsx
// 如果后端返回完整的 grade_id 对象
{
  grade_id: {
    name: "优选",
    badge_url: "/uploads/badges/youxuan-badge.png"
  }
}
// → 卡片右上角显示徽章图片

// 如果只有 grade 字符串
{
  grade: "优"
}
// → 卡片右上角显示文字徽章 "优"
```

### 批次详情页显示效果
```tsx
// 如果后端返回完整的 grade_id 对象
{
  grade_id: {
    name: "优选",
    badge_url: "/uploads/badges/youxuan-badge.png"
  }
}
// → 详情页显示 "优选" 文本

// 如果只有 grade 字符串
{
  grade: "优"
}
// → 详情页显示 "优" 文本
```

## ✅ 测试要点

1. **新 API 数据格式**
   - [ ] 批次卡片正确显示徽章图片
   - [ ] 批次详情页正确显示等级名称

2. **旧 API 数据格式**（兼容性测试）
   - [ ] 批次卡片正确显示文字徽章
   - [ ] 批次详情页正确显示等级文本

3. **错误处理**
   - [ ] 图片加载失败时自动回退到文字徽章
   - [ ] 缺少 grade_id 和 grade 时显示默认值

4. **样式验证**
   - [ ] 徽章图片尺寸正确 (64x64)
   - [ ] 旋转效果正常 (rotate-12)
   - [ ] 阴影效果美观

## 📝 备注

- 徽章图片路径会通过 `getFullImageUrl()` 自动拼接完整的后端服务器地址
- GRADE_BADGES 配置保留用作回退方案
- 所有修改都已通过 TypeScript 类型检查
- 无 linter 错误

---

**重构完成日期**: 2025年10月7日  
**影响范围**: 批次卡片显示、批次详情页显示

