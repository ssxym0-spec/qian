'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { PrivatePlanData, EnterprisePlanData, B2BPlanData } from '../types';

// 懒加载三个方案组件，只在需要时加载
const PrivatePlan = dynamic(() => import('./PrivatePlan'), {
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F59E0B]"></div>
    </div>
  ),
  ssr: false, // 仅在客户端渲染
});

const EnterprisePlan = dynamic(() => import('./EnterprisePlan'), {
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F59E0B]"></div>
    </div>
  ),
  ssr: false,
});

const B2BPlan = dynamic(() => import('./B2BPlan'), {
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F59E0B]"></div>
    </div>
  ),
  ssr: false,
});

interface Props {
  privatePlan: PrivatePlanData | null;
  enterprisePlan: EnterprisePlanData | null;
  b2bPlan: B2BPlanData | null;
}

export default function AdoptionPageClientWrapper({ 
  privatePlan,
  enterprisePlan,
  b2bPlan 
}: Props) {
  const [activeTab, setActiveTab] = useState<'private' | 'enterprise' | 'b2b'>('private');
  const [isTabSticky, setIsTabSticky] = useState(false);
  const [showMainTitle, setShowMainTitle] = useState(true);
  
  const tabsRef = useRef<HTMLDivElement>(null);
  const observerTargetRef = useRef<HTMLDivElement>(null);

  // 使用 IntersectionObserver 检测 Tabs 是否滚动到顶部
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 当观察目标离开视口时，Tabs应该变为粘性
        setIsTabSticky(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '-1px 0px 0px 0px', // 稍微偏移，确保准确检测
      }
    );

    if (observerTargetRef.current) {
      observer.observe(observerTargetRef.current);
    }

    return () => {
      if (observerTargetRef.current) {
        observer.unobserve(observerTargetRef.current);
      }
    };
  }, []);

  // 处理Tab切换
  const handleTabChange = (tab: 'private' | 'enterprise' | 'b2b') => {
    // 隐藏主副标题模块
    setShowMainTitle(false);
    
    // 切换标签
    setActiveTab(tab);
    
    // 滚动到Tabs顶部
    if (tabsRef.current) {
      const offset = isTabSticky ? 0 : tabsRef.current.offsetTop;
      window.scrollTo({
        top: offset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white pb-16">
      {/* 主副标题模块 - 只在首次加载或未切换时显示 */}
      {showMainTitle && (
        <div className="container mx-auto px-4 pt-8 pb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            故事的主人
          </h1>
          <p className="text-gray-600 text-sm" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            从追溯一段旅程，到亲身参与并拥有它的每一章
          </p>
        </div>
      )}

      {/* IntersectionObserver 观察目标 - 放在 Tabs 上方 */}
      <div ref={observerTargetRef} className="h-px" />

      {/* 客群切换 Tabs - 采用批次追溯品类切换样式，支持粘性定位 */}
      <div
        ref={tabsRef}
        className={`transition-all duration-300 ${
          isTabSticky 
            ? 'sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-stone-200 shadow-sm' 
            : 'bg-white/95 backdrop-blur-lg border-b border-stone-200'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* 网格布局的客群选项卡 */}
          <div 
            className="grid gap-1 md:gap-2"
            style={{ 
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' 
            }}
          >
            {[
              { key: 'private' as const, label: '私人定制' },
              { key: 'enterprise' as const, label: '企业领养' },
              { key: 'b2b' as const, label: 'B端合作' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`
                  text-center py-2 px-1 md:px-2 rounded-lg text-sm md:text-base font-medium
                  transition-all duration-200
                  ${activeTab === tab.key 
                    ? 'text-[#F59E0B] bg-orange-50 border-b-2 border-[#F59E0B]' 
                    : 'text-gray-600 hover:text-[#F59E0B] hover:bg-gray-50'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 内容区域 - 根据选中的Tab渲染对应方案 */}
      <div className="container mx-auto px-4 py-8 md:py-12 pb-20">
        {activeTab === 'private' && <PrivatePlan planData={privatePlan} />}
        {activeTab === 'enterprise' && <EnterprisePlan planData={enterprisePlan} />}
        {activeTab === 'b2b' && <B2BPlan planData={b2bPlan} />}
      </div>
    </div>
  );
}

