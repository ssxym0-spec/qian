'use client';

import { useState, useEffect, useRef } from 'react';
import { getFullImageUrl } from '../../suyuan/utils/imageUtils';

// 核心价值接口
interface CoreValue {
  icon?: string;
  title: string;
  description?: string;
}

// 场景接口
interface Scenario {
  id: string;
  title: string;
  icon?: string;
  pain_point?: string;
  solution?: string;
  background_image?: string;
  core_values?: CoreValue[];
  // 兼容旧格式
  content?: string;
}

interface ScenarioCarouselProps {
  scenarios: Scenario[];
  autoPlayInterval?: number; // 自动播放间隔（毫秒），默认7000ms
}

// 场景图标映射（用于旧数据兼容）
const scenarioIcons: { [key: string]: string } = {
  '节日礼赠': '🎁',
  '客户答谢': '🤝',
  '团队建设': '👥',
  '品牌推广': '🎨',
  'ESG实践': '🌱',
  '商务合作': '💼',
  '会员权益': '⭐',
  '粉丝运营': '💝',
  '私房好礼': '🎁',
  '商务礼品': '🎁',
  '健康养生': '🍵',
  '亲子教育': '👨‍👩‍👧‍👦',
};

// 从标题中提取场景图标
const getScenarioIcon = (title: string): string => {
  for (const [key, icon] of Object.entries(scenarioIcons)) {
    if (title.includes(key)) {
      return icon;
    }
  }
  return '🎯'; // 默认图标
};

// 解析场景内容，提取结构化信息（用于兼容旧的content格式）
const parseScenarioContent = (content: string) => {
  const lines = content.split('\n').filter(line => line.trim());
  
  let painPoint = '';
  let solution = '';
  const values: string[] = [];
  
  let currentSection = '';
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.includes('痛点') || trimmed.includes('困扰') || trimmed.includes('问题')) {
      currentSection = 'pain';
      painPoint = trimmed.replace(/^(痛点|困扰|问题)[：:]\s*/, '');
    } else if (trimmed.includes('方案') || trimmed.includes('解决')) {
      currentSection = 'solution';
      solution = trimmed.replace(/^(方案|解决方案)[：:]\s*/, '');
    } else if (trimmed.includes('价值') || trimmed.includes('效果') || trimmed.includes('优势')) {
      currentSection = 'value';
      const valueText = trimmed.replace(/^(价值|效果|优势)[：:]\s*/, '');
      if (valueText) values.push(valueText);
    } else if (currentSection === 'pain' && !painPoint) {
      painPoint = trimmed;
    } else if (currentSection === 'solution' && !solution) {
      solution = trimmed;
    } else if (currentSection === 'value' && trimmed) {
      values.push(trimmed);
    }
  });
  
  // 如果没有明确的结构，使用默认解析
  if (!painPoint && !solution && values.length === 0) {
    const parts = lines;
    if (parts.length >= 1) painPoint = parts[0];
    if (parts.length >= 2) solution = parts[1];
    if (parts.length > 2) {
      values.push(...parts.slice(2));
    }
  }
  
  return { painPoint, solution, values };
};

// 规范化场景数据
const normalizeScenario = (scenario: Scenario): Required<Omit<Scenario, 'content'>> => {
  // 如果有新格式的数据，直接使用
  if (scenario.pain_point || scenario.solution || scenario.core_values) {
    return {
      id: scenario.id,
      title: scenario.title,
      icon: scenario.icon || getScenarioIcon(scenario.title),
      pain_point: scenario.pain_point || '',
      solution: scenario.solution || '',
      background_image: scenario.background_image || '',
      core_values: scenario.core_values || [],
    };
  }
  
  // 兼容旧的content格式
  if (scenario.content) {
    const { painPoint, solution, values } = parseScenarioContent(scenario.content);
    return {
      id: scenario.id,
      title: scenario.title,
      icon: scenario.icon || getScenarioIcon(scenario.title),
      pain_point: painPoint,
      solution: solution,
      background_image: scenario.background_image || '',
      core_values: values.map((value, idx) => ({
        icon: ['🎯', '📱', '💝', '🎁', '⭐', '🌟'][idx % 6],
        title: value.replace(/^[•\-\*]\s*/, ''),
      })),
    };
  }
  
  // 返回默认值
  return {
    id: scenario.id,
    title: scenario.title,
    icon: '🎯',
    pain_point: '',
    solution: '',
    background_image: '',
    core_values: [],
  };
};

export default function ScenarioCarousel({ 
  scenarios, 
  autoPlayInterval = 9000 
}: ScenarioCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  if (!scenarios || scenarios.length === 0) {
    return (
      <div className="text-center py-16 text-stone-500">
        <div className="text-6xl mb-4">🎯</div>
        <p>暂无场景数据</p>
      </div>
    );
  }

  // 上一张
  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + scenarios.length) % scenarios.length);
  };

  // 下一张
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % scenarios.length);
  };

  // 自动播放
  useEffect(() => {
    // 清除之前的定时器
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }

    // 如果正在拖拽或悬停，不自动播放
    if (isDragging || isHovering || scenarios.length <= 1) {
      return;
    }

    // 设置自动播放定时器
    autoPlayTimerRef.current = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    // 清理函数
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [currentIndex, isDragging, isHovering, scenarios.length, autoPlayInterval]);

  // 触摸/鼠标事件处理
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setTranslateX(diff);
  };

  const handleEnd = () => {
    setIsDragging(false);
    const threshold = 100;

    if (Math.abs(translateX) > threshold) {
      if (translateX > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }

    setTranslateX(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 轮播容器 */}
      <div 
        className="relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* 轮播内容 */}
        <div
          className="overflow-hidden rounded-2xl shadow-xl select-none cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => handleStart(e.clientX)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onTouchEnd={handleEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`,
            }}
          >
            {scenarios.map((scenario) => {
              const normalized = normalizeScenario(scenario);

              return (
                <div
                  key={scenario.id}
                  className="w-full flex-shrink-0"
                >
                  {/* 环绕式卡片布局 */}
                  <div className="bg-gradient-to-br from-white to-amber-50/30 p-6 sm:p-8 md:p-10">
                    <div className="max-w-3xl mx-auto">
                      {/* 顶部区域：痛点 环绕 插图 */}
                      <div className="flex gap-4 sm:gap-6 mb-6 sm:mb-8">
                        {/* 左侧：痛点 */}
                        <div className="flex-1 flex items-start justify-center flex-col">
                          {normalized.pain_point && (
                            <p className="text-lg sm:text-xl md:text-2xl text-red-600 font-medium pl-2 sm:pl-4 whitespace-pre-line leading-relaxed">
                              {normalized.pain_point}
                            </p>
                          )}
                        </div>

                        {/* 右上角：插图区（正方形） */}
                        <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36">
                          {normalized.background_image ? (
                            <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg">
                              <img
                                src={
                                  normalized.background_image.startsWith('/')
                                    ? getFullImageUrl(normalized.background_image)
                                    : normalized.background_image
                                }
                                alt={scenario.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg">
                              <span className="text-5xl sm:text-6xl md:text-7xl">{normalized.icon}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 方案区（横跨全宽，包含价值） */}
                      {normalized.solution && (
                        <div className="mb-6 sm:mb-8 bg-white rounded-xl shadow-md border-l-4 border-amber-500 divide-y divide-stone-200">
                          {/* 标题作为方案标题 */}
                          <div className="px-4 sm:px-6 py-3 sm:py-4">
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#F59E0B] text-center">
                              {scenario.title}
                            </h3>
                          </div>
                          
                          {/* 方案内容 */}
                          <div className="px-4 sm:px-6 py-3 sm:py-4">
                            <p className="text-stone-700 text-sm sm:text-base md:text-lg leading-relaxed whitespace-pre-line">
                              {normalized.solution}
                            </p>
                          </div>
                          
                          {/* 价值点 */}
                          {normalized.core_values.length > 0 && (
                            <div className="px-4 sm:px-6 py-3 sm:py-4 space-y-1.5">
                              {normalized.core_values.map((value, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2"
                                >
                                  <span className="text-lg sm:text-xl flex-shrink-0">
                                    {value.icon || '✓'}
                                  </span>
                                  <span className="text-sm sm:text-base text-stone-700 font-medium">
                                    {value.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 胶囊指示器 */}
      <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8">
        {scenarios.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`
              transition-all duration-500 rounded-full
              ${index === currentIndex
                ? 'bg-gradient-to-r from-orange-400 to-amber-500 w-12 sm:w-14 h-3 shadow-lg scale-110'
                : 'bg-stone-300 w-3 h-3 hover:bg-stone-400 hover:scale-110'
              }
            `}
            aria-label={`切换到场景 ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

