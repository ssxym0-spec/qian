/**
 * 天气模板工具函数
 * 用于从后端加载天气图标映射表
 */

interface WeatherTemplate {
  _id: string;
  name: string;
  svg_icon: string;
  temperature_range?: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
}

interface WeatherTemplatesResponse {
  success: boolean;
  data: {
    templates: WeatherTemplate[];
    iconMap: { [key: string]: string };
  };
  count: number;
}

/**
 * 全局天气图标映射表
 */
let weatherIconMap: { [key: string]: string } = {};

/**
 * 加载状态跟踪
 */
let isLoading = false;
let isLoaded = false;
let loadPromise: Promise<void> | null = null;

/**
 * 加载天气模板，构建图标映射表
 * 🆕 添加缓存机制，防止重复加载
 */
export async function loadWeatherTemplates(): Promise<void> {
  // 如果已经加载完成，直接返回
  if (isLoaded) {
    console.log('✅ [WeatherTemplates] 天气模板已缓存，跳过加载');
    return;
  }
  
  // 如果正在加载中，返回现有的Promise，避免重复请求
  if (isLoading && loadPromise) {
    console.log('⏳ [WeatherTemplates] 天气模板正在加载中，等待完成...');
    return loadPromise;
  }
  
  // 开始新的加载
  isLoading = true;
  loadPromise = (async () => {
    try {
      console.log('🔄 [WeatherTemplates] 开始加载天气模板...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/public/weather-templates`, {
        cache: 'no-store', // 不缓存，每次都获取最新数据
      });
      
      console.log('🔄 [WeatherTemplates] API响应状态:', response.status);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const result: WeatherTemplatesResponse = await response.json();
      console.log('🔄 [WeatherTemplates] API返回数据:', result);
      
      if (result.success && result.data) {
        weatherIconMap = result.data.iconMap;
        isLoaded = true; // 标记为已加载
        console.log('✅ [WeatherTemplates] 天气图标映射已加载，共', Object.keys(weatherIconMap).length, '个图标');
        console.log('✅ [WeatherTemplates] 映射表详情:', weatherIconMap);
      } else {
        console.warn('⚠️ [WeatherTemplates] API返回数据格式不正确:', result);
        weatherIconMap = {};
      }
    } catch (error) {
      console.error('❌ [WeatherTemplates] 加载天气模板失败:', error);
      // 失败时使用空映射表，降级到预设图标
      weatherIconMap = {};
    } finally {
      isLoading = false;
    }
  })();
  
  return loadPromise;
}

/**
 * 获取天气图标URL
 * @param weatherName 天气名称，如"晴天"
 * @returns SVG图标URL，如果没有找到则返回null
 */
export function getWeatherIconUrl(weatherName: string): string | null {
  const url = weatherIconMap[weatherName] || null;
  console.log(`🔍 [WeatherTemplates] 查找天气图标: "${weatherName}" -> ${url || '未找到'}`);
  return url;
}

/**
 * 获取完整的天气图标映射表
 */
export function getWeatherIconMap(): { [key: string]: string } {
  return weatherIconMap;
}

/**
 * 检查天气模板是否已加载
 */
export function isWeatherTemplatesLoaded(): boolean {
  return isLoaded;
}

