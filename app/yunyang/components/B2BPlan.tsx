'use client';

import type { B2BPlanData } from '../types';

interface B2BPlanProps {
  planData: B2BPlanData | null;
}

export default function B2BPlan({ planData }: B2BPlanProps) {
  // 默认描述（当后端数据不可用时使用）
  const defaultDescription = '我们提供茶叶供应链、定制生产、品牌合作等多种B端合作模式，欢迎联系洽谈。';
  
  // 使用后端数据或降级到默认值
  const description = planData?.description || defaultDescription;

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-10 md:p-12 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">🤝</div>
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-6">B端合作</h2>
        </div>
        
        <p className="text-stone-600 text-lg leading-relaxed mb-8 whitespace-pre-line">
          {description}
        </p>

        <div className="space-y-4 text-left bg-stone-50 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <span className="text-[#C5A572] text-xl">•</span>
            <span className="text-stone-700">茶叶供应链解决方案</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#C5A572] text-xl">•</span>
            <span className="text-stone-700">定制化生产服务</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#C5A572] text-xl">•</span>
            <span className="text-stone-700">品牌联名合作</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#C5A572] text-xl">•</span>
            <span className="text-stone-700">其他合作模式探讨</span>
          </div>
        </div>

        <button className="mt-8 bg-[#C5A572] text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#B89562] transition-colors shadow-lg hover:shadow-xl">
          联系洽谈
        </button>
      </div>
    </div>
  );
}

