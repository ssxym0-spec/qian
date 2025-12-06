import { notFound } from 'next/navigation';
import CategoryFilter from '../components/CategoryFilter';
import BatchList from '../components/BatchList';
import { BatchListItem, Grade } from '../types';
import { getAvailableCategories, getCategoryBySlug } from '../utils/categoryUtils';

/**
 * 批次列表页面（服务器组件）
 * 根据品类动态获取并展示对应的批次列表
 */

interface PageProps {
  params: {
    category: string;
  };
}

const BATCH_API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/public/batches`;
const CATEGORY_BATCH_API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/public/categories`;

/**
 * 在对象中按 key 关键词递归查找第一个看起来像 URL 的字符串
 */
function findUrlByKeyPatterns(
  obj: any,
  keyPatterns: string[]
): string | undefined {
  if (!obj || typeof obj !== 'object') return undefined;

  for (const key of Object.keys(obj)) {
    const value = (obj as any)[key];
    const lowerKey = key.toLowerCase();

    if (
      keyPatterns.some((pattern) => lowerKey.includes(pattern)) &&
      typeof value === 'string' &&
      value.trim() !== ''
    ) {
      return value;
    }

    if (value && typeof value === 'object') {
      const nested = findUrlByKeyPatterns(value, keyPatterns);
      if (nested) return nested;
    }
  }

  return undefined;
}

/**
 * 为批次补齐 grade_id（不再强制填充不存在的 badge_url，避免 404 图片请求）
 */
const toArrayWithMockGrade = (batches: any[]): any[] => {
  return batches.map((batch) => {
    // 如果后端已经返回 grade_id，则直接使用
    if (batch.grade_id) {
      return batch;
    }

    // 列表接口实际返回: grade: { name, badgeUrl }, gradeId: string
    if (batch.grade && typeof batch.grade === 'object') {
      return {
        ...batch,
        grade_id: {
          _id:
            batch.gradeId ||
            batch.grade._id ||
            batch.grade.id ||
            batch._id ||
            batch.id ||
            'mock-grade-id',
          name: batch.grade.name || '优选',
          badge_url: batch.grade.badgeUrl || batch.grade.badge_url,
        },
      };
    }

    return {
      ...batch,
      grade_id: {
        _id:
          batch.gradeId ||
          batch.grade_id?._id ||
          batch.grade_id?.id ||
          batch._id ||
          batch.id ||
          'mock-grade-id',
        name:
          (typeof batch.grade === 'string' && batch.grade) ||
          (typeof batch.grade === 'object' && batch.grade?.name) ||
          '优选',
        badge_url: batch.grade?.badgeUrl || batch.grade?.badge_url,
      },
    };
  });
};

/**
 * 归一化单条批次数据，保证：
 *  - 一定有可用的 _id（用于路由跳转）
 *  - 一定有 batch_number 和 category_name
 *  - grade/grade_id 始终是前端预期的结构
 *  - 封面图尽量从多种字段中兜底获取
 *  - 制茶师头像/名称从多种字段中归一化
 */
function adaptBatchItem(raw: any, index: number): BatchListItem {
  const id =
    raw.id ||
    raw._id ||
    raw.batch_id ||
    raw.uuid ||
    raw.slug ||
    `temp-batch-${index}`;

  const batchNumberSource =
    raw.batchNumber ||
    raw.batch_number ||
    raw.batchNo ||
    raw.code ||
    raw.name ||
    `BATCH-${index + 1}`;

  const categoryName =
    raw.category_name ||
    raw.category ||
    raw.categoryName ||
    raw.category_label ||
    '未知品类';

  // 处理 grade / grade_id
  let grade: string | undefined;
  let grade_id: Grade | undefined = raw.grade_id;

  if (typeof raw.grade === 'string') {
    grade = raw.grade;
  } else if (raw.grade && typeof raw.grade === 'object') {
    grade = (raw.grade as any).name;
    // 如果没有 grade_id，但 grade 是对象，则尝试从中构造一个 Grade
    if (!grade_id) {
      grade_id = {
        _id:
          raw.gradeId ||
          (raw.grade as any)._id ||
          (raw.grade as any).id ||
          String(id),
        name: grade || '优选',
        badge_url:
          (raw.grade as any).badgeUrl ??
          (raw.grade as any).badge_url,
      };
    }
  }

  if (grade_id) {
    // 提取徽章 URL：兼容嵌套 badge 对象等多种命名，必要时递归扫描
    const directBadgeUrl =
      (grade_id as any).badge_url ||
      (grade_id as any).badgeUrl ||
      (grade_id as any).badge_image_url ||
      (grade_id as any).badgeImageUrl ||
      (grade_id as any).badge?.image_url ||
      (grade_id as any).badge?.imageUrl ||
      (grade_id as any).badge?.full_url ||
      (grade_id as any).badge?.url;

    const rawBadgeUrl =
      directBadgeUrl ||
      findUrlByKeyPatterns(grade_id, ['badge', 'icon', 'image']);

    grade_id = {
      _id: grade_id._id || String((grade_id as any).id || id),
      name:
        (typeof grade_id.name === 'string' && grade_id.name) ||
        grade ||
        '优选',
      badge_url:
        typeof rawBadgeUrl === 'string' && rawBadgeUrl.trim() !== ''
          ? rawBadgeUrl
          : undefined,
    };
  }

  // 处理封面图：兼容多种字段命名（camelCase + snake_case）
  const coverImageUrl =
    raw.coverImageUrl ||
    raw.cover_image_url ||
    raw.detail_cover_image_url ||
    raw.detailCoverImageUrl ||
    raw.hero_media ||
    raw.hero_image ||
    raw.heroImage ||
    (Array.isArray(raw.images_and_videos) && raw.images_and_videos.length > 0
      ? raw.images_and_videos[0]
      : undefined) ||
    (Array.isArray(raw.media_urls) && raw.media_urls.length > 0
      ? raw.media_urls[0]
      : undefined) ||
    raw.main_image_url ||
    raw.mainImageUrl ||
    '';

  // 处理制茶师信息：列表接口直接返回 teaMaster 对象
  const rawTeaMaster =
    raw.teaMaster ||
    raw.tea_master ||
    raw.tea_master_id ||
    raw.teaMasterId ||
    raw.tea_master ||
    raw.teaMaster ||
    undefined;

  const normalizedTeaMaster = rawTeaMaster
    ? {
        name:
          rawTeaMaster.name ||
          rawTeaMaster.full_name ||
          rawTeaMaster.display_name ||
          rawTeaMaster.title ||
          '未知',
        avatar_url:
          rawTeaMaster.avatar_url ||
          rawTeaMaster.avatarUrl ||
          rawTeaMaster.avatar ||
          rawTeaMaster.profile_image_url ||
          rawTeaMaster.profileImageUrl ||
          rawTeaMaster.image_url ||
          rawTeaMaster.imageUrl ||
          // 兼容嵌套 avatar / profile 对象
          findUrlByKeyPatterns(rawTeaMaster, ['avatar', 'profile', 'image']) ||
          undefined,
        title: rawTeaMaster.title || rawTeaMaster.role || undefined,
        experience_years:
          rawTeaMaster.experience_years ||
          rawTeaMaster.years_of_experience ||
          rawTeaMaster.experienceYears ||
          undefined,
      }
    : undefined;

  return {
    _id: String(id),
    batch_number: String(batchNumberSource),
    category_name: String(categoryName),
    // 保留 category 字段（如果原始数据中有），用于兼容不同的后端返回格式
    ...(raw.category ? { category: String(raw.category) } : {}),
    grade,
    grade_id,
    title: raw.title || raw.detail_title || '',
    summary: raw.summary || raw.description || '',
    notes: raw.notes || raw.remark || '',
    tea_master: normalizedTeaMaster,
    cover_image_url: coverImageUrl,
    core_craft: raw.core_craft,
    flavor_profile: raw.flavor_profile,
    harvest_days_count:
      raw.harvest_days_count ?? raw.harvestDaysCount ?? undefined,
    harvest_records_count:
      raw.harvest_records_count ?? raw.harvestRecordsCount ?? undefined,
    images_and_videos: raw.images_and_videos,
    // 保留原始 tea_master_id，方便下游需要时使用
    ...(rawTeaMaster
      ? {
          tea_master_id: rawTeaMaster,
        }
      : {}),
  };
}

const normalizeBatchResponse = (data: any): BatchListItem[] => {
  const adaptList = (list: any[]): BatchListItem[] =>
    toArrayWithMockGrade(list).map((item, index) => adaptBatchItem(item, index));

  // 实际接口: { success: true, data: [...] }
  if (Array.isArray(data?.data)) {
    return adaptList(data.data);
  }

  if (Array.isArray(data)) {
    return adaptList(data);
  }

  if (data && typeof data === 'object') {
    const candidates = [data.batches, data.data, data.items];
    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return adaptList(candidate);
      }
    }
  }

  return [];
};

interface BatchFetchParams {
  categoryName: string;
  categorySlug: string;
}

/**
 * 从后端 API 获取指定品类的批次列表
 * 优先使用 slug 查询，失败后回退到名称查询
 */
async function getBatches({ categoryName, categorySlug }: BatchFetchParams): Promise<BatchListItem[]> {
  const trimmedSlug = categorySlug?.trim();
  const encodedName = encodeURIComponent(categoryName);

  const requestQueue: Array<{ label: string; url: string; filterByCategory?: boolean }> = [
    ...(trimmedSlug
      ? [
          {
            label: `categories/${trimmedSlug}/batches`,
            url: `${CATEGORY_BATCH_API_BASE}/${trimmedSlug}/batches`,
          },
          {
            label: `slug=${trimmedSlug}`,
            url: `${BATCH_API_BASE}?slug=${encodeURIComponent(trimmedSlug)}`,
          },
          {
            label: `category_slug=${trimmedSlug}`,
            url: `${BATCH_API_BASE}?category_slug=${encodeURIComponent(trimmedSlug)}`,
          },
          {
            label: `categorySlug=${trimmedSlug}`,
            url: `${BATCH_API_BASE}?categorySlug=${encodeURIComponent(trimmedSlug)}`,
          },
        ]
      : []),
    {
      label: `category=${categoryName}`,
      url: `${BATCH_API_BASE}?category=${encodedName}`,
    },
    {
      label: `category_name=${categoryName}`,
      url: `${BATCH_API_BASE}?category_name=${encodedName}`,
    },
    {
      label: 'all-batches',
      url: BATCH_API_BASE,
      filterByCategory: true,
    },
  ];

  for (const { label, url, filterByCategory } of requestQueue) {
    try {
      console.log(`📋 [BatchList] 请求批次列表: ${label}`);
      const response = await fetch(url, {
        cache: 'no-store',
      });

    if (!response.ok) {
        if (response.status === 401) {
          console.error(`❌ [BatchList] API 认证失败 (401): ${label}`);
          console.warn('⚠️ [BatchList] 提示: /api/public/batches 是公开接口，不应需要认证');
        } else {
          console.error(`❌ [BatchList] 获取批次列表失败 (${label}): HTTP ${response.status}`);
        }
        continue;
    }

    const data = await response.json();
      let batches = normalizeBatchResponse(data);

      if (filterByCategory) {
        batches = batches.filter(
          (batch) =>
            batch?.category_name === categoryName ||
            batch?.category === categoryName
        );
    }
    
      console.log(`✅ [BatchList] ${label} 返回 ${batches.length} 个批次`);
      
      if (batches.length > 0) {
        return batches;
      }
    } catch (error) {
      console.error(`❌ [BatchList] 请求 ${label} 时出错:`, error);
      }
  }

  console.warn(`⚠️ [BatchList] slug "${categorySlug}" 与名称 "${categoryName}" 均未获取到批次数据`);
    return [];
}

export default async function BatchListPage({ params }: PageProps) {
  const { category } = params;
  
  // 获取所有可用品类
  const availableCategories = await getAvailableCategories();
  
  // 验证当前品类是否存在
  const currentCategory = await getCategoryBySlug(category);
  if (!currentCategory) {
    console.error(`❌ [BatchListPage] 品类不存在: ${category}`);
    notFound();
  }

  console.log(`✅ [BatchListPage] 当前品类: ${currentCategory.name} (${currentCategory.slug})`);

  // 获取批次数据 - 优先使用 slug，失败后回退到中文名称
  const batches = await getBatches({
    categoryName: currentCategory.name,
    categorySlug: currentCategory.slug || category,
  });
  
  console.log(`📊 [BatchListPage] 获取到 ${batches.length} 个批次`);
  
  // 如果批次为空，输出调试信息
  if (batches.length === 0) {
    console.warn(`⚠️ [BatchListPage] 品类 "${currentCategory.name}" 没有批次数据`);
    console.warn(
      `⚠️ [BatchListPage] 请检查后端 API: ${BATCH_API_BASE}?slug=${currentCategory.slug || category} 或 ?category=${encodeURIComponent(currentCategory.name)}`
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-20">
      {/* 粘性顶部导航和品类筛选器 */}
      <CategoryFilter categories={availableCategories} />

      {/* 批次卡片列表 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {batches.length === 0 ? (
          // 空状态
          <div className="text-center py-20">
            <svg 
              className="w-20 h-20 text-gray-300 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
              />
            </svg>
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
              暂无批次数据
            </h2>
            <p className="text-gray-600">
              {currentCategory.name} 类别下暂时还没有制作批次
            </p>
          </div>
        ) : (
          // 桌面端多列网格，移动端单列 - 使用客户端组件管理激活状态
          <BatchList batches={batches} />
        )}
      </div>
    </div>
  );
}

/**
 * 生成静态参数（可选，用于静态生成）
 * 动态获取所有品类的 slug
 */
export async function generateStaticParams() {
  const categories = await getAvailableCategories();
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}
