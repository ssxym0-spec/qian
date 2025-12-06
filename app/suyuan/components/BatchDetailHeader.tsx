import Image from 'next/image';
import { TeaMaster, Grade } from '../types';
import { getFullImageUrl, isVideoUrl } from '../utils/imageUtils';

/**
 * 批次详情页头部组件
 * 包含沉浸式媒体背景和半覆盖的核心信息卡片
 */

interface BatchDetailHeaderProps {
  heroMedia: string;
  title: string;
  batchNumber: string;
  grade?: Grade | string; // 支持新的 Grade 对象或旧的字符串格式
  finalYieldKg: number;
  teaMaster: TeaMaster;
}

// 等级配置
const GRADE_CONFIG: Record<string, { label: string; bgColor: string; textColor: string }> = {
  '珍品级': { label: '珍品级', bgColor: '#FFB61E', textColor: '#4A2E2B' }, // 紫檀棕
  '优品级': { label: '优品级', bgColor: '#C84C40', textColor: '#FDFDFD' }, // 珍珠白
  '佳品级': { label: '佳品级', bgColor: '#1E50A2', textColor: '#E6A856' }, // 鎏金色
  '醇饮级': { label: '醇饮级', bgColor: '#009966', textColor: '#F7F5F1' }, // 羊脂白
  '茗香级': { label: '茗香级', bgColor: '#1C1C1C', textColor: '#DAA520' }, // 赤金
  // 兼容旧的等级标识
  '臻': { label: '臻品', bgColor: '#FFB61E', textColor: '#4A2E2B' },
  '匠': { label: '匠作', bgColor: '#C84C40', textColor: '#FDFDFD' },
  '优': { label: '优选', bgColor: '#1E50A2', textColor: '#E6A856' },
  '一级': { label: '一级', bgColor: '#FFB61E', textColor: '#4A2E2B' },
  '二级': { label: '二级', bgColor: '#1E50A2', textColor: '#E6A856' },
  '三级': { label: '三级', bgColor: '#009966', textColor: '#F7F5F1' },
};

export default function BatchDetailHeader({
  heroMedia,
  title,
  batchNumber,
  grade,
  finalYieldKg,
  teaMaster,
}: BatchDetailHeaderProps) {
  console.log('🎨 [BatchDetailHeader] 组件渲染');
  console.log('🎨 [BatchDetailHeader] title:', title);
  console.log('🎨 [BatchDetailHeader] batchNumber:', batchNumber);
  console.log('🎨 [BatchDetailHeader] heroMedia:', heroMedia);
  console.log('🎨 [BatchDetailHeader] teaMaster:', teaMaster);
  console.log('🎨 [BatchDetailHeader] grade:', grade);
  
  // 判断 grade 是对象还是字符串，强制收窄为字符串，避免对象直接进入 JSX
  const rawGradeName = typeof grade === 'object' && grade ? (grade as Grade).name : grade;
  const gradeName = typeof rawGradeName === 'string' ? rawGradeName : '';
  const gradeKey = gradeName || '优';
  
  const gradeConfig = GRADE_CONFIG[gradeKey] || {
    label: gradeKey,
    bgColor: '#9CA3AF',
    textColor: '#FFFFFF',
  };

  // 处理图片 URL：如果是相对路径，添加后端服务器地址
  const fullHeroMedia = getFullImageUrl(heroMedia);
  console.log('🎨 [BatchDetailHeader] fullHeroMedia:', fullHeroMedia);

  // 防御性处理批次号，避免 batchNumber 为空或非字符串时调用 replace 报错
  const safeBatchNumber =
    typeof batchNumber === 'string' && batchNumber
      ? batchNumber
      : '未知批次';
  const displayBatchNumber = safeBatchNumber.replace(
    /^.*?([A-Z]{2}-\d{8}(?:-\d+)?).*$/,
    '$1'
  );

  return (
    <div className="relative">
      {/* 沉浸式媒体背景 */}
      <div className="relative w-full h-64 md:h-80 overflow-visible bg-gray-900">
        {fullHeroMedia ? (
          isVideoUrl(fullHeroMedia) ? (
            <video
              src={fullHeroMedia}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              您的浏览器不支持视频播放
            </video>
          ) : (
            <Image
              src={fullHeroMedia}
              alt={title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
              quality={85}
            />
          )
        ) : (
          // 占位符
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-32 h-32 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* 渐变叠加层 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        {/* 核心信息卡片 - 半覆盖布局 */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 px-4">
          <div className={`max-w-4xl mx-auto grid gap-3 md:gap-4 ${gradeName === '无等级' ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {/* 成品等级 - 当等级为"无等级"时不显示 */}
            {gradeName !== '无等级' && (
              <div className="bg-white rounded-2xl p-4 md:p-5 text-center shadow-lg">
                <p className="text-xs text-gray-500 mb-2">成品等级</p>
                <div 
                  className="inline-block px-3 py-1 rounded-full font-bold text-sm"
                  style={{
                    backgroundColor: gradeConfig.bgColor,
                    color: gradeConfig.textColor,
                  }}
                >
                  {gradeConfig.label}
                </div>
              </div>
            )}

            {/* 成品产量 */}
            <div className="bg-white rounded-2xl p-4 md:p-5 text-center shadow-lg">
              <p className="text-xs text-gray-500 mb-2">成品产量</p>
              <p className="text-2xl md:text-3xl font-bold text-green-600">
                {finalYieldKg}
                <span className="text-base ml-1">kg</span>
              </p>
            </div>

            {/* 制茶师 */}
            <div className="bg-white rounded-2xl p-3 md:p-5 shadow-lg flex items-center justify-center">
              <div className="flex items-center gap-2 w-full">
                {/* 左侧：头像 */}
                {(() => {
                  console.log('🧑 [BatchDetailHeader] 制茶大师信息:', {
                    name: teaMaster.name,
                    avatar_url: teaMaster.avatar_url,
                    full_url: getFullImageUrl(teaMaster.avatar_url)
                  });
                  return teaMaster.avatar_url ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow flex-shrink-0">
                      <Image
                        src={getFullImageUrl(teaMaster.avatar_url)}
                        alt={teaMaster.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                        quality={70}
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium flex-shrink-0">
                      {teaMaster.name?.[0] || '师'}
                    </div>
                  );
                })()}
                
                {/* 右侧：标签和名字 */}
                <div className="flex flex-col justify-center min-w-0 flex-1">
                  <p className="text-[10px] md:text-xs text-gray-500 leading-tight">{teaMaster.title || '制茶师'}</p>
                  <p className="text-xs md:text-sm font-semibold text-gray-900 leading-tight break-words">
                    {teaMaster.name || '未知'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 标题信息区 - 为半覆盖卡片留出空间 */}
      <div className="bg-gradient-to-b from-emerald-50 to-white px-4 md:px-8 pt-20 md:pt-24 pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {title || `批次 ${displayBatchNumber}`}
          </h1>
          <p className="text-sm md:text-base text-gray-500">
            批次 {displayBatchNumber}
          </p>
        </div>
      </div>
    </div>
  );
}
