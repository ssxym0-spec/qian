# 批次详情页字段映射修复文档

## 📋 问题发现

通过调试日志，发现后端 API 实际返回的数据结构与前端期望的不同。

## 🔍 后端实际返回的数据结构

### API 响应格式

```json
{
  "success": true,
  "data": {
    // 实际批次数据在这里
  }
}
```

**问题**：前端直接使用了整个响应对象，而不是 `data` 字段。

**修复**：添加解包逻辑 `const rawData = responseData.data || responseData;`

---

## 🗺️ 字段映射对照表

### 1. 基础字段

| 前端期望 | 后端实际 | 说明 |
|---------|---------|------|
| `cover_image_url` | `detail_cover_image_url` 或 `cover_image_url` | 详情页优先使用 `detail_cover_image_url` |
| `created_at` | `createdAt` | 驼峰命名差异 |
| `updated_at` | `updatedAt` | 驼峰命名差异 |

### 2. 采摘记录字段映射

后端返回：
```json
{
  "harvest_date": "2025-09-29T00:00:00.000Z",
  "fresh_leaf_weight_kg": 4,
  "weather": {
    "icon": "多云",
    "temperature_range": "15-35"
  },
  "media_urls": ["/uploads/xxx.jpg"],
  "harvest_team": {
    "leader_name": "李队长",
    "member_count": 3,
    "notes": ""
  }
}
```

前端期望：
```json
{
  "date": "2025-09-29T00:00:00.000Z",
  "weight_kg": 4,
  "weather": "多云",
  "temperature": "15-35",
  "images": ["/uploads/xxx.jpg"],
  "team": {
    "team_name": "李队长",
    "members": [
      { "name": "李队长", "avatar_url": undefined },
      { "name": "成员1", "avatar_url": undefined },
      { "name": "成员2", "avatar_url": undefined }
    ]
  }
}
```

**转换逻辑**：
```typescript
harvest_records_ids: rawData.harvest_records_ids?.map((record: any) => ({
  _id: record._id,
  date: record.harvest_date,
  weight_kg: record.fresh_leaf_weight_kg,
  weather: record.weather?.icon || '晴',
  temperature: record.weather?.temperature_range,
  images: record.media_urls || [],
  team: {
    team_name: record.harvest_team?.leader_name || '采摘队',
    members: Array.from({ length: record.harvest_team.member_count }, (_, i) => ({
      name: i === 0 ? record.harvest_team.leader_name : `成员${i}`,
      avatar_url: undefined
    }))
  }
}))
```

### 3. 制作工艺字段映射

后端返回：
```json
{
  "step_name": "摊晾",
  "step_order": 1,
  "manual_craft": {
    "media_urls": ["/uploads/xxx.jpg"]
  },
  "modern_craft": {
    "media_urls": ["/uploads/yyy.mp4"]
  }
}
```

前端期望（拆分为两条记录）：
```json
[
  {
    "step_name": "摊晾",
    "craft_type": "traditional",
    "images": ["/uploads/xxx.jpg"],
    "description": { ... }
  },
  {
    "step_name": "摊晾",
    "craft_type": "modern",
    "images": ["/uploads/yyy.mp4"],
    "description": { ... }
  }
]
```

**转换逻辑**：
```typescript
production_steps: (() => {
  const steps: any[] = [];
  rawData.production_steps?.forEach((step: any) => {
    // 如果有手工工艺数据，添加 traditional 记录
    if (step.manual_craft?.media_urls?.length > 0) {
      steps.push({
        step_name: step.step_name,
        craft_type: 'traditional',
        images: step.manual_craft.media_urls,
        description: { ... }
      });
    }
    // 如果有现代工艺数据，添加 modern 记录
    if (step.modern_craft?.media_urls?.length > 0) {
      steps.push({
        step_name: step.step_name,
        craft_type: 'modern',
        images: step.modern_craft.media_urls,
        description: { ... }
      });
    }
  });
  return steps;
})()
```

### 4. 成品展示和品鉴报告字段映射

后端返回：
```json
{
  "product_appreciation": {
    "dry_tea_image": "/uploads/dry.jpg",
    "brewed_tea_image": "/uploads/brewed.jpg",
    "tasting_notes": "外形条索紧结...",
    "brewing_suggestion": "水温90℃左右...",
    "storage_method": "密封存放..."
  }
}
```

前端期望（拆分为两个对象）：
```json
{
  "product_display": {
    "dry_tea_image": "/uploads/dry.jpg",
    "brewed_tea_image": "/uploads/brewed.jpg"
  },
  "tasting_report": {
    "tasting_notes": "外形条索紧结...",
    "brewing_guide": "水温90℃左右...",
    "storage_guide": "密封存放..."
  }
}
```

**转换逻辑**：
```typescript
product_display: rawData.product_appreciation ? {
  dry_tea_image: rawData.product_appreciation.dry_tea_image,
  brewed_tea_image: rawData.product_appreciation.brewed_tea_image
} : undefined,

tasting_report: rawData.product_appreciation ? {
  tasting_notes: rawData.product_appreciation.tasting_notes || '',
  brewing_guide: rawData.product_appreciation.brewing_suggestion || '',
  storage_guide: rawData.product_appreciation.storage_method || ''
} : undefined
```

---

## 🛠️ 实施的修复

在 `app/suyuan/batch/[batchId]/page.tsx` 的 `getBatchDetail` 函数中，添加了完整的数据转换层：

1. **解包响应数据**
   ```typescript
   const rawData = responseData.data || responseData;
   ```

2. **创建转换后的 BatchDetail 对象**
   - 直接映射简单字段
   - 转换采摘记录数组
   - 转换制作工艺数组（拆分 manual/modern）
   - 转换成品展示和品鉴报告

3. **保持向后兼容**
   - 使用 `||` 运算符提供回退值
   - 支持旧的和新的字段名

---

## 📊 测试验证

刷新页面后，在终端日志中应该看到：

```
✅ [Server] 解包后的数据: 有效
✅ [Server] 转换后的数据摘要:
  - batch_number: 秋茶 · 批次 QC-20251003-1
  - category_name: 秋茶
  - harvest_records_ids length: 2
  - production_steps length: 2  (从5个步骤中提取出有数据的工艺)
  - product_display: true
  - tasting_report: true
```

页面应该正常显示：
- ✅ 页面头部（封面图、批次信息）
- ✅ 鲜叶采集时间轴（2条采摘记录）
- ✅ 匠心制作工艺（手工摊晾、现代杀青）
- ✅ 成品鉴赏（干茶、泡开、品鉴笔记）

---

## 💡 建议

### 短期建议（前端适配）
✅ **已完成**：在前端添加数据转换层，兼容后端当前格式。

### 长期建议（后端统一）
后端可以考虑在 API 层做统一转换，直接返回前端期望的格式：
- 返回 `data` 而不是 `{ success, data }`，或者在文档中明确说明
- 统一字段命名风格（全部用下划线或全部用驼峰）
- 采摘记录展平为前端期望的结构
- 制作工艺自动拆分为 traditional/modern 两种类型

---

**文档版本**: v1.0  
**创建日期**: 2025年10月4日  
**修复文件**: `app/suyuan/batch/[batchId]/page.tsx`  
**相关文档**: `BATCH_TRACING_FIELD_MAPPING.md`, `BATCH_DETAIL_DEBUG_GUIDE.md`

