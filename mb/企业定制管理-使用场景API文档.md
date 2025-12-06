# 企业定制管理 - 使用场景 API 接口文档

> **文档版本：** v1.0  
> **更新日期：** 2024-10-26  
> **目标用户：** 前端开发人员

---

## 📋 目录

1. [概述](#概述)
2. [数据结构](#数据结构)
3. [API接口](#api接口)
4. [字段说明](#字段说明)
5. [请求示例](#请求示例)
6. [响应示例](#响应示例)
7. [注意事项](#注意事项)
8. [与私人定制的对比](#与私人定制的对比)

---

## 概述

### 功能描述
企业定制管理的**使用场景**功能用于展示企业茶园领养的应用场景，帮助企业客户了解如何将茶园领养应用到实际业务中。

### 核心特点
- ✅ 支持多个使用场景
- ✅ 每个场景包含图标、背景图、标题、痛点、解决方案
- ✅ 支持多个核心价值点（带图标）
- ✅ 兼容旧版数据结构
- ✅ 与私人定制的场景化应用使用相同数据结构

### 字段名称
- **后端字段名：** `use_scenarios`
- **数据类型：** Array of Objects
- **所属方案：** `enterprise` (企业领养方案)

---

## 数据结构

### 使用场景对象结构 (Use Scenario Object)

```typescript
interface UseScenario {
  // 主图标（如 emoji 表情）
  icon: string;
  
  // 背景图片/插画 URL
  background_image: string;
  
  // 场景标题
  title: string;
  
  // 场景痛点描述
  pain_point: string;
  
  // 解决方案描述
  solution: string;
  
  // 核心价值数组
  core_values: CoreValue[];
  
  // ========== 兼容旧版字段（可选，不推荐使用） ==========
  content?: string;
  application?: string;
  effect?: string;
}
```

### 核心价值对象结构 (Core Value Object)

```typescript
interface CoreValue {
  // 价值点图标（如 emoji 表情）
  icon: string;
  
  // 价值点标题
  title: string;
  
  // 价值点详细描述（可选）
  description?: string;
}
```

---

## API接口

### 1. 获取企业定制方案数据（包含使用场景）

#### 请求信息

```http
GET /api/public/adoption-plans
```

- **请求方式：** GET
- **是否需要登录：** 否（公开API）
- **内容类型：** application/json

#### 响应数据结构

```json
{
  "success": true,
  "data": {
    "private": { ... },
    "enterprise": {
      "_id": "66e9a1234567890abcdef123",
      "type": "enterprise",
      "marketing_header": {
        "title": "当别人还在送烟酒 您已经在送山头",
        "subtitle": "在您的社交名片上 除了头衔 还有一座茶园"
      },
      "customer_cases": [ ... ],
      "use_scenarios": [
        {
          "icon": "🎁",
          "background_image": "/uploads/landing/enterprise-gift-bg.jpg",
          "title": "企业礼赠",
          "pain_point": "传统礼品千篇一律，难以体现企业品味",
          "solution": "专属茶园认养 + 定制企业礼盒",
          "core_values": [
            {
              "icon": "🎯",
              "title": "高端体面",
              "description": "展现企业实力与品味"
            },
            {
              "icon": "💝",
              "title": "独特创意",
              "description": "送出独一无二的专属礼物"
            }
          ]
        }
      ],
      "service_contents": [ ... ],
      "process_steps": [ ... ],
      "createdAt": "2024-09-17T12:00:00.000Z",
      "updatedAt": "2024-10-26T08:30:00.000Z"
    },
    "b2b": { ... }
  }
}
```

#### 提取企业定制使用场景

```javascript
// 前端提取企业定制使用场景的方式
fetch('/api/public/adoption-plans')
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      const enterprisePlan = data.data.enterprise;
      const useScenarios = enterprisePlan.use_scenarios || [];
      
      console.log('企业使用场景:', useScenarios);
      // 在这里处理和展示使用场景数据
    }
  });
```

---

### 2. 更新企业定制方案（包含使用场景）

#### 请求信息

```http
POST /api/adoption-plans/:type
```

- **请求方式：** POST
- **是否需要登录：** 是（需要管理员权限）
- **内容类型：** application/json
- **路径参数：** `type` = `enterprise`

#### 请求体结构

```json
{
  "marketing_header": {
    "title": "当别人还在送烟酒 您已经在送山头",
    "subtitle": "在您的社交名片上 除了头衔 还有一座茶园"
  },
  "customer_cases": [ ... ],
  "use_scenarios": [
    {
      "icon": "🎁",
      "background_image": "/uploads/landing/enterprise-gift-bg.jpg",
      "title": "企业礼赠",
      "pain_point": "传统礼品千篇一律，难以体现企业品味",
      "solution": "专属茶园认养 + 定制企业礼盒",
      "core_values": [
        {
          "icon": "🎯",
          "title": "高端体面",
          "description": "展现企业实力与品味"
        },
        {
          "icon": "💝",
          "title": "独特创意",
          "description": "送出独一无二的专属礼物"
        },
        {
          "icon": "📱",
          "title": "全程可视",
          "description": "实时追踪茶园生长状态"
        }
      ]
    },
    {
      "icon": "🏢",
      "background_image": "/uploads/landing/employee-welfare-bg.jpg",
      "title": "员工福利",
      "pain_point": "员工福利形式单一，缺乏新意",
      "solution": "企业茶园认养 + 员工专属茶叶配送",
      "core_values": [
        {
          "icon": "❤️",
          "title": "关怀到位",
          "description": "体现企业对员工的用心关怀"
        },
        {
          "icon": "🌱",
          "title": "健康生活",
          "description": "提供高品质健康饮品"
        }
      ]
    },
    {
      "icon": "🤝",
      "background_image": "/uploads/landing/business-cooperation-bg.jpg",
      "title": "商务合作",
      "pain_point": "商务社交缺乏独特话题",
      "solution": "共建茶园 + 联名定制茶叶",
      "core_values": [
        {
          "icon": "🎪",
          "title": "品牌联动",
          "description": "提升品牌形象和影响力"
        },
        {
          "icon": "🔗",
          "title": "深度绑定",
          "description": "建立长期合作关系"
        }
      ]
    }
  ],
  "service_contents": [ ... ],
  "process_steps": [ ... ]
}
```

#### 响应数据结构

**成功响应（200）：**

```json
{
  "success": true,
  "message": "方案保存成功",
  "data": {
    "_id": "66e9a1234567890abcdef123",
    "type": "enterprise",
    "marketing_header": { ... },
    "customer_cases": [ ... ],
    "use_scenarios": [ ... ],
    "service_contents": [ ... ],
    "process_steps": [ ... ],
    "createdAt": "2024-09-17T12:00:00.000Z",
    "updatedAt": "2024-10-26T08:30:00.000Z"
  }
}
```

**失败响应（400/500）：**

```json
{
  "success": false,
  "message": "保存方案失败",
  "error": "具体错误信息"
}
```

---

## 字段说明

### 使用场景字段详解

| 字段名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| `icon` | String | 否 | 场景主图标，通常使用 emoji | `"🎁"` |
| `background_image` | String | 否 | 背景图片或插画的 URL | `"/uploads/landing/gift-bg.jpg"` |
| `title` | String | 是 | 场景标题，简短有力 | `"企业礼赠"` |
| `pain_point` | String | 是 | 客户痛点描述 | `"传统礼品千篇一律"` |
| `solution` | String | 是 | 解决方案描述 | `"专属茶园认养 + 定制礼盒"` |
| `core_values` | Array | 是 | 核心价值数组，至少1个 | 见下方核心价值字段 |

### 核心价值字段详解

| 字段名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| `icon` | String | 是 | 价值点图标，通常使用 emoji | `"🎯"` |
| `title` | String | 是 | 价值点标题，简短精炼 | `"高端体面"` |
| `description` | String | 否 | 价值点详细描述 | `"展现企业实力与品味"` |

### 兼容旧版字段（不推荐使用）

| 字段名 | 类型 | 说明 | 状态 |
|--------|------|------|------|
| `content` | String | 旧版内容字段 | ⚠️ 已弃用 |
| `application` | String | 旧版应用字段 | ⚠️ 已弃用 |
| `effect` | String | 旧版效果字段 | ⚠️ 已弃用 |

---

## 请求示例

### JavaScript Fetch API

```javascript
// 1. 获取企业定制方案数据
async function getEnterpriseScenarios() {
  try {
    const response = await fetch('/api/public/adoption-plans');
    const data = await response.json();
    
    if (data.success) {
      const useScenarios = data.data.enterprise.use_scenarios;
      return useScenarios;
    }
  } catch (error) {
    console.error('获取企业使用场景失败:', error);
  }
}

// 2. 更新企业使用场景
async function updateEnterpriseScenarios(newScenarios) {
  try {
    const response = await fetch('/api/adoption-plans/enterprise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        use_scenarios: newScenarios,
        // 其他企业方案字段...
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ 企业使用场景更新成功');
      return data.data;
    } else {
      console.error('❌ 更新失败:', data.message);
    }
  } catch (error) {
    console.error('❌ 请求失败:', error);
  }
}
```

### Axios

```javascript
import axios from 'axios';

// 1. 获取企业定制方案数据
const getEnterpriseScenarios = async () => {
  try {
    const { data } = await axios.get('/api/public/adoption-plans');
    
    if (data.success) {
      return data.data.enterprise.use_scenarios;
    }
  } catch (error) {
    console.error('获取企业使用场景失败:', error);
  }
};

// 2. 更新企业使用场景
const updateEnterpriseScenarios = async (newScenarios) => {
  try {
    const { data } = await axios.post('/api/adoption-plans/enterprise', {
      use_scenarios: newScenarios
    });
    
    if (data.success) {
      console.log('✅ 企业使用场景更新成功');
      return data.data;
    }
  } catch (error) {
    console.error('❌ 更新失败:', error);
  }
};
```

---

## 响应示例

### 完整的企业定制方案响应示例

```json
{
  "success": true,
  "data": {
    "private": { ... },
    "enterprise": {
      "_id": "66e9a1234567890abcdef123",
      "type": "enterprise",
      "marketing_header": {
        "title": "当别人还在送烟酒 您已经在送山头",
        "subtitle": "在您的社交名片上 除了头衔 还有一座茶园"
      },
      "customer_cases": [
        {
          "image_url": "/uploads/landing/case1.jpg",
          "text": "某知名企业为VIP客户定制的专属茶园",
          "media_type": "image"
        }
      ],
      "use_scenarios": [
        {
          "icon": "🎁",
          "background_image": "/uploads/landing/enterprise-gift-bg.jpg",
          "title": "企业礼赠",
          "pain_point": "传统礼品千篇一律，难以体现企业品味",
          "solution": "专属茶园认养 + 定制企业礼盒",
          "core_values": [
            {
              "icon": "🎯",
              "title": "高端体面",
              "description": "展现企业实力与品味"
            },
            {
              "icon": "💝",
              "title": "独特创意",
              "description": "送出独一无二的专属礼物"
            },
            {
              "icon": "📱",
              "title": "全程可视",
              "description": "实时追踪茶园生长状态"
            }
          ]
        },
        {
          "icon": "🏢",
          "background_image": "/uploads/landing/employee-welfare-bg.jpg",
          "title": "员工福利",
          "pain_point": "员工福利形式单一，缺乏新意",
          "solution": "企业茶园认养 + 员工专属茶叶配送",
          "core_values": [
            {
              "icon": "❤️",
              "title": "关怀到位",
              "description": "体现企业对员工的用心关怀"
            },
            {
              "icon": "🌱",
              "title": "健康生活",
              "description": "提供高品质健康饮品"
            },
            {
              "icon": "🎊",
              "title": "增强归属",
              "description": "提升员工对企业的认同感"
            }
          ]
        },
        {
          "icon": "🤝",
          "background_image": "/uploads/landing/business-cooperation-bg.jpg",
          "title": "商务合作",
          "pain_point": "商务社交缺乏独特话题",
          "solution": "共建茶园 + 联名定制茶叶",
          "core_values": [
            {
              "icon": "🎪",
              "title": "品牌联动",
              "description": "提升品牌形象和影响力"
            },
            {
              "icon": "🔗",
              "title": "深度绑定",
              "description": "建立长期合作关系"
            }
          ]
        }
      ],
      "service_contents": [
        {
          "icon": "🏔️",
          "title": "专属茶园认养",
          "description": "为企业提供专属茶园地块，可定制铭牌"
        },
        {
          "icon": "📦",
          "title": "定制礼盒配送",
          "description": "四季茶叶定期配送，礼盒可印企业LOGO"
        },
        {
          "icon": "📱",
          "title": "可视化管理",
          "description": "实时查看茶园生长情况，随时了解制作进度"
        }
      ],
      "process_steps": [
        {
          "step": "1",
          "title": "需求沟通",
          "description": "了解企业需求，定制专属方案"
        },
        {
          "step": "2",
          "title": "签约认养",
          "description": "签订合作协议，确定茶园地块"
        },
        {
          "step": "3",
          "title": "托管运营",
          "description": "专业团队负责茶园日常管理"
        },
        {
          "step": "4",
          "title": "定期配送",
          "description": "按约定周期配送专属茶叶"
        }
      ],
      "createdAt": "2024-09-17T12:00:00.000Z",
      "updatedAt": "2024-10-26T08:30:00.000Z",
      "typeName": "企业领养"
    },
    "b2b": { ... }
  }
}
```

---

## 注意事项

### 1. 字段命名差异
⚠️ **重要：** 企业定制和私人定制的场景字段名称不同：
- **企业定制：** `use_scenarios` （使用场景）
- **私人定制：** `scenario_applications` （场景化应用）

虽然数据结构相同，但字段名不同，前端需要分别处理！

### 2. 数据结构相同
✅ 两者使用相同的 Schema 定义（`scenarioApplicationSchema`），因此数据结构完全一致。

### 3. 更新时必须包含完整数据
⚠️ 更新企业方案时，需要提交**完整的方案数据**，而不仅仅是 `use_scenarios` 字段：

```javascript
// ❌ 错误：只提交 use_scenarios
await axios.post('/api/adoption-plans/enterprise', {
  use_scenarios: [ ... ]
});

// ✅ 正确：提交完整的企业方案数据
await axios.post('/api/adoption-plans/enterprise', {
  marketing_header: { ... },
  customer_cases: [ ... ],
  use_scenarios: [ ... ],      // ← 使用场景
  service_contents: [ ... ],
  process_steps: [ ... ]
});
```

### 4. 核心价值数组的使用
- 每个场景**至少应有 1 个核心价值**
- 建议每个场景包含 **2-4 个核心价值**
- 每个核心价值都应有图标和标题

### 5. 图片路径
- 背景图片 URL 应使用相对路径或完整 URL
- 如果使用相对路径，确保路径正确（如 `/uploads/landing/xxx.jpg`）

### 6. Emoji 图标
- `icon` 和 `core_values[].icon` 字段支持 emoji 表情
- 建议使用单个 emoji 以保持视觉一致性
- 常用 emoji：🎁 🏢 🤝 🎯 💝 ❤️ 🌱 📱 🔗

### 7. 向后兼容
- 模型保留了 `content`、`application`、`effect` 三个旧字段
- 这些字段仅用于兼容历史数据
- **新的实现应使用新结构**（`pain_point`、`solution`、`core_values`）

---

## 与私人定制的对比

### 相同点 ✅

| 特性 | 企业定制 | 私人定制 |
|------|---------|---------|
| 数据结构 | `scenarioApplicationSchema` | `scenarioApplicationSchema` |
| 字段结构 | 相同 | 相同 |
| 支持图标 | ✅ | ✅ |
| 支持背景图 | ✅ | ✅ |
| 核心价值数组 | ✅ | ✅ |

### 不同点 ⚠️

| 特性 | 企业定制 | 私人定制 |
|------|---------|---------|
| **字段名称** | `use_scenarios` | `scenario_applications` |
| **方案类型** | `type: "enterprise"` | `type: "private"` |
| **应用场景** | 企业礼赠、员工福利、商务合作 | 节日礼赠、私人收藏、孝亲送礼 |
| **目标用户** | 企业客户、B端客户 | 个人客户、C端用户 |

### 前端处理示例

```javascript
// 获取两种方案的场景数据
async function getAllScenarios() {
  const response = await fetch('/api/public/adoption-plans');
  const data = await response.json();
  
  if (data.success) {
    // 企业定制的使用场景
    const enterpriseScenarios = data.data.enterprise.use_scenarios || [];
    
    // 私人定制的场景化应用
    const privateScenarios = data.data.private.scenario_applications || [];
    
    return {
      enterprise: enterpriseScenarios,
      private: privateScenarios
    };
  }
}
```

---

## 常见问题

### Q1: 为什么字段名不同？
**A:** 虽然数据结构相同，但在业务语义上有所区别：
- 企业定制强调"**使用场景**"（use_scenarios）
- 私人定制强调"**场景化应用**"（scenario_applications）

### Q2: 可以直接复用私人定制的前端组件吗？
**A:** 可以复用组件逻辑，但需要注意：
1. 接收不同的 prop 名称（`use_scenarios` vs `scenario_applications`）
2. 可能需要不同的 UI 样式和文案
3. 建议创建通用组件，通过 props 传递数据

### Q3: 更新某个场景时，其他场景会被清空吗？
**A:** 是的！后端使用 `findOneAndUpdate` 替换整个文档，因此必须提交完整的 `use_scenarios` 数组。

### Q4: 如何测试 API？
**A:** 可以使用以下工具：
- Postman / Insomnia（推荐）
- curl 命令
- 浏览器开发者工具（DevTools）

---

## 更新日志

| 日期 | 版本 | 更新内容 |
|------|------|---------|
| 2024-10-26 | v1.0 | 初始版本，创建企业定制使用场景API文档 |

---

## 技术支持

如有疑问或需要帮助，请联系后端开发团队。

**文档维护者：** AI Assistant  
**最后更新：** 2024-10-26

---

**🎉 文档结束**

