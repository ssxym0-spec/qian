'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HarvestRecord } from '../types';
import { getFullImageUrl, isVideoUrl } from '../utils/imageUtils';
import { getWeatherIconUrl, loadWeatherTemplates } from '../../utils/weatherTemplates';
import { 
  SunnyIcon, 
  CloudyIcon,
  OvercastIcon,
  RainyIcon,
  PartlyCloudyIcon,
  LightRainIcon,
  ModerateRainIcon,
  HeavyRainIcon,
  ShowersIcon,
  ThunderstormIcon,
  WindyIcon,
  HeatWaveIcon
} from '../../components/growth/WeatherIcons';

// ==================== 使用统一的 Meteocons 风格天气图标 ====================

/**
 * 故事时间轴组件
 * 展示从鲜叶采集到完成的时间线
 */

interface StoryTimelineProps {
  harvestRecords: HarvestRecord[];
}

/**
 * 天气图标映射 - 支持后端11种天气类型
 */
const weatherIconMapping: { [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>> } = {
  // 原有天气
  '晴天': SunnyIcon,
  '多云': CloudyIcon,
  '阴天': OvercastIcon,  // 使用独立的深灰色阴天图标
  '雨天': RainyIcon,
  
  // 新增天气类型
  '多云转晴': PartlyCloudyIcon,
  '小雨': LightRainIcon,
  '中雨': ModerateRainIcon,
  '大雨': HeavyRainIcon,
  '白天有阵雨': ShowersIcon,
  '阵雨': ShowersIcon,
  '雷阵雨': ThunderstormIcon,
  '风': WindyIcon,
  '热浪': HeatWaveIcon,
  
  // 兼容简写
  '晴': SunnyIcon,
  '云': CloudyIcon,
  '阴': OvercastIcon,  // 阴天使用深灰色图标
  '雨': RainyIcon,
};

/**
 * 获取天气图标组件或URL
 * 🆕 支持自定义SVG URL
 * 优先级：后端SVG URL > 从映射表获取的URL > 预设图标组件
 */
const getWeatherIcon = (
  weatherData: string | { icon?: string; svg_icon?: string }
): React.ComponentType<React.SVGProps<SVGSVGElement>> | string => {
  // 🆕 如果是对象且有svg_icon字段，直接返回URL
  if (typeof weatherData === 'object' && weatherData?.svg_icon) {
    return weatherData.svg_icon;
  }
  
  // 获取天气名称
  const weatherName = typeof weatherData === 'object' 
    ? (weatherData?.icon || '') 
    : weatherData;
  
  // 🆕 从天气模板映射表中获取SVG URL
  const svgUrl = getWeatherIconUrl(weatherName);
  if (svgUrl) {
    return svgUrl; // 返回从后端加载的SVG URL
  }
  
  // 降级：使用预设图标组件
  // 直接匹配
  if (weatherIconMapping[weatherName]) {
    return weatherIconMapping[weatherName];
  }
  
  // 模糊匹配
  for (const key in weatherIconMapping) {
    if (weatherName.includes(key)) {
      return weatherIconMapping[key];
    }
  }
  
  // 默认返回晴天图标
  return SunnyIcon;
};

/**
 * 视频播放器组件
 * 支持点击播放/暂停，带居中的播放按钮
 */
interface VideoPlayerProps {
  src: string;
  videoId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, videoId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleVideoClick = () => {
    setShowModal(true);
    setIsPlaying(false);
  };

  const handleModalVideoClick = () => {
    const video = document.getElementById(`modal-${videoId}`) as HTMLVideoElement;
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleCloseModal = () => {
    const video = document.getElementById(`modal-${videoId}`) as HTMLVideoElement;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setShowModal(false);
    setIsPlaying(false);
  };

  return (
    <>
      {/* 缩略图视频 */}
      <div className="relative w-full h-full cursor-pointer" onClick={handleVideoClick}>
        <video
          src={src}
          className="w-full h-full object-cover"
          playsInline
          muted
          loop
        >
          您的浏览器不支持视频播放
        </video>
        
        {/* 中央播放按钮 */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="bg-black/60 rounded-full p-3 backdrop-blur-sm transition-all duration-300 hover:bg-black/80 hover:scale-110 shadow-2xl">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 播放弹窗 */}
      {showModal && (
        <>
          {/* 遮罩层 */}
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            {/* 视频容器 */}
            <div
              className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 关闭按钮 */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                aria-label="关闭"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* 视频播放器 - 可点击的视频区域 */}
              <div 
                className="relative w-full h-full cursor-pointer"
                onClick={handleModalVideoClick}
              >
                <video
                  id={`modal-${videoId}`}
                  src={src}
                  className="w-full h-full object-contain"
                  controls
                  playsInline
                  loop
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                >
                  您的浏览器不支持视频播放
                </video>

                {/* 中央播放/暂停按钮 - 始终显示但播放时透明 */}
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{ paddingBottom: '60px' }}
                >
                  <button
                    className={`pointer-events-auto rounded-full p-6 transition-all duration-300 hover:scale-110 shadow-2xl ${
                      isPlaying 
                        ? 'bg-transparent hover:bg-black/20' 
                        : 'bg-black/60 hover:bg-black/80'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModalVideoClick();
                    }}
                  >
                    {!isPlaying && (
                      <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                    {isPlaying && (
                      <div className="w-16 h-16"></div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default function StoryTimeline({ harvestRecords }: StoryTimelineProps) {
  console.log('📅 [StoryTimeline] 组件渲染, 记录数量:', harvestRecords?.length || 0);

  // 🆕 添加状态来跟踪天气模板是否已加载完成
  const [weatherTemplatesLoaded, setWeatherTemplatesLoaded] = React.useState(false);

  // 🆕 组件挂载时加载天气模板映射表
  React.useEffect(() => {
    const loadTemplates = async () => {
      await loadWeatherTemplates();
      setWeatherTemplatesLoaded(true);
      console.log('✅ [StoryTimeline] 天气模板加载完成，触发重新渲染');
    };
    loadTemplates();
  }, []);
  
  // 空值检查
  if (!harvestRecords || harvestRecords.length === 0) {
    console.warn('⚠️ [StoryTimeline] 没有采摘记录数据');
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center">
        <p className="text-gray-500">暂无采摘记录</p>
      </div>
    );
  }

  // 按日期排序（从早到晚）
  const sortedRecords = [...harvestRecords].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // 计算总重量
  const totalWeight = sortedRecords.reduce((sum, record) => sum + record.weight_kg, 0);
  const dayCount = sortedRecords.length;
  
  console.log('📅 [StoryTimeline] 排序后的记录数量:', sortedRecords.length);
  console.log('📅 [StoryTimeline] 总重量:', totalWeight, 'kg');

  /**
   * 将采摘日期转换为生长日记页面的链接
   * 例如：2025-03-25 -> /shengzhang?month=2025-03&date=25
   */
  const getGrowthLink = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-indexed，需要加1
    const day = date.getDate();
    return `/shengzhang?month=${year}-${month}&date=${day}`;
  };

  /**
   * 格式化日期显示（简短格式）
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  return (
    <>
      {/* 标题部分 - 独立显示 */}
      <div className="mb-6">
        <h2 className="font-serif text-xl md:text-2xl font-bold text-gray-900">
          鲜叶采集
        </h2>
      </div>

      {/* 时间轴容器 - 左对齐布局 */}
      <div className="relative space-y-6">
        {/* 垂直时间轴线 - 从第一个节点延伸到最后的√号 */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 via-green-500 to-amber-500" />

        {sortedRecords.map((record, index) => (
          <div key={record._id} className="relative flex items-start">
            {/* 时间轴节点 - 带序号的圆圈，贴近左侧 */}
            <div className="absolute left-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-md flex items-center justify-center z-10">
              <span className="text-white font-bold text-sm">{index + 1}</span>
            </div>

            {/* 节点内容卡片 - 左侧留出时间轴和节点的空间 */}
            <div className="ml-12 flex-1 bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              {/* 日期和核心信息 */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-base text-gray-900 mb-1">
                    {formatDate(record.date)}
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-right">
                    <span className="text-green-600 font-bold text-base">{record.weight_kg}</span>
                    <span className="text-gray-500 ml-1">kg</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    {/* 天气图标 + 天气文字 */}
                    {(() => {
                      const weatherIconOrUrl = getWeatherIcon(record.weather);
                      const weatherName = typeof record.weather === 'object' 
                        ? (record.weather.icon || '') 
                        : record.weather;
                      
                      // 🆕 如果是URL字符串，显示图片
                      if (typeof weatherIconOrUrl === 'string') {
                        return (
                          <>
                            <Image 
                              src={getFullImageUrl(weatherIconOrUrl)}
                              alt="天气图标"
                              width={20}
                              height={20}
                              className="w-5 h-5 flex-shrink-0 object-contain"
                              sizes="20px"
                            />
                            <span>{weatherName}</span>
                          </>
                        );
                      }
                      
                      // 否则渲染SVG组件
                      const WeatherIcon = weatherIconOrUrl;
                      return (
                        <>
                          <WeatherIcon className="w-5 h-5 flex-shrink-0" />
                          <span>{weatherName}</span>
                        </>
                      );
                    })()}
                    {/* 温度 */}
                    {record.temperature && (
                      <span className="ml-1">· {record.temperature}℃</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 每日影像 - 两列网格布局 */}
              {record.images && record.images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {record.images.slice(0, 2).map((image, imgIndex) => {
                    const fullImageUrl = getFullImageUrl(image);
                    return (
                      <div 
                        key={imgIndex} 
                        className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100"
                      >
                        {isVideoUrl(fullImageUrl) ? (
                          <VideoPlayer 
                            src={fullImageUrl} 
                            videoId={`${record._id}-${imgIndex}`}
                          />
                        ) : (
                          <Image
                            src={fullImageUrl}
                            alt={`采摘影像 ${imgIndex + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 40vw"
                            quality={75}
                            loading="lazy"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 底部信息：团队和链接 */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                {/* 采摘团队 - 显示队长信息 */}
                {record.team && record.team.members && record.team.members.length > 0 && (
                  <div className="flex items-center gap-3">
                    {/* 队长头像 */}
                    {(() => {
                      const leader = record.team.members[0]; // 第一个成员是队长
                      console.log(`🧑 [StoryTimeline] 队长信息:`, {
                        name: leader.name,
                        avatar_url: leader.avatar_url,
                        full_url: getFullImageUrl(leader.avatar_url),
                        date: formatDate(record.date)
                      });
                      
                        return leader.avatar_url ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={getFullImageUrl(leader.avatar_url)}
                            alt={leader.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                            quality={70}
                            sizes="40px"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium flex-shrink-0">
                          {leader.name?.[0] || '队'}
                        </div>
                      );
                    })()}
                    
                    {/* 队长名字和团队信息 */}
                    <div>
                      <p className="text-xs text-gray-500">采摘团队</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {record.team.members[0].name}团队（{record.team.members.length}人）
                      </p>
                    </div>
                  </div>
                )}

                {/* 回溯当日生长记录链接 */}
                <Link
                  href={getGrowthLink(record.date)}
                  className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium group"
                >
                  <span>查看当日生长记录</span>
                  <svg 
                    className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* 结尾节点：采集完成 - 连接到时间轴线 */}
        <div className="relative flex items-start">
        {/* 时间轴终点 - 完成图标 */}
        <div className="absolute left-0 w-8 h-8 bg-amber-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* 完成节点内容卡片 */}
        <div className="ml-12 flex-1 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl shadow-sm p-5 border border-amber-200">
          <h3 className="font-semibold text-base text-gray-900 mb-2">
            采集完成
          </h3>
          <p className="text-sm text-gray-700">
            历时共计 <span className="font-semibold text-amber-600">{dayCount}</span> 天，共计采集 <span className="font-semibold text-green-600">{totalWeight.toFixed(1)} kg</span>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
