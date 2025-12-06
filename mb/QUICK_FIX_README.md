# 品类404错误快速修复指南 🚀

## 问题现象

点击溯源页面的新品类后，出现 **404 错误**。

## 快速诊断（3步）

### 步骤1：运行诊断工具

**方式A：使用网页诊断工具**
1. 确保开发服务器正在运行：
   ```bash
   npm run dev
   ```
2. 在浏览器中打开：
   ```
   http://localhost:3000/diagnose-categories.html
   ```
3. 点击"开始诊断"按钮
4. 查看结果，找出"⚠️ 未映射"的品类

**方式B：使用命令行测试脚本**
```bash
node test-category-mapping.js
```

### 步骤2：查看控制台日志

打开浏览器控制台（F12），点击有问题的品类卡片，查找这样的警告：

```
⚠️ [SuyuanIndex] 品类 "XXX" 未在映射表中，使用自动生成的slug: "xxx"
💡 建议在 CATEGORY_SLUG_MAP 中添加: 'XXX': 'xxx',
```

### 步骤3：应用修复

根据诊断结果，更新品类映射表。

## 快速修复（2个文件）

### 文件1：`app/suyuan/utils/categoryUtils.ts`

找到第21-34行的 `CATEGORY_SLUG_MAP`，添加缺失的品类：

```typescript
const CATEGORY_SLUG_MAP: Record<string, string> = {
  '明前茶': 'mingqian',
  '雨前茶': 'yuqian',
  '春茶': 'chuncha',
  '夏茶': 'xiacha',
  '秋茶': 'qiucha',
  '绿茶': 'lvcha',
  '红茶': 'hongcha',
  '白茶': 'baicha',
  '黄茶': 'huangcha',
  '乌龙茶': 'wulongcha',
  '黑茶': 'heicha',
  // 👇 在这里添加新品类
  // '您的新品类': 'pinyin-slug',
};
```

### 文件2：`app/suyuan/page.tsx`

找到第30-42行的 `CATEGORY_SLUG_MAP`，添加**完全相同**的映射：

```typescript
const CATEGORY_SLUG_MAP: Record<string, string> = {
  '明前茶': 'mingqian',
  '雨前茶': 'yuqian',
  '春茶': 'chuncha',
  '夏茶': 'xiacha',
  '秋茶': 'qiucha',
  '绿茶': 'lvcha',
  '红茶': 'hongcha',
  '白茶': 'baicha',
  '黄茶': 'huangcha',
  '乌龙茶': 'wulongcha',
  '黑茶': 'heicha',
  // 👇 在这里添加新品类（与上面完全一致）
  // '您的新品类': 'pinyin-slug',
};
```

⚠️ **重要**：两个文件的映射表必须完全一致！

## 验证修复

1. **重启开发服务器**
   ```bash
   # 按 Ctrl+C 停止
   npm run dev
   ```

2. **清除浏览器缓存**
   - 按 `Ctrl+Shift+R` (Windows) 或 `Cmd+Shift+R` (Mac)

3. **测试**
   - 访问首页：http://localhost:3000
   - 点击之前404的品类卡片
   - 确认正常跳转，无404错误

4. **再次运行诊断工具**
   - 确认所有品类都显示 "✅ 已映射"

## Slug命名规则

为新品类创建 slug 时，请遵循：

| 规则 | 示例 |
|------|------|
| 使用拼音 | `'绿茶': 'lvcha'` |
| 全小写 | ❌ `'LvCha'` ✅ `'lvcha'` |
| 无空格 | ❌ `'lv cha'` ✅ `'lvcha'` |
| 无特殊字符 | ❌ `'lv-cha'` ✅ `'lvcha'` |

**常见茶类slug示例：**
```typescript
'普洱茶': 'puercha',
'铁观音': 'tieguanyin',
'大红袍': 'dahongpao',
'碧螺春': 'biluochun',
'龙井茶': 'longjingcha',
'毛尖': 'maojian',
```

## 常见问题

### Q：我已经添加了映射，为什么还是404？

**A：** 可能是以下原因：

1. **没有重启服务器**
   ```bash
   # 停止服务器 (Ctrl+C)
   npm run dev
   ```

2. **浏览器缓存未清除**
   - 按 `Ctrl+Shift+R` 强制刷新

3. **两个文件的映射不一致**
   - 检查两个文件的 `CATEGORY_SLUG_MAP` 是否完全相同

4. **品类名称不匹配**
   - 检查是否有多余的空格或特殊字符
   - 使用诊断工具查看API实际返回的品类名称

### Q：两个映射表必须完全一样吗？

**A：** 是的！因为：
- `app/suyuan/page.tsx` 负责**首页→溯源页**的跳转
- `app/suyuan/utils/categoryUtils.ts` 负责**溯源页内部**的路由
- 如果不一致，会导致跳转到错误的页面或404

### Q：新品类用什么 slug？

**A：** 优先使用汉语拼音，例如：
- 中文名：白茶 → slug: `baicha`
- 中文名：乌龙茶 → slug: `wulongcha`

如果不确定，运行诊断工具会给出建议。

### Q：诊断工具打不开怎么办？

**A：** 检查：
1. 开发服务器是否正在运行（`npm run dev`）
2. 访问地址是否正确：`http://localhost:3000/diagnose-categories.html`
3. 或直接运行命令行工具：`node test-category-mapping.js`

## 已配置的品类

目前系统已预先配置了以下品类：

| 中文名称 | URL Slug | 状态 |
|---------|----------|------|
| 明前茶   | mingqian | ✅ |
| 雨前茶   | yuqian   | ✅ |
| 春茶     | chuncha  | ✅ |
| 夏茶     | xiacha   | ✅ |
| 秋茶     | qiucha   | ✅ |
| 绿茶     | lvcha    | ✅ |
| 红茶     | hongcha  | ✅ |
| 白茶     | baicha   | ✅ |
| 黄茶     | huangcha | ✅ |
| 乌龙茶   | wulongcha| ✅ |
| 黑茶     | heicha   | ✅ |

如果你的品类不在上面的列表中，需要手动添加。

## 需要更详细的帮助？

查看完整的技术文档：[CATEGORY_404_FIX_GUIDE.md](./CATEGORY_404_FIX_GUIDE.md)

或者提供以下信息以获得帮助：
1. 诊断工具的截图
2. 浏览器控制台的错误信息
3. 点击的是哪个品类
4. 命令行测试脚本的输出

