# 定制套餐对比功能 API 接口文档

> **版本**: v2.0 (动态套餐支持版)  
> **更新日期**: 2024年  
> **适用对象**: 前端开发团队  

---

## 📋 目录

1. [接口概述](#接口概述)
2. [接口详情](#接口详情)
3. [数据结构说明](#数据结构说明)
4. [使用示例](#使用示例)
5. [错误处理](#错误处理)
6. [常见问题](#常见问题)

---

## 接口概述

定制套餐对比功能提供动态的套餐对比表格数据，支持：
- ✅ 动态套餐列数（可增删套餐）
- ✅ 自定义套餐名称
- ✅ 灵活的对比特性管理

### 核心优势
- 套餐数量不限制（默认3个，可扩展到任意数量）
- 套餐名称可自定义（不再写死为"标准"、"尊享"、"VIP"）
- 对比特性支持图标、名称、多列值

---

## 接口详情

### 1️⃣ 获取私人定制套餐对比数据

#### **请求信息**

```http
GET /api/adoption-plans/private
```

**说明**: 获取私人定制方案的完整数据，包含套餐对比信息。

#### **请求参数**

无需参数

#### **请求头**

```http
Content-Type: application/json
```

需要登录认证（Cookie: connect.sid）

#### **响应结果**

**成功响应** (HTTP 200)

```json
{
  "success": true,
  "data": {
    "type": "private",
    "marketing_header": { ... },
    "value_propositions": [ ... ],
    "customer_cases": [ ... ],
    "scenario_applications": [ ... ],
    "packages": [ ... ],
    "process_steps": [ ... ],
    
    // ====== 套餐对比相关字段（新增）====== 
    "comparison_package_names": [
      "标准套餐",
      "尊享套餐", 
      "VIP套餐"
    ],
    "comparison_features": [
      {
        "icon": "🌱",
        "feature_name": "地块面积",
        "values": ["0.3亩", "0.5亩", "1亩"]
      },
      {
        "icon": "🍃",
        "feature_name": "茶树数量",
        "values": ["30棵", "50棵", "100棵"]
      },
      {
        "icon": "📦",
        "feature_name": "年度产茶",
        "values": ["5斤", "10斤", "20斤"]
      }
    ]
  }
}
```

**失败响应** (HTTP 4xx/5xx)

```json
{
  "success": false,
  "message": "错误描述信息"
}
```

---

## 数据结构说明

### 🔑 核心字段

#### 1. `comparison_package_names`

**类型**: `Array<String>`  
**说明**: 套餐名称列表，定义对比表格的**列标题**  
**默认值**: `["标准套餐", "尊享套餐", "VIP套餐"]`

**特点**:
- 数组长度 = 套餐列数
- 顺序重要（对应 `values` 数组的顺序）
- 支持动态增删

**示例**:
```json
// 3个套餐（默认）
["标准套餐", "尊享套餐", "VIP套餐"]

// 4个套餐（扩展后）
["标准套餐", "尊享套餐", "VIP套餐", "至尊套餐"]

// 自定义名称
["入门版", "专业版", "企业版", "旗舰版"]
```

---

#### 2. `comparison_features`

**类型**: `Array<Object>`  
**说明**: 对比特性列表，每个对象代表表格的**一行**

##### 特性对象结构

| 字段 | 类型 | 说明 | 是否必填 | 示例 |
|------|------|------|----------|------|
| `icon` | String | 特性图标（emoji或图标类名） | 可选 | `"🌱"` |
| `feature_name` | String | 特性名称 | 必填 | `"地块面积"` |
| `values` | Array<String> | 各套餐对应的值 | 必填 | `["0.3亩", "0.5亩", "1亩"]` |

##### `values` 数组规则

⚠️ **重要**: `values` 数组的长度和顺序必须与 `comparison_package_names` 保持一致！

```javascript
// ✅ 正确示例
comparison_package_names: ["标准", "尊享", "VIP"]
values: ["30棵", "50棵", "100棵"]
//       ↑        ↑        ↑
//     标准值   尊享值   VIP值

// ❌ 错误示例 - 长度不匹配
comparison_package_names: ["标准", "尊享", "VIP"]  // 3个
values: ["30棵", "50棵"]                          // 2个 ❌

// ❌ 错误示例 - 顺序错乱
comparison_package_names: ["标准", "尊享", "VIP"]
values: ["100棵", "30棵", "50棵"]  // 顺序与名称不对应 ❌
```

---

### 📊 完整数据示例

```json
{
  "comparison_package_names": [
    "标准套餐",
    "尊享套餐",
    "VIP套餐",
    "至尊套餐"
  ],
  "comparison_features": [
    {
      "icon": "🌱",
      "feature_name": "地块面积",
      "values": ["0.3亩", "0.5亩", "1亩", "2亩"]
    },
    {
      "icon": "🍃",
      "feature_name": "茶树数量",
      "values": ["30棵", "50棵", "100棵", "200棵"]
    },
    {
      "icon": "📦",
      "feature_name": "年度产茶",
      "values": ["5斤", "10斤", "20斤", "40斤"]
    },
    {
      "icon": "🎁",
      "feature_name": "专属礼盒",
      "values": ["基础版", "精装版", "豪华版", "定制版"]
    },
    {
      "icon": "👨‍🌾",
      "feature_name": "专属茶农",
      "values": ["否", "是", "是", "是"]
    },
    {
      "icon": "📸",
      "feature_name": "实时监控",
      "values": ["基础", "标准", "高清", "4K"]
    },
    {
      "icon": "🚚",
      "feature_name": "配送次数",
      "values": ["2次/年", "4次/年", "6次/年", "12次/年"]
    }
  ]
}
```

---

## 使用示例

### 前端渲染表格示例

#### HTML 结构

```html
<div class="comparison-table">
  <table>
    <thead>
      <tr>
        <th>对比项</th>
        <!-- 动态生成套餐列 -->
        <th v-for="packageName in packageNames" :key="packageName">
          {{ packageName }}
        </th>
      </tr>
    </thead>
    <tbody>
      <!-- 动态生成特性行 -->
      <tr v-for="feature in features" :key="feature.feature_name">
        <td>
          <span class="icon">{{ feature.icon }}</span>
          {{ feature.feature_name }}
        </td>
        <!-- 动态生成特性值单元格 -->
        <td v-for="(value, index) in feature.values" :key="index">
          {{ value }}
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

#### JavaScript (Vue.js 示例)

```javascript
export default {
  data() {
    return {
      packageNames: [],
      features: []
    }
  },
  
  async mounted() {
    await this.loadComparisonData();
  },
  
  methods: {
    async loadComparisonData() {
      try {
        const response = await fetch('/api/adoption-plans/private');
        const result = await response.json();
        
        if (result.success) {
          const data = result.data;
          
          // 提取套餐名称和对比特性
          this.packageNames = data.comparison_package_names || [];
          this.features = data.comparison_features || [];
          
          // 验证数据完整性
          this.validateData();
        }
      } catch (error) {
        console.error('加载对比数据失败:', error);
      }
    },
    
    // 验证数据一致性
    validateData() {
      const packageCount = this.packageNames.length;
      
      this.features.forEach((feature, index) => {
        if (feature.values.length !== packageCount) {
          console.warn(
            `特性 "${feature.feature_name}" 的值数量(${feature.values.length})` +
            `与套餐数量(${packageCount})不匹配！`
          );
        }
      });
    }
  }
}
```

#### JavaScript (React 示例)

```javascript
import React, { useState, useEffect } from 'react';

function ComparisonTable() {
  const [packageNames, setPackageNames] = useState([]);
  const [features, setFeatures] = useState([]);
  
  useEffect(() => {
    loadComparisonData();
  }, []);
  
  const loadComparisonData = async () => {
    try {
      const response = await fetch('/api/adoption-plans/private');
      const result = await response.json();
      
      if (result.success) {
        const { comparison_package_names, comparison_features } = result.data;
        setPackageNames(comparison_package_names || []);
        setFeatures(comparison_features || []);
      }
    } catch (error) {
      console.error('加载对比数据失败:', error);
    }
  };
  
  return (
    <div className="comparison-table">
      <table>
        <thead>
          <tr>
            <th>对比项</th>
            {packageNames.map((name, index) => (
              <th key={index}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature, featureIndex) => (
            <tr key={featureIndex}>
              <td>
                <span className="icon">{feature.icon}</span>
                {feature.feature_name}
              </td>
              {feature.values.map((value, valueIndex) => (
                <td key={valueIndex}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComparisonTable;
```

#### JavaScript (原生 JS 示例)

```javascript
async function renderComparisonTable() {
  try {
    // 1. 获取数据
    const response = await fetch('/api/adoption-plans/private');
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    const { comparison_package_names, comparison_features } = result.data;
    
    // 2. 生成表头
    let headerHTML = '<tr><th>对比项</th>';
    comparison_package_names.forEach(name => {
      headerHTML += `<th>${name}</th>`;
    });
    headerHTML += '</tr>';
    
    // 3. 生成表格内容
    let bodyHTML = '';
    comparison_features.forEach(feature => {
      bodyHTML += '<tr>';
      bodyHTML += `<td><span class="icon">${feature.icon}</span>${feature.feature_name}</td>`;
      feature.values.forEach(value => {
        bodyHTML += `<td>${value}</td>`;
      });
      bodyHTML += '</tr>';
    });
    
    // 4. 插入DOM
    document.querySelector('#comparison-table thead').innerHTML = headerHTML;
    document.querySelector('#comparison-table tbody').innerHTML = bodyHTML;
    
  } catch (error) {
    console.error('渲染对比表格失败:', error);
  }
}

// 页面加载时调用
document.addEventListener('DOMContentLoaded', renderComparisonTable);
```

---

## 错误处理

### 常见错误码

| HTTP状态码 | 说明 | 处理建议 |
|-----------|------|---------|
| 200 | 成功 | 正常处理数据 |
| 401 | 未登录 | 跳转到登录页 |
| 404 | 资源不存在 | 提示用户数据未初始化 |
| 500 | 服务器错误 | 显示错误提示，建议重试 |

### 前端错误处理示例

```javascript
async function loadComparisonData() {
  try {
    const response = await fetch('/api/adoption-plans/private');
    
    // 1. 检查HTTP状态
    if (!response.ok) {
      if (response.status === 401) {
        // 未登录，跳转登录页
        window.location.href = '/login';
        return;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // 2. 检查业务状态
    if (!result.success) {
      throw new Error(result.message || '获取数据失败');
    }
    
    // 3. 检查数据完整性
    const { comparison_package_names, comparison_features } = result.data;
    
    if (!comparison_package_names || !Array.isArray(comparison_package_names)) {
      console.warn('套餐名称数据缺失，使用默认值');
      comparison_package_names = ['标准套餐', '尊享套餐', 'VIP套餐'];
    }
    
    if (!comparison_features || !Array.isArray(comparison_features)) {
      console.warn('对比特性数据缺失');
      comparison_features = [];
    }
    
    // 4. 验证数据一致性
    const packageCount = comparison_package_names.length;
    comparison_features.forEach(feature => {
      if (feature.values.length !== packageCount) {
        console.error(
          `数据不一致: "${feature.feature_name}" 有 ${feature.values.length} 个值，` +
          `但有 ${packageCount} 个套餐`
        );
      }
    });
    
    return { comparison_package_names, comparison_features };
    
  } catch (error) {
    console.error('加载对比数据失败:', error);
    // 显示用户友好的错误提示
    showErrorMessage('加载套餐对比信息失败，请刷新页面重试');
    throw error;
  }
}
```

---

## 常见问题

### Q1: 如何判断套餐数量？

**A**: 通过 `comparison_package_names.length` 获取

```javascript
const packageCount = data.comparison_package_names.length;
console.log(`当前有 ${packageCount} 个套餐`);
```

---

### Q2: 如何处理空数据？

**A**: 始终检查数据是否存在并提供默认值

```javascript
const packageNames = data.comparison_package_names || ['标准套餐', '尊享套餐', 'VIP套餐'];
const features = data.comparison_features || [];
```

---

### Q3: values 数组为什么可能与套餐数量不匹配？

**A**: 可能的原因：
1. 后台管理员添加了新套餐，但未更新旧特性的值
2. 数据迁移过程中出现问题
3. 手动编辑数据库导致不一致

**解决方案**:
```javascript
// 前端自动补全缺失的值
function normalizeFeatureValues(feature, packageCount) {
  const currentLength = feature.values.length;
  
  if (currentLength < packageCount) {
    // 补全缺失的值（用 "-" 或 "待定" 填充）
    const missingCount = packageCount - currentLength;
    feature.values.push(...Array(missingCount).fill('-'));
  } else if (currentLength > packageCount) {
    // 截断多余的值
    feature.values = feature.values.slice(0, packageCount);
  }
  
  return feature;
}
```

---

### Q4: 如何实现响应式表格（移动端适配）？

**A**: CSS 示例

```css
/* 桌面端 - 正常表格 */
.comparison-table {
  overflow-x: auto;
}

/* 移动端 - 卡片式布局 */
@media (max-width: 768px) {
  .comparison-table table {
    display: block;
  }
  
  .comparison-table thead {
    display: none; /* 隐藏表头 */
  }
  
  .comparison-table tr {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 0.5rem;
  }
  
  .comparison-table td {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .comparison-table td::before {
    content: attr(data-label);
    font-weight: bold;
    margin-right: 1rem;
  }
}
```

---

### Q5: 数据更新频率是多少？

**A**: 
- 套餐对比数据由**后台管理员**手动更新
- 建议前端：
  - 页面加载时获取一次
  - 不需要轮询（数据不会频繁变化）
  - 可考虑缓存策略（如 LocalStorage，有效期24小时）

---

### Q6: 如何实现高亮推荐套餐？

**A**: 后端暂未提供推荐标识，前端可硬编码或通过配置指定

```javascript
// 方案1: 硬编码（推荐第2列 - 尊享套餐）
const recommendedIndex = 1;

// 方案2: 通过套餐名称判断
const recommendedIndex = packageNames.findIndex(name => 
  name.includes('尊享') || name.includes('推荐')
);

// 渲染时添加class
<th :class="{ recommended: index === recommendedIndex }">
  {{ packageName }}
  <span v-if="index === recommendedIndex" class="badge">推荐</span>
</th>
```

---

## 📞 技术支持

如有疑问，请联系：
- **后端开发团队**: [后端联系方式]
- **接口文档维护**: [文档负责人]
- **紧急问题**: [技术支持渠道]

---

## 📝 更新日志

### v2.0 (当前版本)
- ✅ 支持动态套餐数量
- ✅ 套餐名称可自定义
- ✅ `values` 数组对应 `comparison_package_names`
- ✅ 完整的错误处理示例

### v1.0 (已废弃)
- ❌ 固定3个套餐（标准、尊享、VIP）
- ❌ 使用 `standard_value`, `premium_value`, `vip_value` 字段
- ⚠️ 不再支持，请升级到 v2.0

---

## 附录：完整响应示例

```json
{
  "success": true,
  "message": "获取方案成功",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "type": "private",
    
    "marketing_header": {
      "title": "从消费奢侈 到创造私享",
      "subtitle": "茶如人 百味皆私享"
    },
    
    "value_propositions": [
      {
        "icon": "🌱",
        "title": "专属定制",
        "description": "一对一茶园定制方案"
      }
    ],
    
    "customer_cases": [],
    "scenario_applications": [],
    "packages": [],
    "process_steps": [],
    
    "comparison_package_names": [
      "标准套餐",
      "尊享套餐",
      "VIP套餐"
    ],
    
    "comparison_features": [
      {
        "icon": "🌱",
        "feature_name": "地块面积",
        "values": ["0.3亩", "0.5亩", "1亩"]
      },
      {
        "icon": "🍃",
        "feature_name": "茶树数量",
        "values": ["30棵", "50棵", "100棵"]
      },
      {
        "icon": "📦",
        "feature_name": "年度产茶",
        "values": ["5斤", "10斤", "20斤"]
      },
      {
        "icon": "🎁",
        "feature_name": "专属礼盒",
        "values": ["基础版", "精装版", "豪华版"]
      },
      {
        "icon": "👨‍🌾",
        "feature_name": "专属茶农",
        "values": ["否", "是", "是"]
      },
      {
        "icon": "📸",
        "feature_name": "实时监控",
        "values": ["基础", "标准", "高清"]
      }
    ],
    
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T08:30:00.000Z"
  }
}
```

---

**文档结束** 🎉

