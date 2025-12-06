# 场景化应用 API 接口文档

## 📋 文档信息

- **版本**: v2.2
- **最后更新**: 2025年10月14日
- **适用范围**: 云养茶园管理系统 - 场景化应用模块
- **后端框架**: Node.js + Express + MongoDB
- **新增功能**: 
  - 场景痛点和定制方案支持图标 🎨
  - 后端管理界面提供可视化图标选择器 ✨

---

## 🌐 API 概览

场景化应用模块提供以下API接口，用于获取和管理私人定制和企业领养的场景化应用数据。

### 📑 快速导航

- [接口列表](#接口列表) - 查看所有可用API
- [数据字段说明](#数据字段说明) - 了解数据结构
- [🎨 图标使用指南](#图标使用指南) - **新增！** 学习如何在痛点和方案中使用图标
- [使用示例](#使用示例) - 查看代码示例
- [错误处理](#错误处理) - 处理异常情况
- [常见问题](#常见问题) - 快速解决问题

### 接口列表

| 接口名称 | HTTP方法 | 端点 | 说明 |
|---------|---------|------|------|
| 获取私人定制方案 | GET | `/api/adoption-plans/private` | 获取私人定制的完整方案数据 |
| 获取企业领养方案 | GET | `/api/adoption-plans/enterprise` | 获取企业领养的完整方案数据 |
| 更新私人定制方案 | POST | `/api/adoption-plans/private` | 更新私人定制方案（需权限） |
| 更新企业领养方案 | POST | `/api/adoption-plans/enterprise` | 更新企业领养方案（需权限） |

---

## 📡 API 详细说明

### 1. 获取私人定制方案

#### 接口信息
```
GET /api/adoption-plans/private
```

#### 请求参数
无需参数

#### 请求示例
```javascript
// 原生 fetch
const response = await fetch('/api/adoption-plans/private');
const data = await response.json();

// axios
const { data } = await axios.get('/api/adoption-plans/private');

// jQuery
$.get('/api/adoption-plans/private', function(data) {
  console.log(data);
});
```

#### 响应数据结构
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "plan_type": "private",
  "scenario_applications": [
    {
      "icon": "🎁",
      "background_image": "/uploads/scenarios/holiday-gift.jpg",
      "title": "节日礼赠",
      "pain_point": "😔 传统礼物千篇一律？想送一份有心意的特别礼物？",
      "solution": "💡 专属茶园认养礼盒 + 四季新茶配送，让每个节日都有新茶相伴",
      "core_values": [
        {
          "icon": "🎯",
          "title": "体面有心意",
          "description": ""
        },
        {
          "icon": "📱",
          "title": "持续互动",
          "description": ""
        },
        {
          "icon": "💝",
          "title": "情感连接",
          "description": ""
        }
      ]
    }
  ],
  "created_at": "2025-10-13T08:00:00.000Z",
  "updated_at": "2025-10-13T10:30:00.000Z"
}
```

#### 响应状态码
| 状态码 | 说明 |
|-------|------|
| 200 | 成功获取数据 |
| 404 | 未找到方案数据 |
| 500 | 服务器内部错误 |

---

### 2. 获取企业领养方案

#### 接口信息
```
GET /api/adoption-plans/enterprise
```

#### 请求参数
无需参数

#### 请求示例
```javascript
// 原生 fetch
const response = await fetch('/api/adoption-plans/enterprise');
const data = await response.json();

// axios
const { data } = await axios.get('/api/adoption-plans/enterprise');
```

#### 响应数据结构
与私人定制方案相同，区别在于 `plan_type` 字段值为 `"enterprise"`

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "plan_type": "enterprise",
  "scenario_applications": [
    {
      "icon": "💼",
      "background_image": "/uploads/scenarios/team-building.jpg",
      "title": "企业团建",
      "pain_point": "😕 团建活动形式单一，缺乏深度体验？",
      "solution": "✨ 茶园采摘 + 制茶体验 + 团队建设活动",
      "core_values": [
        {
          "icon": "🌱",
          "title": "回归自然",
          "description": ""
        },
        {
          "icon": "🤲",
          "title": "团队协作",
          "description": ""
        },
        {
          "icon": "📸",
          "title": "独特记忆",
          "description": ""
        }
      ]
    }
  ],
  "created_at": "2025-10-13T08:00:00.000Z",
  "updated_at": "2025-10-13T10:30:00.000Z"
}
```

#### 响应状态码
| 状态码 | 说明 |
|-------|------|
| 200 | 成功获取数据 |
| 404 | 未找到方案数据 |
| 500 | 服务器内部错误 |

---

## 📊 数据字段说明

### 方案对象 (AdoptionPlan)

| 字段名 | 类型 | 说明 | 必填 |
|-------|------|------|------|
| `_id` | String | MongoDB ObjectId | 是 |
| `plan_type` | String | 方案类型：`"private"` 或 `"enterprise"` | 是 |
| `scenario_applications` | Array | 场景化应用数组 | 是 |
| `created_at` | Date | 创建时间 | 是 |
| `updated_at` | Date | 更新时间 | 是 |

### 场景对象 (ScenarioApplication)

| 字段名 | 类型 | 说明 | 必填 | 示例 |
|-------|------|------|------|------|
| `icon` | String | 场景主图标（Emoji） | 否 | `"🎁"`, `"💼"`, `"🎊"` |
| `background_image` | String | 场景专属插画URL | 否 | `"/uploads/scenarios/holiday.jpg"` |
| `title` | String | 场景标题 | 是 | `"节日礼赠"` |
| `pain_point` | String | 用户痛点描述（**支持前置图标**） | 否 | `"😔 传统礼物千篇一律？"` |
| `solution` | String | 定制解决方案（**支持前置图标**） | 否 | `"💡 专属茶园认养礼盒..."` |
| `core_values` | Array | 核心价值数组 | 否 | 见下表 |

> **💡 提示**: `pain_point` 和 `solution` 字段支持在文本**最前面**添加 Emoji 图标（图标与文本之间有一个空格），增强视觉表现力。后端管理界面提供了可视化图标选择器，包含痛点推荐图标（😔😕❓😰🤔💭⚠️）和方案推荐图标（💡✨🎯🌟⭐🔆💫🎁）。前端直接显示即可，无需特殊处理。

### 核心价值对象 (CoreValue)

| 字段名 | 类型 | 说明 | 必填 | 示例 |
|-------|------|------|------|------|
| `icon` | String | 价值图标（Emoji） | 否 | `"🎯"`, `"📱"`, `"💝"` |
| `title` | String | 价值标题 | 是 | `"体面有心意"` |
| `description` | String | 价值描述（可选） | 否 | `""` |

---

## 🎨 图标使用指南

> **✨ 后端管理更新** (2025-10-14): 后端管理界面现已提供可视化图标选择器，管理员可以通过点击推荐图标或手动输入的方式为痛点和方案添加图标。这使得图标的使用更加便捷和规范。API接口和数据格式保持不变。

### 支持图标的字段

场景化应用中，以下字段支持添加 Emoji 图标来增强视觉表现力：

| 字段 | 支持图标 | 推荐使用场景 |
|------|---------|-------------|
| `icon` | ✅ | 场景主图标，必须使用 |
| `pain_point` | ✅ | 可在痛点描述前添加表情图标 |
| `solution` | ✅ | 可在方案说明前添加点亮图标 |
| `core_values[].icon` | ✅ | 核心价值图标，建议使用 |

### 痛点图标推荐

用于 `pain_point` 字段，表达用户的困扰和问题：

```
😔 表示失望、困扰
😕 表示疑惑、不确定
❓ 表示疑问
😰 表示担忧
🤔 表示思考、犹豫
💭 表示思考气泡
⚠️ 表示警示、问题
```

#### 使用示例
```json
{
  "pain_point": "😔 传统礼物千篇一律？想送一份有心意的特别礼物？"
}
```

### 方案图标推荐

用于 `solution` 字段，表达解决方案和积极效果：

```
💡 表示好主意、解决方案（最常用）
✨ 表示闪亮、出色
🎯 表示精准、目标明确
🌟 表示优质、卓越
⭐ 表示推荐
🔆 表示明亮、清晰
💫 表示神奇、超越
🎁 表示礼物、惊喜
```

#### 使用示例
```json
{
  "solution": "💡 专属茶园认养礼盒 + 四季新茶配送，让每个节日都有新茶相伴"
}
```

### 核心价值图标推荐

用于 `core_values[].icon` 字段：

```
🎯 目标、精准
💎 高端、品质
📱 科技、互动
🔗 连接、关系
🌱 自然、成长
👔 专业、身份
💝 情感、心意
⭐ 优质、推荐
✅ 优势、确认
🎨 个性化、创意
📊 数据化、可视
🔒 安全、保障
🤲 团队、协作
📸 记忆、留念
🌟 卓越、闪耀
```

### 图标格式规范

后端管理界面确保图标遵循以下格式（前端无需处理，直接显示即可）：

1. **位置**: 图标始终在文本最前面
2. **分隔**: 图标与文本之间有一个空格
3. **数量**: 每个字段只使用一个图标（不会出现多个图标）
4. **可选**: 图标是可选的，字段可以不包含图标

**标准格式**:
```
[图标] [空格] [文本内容]
```

**示例**:
```json
{
  "pain_point": "😔 传统礼物千篇一律？想送一份有心意的特别礼物？",
  "solution": "💡 专属茶园认养礼盒 + 四季新茶配送，让每个节日都有新茶相伴"
}
```

**无图标示例**（也是有效的）:
```json
{
  "pain_point": "传统礼物千篇一律？",
  "solution": "专属茶园认养礼盒 + 四季新茶配送"
}
```

> **💡 前端提示**: 由于后端管理界面的规范化处理，前端可以放心地直接显示这些字段，不需要担心格式异常（如多个图标、图标在中间等）。

### 图标使用最佳实践

#### ✅ 推荐做法

1. **保持一致性**
   ```json
   // 所有痛点都使用相同风格的图标
   {
     "pain_point": "😔 传统礼物千篇一律？",
     // 而不是混用: "😔❓传统礼物..."
   }
   ```

2. **图标与文本分隔**
   ```json
   // 图标后加空格
   {
     "solution": "💡 专属茶园认养礼盒"  // ✅ 正确
   }
   ```

3. **避免过度使用**
   ```json
   // 简洁明了
   {
     "pain_point": "😔 传统礼物千篇一律？"  // ✅ 正确
   }
   
   // 避免：
   {
     "pain_point": "😔😔😔 传统礼物千篇一律？？？"  // ❌ 过度
   }
   ```

4. **选择恰当的图标**
   ```json
   {
     "pain_point": "😔 团建活动形式单一",  // ✅ 恰当
     "solution": "💡 茶园采摘体验活动"     // ✅ 恰当
   }
   ```

#### ❌ 避免的做法

1. **不要混用多个不同图标**
   ```json
   {
     "pain_point": "😔❓😰 传统礼物千篇一律"  // ❌ 混乱
   }
   ```

2. **不要在句子中间插入图标**
   ```json
   {
     "solution": "专属茶园💡认养礼盒"  // ❌ 影响阅读
   }
   ```

3. **不要使用无关的图标**
   ```json
   {
     "pain_point": "🍕 传统礼物千篇一律"  // ❌ 不相关
   }
   ```

### 前端渲染建议

在前端渲染时，图标会自然显示在文本前，无需特殊处理：

```javascript
// 渲染痛点
function renderPainPoint(painPoint) {
  return `
    <div class="pain-point">
      ${painPoint}
      <!-- 例如：😔 传统礼物千篇一律？ -->
      <!-- 图标会自动显示，无需分离处理 -->
    </div>
  `;
}

// 渲染方案
function renderSolution(solution) {
  return `
    <div class="solution">
      ${solution}
      <!-- 例如：💡 专属茶园认养礼盒 + 四季新茶配送 -->
      <!-- 图标会自动显示，无需分离处理 -->
    </div>
  `;
}
```

**注意事项**:
- ✅ 直接显示字符串即可，浏览器会自动渲染emoji
- ✅ 确保HTML页面使用UTF-8编码：`<meta charset="UTF-8">`
- ✅ 图标和文本作为一个整体显示
- ⚠️ 无需在前端分离图标和文本（后端管理界面已规范化处理）

### 完整示例

```json
{
  "icon": "🎁",
  "title": "节日礼赠",
  "pain_point": "😔 传统礼物千篇一律？想送一份有心意的特别礼物？",
  "solution": "💡 专属茶园认养礼盒 + 四季新茶配送，让每个节日都有新茶相伴",
  "core_values": [
    {
      "icon": "🎯",
      "title": "体面有心意"
    },
    {
      "icon": "📱",
      "title": "持续互动"
    },
    {
      "icon": "💝",
      "title": "情感连接"
    }
  ]
}
```

---

## 💡 使用示例

### 示例1: 获取并渲染私人定制场景

```javascript
// 1. 获取数据
async function loadPrivateScenarios() {
  try {
    const response = await fetch('/api/adoption-plans/private');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const scenarios = data.scenario_applications || [];
    
    // 2. 渲染场景
    renderScenarios(scenarios);
    
  } catch (error) {
    console.error('获取场景数据失败:', error);
    showError('加载失败，请稍后重试');
  }
}

// 3. 渲染函数
function renderScenarios(scenarios) {
  const container = document.getElementById('scenariosContainer');
  
  scenarios.forEach(scenario => {
    const card = createScenarioCard(scenario);
    container.appendChild(card);
  });
}

// 4. 创建卡片
function createScenarioCard(scenario) {
  const card = document.createElement('div');
  card.className = 'scenario-card';
  
  card.innerHTML = `
    <div class="scenario-header">
      <span class="icon">${scenario.icon}</span>
      <h3>${scenario.title}</h3>
    </div>
    ${scenario.background_image ? `
      <img src="${scenario.background_image}" alt="${scenario.title}">
    ` : ''}
    <p class="pain-point">${scenario.pain_point}</p>
    <p class="solution">${scenario.solution}</p>
    <div class="values">
      ${scenario.core_values.map(v => `
        <span class="value-tag">${v.icon} ${v.title}</span>
      `).join('')}
    </div>
  `;
  
  return card;
}

// 页面加载时调用
document.addEventListener('DOMContentLoaded', loadPrivateScenarios);
```

### 示例2: 使用 async/await 处理多个方案

```javascript
async function loadAllScenarios() {
  try {
    // 并行请求两个方案
    const [privateRes, enterpriseRes] = await Promise.all([
      fetch('/api/adoption-plans/private'),
      fetch('/api/adoption-plans/enterprise')
    ]);
    
    // 解析响应
    const privateData = await privateRes.json();
    const enterpriseData = await enterpriseRes.json();
    
    // 处理数据
    console.log('私人定制场景数:', privateData.scenario_applications.length);
    console.log('企业领养场景数:', enterpriseData.scenario_applications.length);
    
    return {
      private: privateData.scenario_applications,
      enterprise: enterpriseData.scenario_applications
    };
    
  } catch (error) {
    console.error('加载失败:', error);
    throw error;
  }
}
```

### 示例3: 使用 axios 并添加加载状态

```javascript
import axios from 'axios';

class ScenarioService {
  constructor() {
    this.loading = false;
    this.error = null;
  }
  
  async getScenarios(type = 'private') {
    this.loading = true;
    this.error = null;
    
    try {
      const response = await axios.get(`/api/adoption-plans/${type}`);
      return response.data.scenario_applications;
      
    } catch (error) {
      this.error = error.response?.data?.message || '获取数据失败';
      console.error('API错误:', error);
      return [];
      
    } finally {
      this.loading = false;
    }
  }
}

// 使用
const service = new ScenarioService();
const scenarios = await service.getScenarios('private');
```

### 示例4: React 组件中使用

```jsx
import React, { useState, useEffect } from 'react';

function ScenarioList({ planType = 'private' }) {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchScenarios() {
      try {
        setLoading(true);
        const response = await fetch(`/api/adoption-plans/${planType}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        
        const data = await response.json();
        setScenarios(data.scenario_applications || []);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchScenarios();
  }, [planType]);
  
  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;
  
  return (
    <div className="scenario-list">
      {scenarios.map((scenario, index) => (
        <ScenarioCard key={index} scenario={scenario} />
      ))}
    </div>
  );
}

function ScenarioCard({ scenario }) {
  return (
    <div className="scenario-card">
      <div className="header">
        <span className="icon">{scenario.icon}</span>
        <h3>{scenario.title}</h3>
      </div>
      
      {scenario.background_image && (
        <img src={scenario.background_image} alt={scenario.title} />
      )}
      
      <p className="pain-point">{scenario.pain_point}</p>
      <p className="solution">{scenario.solution}</p>
      
      <div className="values">
        {scenario.core_values?.map((value, idx) => (
          <span key={idx} className="value-tag">
            {value.icon} {value.title}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ScenarioList;
```

### 示例5: Vue 组件中使用

```vue
<template>
  <div class="scenario-list">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else class="scenarios-grid">
      <div 
        v-for="(scenario, index) in scenarios" 
        :key="index"
        class="scenario-card"
      >
        <div class="header">
          <span class="icon">{{ scenario.icon }}</span>
          <h3>{{ scenario.title }}</h3>
        </div>
        
        <img 
          v-if="scenario.background_image"
          :src="scenario.background_image"
          :alt="scenario.title"
        />
        
        <p class="pain-point">{{ scenario.pain_point }}</p>
        <p class="solution">{{ scenario.solution }}</p>
        
        <div class="values">
          <span 
            v-for="(value, idx) in scenario.core_values"
            :key="idx"
            class="value-tag"
          >
            {{ value.icon }} {{ value.title }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScenarioList',
  props: {
    planType: {
      type: String,
      default: 'private'
    }
  },
  data() {
    return {
      scenarios: [],
      loading: true,
      error: null
    };
  },
  async mounted() {
    await this.fetchScenarios();
  },
  methods: {
    async fetchScenarios() {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await fetch(`/api/adoption-plans/${this.planType}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch scenarios');
        }
        
        const data = await response.json();
        this.scenarios = data.scenario_applications || [];
        
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
```

---

## ⚠️ 错误处理

### 错误响应格式

```json
{
  "success": false,
  "message": "错误描述",
  "error": "详细错误信息（仅开发环境）"
}
```

### 常见错误及处理

#### 1. 404 - 未找到数据

```javascript
try {
  const response = await fetch('/api/adoption-plans/private');
  
  if (response.status === 404) {
    console.log('方案数据尚未创建');
    // 显示空状态或默认内容
    showEmptyState();
    return;
  }
  
  const data = await response.json();
  // 处理数据...
  
} catch (error) {
  console.error('请求失败:', error);
}
```

#### 2. 500 - 服务器错误

```javascript
try {
  const response = await fetch('/api/adoption-plans/private');
  
  if (response.status === 500) {
    throw new Error('服务器错误，请稍后重试');
  }
  
  const data = await response.json();
  // 处理数据...
  
} catch (error) {
  showError(error.message);
}
```

#### 3. 网络错误

```javascript
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      if (i === retries - 1) {
        throw new Error('网络连接失败，请检查网络后重试');
      }
      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### 完整的错误处理示例

```javascript
class APIError extends Error {
  constructor(message, status, response) {
    super(message);
    this.status = status;
    this.response = response;
  }
}

async function fetchScenarios(planType) {
  try {
    const response = await fetch(`/api/adoption-plans/${planType}`);
    
    // 处理HTTP错误
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || '请求失败',
        response.status,
        errorData
      );
    }
    
    const data = await response.json();
    
    // 验证数据结构
    if (!data.scenario_applications) {
      throw new Error('数据格式错误');
    }
    
    return data.scenario_applications;
    
  } catch (error) {
    if (error instanceof APIError) {
      // API错误
      switch (error.status) {
        case 404:
          console.warn('场景数据不存在');
          return [];
        case 500:
          console.error('服务器错误:', error.message);
          throw new Error('服务器繁忙，请稍后重试');
        default:
          throw error;
      }
    } else if (error instanceof TypeError) {
      // 网络错误
      console.error('网络错误:', error);
      throw new Error('网络连接失败，请检查网络');
    } else {
      // 其他错误
      console.error('未知错误:', error);
      throw error;
    }
  }
}
```

---

## 🔒 权限说明

### 公开接口（无需认证）
- `GET /api/adoption-plans/private` - 获取私人定制方案
- `GET /api/adoption-plans/enterprise` - 获取企业领养方案

### 管理接口（需要认证）
- `POST /api/adoption-plans/private` - 更新私人定制方案
- `POST /api/adoption-plans/enterprise` - 更新企业领养方案

> **注意**: 管理接口需要在请求头中包含认证令牌，前端展示页面通常只需要使用公开接口。

---

## 📝 数据验证

### 前端数据验证建议

```javascript
// 验证场景对象
function validateScenario(scenario) {
  const errors = [];
  
  // 必填字段检查
  if (!scenario.title || scenario.title.trim() === '') {
    errors.push('场景标题不能为空');
  }
  
  // 核心价值验证
  if (scenario.core_values && Array.isArray(scenario.core_values)) {
    scenario.core_values.forEach((value, index) => {
      if (!value.title || value.title.trim() === '') {
        errors.push(`核心价值 ${index + 1} 缺少标题`);
      }
    });
  }
  
  // URL验证
  if (scenario.background_image) {
    try {
      new URL(scenario.background_image, window.location.origin);
    } catch (e) {
      errors.push('场景插画URL格式不正确');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// 使用验证
const scenarios = await fetchScenarios('private');
scenarios.forEach(scenario => {
  const validation = validateScenario(scenario);
  if (!validation.valid) {
    console.warn('场景数据验证失败:', validation.errors);
  }
});
```

---

## 🚀 性能优化建议

### 1. 数据缓存

```javascript
class ScenarioCache {
  constructor(ttl = 5 * 60 * 1000) { // 默认缓存5分钟
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    // 检查是否过期
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  clear() {
    this.cache.clear();
  }
}

// 使用缓存
const cache = new ScenarioCache();

async function getScenarios(planType) {
  // 先检查缓存
  const cached = cache.get(planType);
  if (cached) {
    console.log('从缓存获取数据');
    return cached;
  }
  
  // 缓存未命中，请求API
  const response = await fetch(`/api/adoption-plans/${planType}`);
  const data = await response.json();
  const scenarios = data.scenario_applications;
  
  // 存入缓存
  cache.set(planType, scenarios);
  
  return scenarios;
}
```

### 2. 请求防抖

```javascript
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 防抖的场景加载函数
const debouncedLoadScenarios = debounce(async (planType) => {
  const scenarios = await fetchScenarios(planType);
  renderScenarios(scenarios);
}, 300);
```

### 3. 图片懒加载

```javascript
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// 渲染时使用 data-src
function createScenarioCard(scenario) {
  return `
    <div class="scenario-card">
      ${scenario.background_image ? `
        <img 
          data-src="${scenario.background_image}" 
          alt="${scenario.title}"
          class="lazy-load"
        />
      ` : ''}
    </div>
  `;
}
```

---

## 🧪 测试建议

### 单元测试示例（Jest）

```javascript
// scenarioAPI.test.js
import { fetchScenarios } from './scenarioAPI';

describe('Scenario API', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  
  test('should fetch private scenarios successfully', async () => {
    const mockData = {
      scenario_applications: [
        {
          title: '节日礼赠',
          icon: '🎁',
          core_values: []
        }
      ]
    };
    
    fetch.mockResponseOnce(JSON.stringify(mockData));
    
    const scenarios = await fetchScenarios('private');
    
    expect(scenarios).toHaveLength(1);
    expect(scenarios[0].title).toBe('节日礼赠');
  });
  
  test('should handle 404 error', async () => {
    fetch.mockResponseOnce('Not Found', { status: 404 });
    
    const scenarios = await fetchScenarios('private');
    
    expect(scenarios).toEqual([]);
  });
  
  test('should handle network error', async () => {
    fetch.mockReject(new Error('Network error'));
    
    await expect(fetchScenarios('private'))
      .rejects
      .toThrow('网络连接失败');
  });
});
```

### 集成测试示例

```javascript
// 测试完整流程
async function testScenarioFlow() {
  console.log('开始测试...');
  
  // 1. 测试获取数据
  const scenarios = await fetchScenarios('private');
  console.assert(Array.isArray(scenarios), '应返回数组');
  
  // 2. 测试数据结构
  if (scenarios.length > 0) {
    const scenario = scenarios[0];
    console.assert(scenario.title, '场景应有标题');
    console.assert(Array.isArray(scenario.core_values), '核心价值应为数组');
  }
  
  // 3. 测试渲染
  renderScenarios(scenarios);
  const cards = document.querySelectorAll('.scenario-card');
  console.assert(cards.length === scenarios.length, '卡片数量应匹配');
  
  console.log('测试完成！');
}
```

---

## 📚 相关文档

- [私人定制场景化应用-前端实现指南.md](./私人定制场景化应用-前端实现指南.md) - 前端实现完整指南
- [场景化应用-数据结构说明.md](./场景化应用-数据结构说明.md) - 数据结构详解
- [场景化应用-快速使用指南.md](./场景化应用-快速使用指南.md) - 管理端使用指南

---

## 🆘 常见问题

### Q1: API返回的数据为空怎么办？
A: 检查数据库中是否已创建方案数据，可以通过管理后台添加场景。

### Q2: 如何处理场景插画加载失败？
A: 使用图片的 `onerror` 事件处理：
```javascript
<img 
  src="${scenario.background_image}" 
  onerror="this.style.display='none'"
  alt="${scenario.title}"
/>
```

### Q3: 如何判断是否有场景数据？
A: 检查 `scenario_applications` 数组的长度：
```javascript
const hasScenarios = data.scenario_applications && 
                     data.scenario_applications.length > 0;
```

### Q4: 可以缓存API数据吗？
A: 可以，建议缓存5-10分钟，参考上面的"性能优化建议"章节。

### Q5: 如何处理特殊字符和Emoji？
A: API返回的数据已经是UTF-8编码，可以直接使用。确保HTML页面声明了正确的字符集：
```html
<meta charset="UTF-8">
```

### Q6: 痛点和方案的图标是必须的吗？
A: 不是必须的，但**强烈推荐**使用。图标可以：
- ✨ 增强视觉表现力
- 🎯 帮助用户快速理解内容
- 💡 提升用户体验

### Q7: 如何在前端渲染带图标的痛点和方案？
A: 直接渲染即可，图标会自动显示：
```javascript
// 痛点和方案中的图标会自然显示
<p class="pain-point">{scenario.pain_point}</p>
<!-- 渲染结果：😔 传统礼物千篇一律？ -->

<p class="solution">{scenario.solution}</p>
<!-- 渲染结果：💡 专属茶园认养礼盒 + 四季新茶配送 -->
```

### Q8: 可以同时使用多个图标吗？
A: 不推荐。每个字段建议只使用一个图标，保持简洁清晰：
```javascript
// ✅ 推荐
"pain_point": "😔 传统礼物千篇一律？"

// ❌ 不推荐
"pain_point": "😔😕❓ 传统礼物千篇一律？"
```

### Q9: 图标显示不出来怎么办？
A: 检查以下几点：
1. 确保HTML页面使用UTF-8编码：`<meta charset="UTF-8">`
2. 确保字体支持Emoji显示
3. 检查浏览器是否支持Emoji（现代浏览器都支持）
4. 使用开发者工具查看实际返回的数据

### Q10: 后端管理界面更新后，前端需要修改代码吗？
A: **不需要**。后端管理界面的图标选择器只是方便管理员编辑，API返回的数据格式完全没有变化。前端继续按原来的方式渲染即可，图标会自动显示。

### Q11: 图标的格式有保证吗？
A: **有保证**。后端管理界面确保：
- 图标始终在文本最前面
- 图标与文本之间有一个空格
- 每个字段只有一个图标（不会出现多个图标）
- 这使得前端渲染更加可预测和简单

### Q12: 如果痛点或方案没有图标怎么办？
A: **正常显示**。图标是可选的，如果字段没有图标，就是普通的文本字符串，前端直接显示即可。无需判断或特殊处理。

---

## 📞 技术支持

如有问题，请联系：
- **开发团队**: [开发团队联系方式]
- **文档维护**: [文档维护者]
- **更新日期**: 2025年10月14日

---

## 📋 更新日志

### v2.2 (2025-10-14)
- ✅ **后端管理界面升级** - 添加图标可视化选择器
- ✅ 痛点和方案图标编辑更加便捷
- ✅ 提供7个痛点推荐图标和8个方案推荐图标
- ✅ 图标格式更加规范和统一
- ✅ 补充图标格式规范说明章节
- ✅ 更新前端渲染建议和注意事项
- ✅ 新增3个FAQ（Q10-Q12）
- ℹ️ **API接口和数据格式保持不变**

### v2.1 (2025-10-13)
- ✅ 新增图标使用指南章节
- ✅ 痛点和方案字段支持图标说明
- ✅ 推荐图标列表（痛点、方案、核心价值）
- ✅ 图标使用最佳实践
- ✅ 新增4个图标相关FAQ
- ✅ 更新所有示例数据展示图标

### v2.0 (2025-10-13)
- ✅ 完整的API文档
- ✅ 详细的使用示例
- ✅ 错误处理指南
- ✅ 性能优化建议
- ✅ React和Vue示例

### v1.0 (2025-10-12)
- 初始版本

---

**祝开发顺利！** 🚀

