# 头像字段映射参考

## 📊 不同页面使用的字段对比

### 批次追溯页面（溯源页面）vs 生长记录页面

| 页面 | 人员类型 | 字段名 | 包含的信息 |
|------|---------|--------|-----------|
| 溯源页面 | 制茶师 | `tea_master_id` | `{name, avatar_url}` |
| 溯源页面 | 采摘队长 | `harvest_team_id` | `{name, avatar_url}` |
| **生长记录页面** | **记录人** | **`recorder_id`** | **`{name, avatar_url}`** |

---

## 🎯 生长记录页面的字段

### 当前实现

**优先级顺序**（从高到低）：

```typescript
1. recorder_id.name + recorder_id.avatar_url  // 最新格式（有头像）
   └─ 示例: { name: "高师傅", avatar_url: "/uploads/avatars/gao.jpg" }

2. recorder_name                              // 新格式（无头像）
   └─ 示例: "高师傅"

3. recorder                                   // 旧格式（无头像）
   └─ 示例: "高师傅"
```

### 后端需要 populate 的字段

```javascript
// 生长记录 API
const dailyLogs = await DailyLog.find(...)
  .populate('recorder_id')   // ← 记录人（包含头像）
  .populate('plot_id')       // ← 地块信息
  .lean();
```

---

## 🔍 为什么不是 tea_master_id？

### 字段含义区别

| 字段 | 含义 | 使用场景 | 数据模型 |
|------|------|---------|---------|
| `tea_master_id` | 制茶师/茶叶大师 | 批次追溯页面 | `Batch` 模型 |
| `harvest_team_id` | 采摘队长 | 批次追溯页面 | `HarvestRecord` 模型 |
| `recorder_id` | 生长日记记录人 | 生长记录页面 | `DailyLog` 模型 |

### 数据模型结构

```typescript
// 批次追溯数据模型
interface Batch {
  batch_number: string;
  tea_master_id: {        // ← 制茶师
    name: string;
    avatar_url: string;
  };
  harvest_records_ids: [{
    harvest_team_id: {    // ← 采摘队长
      name: string;
      avatar_url: string;
    }
  }];
}

// 生长日记数据模型
interface DailyLog {
  date: string;
  recorder_id: {          // ← 记录人
    name: string;
    avatar_url: string;
  };
  plot_id: {
    name: string;
  };
  summary: string;
}
```

---

## 📝 完整的 API 响应示例

### 生长记录 API (`/api/public/growth-data`)

```json
{
  "daily_logs": [
    {
      "_id": "660a1234567890abcdef1234",
      "date": "2024-03-19",
      
      "recorder_id": {                         // ← 记录人（完整对象）
        "_id": "668e2922568d83d2fd838f91f",
        "name": "高师傅",
        "avatar_url": "/uploads/avatars/gao.jpg",
        "role": "记录员"
      },
      
      "plot_id": {                             // ← 地块（完整对象）
        "_id": "660b5678901234567890abcd",
        "name": "台地三号",
        "area": "2亩"
      },
      
      "summary": "明雨纷纷，一芽一叶初展...",
      "images": ["/uploads/growth/2024-03-19-1.jpg"]
    }
  ],
  "monthly_summary": null
}
```

### 批次追溯 API (`/api/public/batch/:batchId`)

```json
{
  "batch_number": "2024-03-001",
  
  "tea_master_id": {                         // ← 制茶师（完整对象）
    "_id": "668e2922568d83d2fd838f91f",
    "name": "陈大师",
    "avatar_url": "/uploads/avatars/chen.jpg",
    "role": "制茶师",
    "experience_years": 10
  },
  
  "harvest_records_ids": [
    {
      "date": "2024-03-15",
      "harvest_team_id": {                   // ← 采摘队长（完整对象）
        "_id": "668e3922568d83d2fd838f91f",
        "name": "李队长",
        "avatar_url": "/uploads/avatars/li.jpg"
      }
    }
  ]
}
```

---

## 🔧 常见错误和修复

### 错误 1：混淆了不同页面的字段

❌ **错误**：在生长记录页面中使用 `tea_master_id`
```typescript
const name = log.tea_master_id?.name;  // 错误！
```

✅ **正确**：在生长记录页面中使用 `recorder_id`
```typescript
const name = log.recorder_id?.name;    // 正确！
```

### 错误 2：忘记 populate

❌ **错误**：后端查询时没有 populate
```javascript
const dailyLogs = await DailyLog.find(...).lean();
// 结果：recorder_id 只是一个 ID 字符串
```

✅ **正确**：后端查询时使用 populate
```javascript
const dailyLogs = await DailyLog.find(...)
  .populate('recorder_id')
  .lean();
// 结果：recorder_id 是完整对象，包含 name 和 avatar_url
```

---

## 📚 相关文档

- `GROWTH_AVATAR_DEBUG_GUIDE.md` - 头像不显示问题排查指南
- `GROWTH_PAGE_AVATAR_FIX.md` - 生长记录页面头像功能完整文档
- `AVATAR_DISPLAY_FIX_SUMMARY.md` - 溯源页面头像功能参考

---

## 🎯 总结

- ✅ 生长记录页面使用 **`recorder_id`**（记录人）
- ✅ 溯源页面使用 **`tea_master_id`**（制茶师）和 **`harvest_team_id`**（采摘队长）
- ✅ 每个字段都需要后端使用 `.populate()` 才能获取完整对象
- ✅ 完整对象才包含 `avatar_url` 字段


