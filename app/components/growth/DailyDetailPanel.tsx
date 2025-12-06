'use client';

import { useState, useEffect } from 'react';
import { DailyLog } from './types';
import Image from 'next/image';
import { Sun, CloudRain, Thermometer, Droplets, Leaf, BookOpen, Eye, Scissors, AlertTriangle, Wind, HardHat, Package } from 'lucide-react';
import { getFullImageUrl } from '../../suyuan/utils/imageUtils';
import { getRecorderInfo } from './dailyLogAdapters';

interface DailyDetailPanelProps {
  log: DailyLog;
  onClose: () => void;
}

/**
 * 每日生长详情面板
 * 从右侧滑入，展示完整的每日记录详情
 * 支持新旧两种 API 数据格式
 */
export default function DailyDetailPanel({ log, onClose }: DailyDetailPanelProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // ==================== 数据适配层 ====================
  const logAny = log as any;

  /**
   * 获取详情图片数组
   * 新 API: log.detail_gallery / detailGallery / imagesAndVideos / mediaUrls
   * 旧 API: log.images
   */
  const getDetailGallery = (): string[] => {
    return (
      logAny.detail_gallery ||
      logAny.detailGallery ||
      logAny.imagesAndVideos ||
      logAny.mediaUrls ||
      log.images ||
      []
    );
  };

  /**
   * 判断是否为视频文件
   */
  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  /**
   * 获取拍摄日期（短格式）
   * 新 API: log.photo_info.date
   * 旧 API: 从 log.date 计算
   */
  const getPhotoDate = (): string => {
    if (logAny.photo_info?.date) {
      return logAny.photo_info.date;
    }
    // 回退到旧格式
    const date = new Date(log.date);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}.${day}`;
  };

  /**
   * 获取地块名称
   * 新 API: log.photo_info.location / photoInfo.location / photoInfo.plotName
   * 旧 API: log.plot_name / plotName 或 log.plot_id.name / plotId.name
   */
  const getPlotName = (): string => {
    return (
      logAny.photo_info?.location ||
      logAny.photoInfo?.location ||
      logAny.photo_info?.plot_name ||
      logAny.photoInfo?.plotName ||
      logAny.plot_id?.name ||
      logAny.plotId?.name ||
      logAny.plotName ||
      log.plot_name ||
      '未知地块'
    );
  };

  /**
   * 获取拍摄人/记录人信息（包含姓名和头像）
   * 直接复用 dailyLogAdapters 中的 getRecorderInfo 逻辑，
   * 保证与列表卡片的“记录人头像”完全一致。
   */
  const getPhotographerInfo = (): { name: string; avatar_url?: string } => {
    const info = getRecorderInfo(log as any);
    return {
      name: info.name,
      avatar_url: info.avatar_url || undefined,
    };
  };

  /**
   * 获取环境数据
   * 后端实际保存的字段名: { sunshine_hours, rainfall, temperature, humidity }
   * 旧 API: log.sunlight_hours, log.rainfall, log.avg_temperature, log.humidity
   */
  const getEnvironmentData = () => {
    const env = logAny.environment_data || logAny.environmentData || {};
    
    return {
      sunshine:
        env.sunshine_hours ||
        env.sunshine ||
        `${log.sunlight_hours || 0}`,
      precipitation:
        env.rainfall ||
        env.precipitation ||
        `${log.rainfall || 0}`,
      avg_temp:
        env.temperature ||
        env.avg_temp ||
        `${log.avg_temperature || 0}`,
      humidity: env.humidity || `${log.humidity || 0}`,
    };
  };

  /**
   * 获取完整日记内容
   * 新 API: log.full_log / fullLog
   * 旧 API: log.full_description
   * 返回 null 如果内容为空
   */
  const getFullLog = (): string | null => {
    const value =
      logAny.full_log ||
      logAny.fullLog ||
      log.full_description ||
      log.summary ||
      '';
    // 检查是否为非空字符串
    return value && value.trim() !== '' ? value : null;
  };

  /**
   * 获取农事活动类型
   * 新 API: log.activity
   * 旧 API: log.farm_activity_type / farmActivityType
   * 返回活动类型字符串，如"施肥"、"修剪"等，默认为"当日农事"
   */
  const getActivity = (): string => {
    const value =
      logAny.activity ||
      logAny.farm_activity_type ||
      logAny.farmActivityType ||
      '';
    // 如果有值且不是"无"，则返回该值，否则返回默认标题
    return value && value.trim() !== '' && value !== '无' ? value : '当日农事';
  };

  /**
   * 获取当日农事记录
   * 新 API: log.farm_activity_log / farmActivityLog
   * 旧 API: log.farm_activities
   * 返回 null 如果内容为空
   */
  const getFarmActivityLog = (): string | null => {
    const value =
      logAny.farm_activity_log ||
      logAny.farmActivityLog ||
      log.farm_activities ||
      '';
    // 检查是否为非空字符串
    return value && value.trim() !== '' ? value : null;
  };

  /**
   * 获取物候观察
   * 新旧 API: log.phenological_observation / phenologicalObservation
   * 返回 null 如果内容为空
   */
  const getPhenologicalObservation = (): string | null => {
    const value =
      log.phenological_observation || logAny.phenologicalObservation || '';
    // 检查是否为非空字符串
    return value && value.trim() !== '' ? value : null;
  };

  /**
   * 获取异常事件
   * 新 API: log.abnormal_event { title, description, measures_taken }
   * 兼容: abnormalEvent
   * 旧 API: log.is_abnormal, log.abnormal_description, log.abnormal_solution
   * 返回 null 如果没有有效的异常信息
   */
  const getAbnormalEvent = (): { title: string; description: string; measures: string } | null => {
    const abnormal = logAny.abnormal_event || logAny.abnormalEvent;
    // 新 API: abnormal_event / abnormalEvent 对象
    if (abnormal) {
      const title = abnormal.title || '';
      const desc = abnormal.description || '';
      // 支持两种字段名：measures_taken (最新) 和 solution (向后兼容)
      const measures = abnormal.measures_taken || abnormal.solution || '';
      
      // 只有当 title、description 或 measures 至少有一个有内容时才返回对象
      if (title.trim() !== '' || desc.trim() !== '' || measures.trim() !== '') {
        return {
          title: title,
          description: desc,
          measures: measures,
        };
      }
    }
    
    // 旧 API: is_abnormal 布尔值（没有 title）
    if (log.is_abnormal) {
      const desc = log.abnormal_description || '';
      const measures = log.abnormal_solution || '';
      // 只有当有描述内容时才返回
      if (desc.trim() !== '') {
        return {
          title: '', // 旧 API 没有 title
          description: desc,
          measures: measures,
        };
      }
    }
    
    return null;
  };

  // ==================== 获取适配后的数据 ====================
  const detailGallery = getDetailGallery();
  const photoDate = getPhotoDate();
  const plotName = getPlotName();
  const photographerInfo = getPhotographerInfo();
  const environmentData = getEnvironmentData();
  const fullLog = getFullLog();
  const activity = getActivity(); // 农事活动类型（用于标题）
  const farmActivityLog = getFarmActivityLog();
  const phenologicalObservation = getPhenologicalObservation();
  const abnormalEvent = getAbnormalEvent();

  // ==================== 辅助函数 ====================
  
  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  };

  // ==================== 图标-颜色映射 ====================
  /**
   * 板块标题到图标和颜色的映射
   * 用于在"农事与观察区"中显示动态彩色图标
   */
  const sectionIconMapping: { [key: string]: { icon: any; color: string } } = {
    // 动态农事活动
    '施肥': { icon: Leaf, color: 'text-green-500' },
    '修剪': { icon: Scissors, color: 'text-blue-500' },
    '灌溉': { icon: Droplets, color: 'text-sky-500' },
    '采摘': { icon: HardHat, color: 'text-purple-500' },
    '异常': { icon: AlertTriangle, color: 'text-red-500' },
    // 固定板块
    '生长日记': { icon: BookOpen, color: 'text-gray-700' },
    '物候观察': { icon: Eye, color: 'text-indigo-500' }
  };

  // 默认备用图标
  const DefaultIcon = { icon: Wind, color: 'text-gray-400' };

  /**
   * 根据板块标题获取对应的图标配置
   */
  const getSectionIcon = (title: string) => {
    return sectionIconMapping[title] || DefaultIcon;
  };

  // 图片轮播逻辑（仅在当前项不是视频时自动切换）
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

  // 组件挂载动画
  useEffect(() => {
    setIsAnimating(true);
  }, []);

  // 处理关闭
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300); // 等待动画完成
  };

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
              {formatDate(log.date)} 生长记录
            </h2>
            <div className="w-6" /> {/* 占位，保持标题居中 */}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="pb-8">
          {/* 顶部图片画廊 - 4:3比例，支持轮播 */}
          <div className="relative w-full aspect-[4/3] bg-gray-100">
            {detailGallery && detailGallery.length > 0 ? (
              <>
                {isVideo(detailGallery[currentImageIndex]) ? (
                  <>
                    <video
                      id="daily-detail-video"
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
                          const video = document.getElementById('daily-detail-video') as HTMLVideoElement
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
                    alt={`${formatDate(log.date)}的详情图片`}
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
                暂无图片
              </div>
            )}
          </div>

          {/* 图片信息 - 三列网格布局，淡灰色分割线 */}
          <div className="grid grid-cols-3 divide-x divide-gray-200 border-b border-gray-200 bg-gray-50">
            <div className="py-3 text-center">
              <div className="text-xs text-gray-500 mb-1">拍摄日期</div>
              <div className="text-sm font-medium text-gray-800">{photoDate}</div>
            </div>
            <div className="py-3 text-center">
              <div className="text-xs text-gray-500 mb-1">地块</div>
              <div className="text-sm font-medium text-gray-800">{plotName}</div>
            </div>
            <div className="py-3 text-center">
              {/* 拍摄人：左侧头像 + 右侧垂直排列（标签+名字） */}
              <div className="flex items-center justify-center gap-2">
                {/* 头像 - 圆形 40x40 */}
                {photographerInfo.avatar_url ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={getFullImageUrl(photographerInfo.avatar_url)}
                      alt={photographerInfo.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      quality={70}
                      sizes="40px"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm text-gray-600 font-medium flex-shrink-0">
                    {photographerInfo.name?.[0] || '拍'}
                  </div>
                )}
                
                {/* 右侧：标签和名字垂直排列 */}
                <div className="flex flex-col items-start">
                  <div className="text-xs text-gray-500">拍摄人</div>
                  <div className="text-sm font-medium text-gray-800">{photographerInfo.name}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 环境数据面板 - 2x2网格布局，垂直居中样式 */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-2 gap-4">
              {/* 日照时间 */}
              <div className="bg-yellow-50 rounded-lg p-6 flex flex-col items-center justify-center gap-2">
                <Sun className="w-10 h-10 text-yellow-500" />
                <div className="text-sm text-gray-600">日照时间</div>
                <div className="text-xl font-bold text-gray-800">
                  {environmentData.sunshine ? `${environmentData.sunshine}小时` : '0小时'}
                </div>
              </div>
              
              {/* 今日降水 */}
              <div className="bg-blue-50 rounded-lg p-6 flex flex-col items-center justify-center gap-2">
                <CloudRain className="w-10 h-10 text-blue-500" />
                <div className="text-sm text-gray-600">今日降水</div>
                <div className="text-xl font-bold text-gray-800">
                  {environmentData.precipitation ? `${environmentData.precipitation}mm` : '0mm'}
                </div>
              </div>
              
              {/* 平均温度 */}
              <div className="bg-red-50 rounded-lg p-6 flex flex-col items-center justify-center gap-2">
                <Thermometer className="w-10 h-10 text-red-500" />
                <div className="text-sm text-gray-600">平均温度</div>
                <div className="text-xl font-bold text-gray-800">
                  {environmentData.avg_temp ? `${environmentData.avg_temp}℃` : '0℃'}
                </div>
              </div>
              
              {/* 湿度 */}
              <div className="bg-cyan-50 rounded-lg p-6 flex flex-col items-center justify-center gap-2">
                <Droplets className="w-10 h-10 text-cyan-500" />
                <div className="text-sm text-gray-600">湿度</div>
                <div className="text-xl font-bold text-gray-800">
                  {environmentData.humidity ? `${environmentData.humidity}%` : '0%'}
                </div>
              </div>
            </div>
          </div>

          {/* 🆕 今日采摘信息模块 - 重新设计的布局 */}
          {log.has_harvest && (
            <div className="mx-6 mb-6">
              {/* 标题区 */}
              <div className="flex items-center gap-2 mb-4">
                <HardHat className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-800">今日采摘</h3>
              </div>
              
              {/* 采摘信息卡片 */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-5 border border-orange-100">
                <div className="flex items-center justify-between gap-4">
                  {/* 左侧：队长信息 */}
                  <div className="flex items-center gap-3">
                    {/* 队长头像 */}
                    {log.harvest_leader_avatar ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-orange-300 shadow-sm">
                        <Image
                          src={getFullImageUrl(log.harvest_leader_avatar)}
                          alt={log.harvest_leader_name || '队长'}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          quality={70}
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-orange-400 flex items-center justify-center text-white text-lg font-bold flex-shrink-0 ring-2 ring-orange-300 shadow-sm">
                        {log.harvest_leader_name?.[0] || '队'}
                      </div>
                    )}
                    
                    {/* 队长名称和采摘人数 */}
                    <div>
                      <div className="text-base font-semibold text-gray-800 mb-0.5">
                        {log.harvest_leader_name || '未知队长'}
                      </div>
                      <div className="text-sm text-gray-600">
                        采摘人数：<span className="font-semibold text-orange-700">{log.harvest_team_count || 0}</span> 人
                      </div>
                    </div>
                  </div>
                  
                  {/* 右侧：统计数据 */}
                  <div className="flex items-center gap-3">
                    {/* 鲜叶重量 */}
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <Package className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-600">鲜叶重量</div>
                        <div className="text-lg font-bold text-orange-600">
                          {log.harvest_total_weight || 0} <span className="text-xs font-normal text-gray-500">kg</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 采摘次数（仅当大于1次时显示） */}
                    {log.harvest_count && log.harvest_count > 1 && (
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <span className="text-orange-600 text-xl">📊</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-600">采摘次数</div>
                          <div className="text-lg font-bold text-orange-600">
                            {log.harvest_count} <span className="text-xs font-normal text-gray-500">次</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 农事与观察区 - 堆叠式布局：图标+标题在第一行，正文在第二行与图标左对齐 */}
          {(fullLog || farmActivityLog || phenologicalObservation || abnormalEvent) && (
            <div className="mx-6 mb-6 bg-white rounded-lg shadow-md p-6">
              {/* 当日农事（条件显示 - 优先显示在最顶部） */}
              {farmActivityLog && (() => {
                const iconConfig = getSectionIcon(activity);
                const IconComponent = iconConfig.icon;
                return (
                  <div className="mb-6">
                    {/* 第一行：图标 + 标题 */}
                    <div className="flex items-center mb-2">
                      <IconComponent className={`w-6 h-6 ${iconConfig.color} mr-3`} />
                      <h3 className="text-lg font-semibold text-gray-800">{activity}</h3>
                    </div>
                    
                    {/* 第二行：正文（与图标左对齐） */}
                    <p className="text-gray-600 leading-relaxed">{farmActivityLog}</p>
                  </div>
                );
              })()}

              {/* 分割线 */}
              {farmActivityLog && fullLog && <hr className="border-gray-200 my-6" />}

              {/* 生长日记（条件显示） */}
              {fullLog && (() => {
                const iconConfig = getSectionIcon('生长日记');
                const IconComponent = iconConfig.icon;
                return (
                  <div className="mb-6">
                    {/* 第一行：图标 + 标题 */}
                    <div className="flex items-center mb-2">
                      <IconComponent className={`w-6 h-6 ${iconConfig.color} mr-3`} />
                      <h3 className="text-lg font-semibold text-gray-800">生长日记</h3>
                    </div>
                    
                    {/* 第二行：正文（与图标左对齐） */}
                    <p className="text-gray-600 leading-relaxed">{fullLog}</p>
                  </div>
                );
              })()}

              {/* 分割线 */}
              {(farmActivityLog || fullLog) && phenologicalObservation && (
                <hr className="border-gray-200 my-6" />
              )}

              {/* 物候观察（条件显示） */}
              {phenologicalObservation && (() => {
                const iconConfig = getSectionIcon('物候观察');
                const IconComponent = iconConfig.icon;
                return (
                  <div className="mb-6">
                    {/* 第一行：图标 + 标题 */}
                    <div className="flex items-center mb-2">
                      <IconComponent className={`w-6 h-6 ${iconConfig.color} mr-3`} />
                      <h3 className="text-lg font-semibold text-gray-800">物候观察</h3>
                    </div>
                    
                    {/* 第二行：正文（与图标左对齐） */}
                    <p className="text-gray-600 leading-relaxed">{phenologicalObservation}</p>
                  </div>
                );
              })()}

              {/* 分割线 */}
              {(farmActivityLog || fullLog || phenologicalObservation) && abnormalEvent && (
                <hr className="border-red-200 my-6" />
              )}

              {/* 异常处理（条件显示 - 特殊样式） */}
              {abnormalEvent && (() => {
                const iconConfig = getSectionIcon('异常');
                const IconComponent = iconConfig.icon;
                return (
                  <div className="bg-red-50 rounded-lg p-5 -mx-6 -mb-6 border-l-4 border-red-400">
                    {/* 总标题：异常处理 */}
                    <div className="flex items-center mb-4">
                      <IconComponent className={`w-6 h-6 ${iconConfig.color} mr-3`} />
                      <h3 className="text-lg font-semibold text-red-700">异常处理</h3>
                    </div>
                    
                    {/* 第一部分：异常情况（包含标题和描述） */}
                    {(abnormalEvent.title.trim() !== '' || abnormalEvent.description.trim() !== '') && (
                      <div className="mb-3">
                        {/* 异常标题（如果存在） */}
                        {abnormalEvent.title && abnormalEvent.title.trim() !== '' && (
                          <div className="text-base font-bold text-gray-800 mb-2">
                            {abnormalEvent.title}
                          </div>
                        )}
                        
                        {/* 异常描述 */}
                        {abnormalEvent.description && abnormalEvent.description.trim() !== '' && (
                          <p className="text-gray-700 leading-relaxed">
                            {abnormalEvent.description}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {/* 第二部分：处理措施（仅当 measures 存在时显示，带分割线） */}
                    {abnormalEvent.measures && abnormalEvent.measures.trim() !== '' && (
                      <div className="mt-4 pt-4 border-t border-red-200">
                        <div className="text-sm font-semibold text-red-700 mb-2">已采取措施</div>
                        <p className="text-gray-700 leading-relaxed">
                          {abnormalEvent.measures}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

