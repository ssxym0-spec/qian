'use client';

import React from 'react';
import { MonthlySummary } from './types';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { getFullImageUrl } from '../../suyuan/utils/imageUtils';

interface MonthlySummaryCardProps {
  summary: MonthlySummary;
  onClick: () => void;
}

/**
 * 月度汇总卡片
 * 左侧1/3为视频缩略图（带播放按钮），右侧2/3为内容区
 * 整体可点击，有与每日日志卡片一致的悬停效果
 */
export default function MonthlySummaryCard({ summary, onClick }: MonthlySummaryCardProps) {
  // ==================== 数据适配层 ====================
  
  /**
   * 格式化月份标题
   * 从 "2024-08" 转换为 "八月汇总记录"
   */
  const formatMonthTitle = (monthStr: string | undefined): string => {
    // 安全检查：如果 monthStr 未定义或不包含 '-'，返回默认值
    if (!monthStr || !monthStr.includes('-')) {
      return '月度汇总记录';
    }
    
    const [year, month] = monthStr.split('-');
    const monthNames = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
    const monthIndex = parseInt(month) - 1;
    
    // 验证月份索引是否有效
    if (monthIndex < 0 || monthIndex >= 12 || isNaN(monthIndex)) {
      return '月度汇总记录';
    }
    
    return `${monthNames[monthIndex]}月汇总记录`;
  };

  /**
   * 获取视频缩略图URL
   * 新 API: summary.video_thumbnail
   * 旧 API: summary.images[0] 或 summary.detail_gallery[0]
   */
  const getThumbnailUrl = (): string | null => {
    // 优先使用 video_thumbnail
    if (summary.video_thumbnail) {
      return summary.video_thumbnail;
    }
    
    // 回退到 detail_gallery 或 images
    const gallery = summary.detail_gallery || summary.images || [];
    return gallery.length > 0 ? gallery[0] : null;
  };

  /**
   * 判断是否为视频文件
   */
  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  // ==================== 获取数据 ====================
  const thumbnailUrl = getThumbnailUrl();
  // 优先使用 year_month 字段，回退到 month 字段（向后兼容）
  const monthTitle = formatMonthTitle(summary.year_month || summary.month);

  // ==================== 渲染 ====================
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-98"
    >
      {/* 
        外层容器：使用 flex-row 实现左右两栏布局
        在移动端和桌面端保持一致
      */}
      <div className="flex flex-row h-full">
        {/* 
          左侧视频缩略图区 (占 1/3 宽度)
          - 使用 relative 定位，以便内部的播放按钮可以使用 absolute 定位
          - min-h-[180px] 确保卡片有足够的高度
        */}
        <div className="relative w-1/3 min-h-[180px]">
          {thumbnailUrl ? (
            <>
              {/* 缩略图或视频 */}
              {isVideo(thumbnailUrl) ? (
                <video
                  src={getFullImageUrl(thumbnailUrl)}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  loop
                >
                  您的浏览器不支持视频播放
                </video>
              ) : (
                <Image
                  src={getFullImageUrl(thumbnailUrl)}
                  alt={monthTitle}
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
              )}
              
              {/* 
                播放按钮图标 - 叠加在缩略图中央
                使用 absolute + top-1/2 + left-1/2 + transform 实现居中
              */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 rounded-full p-4 backdrop-blur-sm transition-all duration-300 hover:bg-black/70 hover:scale-110">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <span className="text-gray-400 text-xs">暂无视频</span>
              </div>
            </div>
          )}
        </div>

        {/* 
          右侧内容区 (占 2/3 宽度)
          - flex-1 使其占据剩余空间
          - flex items-center 使标题垂直居中
        */}
        <div className="flex-1 p-6 flex items-center justify-center">
          {/* 放大的标题 */}
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
            {monthTitle}
          </h3>
        </div>
      </div>
    </div>
  );
}
