# 定制套餐 API 接口文档

## 📋 文档信息

- **版本**: v1.0
- **创建日期**: 2025年10月30日
- **适用范围**: 私人定制方案 - 定制套餐模块
- **后端框架**: Node.js + Express + MongoDB
- **API 基础路径**: `/api`

---

## 🌐 API 概览

定制套餐是私人定制方案的核心部分，为客户提供多层次的茶园认养选择。本文档提供获取和管理定制套餐数据的完整API接口说明。

### 📑 快速导航

- [接口列表](#接口列表)
- [数据字段说明](#数据字段说明)
- [API 详细说明](#api-详细说明)
- [使用示例](#使用示例)
- [错误处理](#错误处理)
- [常见问题](#常见问题)

---

## 📊 接口列表

| 接口名称 | HTTP方法 | 端点 | 说明 | 是否需要登录 |
|---------|---------|------|------|------------|
| 获取定制套餐列表 | GET | `/api/public/adoption-plans` | 获取私人定制方案包含所有套餐 | ❌ 否 |
| 获取私人定制方案 | GET | `/api/adoption-plans/private` | 获取完整的私人定制方案（含套餐） | ✅ 是 |
| 更新定制套餐 | PUT | `/api/adoption-plans/private` | 更新私人定制方案（含套餐） | ✅ 是 |

---

## 📝 数据字段说明

### 套餐对象结构 (Package Object)

```typescript
interface Package {
  name: string;              // 套餐名称，如："标准套餐"
  price: string;             // 套餐价格，如："¥18,800/年"
  target_audience: string;   // 目标人群，如："追求品质的个人或家庭"
  area_features: string;     // 地块特色，如："0.3亩位于规范管理的优质生态茶区"
  exclusive_output: string;  // 专属产量，如："年产私享鲜叶约30斤"
  tagline: string;           // 宣传标语，如："核心体验"
  features: string;          // 套餐特色（保留字段）
  rights: PackageRight[];    // 套餐权益数组
}
```

### 套餐权益结构 (PackageRight Object)

```typescript
interface PackageRight {
  icon: string;        // 权益图标，如："📍" 或 "https://..."
  title: string;       // 权益标题，如："专属地块"
  description: string; // 权益描述，如："您的专属茶园认养地块"
}
```

### 完整私人定制方案结构

```typescript
interface PrivateAdoptionPlan {
  _id: string;
  type: "private";
  marketing_header: {
    title: string;      // 营销主标题
    subtitle: string;   // 营销副标题
  };
  value_propositions: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  customer_cases: Array<{
    image_url: string;
    text: string;
    media_type: "image" | "video";
  }>;
  scenario_applications: Array<{
    icon: string;
    background_image: string;
    title: string;
    pain_point: string;
    solution: string;
    core_values: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  }>;
  packages: Package[];        // 定制套餐数组（通常3个）
  process_steps: Array<{
    step: string;
    title: string;
    description: string;
  }>;
  createdAt: string;         // ISO 8601 格式
  updatedAt: string;         // ISO 8601 格式
}
```

---

## 📡 API 详细说明

### 1. 获取定制套餐列表（公开接口）

#### 接口信息
```http
GET /api/public/adoption-plans
```

**特点：**
- ✅ 无需登录，公开访问
- ✅ 返回所有方案类型数据
- ✅ 前端网站专用接口

#### 请求参数
无需参数

#### 请求示例

##### 原生 Fetch
```javascript
const response = await fetch('/api/public/adoption-plans');
const result = await response.json();

if (result.success) {
  const packages = result.data.private.packages;
  console.log('定制套餐:', packages);
}
```

##### Axios
```javascript
const { data } = await axios.get('/api/public/adoption-plans');
const packages = data.data.private.packages;

packages.forEach(pkg => {
  console.log(`${pkg.name}: ${pkg.price}`);
});
```

##### jQuery
```javascript
$.get('/api/public/adoption-plans', function(result) {
  const packages = result.data.private.packages;
  
  // 渲染套餐列表
  packages.forEach(function(pkg) {
    $('#packages-container').append(
      `<div class="package-card">
        <h3>${pkg.name}</h3>
        <p class="price">${pkg.price}</p>
        <p class="tagline">${pkg.tagline}</p>
      </div>`
    );
  });
});
```

#### 响应数据结构

```json
{
  "success": true,
  "data": {
    "private": {
      "_id": "66e9a1234567890abcdef123",
      "type": "private",
      "marketing_header": {
        "title": "从消费奢侈 到创造私享",
        "subtitle": "茶如人 百味皆私享"
      },
      "packages": [
        {
          "name": "标准套餐",
          "price": "¥18,800/年",
          "target_audience": "追求品质的个人或家庭",
          "area_features": "0.3亩位于规范管理的优质生态茶区",
          "exclusive_output": "年产私享鲜叶约30斤",
          "tagline": "核心体验",
          "features": "基础的茶园认养体验",
          "rights": [
            {
              "icon": "📍",
              "title": "专属地块",
              "description": "您的专属茶园认养地块，带有定制铭牌"
            },
            {
              "icon": "📱",
              "title": "在线监管",
              "description": "通过APP实时查看茶园生长情况"
            },
            {
              "icon": "🍵",
              "title": "专属茶叶",
              "description": "每年配送您茶园专属产出的优质茶叶"
            }
          ]
        },
        {
          "name": "进阶套餐",
          "price": "¥38,800/年",
          "target_audience": "追求深度参与的茶文化爱好者",
          "area_features": "0.5亩核心产区优质地块",
          "exclusive_output": "年产私享鲜叶约50斤",
          "tagline": "深度参与",
          "features": "深度参与茶园管理",
          "rights": [
            {
              "icon": "⭐",
              "title": "标准套餐全部权益",
              "description": "包含标准套餐的所有服务内容"
            },
            {
              "icon": "🎯",
              "title": "定制管理",
              "description": "参与茶园管理决策，如施肥、采摘时间"
            },
            {
              "icon": "🎁",
              "title": "专属礼盒",
              "description": "定制家族/个人专属包装礼盒"
            },
            {
              "icon": "👨‍🌾",
              "title": "现场体验",
              "description": "每年2次实地采茶、制茶体验活动"
            }
          ]
        },
        {
          "name": "尊享套餐",
          "price": "¥88,800/年",
          "target_audience": "追求极致品质与全方位服务的高端客户",
          "area_features": "1亩山头核心地块，独立区域管理",
          "exclusive_output": "年产私享鲜叶约100斤",
          "tagline": "极致尊享",
          "features": "最高端的茶园认养体验",
          "rights": [
            {
              "icon": "💎",
              "title": "进阶套餐全部权益",
              "description": "包含进阶套餐的所有服务内容"
            },
            {
              "icon": "🏔️",
              "title": "独立山头",
              "description": "专属山头地块，独立命名权"
            },
            {
              "icon": "👨‍🏫",
              "title": "制茶大师",
              "description": "特聘制茶大师专属定制您的茶叶"
            },
            {
              "icon": "🎊",
              "title": "不限次数体验",
              "description": "全年不限次数实地访问和体验"
            },
            {
              "icon": "🌟",
              "title": "专属管家",
              "description": "一对一茶园管家全程服务"
            }
          ]
        }
      ],
      "createdAt": "2024-09-17T12:00:00.000Z",
      "updatedAt": "2024-10-30T08:30:00.000Z"
    },
    "enterprise": { ... },
    "b2b": { ... }
  }
}
```

#### 响应字段说明

| 字段路径 | 类型 | 说明 |
|---------|------|------|
| `success` | Boolean | 请求是否成功 |
| `data.private.packages` | Array | 定制套餐数组（通常包含3个套餐） |
| `data.private.packages[].name` | String | 套餐名称 |
| `data.private.packages[].price` | String | 套餐价格 |
| `data.private.packages[].target_audience` | String | 目标客户群体 |
| `data.private.packages[].area_features` | String | 地块特色描述 |
| `data.private.packages[].exclusive_output` | String | 专属产量说明 |
| `data.private.packages[].tagline` | String | 套餐宣传标语 |
| `data.private.packages[].rights` | Array | 套餐权益列表 |
| `data.private.packages[].rights[].icon` | String | 权益图标 |
| `data.private.packages[].rights[].title` | String | 权益标题 |
| `data.private.packages[].rights[].description` | String | 权益详细说明 |

---

### 2. 获取私人定制方案（管理接口）

#### 接口信息
```http
GET /api/adoption-plans/private
```

**特点：**
- 🔒 需要管理员登录
- 🎯 仅返回私人定制方案数据
- 🛠️ 后台管理专用接口

#### 请求头
```http
Cookie: connect.sid=<session_id>
```

#### 请求示例

```javascript
// 需要在登录状态下调用
const response = await fetch('/api/adoption-plans/private', {
  credentials: 'include'  // 包含 cookie
});

const result = await response.json();

if (result.success) {
  const packages = result.data.packages;
  console.log('套餐数量:', packages.length);
}
```

#### 响应数据结构

```json
{
  "success": true,
  "data": {
    "_id": "66e9a1234567890abcdef123",
    "type": "private",
    "marketing_header": { ... },
    "value_propositions": [ ... ],
    "customer_cases": [ ... ],
    "scenario_applications": [ ... ],
    "packages": [
      {
        "name": "标准套餐",
        "price": "¥18,800/年",
        "target_audience": "追求品质的个人或家庭",
        "area_features": "0.3亩位于规范管理的优质生态茶区",
        "exclusive_output": "年产私享鲜叶约30斤",
        "tagline": "核心体验",
        "features": "基础的茶园认养体验",
        "rights": [ ... ]
      }
      // ... 其他套餐
    ],
    "process_steps": [ ... ],
    "createdAt": "2024-09-17T12:00:00.000Z",
    "updatedAt": "2024-10-30T08:30:00.000Z"
  }
}
```

---

### 3. 更新定制套餐（管理接口）

#### 接口信息
```http
PUT /api/adoption-plans/private
```

**特点：**
- 🔒 需要管理员登录
- 🔄 更新整个私人定制方案（包括套餐）
- ✅ 支持 Upsert（不存在则创建）

#### 请求头
```http
Content-Type: application/json
Cookie: connect.sid=<session_id>
```

#### 请求体示例

```json
{
  "type": "private",
  "marketing_header": {
    "title": "从消费奢侈 到创造私享",
    "subtitle": "茶如人 百味皆私享"
  },
  "packages": [
    {
      "name": "标准套餐",
      "price": "¥18,800/年",
      "target_audience": "追求品质的个人或家庭",
      "area_features": "0.3亩位于规范管理的优质生态茶区",
      "exclusive_output": "年产私享鲜叶约30斤",
      "tagline": "核心体验",
      "features": "基础的茶园认养体验",
      "rights": [
        {
          "icon": "📍",
          "title": "专属地块",
          "description": "您的专属茶园认养地块，带有定制铭牌"
        },
        {
          "icon": "📱",
          "title": "在线监管",
          "description": "通过APP实时查看茶园生长情况"
        }
      ]
    },
    {
      "name": "进阶套餐",
      "price": "¥38,800/年",
      "target_audience": "追求深度参与的茶文化爱好者",
      "area_features": "0.5亩核心产区优质地块",
      "exclusive_output": "年产私享鲜叶约50斤",
      "tagline": "深度参与",
      "features": "深度参与茶园管理",
      "rights": [
        {
          "icon": "⭐",
          "title": "标准套餐全部权益",
          "description": "包含标准套餐的所有服务内容"
        },
        {
          "icon": "🎯",
          "title": "定制管理",
          "description": "参与茶园管理决策"
        }
      ]
    },
    {
      "name": "尊享套餐",
      "price": "¥88,800/年",
      "target_audience": "追求极致品质与全方位服务的高端客户",
      "area_features": "1亩山头核心地块，独立区域管理",
      "exclusive_output": "年产私享鲜叶约100斤",
      "tagline": "极致尊享",
      "features": "最高端的茶园认养体验",
      "rights": [
        {
          "icon": "💎",
          "title": "进阶套餐全部权益",
          "description": "包含进阶套餐的所有服务内容"
        },
        {
          "icon": "🏔️",
          "title": "独立山头",
          "description": "专属山头地块，独立命名权"
        }
      ]
    }
  ]
}
```

#### 请求示例

```javascript
// 更新定制套餐
async function updatePackages(packages) {
  const response = await fetch('/api/adoption-plans/private', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      type: 'private',
      packages: packages
      // 注意：需要包含其他必要字段，或先获取现有数据再更新
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    console.log('套餐更新成功!');
    return result.data;
  } else {
    console.error('更新失败:', result.message);
    throw new Error(result.message);
  }
}

// 使用示例
const newPackages = [
  {
    name: "新套餐",
    price: "¥28,800/年",
    target_audience: "新目标人群",
    area_features: "新地块特色",
    exclusive_output: "新产量说明",
    tagline: "新标语",
    features: "新特色",
    rights: [
      {
        icon: "🎁",
        title: "新权益",
        description: "新权益描述"
      }
    ]
  }
];

updatePackages(newPackages);
```

#### 响应数据结构

**成功响应：**
```json
{
  "success": true,
  "message": "私人定制方案更新成功",
  "data": {
    "_id": "66e9a1234567890abcdef123",
    "type": "private",
    "packages": [
      // 更新后的套餐数据
    ],
    "updatedAt": "2024-10-30T10:15:30.000Z"
  }
}
```

**失败响应：**
```json
{
  "success": false,
  "message": "更新失败的原因",
  "error": "详细错误信息"
}
```

---

## 💡 使用示例

### 场景1: 在前端网站展示三个套餐

```javascript
// 1. 获取套餐数据
async function loadPackages() {
  try {
    const response = await fetch('/api/public/adoption-plans');
    const result = await response.json();
    
    if (result.success) {
      const packages = result.data.private.packages;
      renderPackages(packages);
    }
  } catch (error) {
    console.error('加载套餐失败:', error);
  }
}

// 2. 渲染套餐卡片
function renderPackages(packages) {
  const container = document.getElementById('packages-container');
  
  packages.forEach((pkg, index) => {
    const card = document.createElement('div');
    card.className = 'package-card';
    card.innerHTML = `
      <div class="package-header">
        <h3>${pkg.name}</h3>
        <p class="price">${pkg.price}</p>
        <p class="tagline">${pkg.tagline}</p>
      </div>
      
      <div class="package-details">
        <p class="target"><strong>适合人群：</strong>${pkg.target_audience}</p>
        <p class="area"><strong>地块特色：</strong>${pkg.area_features}</p>
        <p class="output"><strong>专属产量：</strong>${pkg.exclusive_output}</p>
      </div>
      
      <div class="package-rights">
        <h4>套餐权益</h4>
        <ul>
          ${pkg.rights.map(right => `
            <li>
              <span class="icon">${right.icon}</span>
              <div>
                <strong>${right.title}</strong>
                <p>${right.description}</p>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
      
      <button class="select-package" data-package="${pkg.name}">
        选择此套餐
      </button>
    `;
    
    container.appendChild(card);
  });
}

// 3. 页面加载时调用
document.addEventListener('DOMContentLoaded', loadPackages);
```

### 场景2: 套餐比较功能

```javascript
// 创建套餐对比表
function createComparisonTable(packages) {
  const table = document.createElement('table');
  table.className = 'comparison-table';
  
  // 表头
  const thead = `
    <thead>
      <tr>
        <th>对比项</th>
        ${packages.map(pkg => `<th>${pkg.name}</th>`).join('')}
      </tr>
    </thead>
  `;
  
  // 表体
  const tbody = `
    <tbody>
      <tr>
        <td>价格</td>
        ${packages.map(pkg => `<td class="price">${pkg.price}</td>`).join('')}
      </tr>
      <tr>
        <td>地块面积</td>
        ${packages.map(pkg => `<td>${pkg.area_features}</td>`).join('')}
      </tr>
      <tr>
        <td>年产量</td>
        ${packages.map(pkg => `<td>${pkg.exclusive_output}</td>`).join('')}
      </tr>
      <tr>
        <td>权益数量</td>
        ${packages.map(pkg => `<td>${pkg.rights.length}项</td>`).join('')}
      </tr>
    </tbody>
  `;
  
  table.innerHTML = thead + tbody;
  return table;
}

// 使用
fetch('/api/public/adoption-plans')
  .then(res => res.json())
  .then(result => {
    const packages = result.data.private.packages;
    const table = createComparisonTable(packages);
    document.getElementById('comparison-container').appendChild(table);
  });
```

### 场景3: 筛选和排序套餐

```javascript
class PackageManager {
  constructor() {
    this.packages = [];
  }
  
  // 加载套餐
  async load() {
    const response = await fetch('/api/public/adoption-plans');
    const result = await response.json();
    this.packages = result.data.private.packages;
    return this.packages;
  }
  
  // 按价格筛选
  filterByPrice(maxPrice) {
    return this.packages.filter(pkg => {
      const price = parseInt(pkg.price.replace(/[^\d]/g, ''));
      return price <= maxPrice;
    });
  }
  
  // 按价格排序
  sortByPrice(ascending = true) {
    return [...this.packages].sort((a, b) => {
      const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
      const priceB = parseInt(b.price.replace(/[^\d]/g, ''));
      return ascending ? priceA - priceB : priceB - priceA;
    });
  }
  
  // 获取推荐套餐（中间价位）
  getRecommended() {
    if (this.packages.length === 3) {
      return this.packages[1]; // 返回进阶套餐
    }
    return this.packages[0];
  }
  
  // 搜索套餐
  search(keyword) {
    keyword = keyword.toLowerCase();
    return this.packages.filter(pkg => 
      pkg.name.toLowerCase().includes(keyword) ||
      pkg.tagline.toLowerCase().includes(keyword) ||
      pkg.target_audience.toLowerCase().includes(keyword)
    );
  }
}

// 使用示例
const manager = new PackageManager();
await manager.load();

// 获取30000元以下的套餐
const affordable = manager.filterByPrice(30000);

// 按价格升序排列
const sorted = manager.sortByPrice(true);

// 获取推荐套餐
const recommended = manager.getRecommended();
```

### 场景4: Vue.js 集成

```vue
<template>
  <div class="packages-section">
    <h2>选择您的定制套餐</h2>
    
    <div v-if="loading" class="loading">
      加载中...
    </div>
    
    <div v-else class="packages-grid">
      <div 
        v-for="(pkg, index) in packages" 
        :key="index"
        class="package-card"
        :class="{ 'recommended': isRecommended(index) }"
      >
        <div v-if="isRecommended(index)" class="badge">推荐</div>
        
        <h3>{{ pkg.name }}</h3>
        <div class="price">{{ pkg.price }}</div>
        <p class="tagline">{{ pkg.tagline }}</p>
        
        <div class="info">
          <p><strong>适合：</strong>{{ pkg.target_audience }}</p>
          <p><strong>地块：</strong>{{ pkg.area_features }}</p>
          <p><strong>产量：</strong>{{ pkg.exclusive_output }}</p>
        </div>
        
        <div class="rights">
          <h4>套餐权益</h4>
          <ul>
            <li v-for="(right, idx) in pkg.rights" :key="idx">
              <span class="icon">{{ right.icon }}</span>
              <div>
                <strong>{{ right.title }}</strong>
                <p>{{ right.description }}</p>
              </div>
            </li>
          </ul>
        </div>
        
        <button @click="selectPackage(pkg)" class="btn-select">
          选择此套餐
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PackagesSection',
  
  data() {
    return {
      packages: [],
      loading: true
    };
  },
  
  mounted() {
    this.loadPackages();
  },
  
  methods: {
    async loadPackages() {
      try {
        const response = await fetch('/api/public/adoption-plans');
        const result = await response.json();
        
        if (result.success) {
          this.packages = result.data.private.packages;
        }
      } catch (error) {
        console.error('加载套餐失败:', error);
        this.$message.error('加载套餐失败，请刷新重试');
      } finally {
        this.loading = false;
      }
    },
    
    isRecommended(index) {
      // 中间的套餐为推荐套餐
      return index === 1 && this.packages.length === 3;
    },
    
    selectPackage(pkg) {
      this.$emit('package-selected', pkg);
      // 或者导航到订购页面
      this.$router.push({
        name: 'order',
        params: { package: pkg.name }
      });
    }
  }
};
</script>

<style scoped>
.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.package-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
}

.package-card.recommended {
  border-color: #ff6b35;
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.2);
  transform: scale(1.05);
}

.badge {
  position: absolute;
  top: -10px;
  right: 20px;
  background: #ff6b35;
  color: white;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: #ff6b35;
  margin: 1rem 0;
}

.rights ul {
  list-style: none;
  padding: 0;
}

.rights li {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.icon {
  font-size: 1.5rem;
}
</style>
```

### 场景5: React 集成

```jsx
import React, { useState, useEffect } from 'react';
import './PackagesSection.css';

function PackagesSection() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const response = await fetch('/api/public/adoption-plans');
      const result = await response.json();
      
      if (result.success) {
        setPackages(result.data.private.packages);
      } else {
        setError('加载失败');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    // 可以触发其他操作，如打开订购表单
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (error) {
    return <div className="error">加载失败: {error}</div>;
  }

  return (
    <div className="packages-section">
      <h2>选择您的定制套餐</h2>
      
      <div className="packages-grid">
        {packages.map((pkg, index) => (
          <PackageCard
            key={index}
            package={pkg}
            isRecommended={index === 1 && packages.length === 3}
            onSelect={handleSelectPackage}
            isSelected={selectedPackage?.name === pkg.name}
          />
        ))}
      </div>
    </div>
  );
}

function PackageCard({ package: pkg, isRecommended, onSelect, isSelected }) {
  return (
    <div className={`package-card ${isRecommended ? 'recommended' : ''} ${isSelected ? 'selected' : ''}`}>
      {isRecommended && <div className="badge">推荐</div>}
      
      <h3>{pkg.name}</h3>
      <div className="price">{pkg.price}</div>
      <p className="tagline">{pkg.tagline}</p>
      
      <div className="info">
        <p><strong>适合：</strong>{pkg.target_audience}</p>
        <p><strong>地块：</strong>{pkg.area_features}</p>
        <p><strong>产量：</strong>{pkg.exclusive_output}</p>
      </div>
      
      <div className="rights">
        <h4>套餐权益</h4>
        <ul>
          {pkg.rights.map((right, idx) => (
            <li key={idx}>
              <span className="icon">{right.icon}</span>
              <div>
                <strong>{right.title}</strong>
                <p>{right.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <button 
        onClick={() => onSelect(pkg)}
        className="btn-select"
      >
        {isSelected ? '已选择' : '选择此套餐'}
      </button>
    </div>
  );
}

export default PackagesSection;
```

---

## ⚠️ 错误处理

### 常见错误类型

#### 1. 未登录错误（仅管理接口）

```json
{
  "success": false,
  "message": "需要登录才能访问此资源"
}
```

**解决方案：**
```javascript
// 重定向到登录页
if (!result.success && result.message.includes('登录')) {
  window.location.href = '/login';
}
```

#### 2. 数据不存在

```json
{
  "success": false,
  "message": "未找到私人定制方案数据"
}
```

**解决方案：**
```javascript
// 系统会自动创建默认数据，重新请求即可
if (!result.success && result.message.includes('未找到')) {
  setTimeout(() => loadPackages(), 1000);
}
```

#### 3. 服务器错误

```json
{
  "success": false,
  "message": "获取方案数据失败",
  "error": "详细错误信息"
}
```

**解决方案：**
```javascript
try {
  const response = await fetch('/api/public/adoption-plans');
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message);
  }
  
  // 处理成功的数据
  
} catch (error) {
  console.error('请求失败:', error);
  // 显示友好的错误提示
  showErrorMessage('加载套餐失败，请稍后重试');
}
```

#### 4. 数据验证错误（更新接口）

```json
{
  "success": false,
  "message": "验证失败",
  "errors": [
    "套餐名称不能为空",
    "套餐价格格式不正确"
  ]
}
```

**解决方案：**
```javascript
// 前端验证
function validatePackage(pkg) {
  const errors = [];
  
  if (!pkg.name || pkg.name.trim() === '') {
    errors.push('套餐名称不能为空');
  }
  
  if (!pkg.price || pkg.price.trim() === '') {
    errors.push('套餐价格不能为空');
  }
  
  if (!pkg.rights || pkg.rights.length === 0) {
    errors.push('至少需要添加一项套餐权益');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// 使用
const validation = validatePackage(newPackage);
if (!validation.isValid) {
  alert('验证失败:\n' + validation.errors.join('\n'));
  return;
}
```

---

## ❓ 常见问题

### Q1: 套餐数量是否固定为3个？

**A:** 不是固定的。虽然通常设计为3个套餐（标准、进阶、尊享），但系统支持任意数量的套餐。前端应该动态渲染，而不是硬编码3个。

```javascript
// ✅ 好的做法 - 动态渲染
packages.forEach(pkg => renderPackage(pkg));

// ❌ 不好的做法 - 硬编码
const standard = packages[0];
const advanced = packages[1];
const premium = packages[2];
```

---

### Q2: 如何判断哪个是推荐套餐？

**A:** 数据库中没有专门的"推荐"标记。通常按照业务逻辑，中间价位的套餐作为推荐套餐。

```javascript
function getRecommendedPackage(packages) {
  if (packages.length === 3) {
    return packages[1]; // 中间套餐
  }
  
  // 或者根据价格排序后取中间值
  const sorted = packages.sort((a, b) => {
    const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
    const priceB = parseInt(b.price.replace(/[^\d]/g, ''));
    return priceA - priceB;
  });
  
  return sorted[Math.floor(sorted.length / 2)];
}
```

---

### Q3: 权益图标应该使用 Emoji 还是图片 URL？

**A:** 两者都支持。`icon` 字段可以是：
- Emoji 字符：`"🎁"`、`"📍"`
- 图片 URL：`"/uploads/icons/gift.png"`
- 图标类名：`"fas fa-gift"`（如果使用 FontAwesome）

```javascript
// 渲染权益图标
function renderIcon(icon) {
  // 判断是否为 URL
  if (icon.startsWith('http') || icon.startsWith('/')) {
    return `<img src="${icon}" alt="icon" class="right-icon">`;
  }
  
  // 判断是否为图标类名
  if (icon.includes('fa-')) {
    return `<i class="${icon}"></i>`;
  }
  
  // 默认作为 Emoji
  return `<span class="emoji">${icon}</span>`;
}
```

---

### Q4: 如何处理套餐价格的货币格式？

**A:** 价格存储为字符串格式（如 `"¥18,800/年"`），前端需要根据需要解析。

```javascript
// 提取数字价格
function extractPrice(priceString) {
  return parseInt(priceString.replace(/[^\d]/g, ''));
}

// 格式化价格
function formatPrice(price) {
  return `¥${price.toLocaleString('zh-CN')}/年`;
}

// 比较价格
function comparePackages(pkg1, pkg2) {
  const price1 = extractPrice(pkg1.price);
  const price2 = extractPrice(pkg2.price);
  return price1 - price2;
}
```

---

### Q5: 更新套餐时是否需要传递完整的方案数据？

**A:** 是的。PUT 接口会替换整个方案文档，所以需要包含所有字段。建议的做法是：

```javascript
async function updatePackagesOnly(newPackages) {
  // 1. 先获取当前完整数据
  const response = await fetch('/api/adoption-plans/private', {
    credentials: 'include'
  });
  const result = await response.json();
  
  if (!result.success) {
    throw new Error('获取当前数据失败');
  }
  
  // 2. 只更新 packages 字段
  const updatedData = {
    ...result.data,
    packages: newPackages
  };
  
  // 3. 提交更新
  const updateResponse = await fetch('/api/adoption-plans/private', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(updatedData)
  });
  
  return await updateResponse.json();
}
```

---

### Q6: 套餐权益最多可以添加多少个？

**A:** 没有硬性限制，但建议每个套餐的权益数量控制在 3-8 个之间，以保证用户体验。

```javascript
// 验证权益数量
function validateRightsCount(rights) {
  const MIN_RIGHTS = 3;
  const MAX_RIGHTS = 8;
  const RECOMMENDED_RIGHTS = 5;
  
  if (rights.length < MIN_RIGHTS) {
    return {
      valid: false,
      message: `至少需要${MIN_RIGHTS}个权益`
    };
  }
  
  if (rights.length > MAX_RIGHTS) {
    return {
      valid: true,
      warning: `建议权益数量不超过${MAX_RIGHTS}个，以获得更好的展示效果`
    };
  }
  
  return { valid: true };
}
```

---

### Q7: 如何实现套餐的排序展示？

**A:** 数据库中套餐的顺序就是展示顺序。如果需要自定义排序：

```javascript
// 按价格升序
const sortedByPrice = packages.sort((a, b) => {
  const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
  const priceB = parseInt(b.price.replace(/[^\d]/g, ''));
  return priceA - priceB;
});

// 按权益数量降序
const sortedByRights = packages.sort((a, b) => {
  return b.rights.length - a.rights.length;
});

// 自定义顺序（使用索引数组）
const customOrder = [2, 0, 1]; // 尊享、标准、进阶
const customSorted = customOrder.map(i => packages[i]);
```

---

### Q8: 如何实现套餐的搜索和筛选？

**A:** 可以根据多个字段进行搜索：

```javascript
function searchPackages(packages, keyword) {
  keyword = keyword.toLowerCase().trim();
  
  return packages.filter(pkg => {
    // 搜索套餐名称
    if (pkg.name.toLowerCase().includes(keyword)) return true;
    
    // 搜索标语
    if (pkg.tagline.toLowerCase().includes(keyword)) return true;
    
    // 搜索目标人群
    if (pkg.target_audience.toLowerCase().includes(keyword)) return true;
    
    // 搜索权益标题
    if (pkg.rights.some(r => r.title.toLowerCase().includes(keyword))) return true;
    
    return false;
  });
}

// 使用
const results = searchPackages(packages, '体验');
```

---

## 📚 相关文档

- [场景化应用 API 接口文档](./场景化应用API接口文档.md)
- [企业定制管理 - 使用场景API文档](./企业定制管理-使用场景API文档.md)
- [云养茶园功能实施完成报告](./云养茶园功能实施完成报告.md)

---

## 📞 技术支持

如有任何问题，请联系：
- **技术团队**: tech@example.com
- **文档维护**: docs@example.com

---

## 📝 更新日志

### v1.0 (2025-10-30)
- ✨ 初版发布
- 📖 完整的API接口说明
- 💡 丰富的使用示例
- ❓ 常见问题解答
- 🎨 Vue.js 和 React 集成示例

