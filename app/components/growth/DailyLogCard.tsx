'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { DailyLog } from './types';
import { getFullImageUrl } from '../../suyuan/utils/imageUtils';
import {
  getMainImageUrl,
  isVideo,
  getWeatherIcon,
  getTemperatureRange,
  getPlotName,
  getRecorderInfo,
  getStatusTag,
  formatDate,
} from './dailyLogAdapters';
import { toDisplayText } from './utils/textUtils';

interface DailyLogCardProps {
  log: DailyLog;
  onClick: () => void;
  /** 卡片是否处于激活状态（带流光边框） */
  isActive?: boolean;
}

/**
 * 每日日志卡片组件
 * 左侧1/3为图片，右侧2/3为内容
 * 支持新旧两种 API 数据格式
 */
const DailyLogCard = React.memo(({ log, onClick, isActive = false }: DailyLogCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // 使用 useMemo 缓存计算结果，避免不必要的重新计算
  const mainImageUrl = useMemo(() => getMainImageUrl(log), [log]);
  const weatherIcon = useMemo(() => getWeatherIcon(log), [log]);
  const temperatureRange = useMemo(() => getTemperatureRange(log), [log]);
  const plotName = useMemo(() => toDisplayText(getPlotName(log), '未知地块'), [log]);
  const recorderInfo = useMemo(() => getRecorderInfo(log), [log]);
  const recorderName = useMemo(
    () => toDisplayText(recorderInfo.name, '记录员'),
    [recorderInfo.name]
  );
  const statusTag = useMemo(() => getStatusTag(log), [log]);
  const formattedDate = useMemo(() => formatDate(log.date), [log.date]);
  const summaryText = useMemo(() => toDisplayText(log.summary, '暂无生长记录'), [log.summary]);
  const statusTagText = useMemo(
    () => (statusTag ? toDisplayText(statusTag.text, '') : ''),
    [statusTag]
  );
  
  // 🆕 获取天气名称
  const weatherName = useMemo(() => {
    const weather = log.weather;
    if (typeof weather === 'object' && weather?.icon) {
      return toDisplayText(weather.icon, '');
    }
    return toDisplayText(weather, '');
  }, [log.weather]);

  return (
    <div
      onClick={onClick}
      className={`
        relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer 
        transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-98
        ${isActive ? 'active-card-border' : 'active-card-border-default'}
      `}
    >
      {/* 🆕 已采摘标签 - 绝对定位在卡片左上角 */}
      {log.has_harvest && (
        <div 
          className="absolute top-2.5 left-2.5 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold z-20 shadow-md"
          title={`采摘 ${log.harvest_count || 1} 次，共 ${log.harvest_total_weight || 0}kg`}
        >
          已采摘
        </div>
      )}
      
      <div className="flex flex-row h-full">
        {/* 左侧图片区 (占 1/3 宽度) */}
        <div className="relative w-1/3 min-h-[180px]">
          {mainImageUrl ? (
            isVideo(mainImageUrl) ? (
              <video
                src={getFullImageUrl(mainImageUrl)}
                className="w-full h-full object-cover"
                muted
                playsInline
                loop
              >
                您的浏览器不支持视频播放
              </video>
            ) : (
              <>
                {/* 骨架屏加载状态 */}
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <Image
                  src={getFullImageUrl(mainImageUrl)}
                  alt={`${formattedDate}的记录图片`}
                  fill
                  className={`object-cover transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  sizes="33vw"
                  quality={70}
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                />
              </>
            )
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-xs">暂无图片</span>
            </div>
          )}
          
          {/* 农事标签 - 绝对定位在图片左上角 */}
          {/* 🆕 优先级逻辑：有采摘标签时不显示农事标签 */}
          {statusTag && statusTagText && !log.has_harvest && (
            <div 
              className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-sm font-medium shadow-lg"
              style={{ backgroundColor: statusTag.color }}
            >
              {statusTagText}
            </div>
          )}
        </div>

        {/* 右侧内容区 (占 2/3 宽度) */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          {/* 顶部区域：日期与天气信息 */}
          <div className="flex justify-between items-start mb-2">
            {/* 左侧：大号浅绿色日期 */}
            <div className="text-xl md:text-2xl font-bold text-green-600">
              {formattedDate}
            </div>
            
            {/* 右侧：天气图标、天气名称与温度范围 */}
            <div className="flex items-center gap-1.5 text-gray-600">
              {/* 天气图标 */}
              <span className="flex items-center">
                {typeof weatherIcon === 'string' ? (
                  // 🆕 判断是否为URL（以 / 或 http 开头）
                  weatherIcon.startsWith('/') || weatherIcon.startsWith('http') ? (
                    <Image 
                      src={getFullImageUrl(weatherIcon)} 
                      alt="天气图标"
                      width={28}
                      height={28}
                      className="w-6 h-6 md:w-7 md:h-7 object-contain"
                      sizes="28px"
                    />
                  ) : (
                    <span className="text-xl">{weatherIcon}</span>  // emoji 也增大
                  )
                ) : (
                  React.createElement(weatherIcon, { className: "w-6 h-6 md:w-7 md:h-7" })
                )}
              </span>
              {/* 🆕 天气名称 */}
              {weatherName && (
                <span className="text-xs md:text-sm">{weatherName}</span>
              )}
              {/* 温度范围 */}
              <span className="text-xs md:text-sm whitespace-nowrap">{temperatureRange}</span>
            </div>
          </div>

          {/* 中部：核心日志摘要 */}
          <div className="flex-1 mb-2">
            <p className="text-gray-700 line-clamp-2 text-xs md:text-sm leading-relaxed">
              {summaryText}
            </p>
          </div>

          {/* 底部：地块信息 | 记录人头像+信息 + 箭头图标 */}
          <div className="flex justify-between items-center">
            {/* 左侧：地块和记录人信息 */}
            <div className="flex items-center gap-3 text-xs">
              {/* 地块信息 */}
              <div className="flex flex-col">
                <div className="text-gray-500 mb-0.5">地块</div>
                <div className="text-gray-800 font-medium">{plotName}</div>
              </div>
              
              {/* 竖线分隔 */}
              <div className="h-10 w-px bg-gray-300"></div>
              
              {/* 记录人信息：头像 + 名字 */}
              <div className="flex items-center gap-2">
                {/* 头像 */}
                {recorderInfo.avatar_url ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                    <Image
                      src={getFullImageUrl(recorderInfo.avatar_url)}
                      alt={recorderName}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      quality={70}
                      sizes="40px"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm text-gray-600 font-medium flex-shrink-0">
                    {recorderName?.[0] || '记'}
                  </div>
                )}
                
                {/* 记录人名字 */}
                <div className="flex flex-col">
                  <div className="text-gray-500 mb-0.5">记录人</div>
                  <div className="text-gray-800 font-medium">{recorderName}</div>
                </div>
              </div>
            </div>
            
            {/* 橘黄色向右箭头 - 带呼吸效果 */}
            <div className="flex-shrink-0">
              <svg 
                className="w-5 h-5 text-orange-500 arrow-breathe" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

DailyLogCard.displayName = 'DailyLogCard';

export default DailyLogCard;
