'use client';

import { useState } from 'react';
import ValuePropositionCard from './ValuePropositionCard';
import StackedCards from './StackedCards';
import ScenarioCarousel from './ScenarioCarousel';
import PackageTabs from './PackageTabs';
import ProcessTimeline from './ProcessTimeline';
import ComparisonModal from './ComparisonModal';
import type { PrivatePlanData, ValueProposition, CustomerCase, Scenario, PackageData, ProcessStep } from '../types';

interface PrivatePlanProps {
  planData: PrivatePlanData | null;
}

export default function PrivatePlan({ planData }: PrivatePlanProps) {
  // 状态管理：控制对比弹窗
  const [showComparison, setShowComparison] = useState(false);

  // 默认数据（当后端数据不可用时使用）
  const defaultValuePropositions: ValueProposition[] = [
    {
      icon: '👑',
      title: '尊享专属',
      description: '当他人还在追逐品牌时，您已然拥有了品牌的源头',
    },
    {
      icon: '🔍',
      title: '可见的安心',
      description: '为您解密从一片嫩芽到一杯香茗的全过程，让"可见"成就"安心"',
    },
    {
      icon: '🎁',
      title: '身份的温度',
      description: '在重要场合，一份源自您私有茶园的茶礼，是您最不动声色的实力与品味象征',
    },
    {
      icon: '✨',
      title: '托管之悦',
      description: '将繁琐的茶园事务交给我们，您只负责享受成果与背后的那份尊荣',
    },
  ];

  const defaultCustomerCases: CustomerCase[] = [
    { id: '1', content: '刻有"王氏茶园"的专属地块铭牌。' },
    { id: '2', content: '印有家族姓氏的精美礼盒。' },
    { id: '3', content: '为友人定制的专属茶礼。' },
    { id: '4', content: '纪念日专属定制茶叶。' },
  ];

  const defaultScenarios: Scenario[] = [
    {
      id: '1',
      title: '私房好礼',
      icon: '🎁',
      pain_point: '礼物千篇一律？转身即忘',
      solution: '超越所有奢侈品，这是一个顶级的社交智慧。它传递了扎根土地的稳健、长线布局的远见和回归自然的哲学。这份礼物无需言语，却比任何话语都能好地述说您的实力与格局。',
      core_values: [
        { icon: '✨', title: '有面子，显品味' },
        { icon: '💝', title: '绝对走心，独一份' },
        { icon: '📝', title: '记忆点长久，"看得见"的心意' },
      ],
    },
  ];

  const defaultPackages: PackageData[] = [
    {
      id: 'standard',
      name: '核心体验',
      level: '标准',
      price: '¥18,800/年',
      targetAudience: '热爱茶文化、注重品质与性价比的茶友。',
      plotFeature: '0.3亩位于规范管理的优质生态茶区。',
      production: '年产精制高级绿茶约5-8斤。',
      rights: [],
    },
  ];

  const defaultProcessSteps: ProcessStep[] = [
    {
      id: '1',
      icon: '💬',
      title: '初步洽谈与需求沟通',
      description: '通过「立即咨询」发起联系，顾问24小时内回电。',
    },
  ];

  // 使用后端数据或降级到默认值
  const marketingTitle = planData?.marketing_header?.title || '从消费奢侈 到创造私享';
  const marketingSubtitle = planData?.marketing_header?.subtitle || '茶如人 百味皆私享';
  const valuePropositions = planData?.value_propositions || defaultValuePropositions;
  
  // 转换客户案例格式
  const customerCases: CustomerCase[] = planData?.customer_cases 
    ? planData.customer_cases.map((item, index) => ({
        id: String(index + 1),
        content: item.text,
        image_url: item.image_url,
      }))
    : defaultCustomerCases;

  // 转换场景应用格式
  const scenarios: Scenario[] = planData?.scenario_applications
    ? planData.scenario_applications.map((item, index) => ({
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

  // 转换套餐格式
  const packages: PackageData[] = planData?.packages
    ? planData.packages.map((pkg, index) => {
        return {
          id: ['standard', 'premium', 'vip'][index] || `package-${index}`,
          name: pkg.tagline,  // 副标题用作套餐简称
          level: pkg.name,    // 套餐名称用作显示标签
          price: pkg.price,
          targetAudience: pkg.target_audience,
          plotFeature: pkg.area_features,
          production: pkg.exclusive_output,
          rights: pkg.rights || [],
        };
      })
    : defaultPackages;

  // 转换流程步骤格式
  const processSteps: ProcessStep[] = planData?.process_steps
    ? planData.process_steps.map((step) => {
        // 从标题中提取图标（如果有emoji）
        const emojiRegex = /^([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/;
        const iconMatch = step.title.match(emojiRegex);
        const icon = iconMatch ? iconMatch[0] : ['💬', '🗺️', '📄', '🌟', '💳', '🎊'][step.step - 1] || '📌';
        const title = step.title.replace(emojiRegex, '').replace(/^\s+/, '');
        
        return {
          id: String(step.step),
          icon,
          title,
          description: step.description,
        };
      })
    : defaultProcessSteps;

  // 套餐对比数据（从后端API获取，如果没有则使用默认值）
  const comparisonPackageNames = planData?.comparison_package_names || ['标准套餐', '尊享套餐', 'VIP套餐'];
  const comparisonFeatures = planData?.comparison_features || [
    {
      icon: '🌱',
      feature_name: '地块面积',
      values: ['0.3亩', '0.5亩', '1亩']
    },
    {
      icon: '🍃',
      feature_name: '茶树数量',
      values: ['30棵', '50棵', '100棵']
    },
    {
      icon: '📦',
      feature_name: '年度产茶',
      values: ['5斤', '10斤', '20斤']
    },
    {
      icon: '🎁',
      feature_name: '专属礼盒',
      values: ['基础版', '精装版', '豪华版']
    },
    {
      icon: '👨‍🌾',
      feature_name: '专属茶农',
      values: ['否', '是', '是']
    },
    {
      icon: '📸',
      feature_name: '实时监控',
      values: ['基础', '标准', '高清']
    },
  ];

  return (
    <div className="space-y-16 md:space-y-20">
      {/* 营销标题 */}
      <section className="text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-800 mb-4" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          {marketingTitle}
        </h2>
        <p className="text-xl md:text-2xl text-stone-600" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          {marketingSubtitle}
        </p>
      </section>

      {/* 核心价值主张 */}
      <section>
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-stone-800">核心价值主张</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {valuePropositions.map((prop, index) => (
            <ValuePropositionCard key={index} {...prop} />
          ))}
        </div>
      </section>

      {/* 客户案例 */}
      <section>
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-stone-800">客户案例</h3>
        <div className="mb-16">
          <StackedCards cards={customerCases} />
        </div>
      </section>

      {/* 场景化应用探索 */}
      <section>
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-stone-800">场景化应用探索</h3>
        <ScenarioCarousel scenarios={scenarios} />
      </section>

      {/* 定制套餐对比 */}
      <section data-section="packages">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-stone-800">定制套餐对比</h3>
          <button 
            onClick={() => setShowComparison(true)}
            className="bg-gradient-to-r from-[#C5A572] to-[#B89562] text-white 
                       px-5 md:px-6 py-2 md:py-2.5 rounded-lg text-sm md:text-base font-semibold 
                       hover:shadow-lg hover:scale-105 
                       transition-all duration-300 flex items-center gap-2
                       whitespace-nowrap"
          >
            <span className="text-base md:text-lg">📊</span>
            <span>一键对比三种套餐</span>
          </button>
        </div>
        <PackageTabs packages={packages} defaultPackage="尊享" />
      </section>

      {/* 领养流程 */}
      <section>
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-stone-800">领养流程</h3>
        <ProcessTimeline steps={processSteps} />
      </section>

      {/* CTA按钮 */}
      <section className="text-center pb-8">
        <button className="bg-[#C5A572] text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#B89562] transition-colors shadow-lg hover:shadow-xl">
          立即咨询
        </button>
      </section>

      {/* 套餐对比弹窗 */}
      {showComparison && (
        <ComparisonModal 
          packageNames={comparisonPackageNames}
          features={comparisonFeatures}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
}
