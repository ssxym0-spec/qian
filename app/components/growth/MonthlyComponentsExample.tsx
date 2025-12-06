'use client';

import { useState } from 'react';
import MonthlySummaryCard from './MonthlySummaryCard';
import MonthlyDetailPanel from './MonthlyDetailPanel';
import { MonthlySummary } from './types';

/**
 * 月度汇总组件使用示例
 * 
 * 本文件展示了如何在实际页面中集成 MonthlySummaryCard 和 MonthlyDetailPanel
 * 你可以参考这个示例，将相应的代码复制到你的主页面中
 */
export default function MonthlyComponentsExample() {
  // ==================== 状态管理 ====================
  
  // 用于控制详情面板的显示/隐藏
  const [selectedSummary, setSelectedSummary] = useState<MonthlySummary | null>(null);
  
  // ==================== 示例数据 ====================
  
  // 这是一个模拟的月度汇总数据
  // 在实际应用中，你应该从后端 API 获取这些数据
  const exampleMonthlySummary: MonthlySummary = {
    month: '2024-09',
    video_url: 'https://example.com/videos/2024-09-summary.mp4',
    video_thumbnail: 'https://images.unsplash.com/photo-1587080266227-677cc2a4e76e?w=800&h=600&fit=crop',
    
    // 新 API 格式
    detail_gallery: [
      'https://images.unsplash.com/photo-1563788835932-4a8ec6c615c1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&h=600&fit=crop',
    ],
    
    harvest_stats: {
      count: 8,
      total_weight: 185.5,
    },
    
    farm_calendar: [
      { date: '09-03', activity: '秋茶开采' },
      { date: '09-08', activity: '土壤检测' },
      { date: '09-15', activity: '有机肥施用' },
      { date: '09-20', activity: '病虫害防治' },
      { date: '09-28', activity: '秋季修剪' },
    ],
    
    abnormal_summary: [
      {
        date: '09-12',
        description: '发现茶尺蠖幼虫，虫口密度较高，部分叶片出现啃食痕迹',
        solution: '采用生物防治方法，喷施苏云金杆菌（Bt）制剂，连续处理3次，间隔5-7天',
      },
    ],
    
    climate_summary: {
      avg_temperature: 22.8,
      total_rainfall: 95.6,
    },
    
    next_month_plan: [
      '加强秋季茶园管理，做好越冬前的准备工作',
      '进行深耕松土，改善土壤通气性，促进根系生长',
      '适时追施有机肥，补充土壤养分，提升土壤肥力',
      '做好秋茶后期采摘工作，确保鲜叶品质',
      '开展秋季病虫害预防，重点防控茶饼病和茶橙瘿螨',
      '准备越冬覆盖材料，为茶树越冬保护做好准备',
    ],
  };

  // ==================== 渲染 ====================
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            月度汇总组件示例
          </h1>
          <p className="text-gray-600">
            点击下方卡片查看完整的月度汇总详情
          </p>
        </div>

        {/* 
          月度汇总卡片
          - summary: 月度汇总数据对象
          - onClick: 点击卡片时的回调函数，用于打开详情面板
        */}
        <MonthlySummaryCard
          summary={exampleMonthlySummary}
          onClick={() => setSelectedSummary(exampleMonthlySummary)}
        />

        {/* 使用说明 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-3">
            💡 集成指南
          </h2>
          <div className="text-sm text-blue-700 space-y-2">
            <p>
              <strong>1. 导入组件：</strong>
            </p>
            <pre className="bg-blue-100 p-3 rounded overflow-x-auto text-xs">
{`import MonthlySummaryCard from './MonthlySummaryCard';
import MonthlyDetailPanel from './MonthlyDetailPanel';
import { MonthlySummary } from './types';`}
            </pre>
            
            <p className="mt-4">
              <strong>2. 状态管理：</strong>
            </p>
            <pre className="bg-blue-100 p-3 rounded overflow-x-auto text-xs">
{`const [selectedSummary, setSelectedSummary] = useState<MonthlySummary | null>(null);`}
            </pre>
            
            <p className="mt-4">
              <strong>3. 从后端获取数据：</strong>
            </p>
            <pre className="bg-blue-100 p-3 rounded overflow-x-auto text-xs">
{`const fetchMonthlySummary = async (month: string) => {
  const response = await fetch(\`/api/public/monthly-summary?month=\${month}\`);
  const data = await response.json();
  return data;
};`}
            </pre>
            
            <p className="mt-4">
              <strong>4. 渲染组件：</strong>
            </p>
            <pre className="bg-blue-100 p-3 rounded overflow-x-auto text-xs">
{`{monthlySummary && (
  <MonthlySummaryCard
    summary={monthlySummary}
    onClick={() => setSelectedSummary(monthlySummary)}
  />
)}

{selectedSummary && (
  <MonthlyDetailPanel
    summary={selectedSummary}
    onClose={() => setSelectedSummary(null)}
  />
)}`}
            </pre>
          </div>
        </div>
      </div>

      {/* 
        月度汇总详情面板
        - 条件渲染：只有当 selectedSummary 不为 null 时才显示
        - summary: 要展示的月度汇总数据
        - onClose: 关闭面板的回调函数
      */}
      {selectedSummary && (
        <MonthlyDetailPanel
          summary={selectedSummary}
          onClose={() => setSelectedSummary(null)}
        />
      )}
    </div>
  );
}

