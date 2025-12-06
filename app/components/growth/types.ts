// 生长过程页数据类型定义

/**
 * 每日日志记录
 * 支持新旧两种 API 数据格式
 */
export interface DailyLog {
  date: string; // 格式: YYYY-MM-DD
  plot_name: string; // 地块名称（旧格式）
  recorder: string; // 记录人（旧格式）
  weather: string | WeatherInfo; // 天气（旧格式为字符串，新格式为对象）
  temperature_range: string; // 温度范围，如 "17~23°C"（旧格式）
  summary: string; // 核心日志摘要
  full_description: string; // 完整的生长日记
  images: string[]; // 图片URL数组（旧格式）
  
  // 环境数据
  sunlight_hours: number; // 日照时长（小时）
  rainfall: number; // 降水量（毫米）
  avg_temperature: number; // 平均温度（摄氏度）
  humidity: number; // 湿度（百分比）
  
  // 农事活动
  farm_activities: string | null; // 当日农事活动
  phenological_observation: string | null; // 物候观察
  
  // 异常处理
  is_abnormal: boolean; // 是否有异常
  abnormal_description: string | null; // 异常描述
  abnormal_solution: string | null; // 异常处理方法
  
  // 新格式字段
  main_image_url?: string; // 主图URL（新格式）
  plot_info?: PlotInfo; // 地块信息（新格式）
  plot_id?: PlotInfo; // 地块信息（最新格式，使用 populate）
  recorder_id?: RecorderInfo; // 记录人信息（新格式，使用 populate）
  recorder_name?: string; // 记录人姓名（新格式备用字段）
  status_tag?: StatusTag; // 状态标签（新格式）
  
  // 🆕 采摘相关字段
  has_harvest?: boolean; // 是否有采摘记录
  harvest_count?: number; // 采摘次数
  harvest_total_weight?: number; // 当日采摘总重量(kg)
  harvest_leader_name?: string; // 采摘队长姓名
  harvest_leader_avatar?: string; // 采摘队长头像URL
  harvest_team_count?: number; // 采摘团队人数
  harvest_records?: HarvestRecord[]; // 完整采摘记录数组
}

/**
 * 天气信息（新格式）
 */
export interface WeatherInfo {
  icon?: string; // 天气图标名称（如"晴天"）
  svg_icon?: string; // 🆕 后端上传的SVG图标URL
  temperature_range?: string; // 温度范围
}

/**
 * 地块信息
 */
export interface PlotInfo {
  name: string; // 地块名称
}

/**
 * 记录人信息
 */
export interface RecorderInfo {
  name: string; // 记录人姓名
  avatar_url?: string; // 记录人头像URL
}

/**
 * 状态标签
 */
export interface StatusTag {
  text: string; // 标签文本
  color: string; // 标签颜色（hex格式）
}

/**
 * 🆕 采摘记录
 */
export interface HarvestRecord {
  id: string; // 采摘记录ID
  weight: number; // 采摘重量(kg)
  leader_name: string; // 队长姓名
  member_count: number; // 团队人数
  leader_avatar?: string; // 队长头像URL
  assigned_batch_id?: string | null; // 归属的批次ID，null表示未归属
}

/**
 * 月度汇总记录
 * 支持新旧两种 API 数据格式
 */
export interface MonthlySummary {
  year_month?: string; // 格式: YYYY-MM（最新字段名）
  month?: string; // 格式: YYYY-MM（旧字段名，向后兼容）
  
  // 视频相关（新旧API兼容）
  video_url?: string; // 汇总视频URL
  video_thumbnail?: string; // 视频缩略图URL
  
  // 精选影像资料（新旧API兼容）
  detail_gallery?: string[]; // 新API: detail_gallery
  images?: string[]; // 旧API: images
  
  // 采摘统计（新旧API兼容）
  harvest_stats?: { // 新API: harvest_stats 对象
    count: number;
    total_weight: number;
  };
  harvest_count?: number; // 旧API: harvest_count
  total_harvest_weight?: number; // 旧API: total_harvest_weight
  
  // 农事日历：日期 -> 农事活动（可选，后端可能未提供）
  farm_calendar?: Array<{
    date: string; // 格式: MM-DD 或 M月D日
    activity: string;
  }>;
  
  // 异常处理记录（新旧API兼容）
  abnormal_summary?: Array<{ // 新API: abnormal_summary
    date: string;
    issue?: string;           // 最新字段：异常问题
    measures?: string;        // 最新字段：采取的措施
    description?: string;     // 旧字段兼容
    solution?: string;        // 旧字段兼容
  }>;
  abnormal_records?: Array<{ // 旧API: abnormal_records
    date: string;
    issue?: string;
    measures?: string;
    description?: string;
    solution?: string;
  }>;
  
  // 气候数据（新旧API兼容）
  climate_summary?: { // 新API: climate_summary 对象
    avg_temp?: string | number;           // 最新字段：平均气温（可能带单位）
    total_precipitation?: string | number; // 最新字段：总降水量（可能带单位）
    avg_temperature?: number;              // 旧字段兼容
    total_rainfall?: number;               // 旧字段兼容
  };
  avg_temperature?: number; // 旧API: avg_temperature
  total_rainfall?: number; // 旧API: total_rainfall
  
  // 下月计划（可选，后端可能未提供）
  next_month_plan?: string[] | string; // 支持数组或字符串
  
  // 制茶师信息（可选，后端可能返回完整对象）
  tea_master?: {
    name: string;
    avatarUrl?: string;
    role?: string;
    experienceYears?: number;
  };
  teaMaster?: {
    name: string;
    avatarUrl?: string;
    role?: string;
    experienceYears?: number;
  };
}

/**
 * API 响应数据结构
 * 注意：支持两种命名方式以兼容不同的 API 返回格式
 */
export interface GrowthData {
  daily_logs?: DailyLog[]; // 下划线命名（旧格式）
  dailyLogs?: DailyLog[]; // 驼峰命名（新格式）
  monthly_summary?: MonthlySummary | null; // 下划线命名（旧格式）
  monthlySummary?: MonthlySummary | null; // 驼峰命名（新格式）
}

