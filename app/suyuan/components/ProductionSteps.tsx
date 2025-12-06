'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { ProductionStep } from '../types';
import { getFullImageUrl, isVideoUrl } from '../utils/imageUtils';

/**
 * 制作工艺步骤组件（客户端组件）
 * 展示不同制作步骤及其工艺类型
 */

interface ProductionStepsProps {
  productionSteps: ProductionStep[];
}

export default function ProductionSteps({ productionSteps }: ProductionStepsProps) {
  console.log('🛠️ [ProductionSteps] 组件渲染, 工艺步骤数量:', productionSteps?.length || 0);
  
  // 空值检查
  if (!productionSteps || productionSteps.length === 0) {
    console.warn('⚠️ [ProductionSteps] 没有制作工艺数据');
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          匠心制作
        </h2>
        <p className="text-gray-500 mt-4">暂无制作工艺数据</p>
      </div>
    );
  }
  
  // ==================== 步骤导航：改为完全数据驱动 ====================
  // 从后端数据中提取实际存在的步骤名称，避免因为固定枚举导致有数据却不展示
  const stepNames = useMemo(
    () =>
      productionSteps.map((step, index) => step.step_name || `步骤${index + 1}`),
    [productionSteps]
  );

  // 状态管理：当前选中的步骤（默认选中第一条有数据的步骤）
  const [currentStep, setCurrentStep] = useState(
    stepNames[0] || '步骤1'
  );

  // 根据当前步骤筛选对应的工艺数据
  const currentStepData = productionSteps.find(
    (step) => step.step_name === currentStep
  );

  // 获取工艺类型标签文本
  const getCraftTypeLabel = (craftType: 'manual' | 'modern') => {
    return craftType === 'manual' ? '手工匠心' : '现代工艺';
  };

  // 获取指定步骤的工艺类型
  const getStepCraftType = (stepName: string): 'manual' | 'modern' | null => {
    const stepData = productionSteps.find(step => step.step_name === stepName);
    return stepData?.craft_type || null;
  };


  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
      {/* 标题 */}
      <h2 className="font-serif text-xl md:text-2xl font-bold text-gray-900 mb-2">
        匠心制作
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        每一道工序，都是匠人的智慧与坚守
      </p>

      {/* 步骤导航 - 五列网格布局（完全基于实际返回的步骤名称） */}
      <div className="grid grid-cols-5 gap-1 md:gap-2 mb-6">
        {stepNames.map((stepName) => {
          const craftType = getStepCraftType(stepName);
          const isActive = currentStep === stepName;
          
          return (
            <button
              key={stepName}
              onClick={() => setCurrentStep(stepName)}
              className={`
                py-2 px-1 md:px-3 rounded-lg text-xs md:text-sm font-medium
                transition-all duration-200
                ${isActive
                  ? craftType === 'manual'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-200'
                    : craftType === 'modern'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md shadow-blue-200'
                    : 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {stepName}
            </button>
          );
        })}
      </div>

      {/* 内容展示区 */}
      {currentStepData ? (
        <div 
          className={`
            space-y-6 rounded-2xl p-6 transition-all duration-500
            ${currentStepData.craft_type === 'manual' 
              ? 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-2 border-amber-300/50 shadow-amber-100 shadow-xl' 
              : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 border-2 border-blue-300/50 shadow-blue-100 shadow-xl'
            }
          `}
        >
          {/* 工艺类型徽章 */}
          <div className="flex items-center gap-2">
            <span className={`
              inline-flex items-center px-4 py-2 rounded-full text-base font-bold
              transition-all duration-300 shadow-lg
              ${currentStepData.craft_type === 'manual'
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
              }
            `}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {currentStepData.craft_type === 'manual' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                )}
              </svg>
              {getCraftTypeLabel(currentStepData.craft_type)}
            </span>
          </div>

          {/* 媒体画廊 */}
          {currentStepData.craft_details?.media_urls && currentStepData.craft_details.media_urls.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentStepData.craft_details.media_urls.map((media, index) => {
                const fullMediaUrl = getFullImageUrl(media);
                return (
                  <div 
                    key={index} 
                    className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 shadow-md"
                  >
                    {isVideoUrl(fullMediaUrl) ? (
                      <video
                        src={fullMediaUrl}
                        controls
                        className="w-full h-full object-cover"
                        playsInline
                      >
                        您的浏览器不支持视频播放
                      </video>
                    ) : (
                      <Image
                        src={fullMediaUrl}
                        alt={`${currentStep} - ${getCraftTypeLabel(currentStepData.craft_type)}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        quality={80}
                        loading="lazy"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 工艺详细描述 */}
          {(currentStepData.craft_details?.purpose || 
            currentStepData.craft_details?.method || 
            currentStepData.craft_details?.sensory_change || 
            currentStepData.craft_details?.value) && (
            <div className="space-y-4 mt-6">
              {/* 工艺目的 */}
              {currentStepData.craft_details.purpose && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500">
                  <h3 className="text-sm font-semibold text-green-800 mb-1 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    工艺目的
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{currentStepData.craft_details.purpose}</p>
                </div>
              )}

              {/* 操作方法 */}
              {currentStepData.craft_details.method && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <h3 className="text-sm font-semibold text-blue-800 mb-1 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    操作方法
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{currentStepData.craft_details.method}</p>
                </div>
              )}

              {/* 感官变化 */}
              {currentStepData.craft_details.sensory_change && (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border-l-4 border-amber-500">
                  <h3 className="text-sm font-semibold text-amber-800 mb-1 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    感官变化
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{currentStepData.craft_details.sensory_change}</p>
                </div>
              )}

              {/* 工艺价值 */}
              {currentStepData.craft_details.value && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500">
                  <h3 className="text-sm font-semibold text-purple-800 mb-1 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    工艺价值
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{currentStepData.craft_details.value}</p>
                </div>
              )}
            </div>
          )}

          {/* 如果没有媒体数据 */}
          {(!currentStepData.craft_details?.media_urls || currentStepData.craft_details.media_urls.length === 0) && (
            <div className="text-center py-8 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">暂无媒体资源</p>
            </div>
          )}
        </div>
      ) : (
        // 无数据状态
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>暂无该步骤的工艺数据</p>
        </div>
      )}
    </div>
  );
}
