'use client';

import { useState, useEffect } from 'react';
import { MonthlySummary } from './types';
import Image from 'next/image';
import { Scale, Calendar, AlertTriangle, CloudRain, Thermometer, ClipboardList, User } from 'lucide-react';
import { getFullImageUrl } from '../../suyuan/utils/imageUtils';
import { toDisplayText } from './utils/textUtils';

interface MonthlyDetailPanelProps {
  summary: MonthlySummary;
  onClose: () => void;
}

/**
 * 月度汇总详情面板
 * 从右侧滑入，展示完整的月度汇总数据
 * 支持新旧两种 API 数据格式
 */
export default function MonthlyDetailPanel({ summary, onClose }: MonthlyDetailPanelProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

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
   * 获取影像画廊数组
   * 新 API: summary.detail_gallery
   * 旧 API: summary.images
   */
  const getDetailGallery = (): string[] => {
    return summary.detail_gallery || summary.images || [];
  };

  /**
   * 判断是否为视频文件
   */
  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  /**
   * 获取采摘统计数据
   * 新 API: summary.harvest_stats { count, total_weight }
   * 旧 API: summary.harvest_count, summary.total_harvest_weight
   */
  const getHarvestStats = () => {
    if (summary.harvest_stats) {
      return {
        count: summary.harvest_stats.count,
        total_weight: summary.harvest_stats.total_weight,
      };
    }
    return {
      count: summary.harvest_count || 0,
      total_weight: summary.total_harvest_weight || 0,
    };
  };

  /**
   * 获取异常处理记录
   * 新 API: summary.abnormal_summary (字段: issue, measures)
   * 旧 API: summary.abnormal_records (字段: description, solution)
   * 
   * 返回标准化格式，支持新旧两种字段名
   */
  const getAbnormalRecords = (): Array<{ date: string; issue: string; measures: string }> => {
    const records = summary.abnormal_summary || summary.abnormal_records || [];
    
    // 将数据标准化为统一格式
    return records.map(record => ({
      date: record.date,
      // 优先使用新字段 issue，回退到 description
      issue: toDisplayText(record.issue || record.description, ''),
      // 优先使用新字段 measures，回退到 solution
      measures: toDisplayText(record.measures || record.solution, ''),
    }));
  };

  /**
   * 获取气候数据
   * 最新 API: summary.climate_summary { avg_temp, total_precipitation }
   * 旧 API: summary.climate_summary { avg_temperature, total_rainfall } 或顶层字段
   */
  const getClimateData = () => {
    // 🔍 调试日志：打印接收到的气候数据
    console.log('🌡️ 接收到的气候数据:', summary.climate_summary);
    
    if (summary.climate_summary) {
      return {
        // 优先使用最新字段名，然后回退到旧字段名
        avg_temperature: summary.climate_summary.avg_temp 
                        || summary.climate_summary.avg_temperature 
                        || 0,
        total_rainfall: summary.climate_summary.total_precipitation 
                       || summary.climate_summary.total_rainfall 
                       || 0,
      };
    }
    // 回退到顶层字段（最旧的 API）
    return {
      avg_temperature: summary.avg_temperature || 0,
      total_rainfall: summary.total_rainfall || 0,
    };
  };

  /**
   * 获取农事日历
   * 支持数组或字符串格式
   * 字符串格式示例："9/1日 采摘 9/2日 采摘 9/3日 施肥"
   */
  const getFarmCalendar = (): Array<{ date: string; activity: string }> => {
    const farmCalendar = summary.farm_calendar;
    
    // 如果已经是数组，直接返回
    if (Array.isArray(farmCalendar)) {
      return farmCalendar as Array<{ date: string; activity: string }>;
    }
    
    // 如果是字符串，需要解析
    if (typeof farmCalendar === 'string') {
      const calendarStr = farmCalendar as string;
      if (calendarStr.trim()) {
        const result: Array<{ date: string; activity: string }> = [];
        const text = calendarStr.trim();
        
        // 使用正则表达式匹配：日期+活动的模式
        // 匹配格式：数字/数字+日/号 + 空格 + 活动内容
        const regex = /(\d+[/月]\d+[日号])\s*([^\d]+?)(?=\d+[/月]|$)/g;
        let match;
        
        while ((match = regex.exec(text)) !== null) {
          const date = match[1].trim();
          const activity = match[2].trim();
          if (date && activity) {
            result.push({ date, activity });
          }
        }
        
        console.log('✅ 从字符串解析出农事日历:', result);
        return result;
      }
    }
    
    return [];
  };

  /**
   * 获取下月计划
   * 支持数组或字符串
   */
  const getNextMonthPlan = (): string[] => {
    if (Array.isArray(summary.next_month_plan)) {
      return summary.next_month_plan
        .map(item => toDisplayText(item, '').trim())
        .filter(item => item.length > 0);
    }
    // 如果是字符串，尝试按分号或换行符分割
    if (typeof summary.next_month_plan === 'string') {
      return summary.next_month_plan
        .split(/[;；\n]/)
        .map(item => toDisplayText(item, '').trim())
        .filter(item => item.length > 0);
    }
    return [];
  };

  // ==================== 获取适配后的数据 ====================
  const detailGallery = getDetailGallery();
  const harvestStats = getHarvestStats();
  const abnormalRecords = getAbnormalRecords();
  const climateData = getClimateData();
  const farmCalendar = getFarmCalendar();
  const nextMonthPlan = getNextMonthPlan();

  // ⭐ 直接从原始 summary 对象中提取制茶师字段，避免构造中间对象
  const rawTeaMaster: any =
    (summary as any).tea_master || (summary as any).teaMaster || null;
  const teaMasterName = rawTeaMaster
    ? toDisplayText(
        rawTeaMaster.name ||
          rawTeaMaster.full_name ||
          rawTeaMaster.title ||
          rawTeaMaster.display_name,
        ''
      ).trim()
    : '';
  const teaMasterRole = rawTeaMaster
    ? toDisplayText(
        rawTeaMaster.role || rawTeaMaster.title || rawTeaMaster.position,
        ''
      ).trim()
    : '';
  const teaMasterAvatar =
    (rawTeaMaster && (rawTeaMaster.avatarUrl || rawTeaMaster.avatar_url || rawTeaMaster.avatar)) ||
    '';
  const teaMasterExperience =
    rawTeaMaster &&
    (typeof rawTeaMaster.experienceYears === 'number'
      ? rawTeaMaster.experienceYears
      : typeof rawTeaMaster.experience_years === 'number'
      ? rawTeaMaster.experience_years
      : typeof rawTeaMaster.years_of_experience === 'number'
      ? rawTeaMaster.years_of_experience
      : undefined);
  // 优先使用 year_month 字段，回退到 month 字段（向后兼容）
  const monthTitle = formatMonthTitle(summary.year_month || summary.month);

  // ==================== 图片轮播逻辑 ====================
  // 仅在当前项不是视频时自动切换
  useEffect(() => {
    // 安全检查：确保图片数组存在且有多张图片
    if (!detailGallery || detailGallery.length <= 1) return;

    // 如果当前项是视频，不自动切换
    if (isVideo(detailGallery[currentImageIndex])) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % detailGallery.length);
    }, 5000); // 5秒自动切换

    return () => clearInterval(interval);
  }, [detailGallery, currentImageIndex]);

  // 当切换图片索引时，重置视频播放状态
  useEffect(() => {
    setIsVideoPlaying(false);
  }, [currentImageIndex]);

  // 手动切换图片
  const goToPrevImage = () => {
    if (!detailGallery || detailGallery.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + detailGallery.length) % detailGallery.length);
  };

  const goToNextImage = () => {
    if (!detailGallery || detailGallery.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % detailGallery.length);
  };

  // ==================== 组件挂载动画 ====================
  useEffect(() => {
    setIsAnimating(true);
  }, []);

  // 处理关闭
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300); // 等待动画完成
  };

  // ==================== 渲染 ====================
  return (
    <>
      {/* 半透明遮罩 */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* 详情面板 */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full md:w-2/3 lg:w-1/2 bg-gradient-to-b from-green-50 to-white shadow-2xl z-50 overflow-y-auto transition-transform duration-300 ${
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* 固定顶部导航栏 */}
        <div className="sticky top-0 bg-green-50/95 backdrop-blur-sm border-b border-green-100 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={handleClose}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="关闭"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-bold text-gray-800">
              {monthTitle}
            </h2>
            <div className="w-6" /> {/* 占位，保持标题居中 */}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="pb-8">
          {/* 顶部影像画廊 - 4:3比例，支持轮播 */}
          <div className="relative w-full aspect-[4/3] bg-gray-100">
            {detailGallery && detailGallery.length > 0 ? (
              <>
                {isVideo(detailGallery[currentImageIndex]) ? (
                  <>
                    <video
                      id="monthly-detail-video"
                      src={getFullImageUrl(detailGallery[currentImageIndex])}
                      className="w-full h-full object-cover"
                      controls
                      playsInline
                      loop
                      onPlay={() => setIsVideoPlaying(true)}
                      onPause={() => setIsVideoPlaying(false)}
                      onEnded={() => setIsVideoPlaying(false)}
                    >
                      您的浏览器不支持视频播放
                    </video>
                    
                    {/* 中央播放/暂停按钮 - 始终显示但播放时透明 */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      style={{ paddingBottom: '60px' }} // 为底部控制条留出空间
                    >
                      <button
                        className={`pointer-events-auto rounded-full p-6 transition-all duration-300 hover:scale-110 shadow-2xl ${
                          isVideoPlaying 
                            ? 'bg-transparent hover:bg-black/20' 
                            : 'bg-black/60 hover:bg-black/80'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          const video = document.getElementById('monthly-detail-video') as HTMLVideoElement
                          if (video) {
                            if (video.paused) {
                              video.play()
                            } else {
                              video.pause()
                            }
                          }
                        }}
                      >
                        {!isVideoPlaying && (
                          <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                        {isVideoPlaying && (
                          <div className="w-16 h-16"></div>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <Image
                    src={getFullImageUrl(detailGallery[currentImageIndex])}
                    alt={`${monthTitle}精选影像`}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                )}
                
                {/* 图片计数器 - 右下角 */}
                {detailGallery.length > 1 && (
                  <>
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {detailGallery.length}
                    </div>
                    
                    {/* 左右切换按钮 */}
                    <button
                      onClick={goToPrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                      aria-label="上一张"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={goToNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                      aria-label="下一张"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                暂无影像资料
              </div>
            )}
          </div>

          {/* 下方模块化列表 - 以独立卡片形式展示 */}
          <div className="px-6 py-6 space-y-6">
            {/* 1. 本月采摘统计 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Scale className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-800">本月采摘统计</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">采摘次数</div>
                  <div className="text-2xl font-bold text-green-600">
                    {harvestStats.count} <span className="text-base font-normal">次</span>
                  </div>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">鲜叶总重量</div>
                  <div className="text-2xl font-bold text-amber-600">
                    {harvestStats.total_weight} <span className="text-base font-normal">kg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 本月气候数据 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <CloudRain className="w-6 h-6 text-sky-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-800">本月气候数据</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 rounded-lg p-4 flex items-center">
                  <Thermometer className="w-8 h-8 text-orange-500 mr-3" />
                  <div>
                    <div className="text-xs text-gray-600 mb-1">月平均气温</div>
                    <div className="text-xl font-bold text-gray-800">
                      {climateData.avg_temperature 
                        ? (String(climateData.avg_temperature).includes('℃') || String(climateData.avg_temperature).includes('°C')
                            ? climateData.avg_temperature  // 已包含单位，直接显示
                            : `${climateData.avg_temperature}°C`)  // 添加单位
                        : 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 flex items-center">
                  <CloudRain className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-xs text-gray-600 mb-1">总降水量</div>
                    <div className="text-xl font-bold text-gray-800">
                      {climateData.total_rainfall 
                        ? (String(climateData.total_rainfall).includes('mm')
                            ? climateData.total_rainfall  // 已包含单位，直接显示
                            : `${climateData.total_rainfall}mm`)  // 添加单位
                        : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 本月农事日历（条件显示） */}
            {farmCalendar.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">本月农事日历</h3>
                </div>
                
                <div className="space-y-2">
                  {farmCalendar.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                      {/* 左侧：日期 */}
                      <div className="text-sm text-gray-600 font-medium">
                        {item.date}
                      </div>
                      {/* 右侧：农事活动（右对齐） */}
                      <div className="text-sm text-gray-800 text-right">
                        {item.activity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. 本月异常汇总（条件显示） */}
            {abnormalRecords.length > 0 && (
              <div className="bg-red-50 rounded-lg shadow-md p-6 border border-red-200">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                  <h3 className="text-lg font-semibold text-red-700">本月异常汇总</h3>
                </div>
                
                <div className="space-y-4">
                  {abnormalRecords.map((event, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                      {/* 日期标签 */}
                      <p className="text-sm font-semibold text-gray-800 mb-2">
                        {event.date}
                      </p>
                      
                      {/* 问题和措施的组合展示 */}
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {/* 问题（加粗） */}
                        {event.issue && (
                          <strong className="text-gray-800">{event.issue}</strong>
                        )}
                        {/* 措施（如果存在，前面加逗号） */}
                        {event.measures && event.measures.trim() !== '' && (
                          <>
                            {event.issue && event.issue.trim() !== '' ? '，' : ''}
                            {event.measures}
                          </>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. 下月计划 */}
            {nextMonthPlan.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <ClipboardList className="w-6 h-6 text-purple-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">下月计划</h3>
                </div>
                
                <div className="space-y-3">
                  {nextMonthPlan.map((plan, index) => (
                    <div key={index} className="flex items-start">
                      {/* 序号 */}
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                        {index + 1}
                      </div>
                      {/* 计划内容 */}
                      <p className="text-sm text-gray-700 leading-relaxed flex-1">
                        {plan}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. 制茶师信息（条件显示） */}
            {teaMasterName && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <User className="w-6 h-6 text-indigo-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">制茶师</h3>
                </div>
                
                <div className="flex items-center gap-4">
                  {teaMasterAvatar && (
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={getFullImageUrl(teaMasterAvatar)}
                        alt={teaMasterName}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        sizes="64px"
                      />
                    </div>
                  )}
                  <div>
                    <div className="text-base font-semibold text-gray-800 mb-1">
                      {teaMasterName}
                    </div>
                    {teaMasterRole && (
                      <div className="text-sm text-gray-600 mb-1">
                        {teaMasterRole}
                      </div>
                    )}
                    {teaMasterExperience !== undefined && (
                      <div className="text-sm text-gray-600">
                        经验：{teaMasterExperience} 年
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
