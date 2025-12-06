/**
 * DailyLog 数据适配器
 * 统一处理新旧两种 API 数据格式
 */

import { DailyLog, WeatherInfo } from './types';
import { weatherIconMapping } from './WeatherIcons';
import { getWeatherIconUrl } from '../../utils/weatherTemplates';

/**
 * 扩展的 DailyLog 类型，包含新 API 字段
 */
export type ExtendedDailyLog = DailyLog & {
  // 新 API 字段（全部可选扩展）
  main_image_url?: string;
  mainImageUrl?: string;
  weather?: string | (WeatherInfo & { svg_icon?: string });
  plot_info?: {
    name: string;
  };
  plot_id?: {
    name: string;
  };
  status_tag?: {
    text: string;
    color: string;
  };
  media_urls?: string[];
  mediaUrls?: string[];
  images_and_videos?: string[];
  imagesAndVideos?: string[];
  // 🆕 最新接口：完整的记录人对象（含 name 与 avatarUrl）
  recorder?: {
    name?: string;
    avatarUrl?: string;
    avatar_url?: string;
    role?: string;
  };
};

/**
 * 获取主图 URL
 */
export function getMainImageUrl(log: ExtendedDailyLog): string | null {
  const anyLog = log as any;
  // 优先使用新 API 的 main_image_url / mainImageUrl
  if (anyLog.main_image_url) {
    return anyLog.main_image_url;
  }
  if (anyLog.mainImageUrl) {
    return anyLog.mainImageUrl;
  }
  // 兼容新的媒体字段：media_urls / mediaUrls / images_and_videos / imagesAndVideos
  if (Array.isArray(anyLog.media_urls) && anyLog.media_urls.length > 0) {
    return anyLog.media_urls[0];
  }
  if (Array.isArray(anyLog.mediaUrls) && anyLog.mediaUrls.length > 0) {
    return anyLog.mediaUrls[0];
  }
  if (Array.isArray(anyLog.images_and_videos) && anyLog.images_and_videos.length > 0) {
    return anyLog.images_and_videos[0];
  }
  if (Array.isArray(anyLog.imagesAndVideos) && anyLog.imagesAndVideos.length > 0) {
    return anyLog.imagesAndVideos[0];
  }
  // 回退到旧 API 的 images 数组
  if (Array.isArray(log.images) && log.images.length > 0) {
    return log.images[0];
  }
  return null;
}

/**
 * 判断是否为视频文件
 */
export function isVideo(url: string): boolean {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
}

/**
 * 获取天气图标
 * 返回图标组件、SVG URL字符串或emoji字符串
 * 优先级：后端SVG URL > 预设图标组件 > emoji
 */
export function getWeatherIcon(
  log: ExtendedDailyLog
): React.ComponentType<React.SVGProps<SVGSVGElement>> | string {
  const weather = log.weather;
  
  console.log('🔍 [getWeatherIcon] 输入天气数据:', weather);
  
  // 🆕 新 API: 优先使用后端上传的SVG图标URL
  if (typeof weather === 'object' && weather?.svg_icon) {
    console.log('✅ [getWeatherIcon] 使用后端svg_icon:', weather.svg_icon);
    return weather.svg_icon; // 返回URL字符串
  }
  
  // 🆕 从天气模板映射表中获取SVG URL
  if (typeof weather === 'object' && weather?.icon) {
    const weatherName = weather.icon;
    console.log('🔍 [getWeatherIcon] 查找天气名称:', weatherName);
    const svgUrl = getWeatherIconUrl(weatherName);
    if (svgUrl) {
      console.log('✅ [getWeatherIcon] 从映射表找到URL:', svgUrl);
      return svgUrl; // 返回从后端加载的SVG URL
    }
    
    console.log('⚠️ [getWeatherIcon] 映射表中未找到，降级到预设图标');
    // 降级：使用预设图标组件
    // 精确匹配
    if (weatherIconMapping[weatherName]) {
      console.log('✅ [getWeatherIcon] 使用预设图标（精确匹配）:', weatherName);
      return weatherIconMapping[weatherName];
    }
    // 模糊匹配
    for (const key in weatherIconMapping) {
      if (weatherName.includes(key)) {
        console.log('✅ [getWeatherIcon] 使用预设图标（模糊匹配）:', key);
        return weatherIconMapping[key];
      }
    }
    // 默认晴天图标
    console.log('✅ [getWeatherIcon] 使用默认晴天图标');
    return weatherIconMapping['晴天'];
  }
  
  // 旧 API: weather 是字符串，转换为 emoji
  if (typeof weather === 'string') {
    const weatherStr = String(weather || '');
    console.log('⚠️ [getWeatherIcon] 旧格式（字符串），使用emoji:', weatherStr);
    if (weatherStr.includes('晴')) return '☀️';
    if (weatherStr.includes('云')) return '☁️';
    if (weatherStr.includes('雨')) return '🌧️';
    if (weatherStr.includes('雪')) return '❄️';
  }
  
  console.log('⚠️ [getWeatherIcon] 使用默认emoji');
  return '🌤️'; // 默认 emoji
}

/**
 * 获取温度范围
 */
export function getTemperatureRange(log: ExtendedDailyLog): string {
  const weather = log.weather;
  
  if (typeof weather === 'object' && weather?.temperature_range) {
    return weather.temperature_range;
  }
  
  return log.temperature_range || '—';
}

/**
 * 获取地块名称
 */
export function getPlotName(log: ExtendedDailyLog): string {
  const anyLog = log as any;
  // 优先使用最新的拍摄信息与 plot 对象
  return (
    anyLog.photo_info?.location ||
    anyLog.photoInfo?.location ||
    anyLog.photo_info?.plot_name ||
    anyLog.photoInfo?.plotName ||
    log.plot_id?.name ||
    anyLog.plotId?.name ||
    log.plot_info?.name ||
    anyLog.plotInfo?.name ||
    anyLog.plotName ||
    log.plot_name ||
    '未知地块'
  );
}

/**
 * 记录人信息
 */
export interface RecorderInfo {
  name: string;
  avatar_url: string | null;
}

/**
 * 获取记录人信息（包含姓名和头像）
 * 基于真实 JSON 结构：log.recorder { name, avatarUrl (camelCase), role, experienceYears }
 */
export function getRecorderInfo(log: ExtendedDailyLog): RecorderInfo {
  const anyLog = log as any;
  
  // 🎯 优先检查 log.recorder 对象（真实 JSON 中的字段）
  if (anyLog.recorder && typeof anyLog.recorder === 'object') {
    const recorder = anyLog.recorder;
    return {
      // 优先使用 recorder.name
      name: recorder.name || anyLog.recorder_name || anyLog.recorderName || '未知',
      // 🎯 优先使用 recorder.avatarUrl (camelCase，真实 JSON 中的字段名)
      avatar_url:
        recorder.avatarUrl ||
        recorder.avatar_url ||
        null,
    };
  }
  
  // 备用格式：recorder_id / recorderId 对象
  const recorderObj = anyLog.recorder_id || anyLog.recorderId;
  if (recorderObj && typeof recorderObj === 'object') {
    return {
      name: recorderObj.name || anyLog.recorder_name || anyLog.recorderName || '未知',
      avatar_url:
        recorderObj.avatarUrl ||
        recorderObj.avatar_url ||
        null,
    };
  }
  
  // 最后备用：仅有名字字符串，无头像
  const name =
    anyLog.recorder_name ||
    anyLog.recorderName ||
    (typeof anyLog.recorder === 'string' ? anyLog.recorder : '') ||
    log.recorder ||
    '未知';
  return {
    name,
    avatar_url: null,
  };
}

/**
 * 状态标签
 */
export interface StatusTag {
  text: string;
  color: string;
}

/**
 * 获取状态标签
 */
export function getStatusTag(log: ExtendedDailyLog): StatusTag | null {
  // 新 API: 直接使用 status_tag
  if (log.status_tag?.text) {
    return {
      text: log.status_tag.text,
      color: log.status_tag.color || '#8A2BE2',
    };
  }

  // 旧 API: 根据 is_abnormal 和 farm_activities 判断
  if (log.is_abnormal) {
    return {
      text: '异常',
      color: '#EF4444', // red-500
    };
  }

  if (log.farm_activities) {
    const activity = log.farm_activities;
    if (activity.includes('施肥')) {
      return { text: '施肥', color: '#22C55E' }; // green-500
    } else if (activity.includes('修剪')) {
      return { text: '修剪', color: '#3B82F6' }; // blue-500
    } else if (activity.includes('灌溉')) {
      return { text: '灌溉', color: '#06B6D4' }; // cyan-500
    } else if (activity.includes('采摘')) {
      return { text: '采摘', color: '#F59E0B' }; // amber-500
    } else {
      return { text: '农事', color: '#22C55E' }; // green-500
    }
  }

  return null;
}

/**
 * 格式化日期显示
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
}

