'use client';

import StackedCards from './StackedCards';
import ScenarioCarousel from './ScenarioCarousel';
import ProcessTimeline from './ProcessTimeline';
import type { EnterprisePlanData, CustomerCase, Scenario, Service, ProcessStep } from '../types';

interface EnterprisePlanProps {
  planData: EnterprisePlanData | null;
}

export default function EnterprisePlan({ planData }: EnterprisePlanProps) {
  // 调试：打印接收到的数据
  console.log('=== EnterprisePlan 调试信息 ===');
  console.log('planData:', planData);
  console.log('use_scenarios:', planData?.use_scenarios);
  console.log('use_scenarios 长度:', planData?.use_scenarios?.length);
  
  // 默认数据（当后端数据不可用时使用）
  const defaultCustomerCases: CustomerCase[] = [
    { id: '1', content: '某科技公司：将茶园作为企业文化的核心象征。' },
    { id: '2', content: '某金融集团：以茶礼维系核心客户关系。' },
    { id: '3', content: '某制造企业：年会奖励核心员工的专属茶园茶礼。' },
    { id: '4', content: '某咨询公司：国际合作伙伴的文化名片。' },
  ];

  const defaultScenarios: Scenario[] = [
    {
      id: '1',
      title: '场景一：顶级客户关系"破冰与升温"',
      content: '在与顶级客户的首次会面、重要签约或传统节庆时，您呈上的不再是常规礼品，而是一份源自您企业专属茶园、承载着四季风土故事的茶礼。\n\n这份礼物以其无可复制的故事性和真诚度，瞬间超越了所有奢侈品。它将一次商业会晤，升华为一场关于品味与信任的深度交流。',
    },
  ];

  const defaultServices: Service[] = [
    {
      icon: '🏷️',
      title: '地块冠名权与标识设立',
      description: '在茶园核心产区为您甄选并划定专属地块。',
    },
  ];

  const defaultProcessSteps: ProcessStep[] = [
    {
      id: '1',
      icon: '💬',
      title: '需求沟通',
      description: '与您深度沟通，了解企业需求、预算及期望。',
    },
  ];

  // 使用后端数据或降级到默认值
  const marketingTitle = planData?.marketing_header?.title || '当别人还在送烟酒 您已经在送山头';
  const marketingSubtitle = planData?.marketing_header?.subtitle || '在您的社交名片上 除了头衔 还有一座茶园';
  
  // 转换客户案例格式
  const customerCases: CustomerCase[] = planData?.customer_cases
    ? planData.customer_cases.map((item, index) => ({
        id: String(index + 1),
        content: item.text,
        image_url: item.image_url,
      }))
    : defaultCustomerCases;

  // 转换使用场景格式
  // 企业定制使用 use_scenarios 字段（后端API标准字段）
  // 向后兼容 scenario_applications 字段（旧字段名）
  const scenarioData = planData?.use_scenarios || planData?.scenario_applications;
  const scenarios: Scenario[] = scenarioData
    ? scenarioData.map((item: any, index: number) => ({
        id: String(index + 1),
        title: item.title,
        icon: item.icon,
        pain_point: item.pain_point,
        solution: item.solution,
        background_image: item.background_image,
        core_values: item.core_values,
        content: item.content, // 兼容旧格式
      }))
    : defaultScenarios;
  
  // 调试：打印转换后的场景数据
  console.log('转换后的 scenarios:', scenarios);
  console.log('scenarios 长度:', scenarios.length);
  console.log('使用的字段:', planData?.use_scenarios ? 'use_scenarios' : 'scenario_applications');

  // 服务内容
  const services: Service[] = planData?.service_contents || defaultServices;

  // 转换流程步骤格式
  const processSteps: ProcessStep[] = planData?.process_steps
    ? planData.process_steps.map((step) => {
        // 从标题中提取图标（如果有emoji）
        const iconMatch = step.title.match(/^([\u{1F000}-\u{1F9FF}])/u);
        const icon = iconMatch ? iconMatch[0] : ['💬', '📋', '💰', '📄', '🌟', '💳', '✅'][step.step - 1] || '📌';
        const title = step.title.replace(/^[\u{1F000}-\u{1F9FF}]\s*/u, '');
        
        return {
          id: String(step.step),
          icon,
          title,
          description: step.description,
        };
      })
    : defaultProcessSteps;

  return (
    <div className="space-y-8 md:space-y-12">
      {/* 营销标题 */}
      <section className="text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-800 mb-4" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          {marketingTitle.split(' ').map((line, index) => (
            <span key={index}>
              {line}
              {index === 0 && <br className="md:hidden" />}
            </span>
          ))}
        </h2>
        <p className="text-lg md:text-xl lg:text-2xl text-stone-600" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          {marketingSubtitle}
        </p>
      </section>

      {/* 客户案例 */}
      <section>
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-stone-800">客户案例</h3>
        <div className="mb-8">
          <StackedCards cards={customerCases} />
        </div>
      </section>

      {/* 核心应用场景 */}
      <section>
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-stone-800" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          让一份茶礼 重构每一种关系
        </h3>
        <ScenarioCarousel scenarios={scenarios} />
      </section>

      {/* 服务内容 */}
      <section>
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-stone-800">服务内容</h3>
        <div className="space-y-3">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-2">
                <div className="text-3xl flex-shrink-0">{service.icon}</div>
                <h4 className="text-lg md:text-xl font-bold text-stone-500">{service.title}</h4>
              </div>
              <p className="text-stone-700 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 合作流程 */}
      <section>
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-stone-800">合作流程</h3>
        <ProcessTimeline steps={processSteps} />
      </section>

      {/* CTA按钮 */}
      <section className="text-center pb-8">
        <button className="bg-[#C5A572] text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#B89562] transition-colors shadow-lg hover:shadow-xl">
          立即咨询
        </button>
      </section>
    </div>
  );
}
