'use client';

import { useState } from 'react';

interface PackageRight {
  icon?: string;
  title: string;
  description: string;
}

interface Package {
  id: string;
  name: string;
  level: string;
  price: string;
  targetAudience: string;
  plotFeature: string;
  production: string;
  rights: PackageRight[];
}

interface PackageTabsProps {
  packages: Package[];
  defaultPackage?: string;
}

export default function PackageTabs({ packages, defaultPackage = '尊享' }: PackageTabsProps) {
  const [activePackageId, setActivePackageId] = useState(
    packages.find(pkg => pkg.level === defaultPackage)?.id || packages[0]?.id
  );

  const activePackage = packages.find(pkg => pkg.id === activePackageId);

  // 根据套餐ID返回对应的星级
  const getStars = (packageId: string) => {
    switch (packageId) {
      case 'standard':
        return '☆'; // 标准套餐：1颗空心星
      case 'premium':
        return '★★★'; // 尊享套餐：3颗实心星
      case 'vip':
        return '★★★★★'; // VIP套餐：5颗实心星
      default:
        return '☆';
    }
  };

  // 获取套餐的尺寸样式（递增）
  const getTabSize = (packageId: string, isActive: boolean) => {
    switch (packageId) {
      case 'standard':
        return 'px-4 md:px-6 py-3'; // 小尺寸
      case 'premium':
        return 'px-6 md:px-8 py-4'; // 中等尺寸
      case 'vip':
        return 'px-8 md:px-10 py-5'; // 大尺寸
      default:
        return 'px-6 md:px-8 py-4';
    }
  };

  // 获取套餐的颜色样式（递增）
  const getTabColor = (packageId: string, isActive: boolean) => {
    if (!isActive) {
      return 'text-stone-600 hover:text-stone-800';
    }
    
    switch (packageId) {
      case 'standard':
        return 'text-[#FCD34D]'; // 淡金色
      case 'premium':
        return 'text-[#F59E0B]'; // 谷雨金
      case 'vip':
        return 'text-[#D97706] bg-gradient-to-b from-amber-50 to-transparent'; // 深金色 + 渐变背景
      default:
        return 'text-[#F59E0B]';
    }
  };

  // 获取套餐的立体感样式（递增）
  const getTabElevation = (packageId: string, isActive: boolean) => {
    if (!isActive) return '';
    
    switch (packageId) {
      case 'standard':
        return ''; // 扁平
      case 'premium':
        return 'transform -translate-y-0.5 shadow-sm'; // 轻微上浮
      case 'vip':
        return 'transform -translate-y-1 shadow-lg shadow-amber-200/50'; // 明显上浮 + 金色阴影
      default:
        return '';
    }
  };

  // 获取字体大小样式（递增）
  const getTextSize = (packageId: string) => {
    switch (packageId) {
      case 'standard':
        return 'text-sm md:text-base'; // 小字体
      case 'premium':
        return 'text-base md:text-lg'; // 中等字体
      case 'vip':
        return 'text-lg md:text-xl'; // 大字体
      default:
        return 'text-base md:text-lg';
    }
  };

  // 获取星级大小样式（递增）
  const getStarSize = (packageId: string) => {
    switch (packageId) {
      case 'standard':
        return 'text-xs'; // 小星级
      case 'premium':
        return 'text-sm'; // 中等星级
      case 'vip':
        return 'text-base'; // 大星级
      default:
        return 'text-sm';
    }
  };

  // 获取徽章
  const getBadge = (packageId: string) => {
    switch (packageId) {
      case 'premium':
        return '推荐';
      case 'vip':
        return '至尊';
      default:
        return null;
    }
  };

  // 获取装饰图标
  const getDecoIcon = (packageId: string) => {
    if (packageId === 'vip') {
      return '👑'; // VIP专属皇冠
    }
    return null;
  };

  return (
    <div className="w-full">
      {/* 套餐选项卡 */}
      <div className="flex justify-center gap-2 mb-8 border-b border-stone-200">
        {packages.map((pkg) => {
          const isActive = activePackageId === pkg.id;
          const badge = getBadge(pkg.id);
          const decoIcon = getDecoIcon(pkg.id);
          
          return (
            <button
              key={pkg.id}
              onClick={() => setActivePackageId(pkg.id)}
              className={`
                ${getTabSize(pkg.id, isActive)}
                ${getTabColor(pkg.id, isActive)}
                ${getTabElevation(pkg.id, isActive)}
                font-medium transition-all duration-300 relative rounded-t-lg
                ${isActive ? 'font-bold' : ''}
                ${pkg.id === 'vip' && isActive ? 'ring-2 ring-amber-300/50' : ''}
              `}
            >
              {/* 徽章标签 */}
              {badge && isActive && (
                <div className={`
                  absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold text-white
                  ${pkg.id === 'premium' ? 'bg-gradient-to-r from-amber-400 to-amber-500' : ''}
                  ${pkg.id === 'vip' ? 'bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg shadow-amber-300/50' : ''}
                `}>
                  {badge}
                </div>
              )}
              
              <div className="flex flex-col items-center gap-1">
                {/* 皇冠装饰（仅VIP） */}
                {decoIcon && isActive && (
                  <span className="text-xl animate-pulse">{decoIcon}</span>
                )}
                
                {/* 套餐名称 */}
                <span className={getTextSize(pkg.id)}>{pkg.level}</span>
                
                {/* 星级 */}
                <span className={`
                  ${getStarSize(pkg.id)}
                  ${isActive ? getTabColor(pkg.id, true).split(' ')[0] : 'text-stone-400'}
                `}>
                  {getStars(pkg.id)}
                </span>
              </div>
              
              {/* 选中时的下划线 - 根据套餐不同样式 */}
              {isActive && (
                <>
                  {pkg.id === 'standard' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FCD34D]" />
                  )}
                  {pkg.id === 'premium' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#F59E0B]" />
                  )}
                  {pkg.id === 'vip' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* 套餐详情 */}
      {activePackage && (
        <div className={`
          rounded-xl shadow-lg p-8 md:p-10 transition-all duration-500
          ${activePackage.id === 'standard' ? 'bg-white border border-stone-200' : ''}
          ${activePackage.id === 'premium' ? 'bg-gradient-to-br from-amber-50/30 to-white border-2 border-amber-200/50' : ''}
          ${activePackage.id === 'vip' ? 'bg-gradient-to-br from-amber-50 via-amber-50/50 to-white border-2 border-amber-300 shadow-2xl shadow-amber-200/30 relative overflow-hidden' : ''}
        `}>
          {/* VIP专属背景纹理 */}
          {activePackage.id === 'vip' && (
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-100/20 to-transparent rounded-full blur-3xl -z-0" />
          )}
          
          <div className="relative z-10">
            {/* 套餐头部 - 价格和面向客群 */}
            <div className="text-center mb-5 pb-4 border-b border-stone-200">
              <div className="mb-3">
                <span className={`
                  font-bold
                  ${activePackage.id === 'standard' ? 'text-3xl md:text-4xl text-[#FCD34D]' : ''}
                  ${activePackage.id === 'premium' ? 'text-3xl md:text-4xl text-[#F59E0B]' : ''}
                  ${activePackage.id === 'vip' ? 'text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500' : ''}
                `}>
                  {activePackage.price.replace('/年', '')}
                </span>
                <span className={`
                  ${activePackage.id === 'vip' ? 'text-lg text-stone-700 font-semibold' : 'text-base text-stone-600'}
                `}>/年</span>
              </div>
              {/* 面向客群 - 居中显示 */}
              <p className={`
                font-semibold
                ${activePackage.id === 'standard' ? 'text-sm text-stone-500' : ''}
                ${activePackage.id === 'premium' ? 'text-sm text-stone-600' : ''}
                ${activePackage.id === 'vip' ? 'text-base text-amber-800' : ''}
              `}>{activePackage.targetAudience}</p>
            </div>

            {/* 套餐信息 - 所有文字与图标对齐 */}
            <div className="space-y-3.5 mb-5">
              {/* 地块特色 */}
              <div>
                <h4 className={`
                  font-semibold mb-1
                  ${activePackage.id === 'vip' ? 'text-base text-amber-700' : 'text-sm text-stone-500'}
                `}>地块特色</h4>
                <p className={`
                  leading-relaxed
                  ${activePackage.id === 'vip' ? 'text-stone-800 font-medium' : 'text-stone-700'}
                `}>{activePackage.plotFeature}</p>
              </div>
              
              {/* 专属产出 */}
              <div>
                <h4 className={`
                  font-semibold mb-1
                  ${activePackage.id === 'vip' ? 'text-base text-amber-700' : 'text-sm text-stone-500'}
                `}>专属产出</h4>
                <p className={`
                  leading-relaxed
                  ${activePackage.id === 'vip' ? 'text-stone-800 font-medium' : 'text-stone-700'}
                `}>{activePackage.production}</p>
              </div>
            </div>

            {/* 核心权益 */}
            <div>
              <h4 className={`
                font-bold mb-4 text-center
                ${activePackage.id === 'standard' ? 'text-xl md:text-2xl text-stone-800' : ''}
                ${activePackage.id === 'premium' ? 'text-xl md:text-2xl text-stone-800' : ''}
                ${activePackage.id === 'vip' ? 'text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-700' : ''}
              `}>
                核心权益
              </h4>
              <div className="space-y-4">
                {activePackage.rights.map((right, index) => (
                  <div key={index} className={`
                    py-2 pr-4 rounded-lg transition-all duration-200
                    ${activePackage.id === 'standard' ? 'hover:bg-stone-50' : ''}
                    ${activePackage.id === 'premium' ? 'hover:bg-amber-50/50' : ''}
                    ${activePackage.id === 'vip' ? 'hover:bg-amber-100/30 hover:shadow-md hover:scale-[1.01]' : ''}
                  `}>
                    {/* 标题 */}
                    <h5 className={`
                      font-bold mb-1
                      ${activePackage.id === 'standard' ? 'text-base text-[#FCD34D]' : ''}
                      ${activePackage.id === 'premium' ? 'text-base text-[#F59E0B]' : ''}
                      ${activePackage.id === 'vip' ? 'text-lg text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-700' : ''}
                    `}>
                      {right.icon ? right.icon + ' ' : ''}{right.title}
                    </h5>
                    {/* 描述 */}
                    <p className={`
                      leading-relaxed
                      ${activePackage.id === 'vip' ? 'text-[#57534E] font-medium' : 'text-[#6B7280]'}
                    `}>{right.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

