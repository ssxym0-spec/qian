'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface MonthSelectorProps {
  currentMonth: string; // 格式: YYYY-MM
}

/**
 * 月份选择器组件
 * 固定于底部导航栏正上方，作为页面的次级导航
 */
export default function MonthSelector({ currentMonth }: MonthSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 获取当前年份和月份
  const [year, monthStr] = currentMonth.split('-');
  const currentMonthNum = parseInt(monthStr, 10);
  
  // 获取真实的当前日期
  const now = new Date();
  const realMonth = now.getMonth() + 1; // JavaScript月份从0开始
  const realYear = now.getFullYear();

  /**
   * 处理月份点击
   */
  const handleMonthClick = (month: number) => {
    const newMonth = `${year}-${String(month).padStart(2, '0')}`;
    router.push(`/shengzhang?month=${newMonth}`);
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 h-14 bg-white z-40">
      {/* 🎪 跑马灯分割线 - 顶部边框带有滚动的五彩灯珠 */}
      <div className="relative w-full h-px bg-gray-200 overflow-hidden">
        {/* 滚动的五彩灯珠 */}
        <div className="absolute top-1/2 -translate-y-1/2 h-3 w-8 animate-marquee-light"></div>
      </div>

      {/* 月份数字容器 */}
      <div className="flex items-center h-full">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-2 md:gap-4">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
              // 判断是否是当前选中的月份
              const isActive = month === currentMonthNum;
              
              // 判断是否是真实当前月份（用于默认高亮）
              const isCurrentRealMonth = month === realMonth && parseInt(year) === realYear;

              return (
                <button
                  key={month}
                  onClick={() => handleMonthClick(month)}
                  className={`
                    py-2 font-medium transition-all duration-200
                    hover:text-orange-400
                    ${isActive 
                      ? 'text-orange-500 text-xl md:text-2xl font-bold' 
                      : 'text-gray-400 text-base md:text-lg font-normal'
                    }
                    ${isCurrentRealMonth && !isActive ? 'text-gray-600' : ''}
                  `}
                  aria-label={`切换到${month}月`}
                  aria-current={isActive ? 'true' : 'false'}
                >
                  {month}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

