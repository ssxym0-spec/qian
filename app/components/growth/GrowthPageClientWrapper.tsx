'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { GrowthData, DailyLog, MonthlySummary } from './types';
import MonthSelector from './MonthSelector';
import CardStream from './CardStream';
import { loadWeatherTemplates } from '../../utils/weatherTemplates';

// 懒加载详情面板组件 - 仅在用户点击时才加载
const DailyDetailPanel = dynamic(() => import('./DailyDetailPanel'), {
  loading: () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>
  ),
  ssr: false, // 详情面板仅客户端使用
});

const MonthlyDetailPanel = dynamic(() => import('./MonthlyDetailPanel'), {
  loading: () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>
  ),
  ssr: false,
});

interface GrowthPageClientWrapperProps {
  initialData: GrowthData;
  currentMonth: string;
  targetDate?: string; // 目标日期，用于自动打开对应的卡片
}

/**
 * 生长过程页客户端交互容器
 * 管理所有交互状态：详情面板开关、当前选中的记录等
 */
export default function GrowthPageClientWrapper({
  initialData,
  currentMonth,
  targetDate,
}: GrowthPageClientWrapperProps) {
  const router = useRouter();
  
  // 🆕 天气模板加载状态
  const [weatherTemplatesLoaded, setWeatherTemplatesLoaded] = useState(false);
  
  // 当前打开的详情面板类型
  const [openPanel, setOpenPanel] = useState<'daily' | 'monthly' | null>(null);
  
  // 当前选中的每日记录或月度汇总
  const [selectedDaily, setSelectedDaily] = useState<DailyLog | null>(null);
  const [selectedMonthly, setSelectedMonthly] = useState<MonthlySummary | null>(null);

  // 解析月份用于显示标题
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', 
                     '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const [year, month] = currentMonth.split('-');
  const monthIndex = parseInt(month, 10) - 1;
  const monthTitle = monthNames[monthIndex];

  /**
   * 打开每日详情面板
   */
  const handleOpenDaily = (log: DailyLog) => {
    setSelectedDaily(log);
    setOpenPanel('daily');
  };

  /**
   * 打开月度汇总面板
   */
  const handleOpenMonthly = (summary: MonthlySummary) => {
    setSelectedMonthly(summary);
    setOpenPanel('monthly');
  };

  /**
   * 关闭所有面板
   */
  const handleClosePanel = () => {
    setOpenPanel(null);
    setSelectedDaily(null);
    setSelectedMonthly(null);
  };

  /**
   * 🆕 组件挂载时加载天气模板映射表
   */
  useEffect(() => {
    async function init() {
      await loadWeatherTemplates();
      setWeatherTemplatesLoaded(true);
      console.log('✅ [GrowthPage] 天气模板加载完成，准备渲染页面');
    }
    init();
  }, []);


  /**
   * 当面板打开时，锁定背景页面滚动
   */
  useEffect(() => {
    if (openPanel) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // 清理函数：组件卸载时恢复滚动
    return () => {
      document.body.style.overflow = '';
    };
  }, [openPanel]);

  return (
    <>
      {/* 主内容区域 - pb-32 为底部两个固定组件留出空间 (h-14 + h-16 = 120px ≈ pb-30, 留余量用 pb-32) */}
      <div className="min-h-screen pb-32">
        {/* 页面标题区域 */}
        <div className="container mx-auto px-4 pt-8 pb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
            {monthTitle} · 生长记录
          </h1>
          <p className="text-gray-600 text-sm">
            点击底部的数字切换月份
          </p>
        </div>

        {/* 🆕 等待天气模板加载完成后再渲染卡片 */}
        {!weatherTemplatesLoaded ? (
          <div className="container mx-auto px-4 py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">正在加载天气图标...</p>
          </div>
        ) : (
          <div className="container mx-auto px-4">
            <CardStream
              dailyLogs={initialData.daily_logs || initialData.dailyLogs || []}
              monthlySummary={initialData.monthly_summary || initialData.monthlySummary || null}
              onOpenDaily={handleOpenDaily}
              onOpenMonthly={handleOpenMonthly}
              targetDate={targetDate}
            />
          </div>
        )}
      </div>

      {/* 月份选择器 - 固定在 BottomNav 正上方 */}
      <MonthSelector currentMonth={currentMonth} />

      {/* 每日详情面板 */}
      {openPanel === 'daily' && selectedDaily && (
        <DailyDetailPanel
          log={selectedDaily}
          onClose={handleClosePanel}
        />
      )}

      {/* 月度汇总详情面板 */}
      {openPanel === 'monthly' && selectedMonthly && (
        <MonthlyDetailPanel
          summary={selectedMonthly}
          onClose={handleClosePanel}
        />
      )}
    </>
  );
}

