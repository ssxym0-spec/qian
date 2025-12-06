// 场景化应用类型定义

export interface CoreValue {
  icon: string;
  title: string;
  description?: string;
}

export interface Scenario {
  id?: string;
  title: string;
  icon?: string;
  pain_point?: string;
  solution?: string;
  background_image?: string;
  core_values?: CoreValue[];
}

export type PlanType = 'private' | 'enterprise';

export interface AdoptionPlan {
  type: PlanType;
  scenario_applications: Scenario[];
}

