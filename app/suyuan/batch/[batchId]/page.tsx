import { notFound } from 'next/navigation';
import { getApiUrl } from '../../../utils/apiConfig';
import BatchDetailHeader from '../../components/BatchDetailHeader';
import BatchDetailTopNav from '../../components/BatchDetailTopNav';
import StoryTimeline from '../../components/StoryTimeline';
import ProductionSteps from '../../components/ProductionSteps';
import ProductDisplay from '../../components/ProductDisplay';
import { BatchDetail } from '../../types';
import { getSlugByName } from '../../utils/categoryUtils';

/**
 * 批次详情页面（服务器组件）
 * 展示单个批次从鲜叶采集到成品的完整故事线
 */

interface PageProps {
  params: {
    batchId: string;
  };
}

async function getBatchDetail(batchId: string): Promise<BatchDetail | null> {
  try {
    console.log('🔍 [Server] 开始获取批次详情, batchId:', batchId);
    
    const apiUrl = getApiUrl(`/api/public/batches/${batchId}`);
    console.log('🔍 [Server] API URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      cache: 'no-store', // 总是获取最新数据
    });

    console.log('🔍 [Server] Response status:', response.status);
    console.log('🔍 [Server] Response ok:', response.ok);

    if (!response.ok) {
      console.error('❌ [Server] Failed to fetch batch detail:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('❌ [Server] Error response:', errorText);
      return null;
    }

    const responseData = await response.json();

    // 真实接口结构：{ success: true, data: { ... } }
    const rawData: any =
      responseData && typeof responseData === 'object' && 'data' in responseData
        ? (responseData as any).data
        : responseData;

    // 归一化制茶师信息 (data.teaMaster)
    const rawTeaMaster = rawData.teaMaster || rawData.tea_master || undefined;
    const normalizedTeaMaster = rawTeaMaster
      ? {
          name: rawTeaMaster.name || '未知',
          avatar_url: rawTeaMaster.avatarUrl || rawTeaMaster.avatar_url,
          title: rawTeaMaster.title || rawTeaMaster.role,
          experience_years: rawTeaMaster.experienceYears ?? rawTeaMaster.experience_years,
        }
      : undefined;

    // 封面图: 优先使用 detailCoverImageUrl / coverImageUrl
    const coverImageUrl =
      rawData.detailCoverImageUrl ||
      rawData.coverImageUrl ||
      rawData.detail_cover_image_url ||
      rawData.cover_image_url ||
      '';

    // 采摘记录: 来自 data.batchLinks[].harvestRecord
    const rawLinks: any[] = Array.isArray(rawData.batchLinks)
      ? rawData.batchLinks
      : [];
    const rawHarvestRecords = rawLinks
      .map((link) => link.harvestRecord)
      .filter(Boolean);

    // 制作工艺: 来自 data.productionSteps
    const rawSteps: any[] = Array.isArray(rawData.productionSteps)
      ? rawData.productionSteps
      : [];

    // 成品展示 & 品鉴报告: 来自 data.productAppreciation
    const productAppreciation = rawData.productAppreciation;

    // 等级信息: grade: { name, badgeUrl }, gradeId: string
    const rawGrade = rawData.grade;
    const gradeName: string | undefined =
      (rawGrade && typeof rawGrade === 'object' && rawGrade.name) ||
      (typeof rawGrade === 'string' ? rawGrade : undefined);
    const grade_id =
      rawGrade && typeof rawGrade === 'object'
        ? {
            _id:
              rawData.gradeId ||
              rawGrade._id ||
              rawGrade.id ||
              rawData.id ||
              rawData._id,
            name: gradeName || '佳品级',
            badge_url: rawGrade.badgeUrl || rawGrade.badge_url,
          }
        : undefined;

    // 转换后端字段到前端期望的格式
    const data: BatchDetail = {
      _id: rawData.id || rawData._id,
      batch_number:
        rawData.batchNumber ||
        rawData.batch_number ||
        rawData.name ||
        '未知批次',
      category_name:
        rawData.categoryName ||
        rawData.category_name ||
        rawData.category ||
        '未知品类',
      grade: gradeName,
      grade_id,
      title: rawData.detailTitle || rawData.title || rawData.batchNumber,
      summary: rawData.summary || rawData.description || rawData.notes,
      notes: rawData.notes,
      final_product_weight_kg:
        Number(rawData.finalProductWeightKg) ||
        rawData.final_product_weight_kg ||
        0,
      // 统一后的制茶师信息
      tea_master: normalizedTeaMaster,
      cover_image_url: coverImageUrl,
      images_and_videos: rawData.imagesAndVideos || rawData.images_and_videos,
      
      // 转换采摘记录格式
      harvest_records_ids: rawHarvestRecords.map((record: any) => ({
        _id: record.id,
        date: record.harvestDate,
        weight_kg: Number(record.freshLeafWeightKg) || 0,
        weather: '晴',
        temperature: undefined,
        images: record.mediaUrls || [],
        team: record.harvestLeader
          ? {
              team_name: `${record.harvestLeader.name}团队`,
              members: [
                {
                  name: record.harvestLeader.name,
                  avatar_url: record.harvestLeader.avatarUrl,
                },
              ],
            }
          : {
              team_name: '采摘队',
              members: [],
            },
      })),
      // 转换制作工艺格式
      production_steps: rawSteps.map((step: any) => {
        const manual = step.manual_craft || {};
        const modern = step.modern_craft || {};
        const baseDetails = step.craft_details || step.craftDetails || {};

        // 后端 craft_type 标记当前采用哪种工艺：'manual' | 'modern'
        let craftType: 'manual' | 'modern' =
          step.craft_type === 'modern' ? 'modern' : 'manual';

        // 判断一个块是否完全为空
        const isEmpty = (obj: any) =>
          !obj ||
          Object.values(obj).every(
            (v) =>
              v === '' ||
              v == null ||
              (Array.isArray(v) && v.length === 0)
          );

        // 优先使用 craft_details（后台录入界面主要写入这里）
        let source = baseDetails;

        // 如果 craft_details 为空，则根据 craft_type 选择 manual / modern，并在需要时回退
        if (isEmpty(source)) {
          if (craftType === 'modern') {
            source = modern;
            if (isEmpty(source) && !isEmpty(manual)) {
              craftType = 'manual';
              source = manual;
            }
          } else {
            source = manual;
            if (isEmpty(source) && !isEmpty(modern)) {
              craftType = 'modern';
              source = modern;
            }
          }
        }

        return {
          step_name: step.step_name,
          craft_type: craftType,
          craft_details: {
            media_urls:
              source.media_urls ||
              source.mediaUrls ||
              step.images ||
              [],
            purpose: source.purpose || '',
            method: source.method || '',
            sensory_change:
              source.sensory_change || source.sensoryChange || '',
            value: source.value || '',
          },
        };
      }),
      // 转换成品展示格式
      product_display: productAppreciation
        ? {
            dry_tea_image: productAppreciation.dry_tea_image,
            brewed_tea_image: productAppreciation.brewed_tea_image,
          }
        : undefined,
      // 转换品鉴报告格式
      tasting_report: productAppreciation
        ? {
            tasting_notes: productAppreciation.tasting_notes || '',
            brewing_guide: productAppreciation.brewing_suggestion || '',
            storage_guide: productAppreciation.storage_method || '',
          }
        : undefined,
      
      core_craft: rawData.core_craft,
      flavor_profile: rawData.flavor_profile,
      created_at: rawData.createdAt,
      updated_at: rawData.updatedAt
    };
    
    return data;
  } catch (error) {
    console.error('❌ [Server] Error fetching batch detail:', error);
    if (error instanceof Error) {
      console.error('❌ [Server] Error message:', error.message);
      console.error('❌ [Server] Error stack:', error.stack);
    }
    return null;
  }
}

export default async function BatchDetailPage({ params }: PageProps) {
  console.log('🎬 [Server] BatchDetailPage 开始渲染');
  console.log('🎬 [Server] params:', params);
  
  const { batchId } = params;
  console.log('🎬 [Server] batchId:', batchId);

  // 获取批次详情
  const batch = await getBatchDetail(batchId);

  // 如果批次不存在，显示 404
  if (!batch) {
    console.error('❌ [Server] 批次不存在，跳转到 404 页面');
    notFound();
  }

  console.log('✅ [Server] 批次数据已获取，准备渲染页面');
  console.log('✅ [Server] 批次号:', batch.batch_number);

  // 获取品类对应的 slug（用于返回按钮）
  const categorySlug = await getSlugByName(batch.category_name) || 'mingqiancha';
  console.log('✅ [Server] categorySlug:', categorySlug);

  // 准备传递给子组件的数据
  const headerProps = {
    heroMedia: batch.cover_image_url || '',
    title: batch.title || batch.batch_number,
    batchNumber: batch.batch_number,
    // 优先使用 grade_id 对象，回退到旧的 grade 字符串
    grade: batch.grade_id || batch.grade || '优',
    finalYieldKg: batch.final_product_weight_kg || 0,
    teaMaster: batch.tea_master || { name: '未知' },
  };
  console.log('✅ [Server] BatchDetailHeader props:', headerProps);

  // 检查各个阶段的数据
  const hasHarvestRecords = batch.harvest_records_ids && batch.harvest_records_ids.length > 0;
  const hasProductionSteps = batch.production_steps && batch.production_steps.length > 0;
  const hasProductDisplay = batch.product_display && batch.tasting_report;
  
  console.log('✅ [Server] 数据完整性检查:');
  console.log('  - 采摘记录:', hasHarvestRecords, '数量:', batch.harvest_records_ids?.length || 0);
  console.log('  - 制作工艺:', hasProductionSteps, '数量:', batch.production_steps?.length || 0);
  console.log('  - 成品展示:', hasProductDisplay);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-20">
      {/* 顶部导航栏 */}
      <BatchDetailTopNav
        categoryName={batch.category_name}
        batchNumber={batch.batch_number}
        categorySlug={categorySlug}
      />
      
      {/* 页面头部（沉浸式媒体 + 核心信息） - 添加顶部间距避免被导航栏遮挡 */}
      <div className="pt-14">
        <BatchDetailHeader {...headerProps} />
      </div>

      {/* 故事时间轴容器 */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 第一阶段：鲜叶采集 */}
        {hasHarvestRecords ? (
          <>
            {console.log('✅ [Server] 渲染 StoryTimeline 组件')}
            <StoryTimeline harvestRecords={batch.harvest_records_ids!} />
          </>
        ) : (
          <>
            {console.log('⚠️ [Server] 跳过 StoryTimeline 组件（无数据）')}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
              <p className="text-yellow-800">暂无采摘记录</p>
            </div>
          </>
        )}

        {/* 第二阶段：匠心制作 */}
        {hasProductionSteps ? (
          <>
            {console.log('✅ [Server] 渲染 ProductionSteps 组件')}
            <ProductionSteps productionSteps={batch.production_steps!} />
          </>
        ) : (
          <>
            {console.log('⚠️ [Server] 跳过 ProductionSteps 组件（无数据）')}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
              <p className="text-yellow-800">暂无制作工艺数据</p>
            </div>
          </>
        )}

        {/* 第三阶段：成品鉴赏 */}
        {hasProductDisplay ? (
          <>
            {console.log('✅ [Server] 渲染 ProductDisplay 组件')}
            <ProductDisplay
              productDisplay={batch.product_display!}
              tastingReport={batch.tasting_report!}
            />
          </>
        ) : (
          <>
            {console.log('⚠️ [Server] 跳过 ProductDisplay 组件（无数据）')}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
              <p className="text-yellow-800">暂无成品展示数据</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
