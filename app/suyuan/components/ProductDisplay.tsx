import Image from 'next/image';
import { ProductDisplay as ProductDisplayType, TastingReport } from '../types';
import { getFullImageUrl } from '../utils/imageUtils';

/**
 * 成品鉴赏组件
 * 展示成品干茶、泡开后的茶汤和品鉴报告
 */

interface ProductDisplayProps {
  productDisplay: ProductDisplayType;
  tastingReport: TastingReport;
}

export default function ProductDisplay({ 
  productDisplay, 
  tastingReport 
}: ProductDisplayProps) {
  console.log('🍵 [ProductDisplay] 组件渲染');
  console.log('🍵 [ProductDisplay] productDisplay:', !!productDisplay);
  console.log('🍵 [ProductDisplay] tastingReport:', !!tastingReport);
  
  // 空值检查
  if (!productDisplay || !tastingReport) {
    console.warn('⚠️ [ProductDisplay] 缺少必要数据');
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          成品鉴赏
        </h2>
        <p className="text-gray-500 mt-4">暂无成品展示数据</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
      {/* 标题 */}
      <h2 className="font-serif text-xl md:text-2xl font-bold text-gray-900 mb-2">
        成品鉴赏
      </h2>
      <p className="text-sm text-gray-500 mb-8">
        历经匠心淬炼，终成一杯好茶
      </p>

      {/* 成品展示 - 两列网格布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* 成品干茶 */}
        <div className="space-y-2">
          <h3 className="font-medium text-sm text-gray-700">成品干茶</h3>
          <div className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-200">
            <Image
              src={getFullImageUrl(productDisplay.dry_tea_image)}
              alt="成品干茶"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={80}
              loading="lazy"
            />
          </div>
        </div>

        {/* 开水泡开 */}
        <div className="space-y-2">
          <h3 className="font-medium text-sm text-gray-700">开水泡开</h3>
          <div className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-200">
            <Image
              src={getFullImageUrl(productDisplay.brewed_tea_image)}
              alt="开水泡开后的茶汤"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={80}
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* 品鉴报告 - 卡片化展示 */}
      <div className="space-y-4">
        {/* 完整品鉴笔记 */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
          <h4 className="font-medium text-sm text-purple-900 mb-3">品鉴</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {tastingReport.tasting_notes}
          </p>
        </div>

        {/* 冲泡建议 */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
          <h4 className="font-medium text-sm text-blue-900 mb-3">品鉴方法</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {tastingReport.brewing_guide}
          </p>
        </div>

        {/* 储存建议 */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
          <h4 className="font-medium text-sm text-amber-900 mb-3">储存方法</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {tastingReport.storage_guide}
          </p>
        </div>
      </div>
    </div>
  );
}
