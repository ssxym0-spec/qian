// 云养茶园页面相关类型定义
// 数据结构匹配后端 API 返回格式

// 私人定制方案数据结构
export interface PrivatePlanData {
  type: 'private';
  marketing_header: {
    title: string;
    subtitle: string;
  };
  value_propositions: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  customer_cases: Array<{
    image_url?: string;
    text: string;
  }>;
  scenario_applications: Array<{
    title: string;
    icon?: string;
    pain_point?: string;
    solution?: string;
    background_image?: string;
    core_values?: Array<{
      icon?: string;
      title: string;
      description?: string;
    }>;
    // 兼容旧格式
    content?: string;
  }>;
  packages: Array<{
    name: string;
    tagline: string;
    price: string;
    target_audience: string;
    area_features: string;
    exclusive_output: string;
    rights: Array<{
      icon?: string;
      title: string;
      description: string;
    }>;
  }>;
  process_steps: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  // 套餐对比相关字段
  comparison_package_names?: string[];
  comparison_features?: Array<{
    icon?: string;
    feature_name: string;
    values: string[];
  }>;
}

// 企业领养方案数据结构
export interface EnterprisePlanData {
  type: 'enterprise';
  marketing_header: {
    title: string;
    subtitle: string;
  };
  customer_cases: Array<{
    image_url?: string;
    text: string;
  }>;
  // 企业定制的使用场景字段（后端API标准字段）
  use_scenarios?: Array<{
    title: string;
    icon?: string;
    pain_point?: string;
    solution?: string;
    background_image?: string;
    core_values?: Array<{
      icon?: string;
      title: string;
      description?: string;
    }>;
    content?: string;
  }>;
  // 向后兼容字段（旧版本可能使用此字段名）
  scenario_applications?: Array<{
    title: string;
    icon?: string;
    pain_point?: string;
    solution?: string;
    background_image?: string;
    core_values?: Array<{
      icon?: string;
      title: string;
      description?: string;
    }>;
    // 兼容旧格式
    content?: string;
  }>;
  service_contents: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  process_steps: Array<{
    step: number;
    title: string;
    description: string;
  }>;
}

// B端合作方案数据结构
export interface B2BPlanData {
  type: 'b2b';
  description: string;
}

// API 响应结构
export interface AdoptionPlansResponse {
  success: boolean;
  data: {
    private: PrivatePlanData;
    enterprise: EnterprisePlanData;
    b2b: B2BPlanData;
  };
}

// 组件使用的简化类型
export interface ValueProposition {
  icon: string;
  title: string;
  description: string;
}

export interface CustomerCase {
  id: string;
  content: string;
  image_url?: string;
}

export interface Scenario {
  id: string;
  title: string;
  icon?: string;
  pain_point?: string;
  solution?: string;
  background_image?: string;
  core_values?: Array<{
    icon?: string;
    title: string;
    description?: string;
  }>;
  // 兼容旧格式
  content?: string;
}

export interface PackageData {
  id: string;
  name: string;
  level: string;
  price: string;
  targetAudience: string;
  plotFeature: string;
  production: string;
  rights: Array<{
    title: string;
    description: string;
  }>;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  id: string;
  icon: string;
  title: string;
  description: string;
}

