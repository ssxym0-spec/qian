/**
 * 批次追溯页面的类型定义
 */

// ==================== 等级信息 ====================

/**
 * 成品等级信息
 */
export interface Grade {
  _id: string;
  name: string; // 等级名称：优选、匠作、臻品等
  badge_url?: string; // 徽章图片URL
}

// ==================== 采摘记录 ====================

/**
 * 采摘团队成员
 */
export interface TeamMember {
  name: string;
  avatar_url?: string;
}

/**
 * 采摘团队
 */
export interface HarvestTeam {
  team_name: string;
  members: TeamMember[];
}

/**
 * 采摘记录（单日）
 */
export interface HarvestRecord {
  _id: string;
  date: string; // ISO 格式日期字符串
  weight_kg: number; // 采摘鲜叶重量（公斤）
  weather: string | { // 天气描述（支持字符串或对象格式）
    icon?: string; // 天气名称（如"晴天"）
    svg_icon?: string; // 🆕 后端上传的SVG图标URL
    temperature_range?: string; // 温度范围
  };
  temperature?: string; // 温度（可选）
  images: string[]; // 当日影像（图片和视频）
  team: HarvestTeam; // 采摘团队
}

// ==================== 制作批次 ====================

/**
 * 制茶师信息
 */
export interface TeaMaster {
  name: string;
  avatar_url?: string;
  title?: string; // 职称，如"高级制茶师"
  experience_years?: number; // 经验年份
}

/**
 * 制作工艺步骤
 */
export interface ProductionStep {
  step_name: string; // 步骤名称：摊晾、杀青、揉捻、干燥、分拣
  craft_type: 'manual' | 'modern'; // 工艺类型：manual=手工匠心、modern=现代工艺
  craft_details: {
    media_urls: string[]; // 工艺图片/视频
    purpose?: string; // 工艺目的
    method?: string; // 操作方法
    sensory_change?: string; // 感官变化
    value?: string; // 工艺价值
  };
}

/**
 * 品鉴报告
 */
export interface TastingReport {
  tasting_notes: string; // 完整品鉴笔记
  brewing_guide: string; // 冲泡建议
  storage_guide: string; // 储存建议
}

/**
 * 成品展示
 */
export interface ProductDisplay {
  dry_tea_image: string; // 成品干茶图片
  brewed_tea_image: string; // 开水泡开后的图片
}

/**
 * 批次详情（完整数据）
 */
export interface BatchDetail {
  _id: string;
  batch_number: string; // 批次号，如 "MQ-20250328-01"
  category_name: string; // 品类：明前茶、雨前茶、春茶、夏茶、秋茶（后端字段名）
  grade?: string; // 成品等级（旧字段，兼容性保留）
  grade_id?: Grade; // 成品等级对象（新字段）
  title?: string; // 诗意标题，如 "年度至臻 静候春雷"
  summary?: string; // 摘要，如 "由3月25日至28日，四日晨露之精华汇聚"
  notes?: string; // 批次备注（后端字段名）
  
  // 成品信息
  final_product_weight_kg?: number; // 成品产量（公斤）（后端字段名）
  tea_master?: TeaMaster; // 制茶大师
  
  // 媒体素材
  cover_image_url?: string; // 封面图片（后端字段名）
  images_and_videos?: string[]; // 其他媒体素材
  
  // 关联的采摘记录（已填充详细信息）
  harvest_records_ids?: HarvestRecord[];
  
  // 制作工艺
  production_steps?: ProductionStep[];
  
  // 成品鉴赏
  product_display?: ProductDisplay;
  tasting_report?: TastingReport;
  
  // 核心工艺与风味特征（用于列表卡片）
  core_craft?: string;
  flavor_profile?: string;
  
  created_at?: string;
  updated_at?: string;
}

/**
 * 批次列表项（简化数据，用于列表展示）
 */
export interface BatchListItem {
  _id: string;
  batch_number: string;
  category_name: string; // 后端返回的是 category_name
  category?: string; // 品类字段（可选，用于兼容不同的后端返回格式）
  grade?: string; // 成品等级（旧字段，兼容性保留）
  grade_id?: Grade; // 成品等级对象（新字段）
  title?: string;
  summary?: string;
  notes?: string; // 后端批次备注字段
  tea_master?: TeaMaster;
  cover_image_url?: string; // 后端返回的是 cover_image_url，不是 hero_media
  core_craft?: string;
  flavor_profile?: string;
  harvest_days_count?: number; // 采摘天数
  harvest_records_count?: number;
  images_and_videos?: string[];
}
