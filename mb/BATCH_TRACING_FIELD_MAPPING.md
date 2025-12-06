# 批次追溯页 - 后端字段映射文档

## 📋 后端 API 字段映射

本文档记录了前端代码与后端 API 返回字段的映射关系。

---

## 批次列表 API

**接口**: `GET /api/public/batches?category=[categoryName]`

### 后端实际返回的字段

| 后端字段名 | 类型 | 说明 | 前端对应字段 |
|-----------|------|------|-------------|
| `_id` | string | 批次ID | `_id` |
| `batch_number` | string | 批次号 | `batch_number` |
| `category_name` | string | 品类名称 | `category_name` ⚠️ |
| `tea_master` | object | 制茶师信息 | `tea_master` |
| `cover_image_url` | string | 封面图片URL | `cover_image_url` ⚠️ |
| `images_and_videos` | array | 媒体素材数组 | `images_and_videos` |
| `production_steps` | array | 制作工艺步骤 | `production_steps` |
| `harvest_records_ids` | array | 采摘记录ID数组 | `harvest_records_ids` |
| `final_product_weight_kg` | number | 成品重量（公斤） | `final_product_weight_kg` ⚠️ |
| `harvest_records_count` | number | 采摘记录数量 | `harvest_records_count` |
| `total_fresh_leaf_weight` | number | 鲜叶总重量 | - |
| `yield_rate` | number | 出茶率 | - |
| `status` | string | 状态 | - |
| `notes` | string | 备注 | - |
| `tasting_report` | object | 品鉴报告 | `tasting_report` |
| `production_date` | string | 制作日期 | - |
| `formatted_production_date` | string | 格式化的制作日期 | - |

### ⚠️ 字段名称差异

| 前端期望（设计文档） | 后端实际 | 说明 |
|-------------------|---------|------|
| `category` | `category_name` | 品类名称 |
| `hero_media` | `cover_image_url` | 封面媒体 |
| `final_yield_kg` | `final_product_weight_kg` | 成品产量 |

---

## 批次详情 API

**接口**: `GET /api/public/batches/[batchId]`

### 返回字段

批次详情返回的字段与列表相同，但 `harvest_records_ids` 会被**填充（populated）**为完整的采摘记录对象数组。

### 采摘记录对象结构

```typescript
{
  _id: string;
  date: string;           // ISO 日期字符串
  weight_kg: number;      // 鲜叶重量
  weather: string;        // 天气
  temperature?: string;   // 温度
  images: string[];       // 图片/视频数组
  team: {
    team_name: string;
    members: Array<{
      name: string;
      avatar_url?: string;
    }>;
  };
}
```

---

## 前端类型定义

详见 `app/suyuan/types.ts`

### 关键接口

#### `BatchListItem` (列表项)
```typescript
interface BatchListItem {
  _id: string;
  batch_number: string;
  category_name: string;        // ← 注意字段名
  cover_image_url?: string;     // ← 注意字段名
  tea_master?: TeaMaster;
  // ... 其他字段
}
```

#### `BatchDetail` (详情)
```typescript
interface BatchDetail {
  _id: string;
  batch_number: string;
  category_name: string;             // ← 注意字段名
  cover_image_url?: string;          // ← 注意字段名
  final_product_weight_kg?: number;  // ← 注意字段名
  harvest_records_ids?: HarvestRecord[];
  // ... 其他字段
}
```

---

## 组件字段使用

### BatchCard 组件
- 使用 `batch.cover_image_url` 显示封面
- 使用 `batch.category_name` 显示品类
- 使用 `batch.tea_master` 显示制茶师

### BatchDetailHeader 组件
接收的 props：
```typescript
{
  heroMedia: batch.cover_image_url || '',
  title: batch.title || batch.batch_number,
  batchNumber: batch.batch_number,
  grade: batch.grade || '优',
  finalYieldKg: batch.final_product_weight_kg || 0,
  teaMaster: batch.tea_master || { name: '未知' },
  categorySlug: categorySlug
}
```

---

## 可选字段处理

由于后端某些字段可能不存在，前端做了以下处理：

1. **封面图片** (`cover_image_url`)
   - 不存在时显示占位符 SVG 图标
   - 加载失败时显示"图片加载失败"提示

2. **等级** (`grade`)
   - 不存在时默认为"优"
   - 等级徽章仅在有 grade 时显示

3. **标题** (`title`)
   - 不存在时使用 `batch_number` 作为标题

4. **摘要** (`summary`)
   - 不存在时不显示摘要区域

5. **制茶师** (`tea_master`)
   - 不存在时显示"未知"

---

## 后端数据建议

为了更好的前端展示效果，建议后端确保以下字段始终有值：

### 必需字段
- ✅ `_id`
- ✅ `batch_number`
- ✅ `category_name`

### 强烈建议提供
- 📌 `cover_image_url` - 封面图片（可以是默认图片）
- 📌 `tea_master` - 制茶师信息
- 📌 `title` - 批次标题
- 📌 `summary` - 批次摘要

### 可选字段
- `grade` - 等级（默认"优"）
- `harvest_records_ids` - 采摘记录（详情页需要）
- `production_steps` - 制作工艺（详情页需要）
- `product_display` - 成品展示（详情页需要）
- `tasting_report` - 品鉴报告（详情页需要）

---

## 图片 URL 格式

Next.js Image 组件已配置支持：
- ✅ `http://localhost:3000/**` (开发环境)
- ✅ `https://**` (所有 HTTPS 域名)

建议图片 URL 格式：
- 绝对路径: `http://localhost:3000/uploads/tea-image.jpg`
- 或完整 URL: `https://cdn.example.com/images/tea.jpg`

---

## 🔧 图片 URL 处理

### 问题
后端返回的图片 URL 可能是相对路径（如 `/uploads/image.jpg`），而 Next.js 的 Image 组件需要完整的 URL。

### 解决方案
创建了通用工具函数 `app/suyuan/utils/imageUtils.ts`：

```typescript
// 自动将相对路径转换为完整 URL
getFullImageUrl('/uploads/tea.jpg')
// 返回: 'http://localhost:3000/uploads/tea.jpg'

// 判断是否为视频
isVideoUrl('video.mp4') // 返回: true
```

### 所有组件都已更新
- ✅ `BatchCard` - 批次卡片
- ✅ `BatchDetailHeader` - 详情页头部
- ✅ `StoryTimeline` - 故事时间轴
- ✅ `ProductionSteps` - 制作工艺
- ✅ `ProductDisplay` - 成品展示

所有图片都添加了 `unoptimized` 属性，避免 Next.js 优化导致的问题。

---

---

## ⚠️ 重要更新：实际字段格式差异（2025-10-04）

### API 响应包装

后端 API 实际返回的数据被包装在一个对象中：
```json
{
  "success": true,
  "data": {
    // 实际的批次数据
  }
}
```

**解决方案**：前端已在 `app/suyuan/batch/[batchId]/page.tsx` 中添加解包逻辑。

### 实际字段名差异

除了之前记录的差异，还发现了以下字段不匹配：

#### 采摘记录
| 文档中的字段 | 实际后端字段 | 说明 |
|------------|------------|------|
| `date` | `harvest_date` | 采摘日期 |
| `weight_kg` | `fresh_leaf_weight_kg` | 鲜叶重量 |
| `weather` (string) | `weather.icon` (object) | 天气是对象 |
| `temperature` | `weather.temperature_range` | 温度在天气对象内 |
| `images` | `media_urls` | 媒体数组 |
| `team` (object) | `harvest_team` (flat) | 团队结构不同 |

#### 制作工艺
| 文档中的字段 | 实际后端字段 | 说明 |
|------------|------------|------|
| `craft_type` | `manual_craft` / `modern_craft` | 不是字段而是嵌套对象 |
| `images` | `manual_craft.media_urls` | 图片在工艺类型对象内 |

#### 成品展示
| 文档中的字段 | 实际后端字段 | 说明 |
|------------|------------|------|
| `product_display` | `product_appreciation` | 字段名不同 |
| `brewing_guide` | `brewing_suggestion` | 冲泡建议 |
| `storage_guide` | `storage_method` | 储存方法 |

**解决方案**：前端已添加完整的数据转换层，详见 `BATCH_DETAIL_FIELD_MAPPING_FIX.md`

---

**文档版本**: v1.2  
**最后更新**: 2025年10月4日  
**相关文档**: `BATCH_TRACING_PAGE_QUICKSTART.md`, `BATCH_TRACING_BUG_FIXES.md`, `BATCH_DETAIL_FIELD_MAPPING_FIX.md`
