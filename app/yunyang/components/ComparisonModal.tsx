'use client';

interface ComparisonFeature {
  icon?: string;
  feature_name: string;
  values: string[];
}

interface ComparisonModalProps {
  packageNames: string[];
  features: ComparisonFeature[];
  onClose: () => void;
}

export default function ComparisonModal({ 
  packageNames, 
  features, 
  onClose 
}: ComparisonModalProps) {
  
  // 获取套餐列的宽度样式（递增）
  const getColumnWidth = (index: number) => {
    switch (index) {
      case 0: return 'min-w-[80px] md:min-w-[120px]'; // 标准：窄
      case 1: return 'min-w-[90px] md:min-w-[160px]'; // 尊享：中
      case 2: return 'min-w-[100px] md:min-w-[200px]'; // VIP：宽
      default: return 'min-w-[90px] md:min-w-[160px]';
    }
  };

  // 获取表头背景样式（递增）
  const getHeaderBg = (index: number) => {
    switch (index) {
      case 0: return 'bg-stone-100'; // 标准：浅灰
      case 1: return 'bg-gradient-to-br from-amber-100/50 to-amber-50/30'; // 尊享：淡金渐变
      case 2: return 'bg-gradient-to-br from-amber-200/60 via-amber-100/50 to-amber-50/40'; // VIP：深金渐变
      default: return 'bg-stone-100';
    }
  };

  // 获取表头边框样式（递增）
  const getHeaderBorder = (index: number) => {
    switch (index) {
      case 0: return 'border-b-2 border-stone-300'; // 标准：细灰边框
      case 1: return 'border-b-2 border-amber-300'; // 尊享：金色边框
      case 2: return 'border-b-4 border-amber-400 shadow-lg shadow-amber-200/50'; // VIP：粗金边框+发光
      default: return 'border-b-2 border-stone-300';
    }
  };

  // 获取字号样式（递增）
  const getTextSize = (index: number) => {
    switch (index) {
      case 0: return 'text-xs md:text-sm'; // 标准：小
      case 1: return 'text-[13px] md:text-base'; // 尊享：中
      case 2: return 'text-sm md:text-lg'; // VIP：大
      default: return 'text-xs md:text-base';
    }
  };

  // 获取星级大小（递增）
  const getStarSize = (index: number) => {
    switch (index) {
      case 0: return 'text-[11px] md:text-xs'; // 标准：小星级
      case 1: return 'text-xs md:text-sm'; // 尊享：中星级
      case 2: return 'text-[13px] md:text-base'; // VIP：大星级
      default: return 'text-xs md:text-sm';
    }
  };

  // 获取星级颜色（递增）
  const getStarColor = (index: number) => {
    switch (index) {
      case 0: return 'text-[#FCD34D]'; // 标准：淡金
      case 1: return 'text-[#F59E0B]'; // 尊享：谷雨金
      case 2: return 'text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600'; // VIP：金色渐变
      default: return 'text-[#F59E0B]';
    }
  };

  // 获取徽章
  const getBadge = (index: number) => {
    switch (index) {
      case 1: return '推荐';
      case 2: return '至尊';
      default: return null;
    }
  };

  // 获取装饰图标
  const getDecoIcon = (index: number) => {
    if (index === 2) return '👑';
    return null;
  };

  // 获取单元格背景样式（递增）
  const getCellBg = (colIndex: number) => {
    switch (colIndex) {
      case 0: return 'bg-white'; // 标准：白色
      case 1: return 'bg-amber-50/30'; // 尊享：淡金
      case 2: return 'bg-gradient-to-b from-amber-50/50 to-amber-100/30'; // VIP：金色渐变
      default: return 'bg-white';
    }
  };

  // 获取单元格边框装饰（递增）
  const getCellBorder = (colIndex: number) => {
    switch (colIndex) {
      case 2: return 'border-l-2 border-amber-300/50'; // VIP：左侧金色边框
      default: return '';
    }
  };

  // 获取单元格字体样式（递增）
  const getCellTextStyle = (colIndex: number) => {
    switch (colIndex) {
      case 0: return 'font-medium'; // 标准：常规
      case 1: return 'font-semibold'; // 尊享：稍粗
      case 2: return 'font-bold text-amber-900'; // VIP：加粗+深色
      default: return 'font-medium';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] animate-slideUp flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 弹窗头部 */}
        <div className="flex-shrink-0 bg-gradient-to-r from-[#C5A572] to-[#B89562] text-white px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <h2 className="text-lg md:text-2xl font-bold flex items-center gap-1.5 md:gap-2">
            <span className="text-xl md:text-2xl">📊</span>
            <span>套餐权益对比</span>
          </h2>
          <button 
            onClick={onClose}
            className="text-2xl md:text-3xl hover:rotate-90 transition-transform duration-300 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-white/20 rounded-full"
            aria-label="关闭"
          >
            ×
          </button>
        </div>

        {/* 对比表格区域（中间可滚动） */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full table-fixed">
            {/* 表头 */}
            <thead className="sticky top-0 z-20 shadow-md">
              <tr>
                <th className="px-1 md:px-4 py-2 md:py-4 text-left text-stone-700 font-semibold border-b-2 border-stone-300 w-[24%] bg-stone-100 text-[11px] md:text-base">
                  对比项
                </th>
                {packageNames.map((name, index) => {
                  const badge = getBadge(index);
                  const decoIcon = getDecoIcon(index);
                  
                  return (
                    <th 
                      key={index}
                      className={`
                        px-1.5 md:px-4 py-2 md:py-4 text-center font-bold
                        ${index === 0 ? 'w-[23%]' : index === 1 ? 'w-[26.5%]' : 'w-[26.5%]'}
                        ${getHeaderBg(index)}
                        ${getHeaderBorder(index)}
                        ${index === 2 ? 'animate-pulse-subtle' : ''}
                      `}
                    >
                      <div className="flex flex-col gap-0.5 md:gap-1 items-center">
                        {/* 徽章标签 - 放在顶部 */}
                        {badge && (
                          <div className={`
                            px-1.5 md:px-2 py-0.5 rounded-full text-[11px] md:text-xs font-bold text-white mb-0.5
                            ${index === 1 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : ''}
                            ${index === 2 ? 'bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg shadow-amber-300/50' : ''}
                          `}>
                            {badge}
                          </div>
                        )}
                        
                        {/* 皇冠装饰（仅VIP） */}
                        {decoIcon && (
                          <span className="text-base md:text-xl">{decoIcon}</span>
                        )}
                        
                        {/* 套餐名称 */}
                        <span className={`
                          leading-tight
                          ${getTextSize(index)}
                          ${index === 2 ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-600' : 'text-stone-800'}
                        `}>
                          {name}
                        </span>
                        
                        {/* 星级标识 */}
                        <span className={`${getStarSize(index)} ${getStarColor(index)}`}>
                          {index === 0 ? '☆' : index === 1 ? '★★★' : '★★★★★'}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* 表体 */}
            <tbody>
              {features.map((feature, rowIndex) => (
                <tr 
                  key={rowIndex}
                  className="transition-all duration-200"
                >
                  {/* 对比项名称 */}
                  <td className={`
                    px-0.5 md:px-4 py-2 md:py-3 border-b border-stone-200
                    ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}
                  `}>
                    <div className="flex items-center gap-0.5 md:gap-2 font-semibold text-stone-700">
                      {feature.icon && (
                        <span className="text-xs md:text-2xl flex-shrink-0">{feature.icon}</span>
                      )}
                      <span className="text-[11px] md:text-base leading-tight">{feature.feature_name}</span>
                    </div>
                  </td>
                  
                  {/* 各套餐的值 */}
                  {feature.values.map((value, colIndex) => (
                    <td 
                      key={colIndex}
                      className={`
                        px-1.5 md:px-4 py-2 md:py-3 text-center border-b border-stone-200
                        ${getCellBg(colIndex)}
                        ${getCellBorder(colIndex)}
                        ${colIndex === 2 ? 'hover:scale-[1.02] hover:shadow-md' : 'hover:bg-opacity-70'}
                        transition-all duration-200
                      `}
                    >
                      <span className={`
                        leading-snug text-xs md:text-base
                        ${getCellTextStyle(colIndex)}
                      `}>
                        {value}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 底部操作按钮（固定在弹窗底部） */}
        <div className="flex-shrink-0 bg-white px-2 md:px-6 py-2.5 md:py-4 flex flex-col md:flex-row justify-center gap-2 md:gap-4">
          <button 
            onClick={onClose}
            className="bg-stone-200 text-stone-700 px-4 md:px-8 py-2 md:py-2.5 rounded-lg text-xs md:text-base font-semibold 
                       hover:bg-stone-300 transition-colors order-2 md:order-1"
          >
            关闭
          </button>
          <button 
            className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white 
                       px-4 md:px-10 py-2 md:py-3 rounded-lg text-xs md:text-base font-bold
                       hover:shadow-2xl hover:shadow-amber-300/50 hover:scale-105
                       transition-all duration-300 order-1 md:order-2
                       animate-shimmer"
            onClick={() => {
              onClose();
              // 滚动到套餐选择区域
              setTimeout(() => {
                const packageSection = document.querySelector('[data-section="packages"]');
                if (packageSection) {
                  packageSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }, 300);
            }}
          >
            立即选择套餐 ✨
          </button>
        </div>
      </div>

      {/* 内联样式以支持动画 */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseSubtle {
          0%, 100% { 
            opacity: 1;
          }
          50% { 
            opacity: 0.95;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-pulse-subtle {
          animation: pulseSubtle 3s ease-in-out infinite;
        }

        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
}

