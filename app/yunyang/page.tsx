import AdoptionPageClientWrapper from './components/AdoptionPageClientWrapper';
import type { AdoptionPlansResponse, PrivatePlanData, EnterprisePlanData, B2BPlanData } from './types';
import { getApiUrl } from '../utils/apiConfig';

function isLikelyBase64(value: string): boolean {
  return /^[A-Za-z0-9+/=]+$/.test(value) && value.length > 40;
}

function normalizeImageSource(value?: string | null): string | undefined {
  if (!value || typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith('data:')) return trimmed;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }
  if (isLikelyBase64(trimmed)) {
    return `data:image/png;base64,${trimmed}`;
  }
  return trimmed;
}

function ensureArray<T>(value: T[] | undefined, fallback: T[] = []): T[] {
  return Array.isArray(value) ? value : fallback;
}

function normalizeCustomerCases(rawCases: any[]): Array<{ text: string; image_url?: string }> {
  return ensureArray(rawCases).map((item: any) => ({
    text: item?.text ?? item?.quote ?? '',
    image_url: normalizeImageSource(item?.image_url ?? item?.logo ?? item?.imageUrl),
  }));
}

function normalizeScenarioApplications(rawScenarios: any[]): Array<any> {
  return ensureArray(rawScenarios).map((item: any) => ({
    title: item?.title ?? '',
    icon: item?.icon,
    pain_point: item?.pain_point ?? item?.painPoint ?? '',
    solution: item?.solution ?? item?.description ?? '',
    background_image: item?.background_image ?? item?.imageUrl ?? '',
    core_values: ensureArray(item?.core_values ?? item?.coreValues),
    content: item?.content ?? item?.description ?? '',
  }));
}

function normalizeComparisonFeatures(rawFeatures: any[]): Array<{ icon?: string; feature_name: string; values: string[] }> {
  return ensureArray(rawFeatures).map((item: any) => ({
    icon: item?.icon ?? item?.emoji,
    feature_name: item?.feature_name ?? item?.featureName ?? '',
    values: ensureArray<string>(item?.values),
  }));
}

function normalizePrivatePlan(raw: any): PrivatePlanData {
  if (!raw) return null as unknown as PrivatePlanData;
  const marketingHeader = raw?.marketing_header ?? raw?.marketingHeader ?? { title: '', subtitle: '' };
  return {
    type: 'private',
    marketing_header: marketingHeader,
    value_propositions: ensureArray(raw?.value_propositions ?? raw?.valuePropositions),
    customer_cases: normalizeCustomerCases(raw?.customer_cases ?? raw?.customerCases ?? []),
    scenario_applications: normalizeScenarioApplications(raw?.scenario_applications ?? raw?.scenarioApplications ?? []),
    packages: ensureArray(raw?.packages),
    process_steps: ensureArray(raw?.process_steps ?? raw?.processSteps),
    comparison_package_names: ensureArray(raw?.comparison_package_names ?? raw?.comparisonPackageNames),
    comparison_features: normalizeComparisonFeatures(raw?.comparison_features ?? raw?.comparisonFeatures ?? []),
  };
}

function normalizeEnterprisePlan(raw: any): EnterprisePlanData {
  if (!raw) return null as unknown as EnterprisePlanData;
  return {
    type: 'enterprise',
    marketing_header: raw?.marketing_header ?? raw?.marketingHeader ?? { title: '', subtitle: '' },
    customer_cases: ensureArray(raw?.customer_cases ?? raw?.customerCases),
    use_scenarios: ensureArray(
      raw?.use_scenarios ?? raw?.useScenarios ?? raw?.scenario_applications ?? raw?.scenarioApplications
    ),
    scenario_applications: ensureArray(raw?.scenario_applications ?? raw?.scenarioApplications),
    service_contents: ensureArray(raw?.service_contents ?? raw?.serviceContents),
    process_steps: ensureArray(raw?.process_steps ?? raw?.processSteps),
  };
}

function normalizeB2BPlan(raw: any): B2BPlanData {
  if (!raw) return null as unknown as B2BPlanData;
  return {
    type: 'b2b',
    description: raw?.description ?? '',
  };
}

/**
 * 云养茶园页 - 服务器组件
 * 负责从后端API获取数据，然后传递给客户端组件处理交互
 * 
 * 缓存配置：完全禁用所有缓存，确保数据实时性
 */

// 强制动态渲染，禁用静态生成
export const dynamic = 'force-dynamic';
// 禁用路由缓存
export const revalidate = 0;
// 禁用fetch缓存
export const fetchCache = 'force-no-store';

// 服务器组件 - 负责从后端API获取数据
export default async function YunYangPage() {
  let privatePlan: PrivatePlanData | null = null;
  let enterprisePlan: EnterprisePlanData | null = null;
  let b2bPlan: B2BPlanData | null = null;
  
  try {
    const response = await fetch(getApiUrl('/api/public/adoption-plans'), {
      cache: 'no-store', // 不缓存，每次都获取最新数据
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('后端服务认证失败，请检查后端配置。公开接口不应需要认证。');
      }
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const result: AdoptionPlansResponse = await response.json();
    
    // 检查API返回是否成功
    if (result.success && result.data) {
      const personalPlanRaw = (result.data as any).private ?? (result.data as any).personal;
      const enterprisePlanRaw = (result.data as any).enterprise ?? (result.data as any).corporate;
      const b2bPlanRaw = (result.data as any).b2b ?? (result.data as any).cooperation;

      privatePlan = personalPlanRaw ? normalizePrivatePlan(personalPlanRaw) : null;
      enterprisePlan = enterprisePlanRaw ? normalizeEnterprisePlan(enterprisePlanRaw) : null;
      b2bPlan = b2bPlanRaw ? normalizeB2BPlan(b2bPlanRaw) : null;
    } else {
      console.error('API returned unsuccessful response:', result);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    console.error('Error fetching adoption plans:', errorMessage);
    
    // 提供更详细的错误信息
    if (errorMessage.includes('401') || errorMessage.includes('认证')) {
      console.warn('⚠️ 提示: /api/public/adoption-plans 是公开接口，不应需要认证');
      console.warn('⚠️ 请检查后端服务是否正常运行');
    }
    
    // 如果API调用失败，组件将使用降级方案显示默认内容
  }

  // 将数据传递给客户端组件处理交互
  return (
    <AdoptionPageClientWrapper
      privatePlan={privatePlan}
      enterprisePlan={enterprisePlan}
      b2bPlan={b2bPlan}
    />
  );
}

