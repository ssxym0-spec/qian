/**
 * 手绘涂鸦风格天气图标组件
 * 使用彩色 SVG 实现，适用于 DailyLogCard 组件
 */

import React from 'react';

/**
 * 手绘涂鸦风格 - 晴天图标 (黄色)
 */
export const SunnyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    {...props}
  >
    {/* 不规则圆形太阳 - 手绘感 */}
    <path 
      d="M 12 7 Q 14.5 7 16 9 Q 17 11 17 12 Q 17 14 16 15.5 Q 14 17 12 17 Q 10 17 8.5 15.5 Q 7 14 7 12 Q 7 10 8 9 Q 9.5 7 12 7 Z" 
      fill="#FCD34D" 
      stroke="#F59E0B" 
      strokeWidth="1.5"
    />
    {/* 手绘波浪光芒 - 8条方向 */}
    <path d="M 12 3 Q 12 4 12 5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
    <path d="M 12 19 Q 12 20 12 21" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
    <path d="M 5 5 Q 6 6 7 7" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
    <path d="M 17 17 Q 18 18 19 19" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
    <path d="M 3 12 Q 4 12 5 12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
    <path d="M 19 12 Q 20 12 21 12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
    <path d="M 7 17 Q 6 18 5 19" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
    <path d="M 17 7 Q 18 6 19 5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

/**
 * 手绘涂鸦风格 - 多云图标 (柔和灰蓝)
 */
export const CloudyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    {...props}
  >
    {/* 不规则云朵轮廓 - 手绘感 */}
    <path 
      d="M 6 13 Q 6 11 7.5 10 Q 9 9 11 9.5 Q 12 8 14 8.5 Q 16 9 17 10.5 Q 18 12 17.5 14 Q 16 15 14 15 Q 12 15.5 10 15 Q 8 14.5 6.5 14 Q 6 13.5 6 13 Z" 
      fill="#CBD5E1" 
      stroke="#64748B" 
      strokeWidth="1.8" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    {/* 云朵纹理线 - 增加手绘细节 */}
    <path d="M 9 12 Q 10 11.5 11 12" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round"/>
    <path d="M 13 12 Q 14 11.5 15 12" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

/**
 * 手绘涂鸦风格 - 雨天图标 (天蓝色)
 */
export const RainyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    {...props}
  >
    {/* 不规则云朵 - 手绘感 */}
    <path 
      d="M 6 10 Q 6 8.5 8 8 Q 10 7.5 12 8.5 Q 13.5 7.5 15.5 8.5 Q 17 9.5 17 11 Q 17 12 16 12.5 Q 14 13 12 12.5 Q 10 13 8 12 Q 6 11.5 6 10 Z" 
      fill="#7DD3FC" 
      stroke="#0369A1" 
      strokeWidth="1.5" 
      strokeLinecap="round"
    />
    {/* 手绘雨滴线条 - 5条不同长度的雨 */}
    <path d="M 8 14 L 7 17" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round"/>
    <path d="M 12 15 L 11 19" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round"/>
    <path d="M 16 14 L 15 17" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round"/>
    <path d="M 10 16 L 9.5 18" stroke="#1E40AF" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M 14 16 L 13.5 18" stroke="#1E40AF" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/**
 * 手绘涂鸦风格 - 阴天图标 (深灰色)
 */
export const OvercastIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    {...props}
  >
    {/* 深灰色云朵 - 手绘感 */}
    <path 
      d="M 6 13 Q 6 11 7.5 10 Q 9 9 11 9.5 Q 12 8 14 8.5 Q 16 9 17 10.5 Q 18 12 17.5 14 Q 16 15 14 15 Q 12 15.5 10 15 Q 8 14.5 6.5 14 Q 6 13.5 6 13 Z" 
      fill="#94A3B8" 
      stroke="#475569" 
      strokeWidth="1.8" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    {/* 云朵纹理线 */}
    <path d="M 9 12 Q 10 11.5 11 12" stroke="#64748B" strokeWidth="1" strokeLinecap="round"/>
    <path d="M 13 12 Q 14 11.5 15 12" stroke="#64748B" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

/**
 * 手绘涂鸦风格 - 多云转晴图标
 */
export const PartlyCloudyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    {...props}
  >
    {/* 太阳 */}
    <circle cx="9" cy="9" r="3" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1.5"/>
    <path d="M 9 4 L 9 5" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M 9 13 L 9 14" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M 4 9 L 5 9" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M 13 9 L 14 9" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
    {/* 云朵 */}
    <path 
      d="M 11 15 Q 11 14 12 13.5 Q 13 13 14 13.5 Q 15 13 16 13.5 Q 17 14 17 15 Q 17 16 16 16.5 Q 15 17 14 16.5 Q 13 17 12 16.5 Q 11 16 11 15 Z" 
      fill="#CBD5E1" 
      stroke="#64748B" 
      strokeWidth="1.5"
    />
  </svg>
);

/**
 * 手绘涂鸦风格 - 小雨图标
 */
export const LightRainIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    {...props}
  >
    {/* 云朵 */}
    <path 
      d="M 6 10 Q 6 8.5 8 8 Q 10 7.5 12 8.5 Q 13.5 7.5 15.5 8.5 Q 17 9.5 17 11 Q 17 12 16 12.5 Q 14 13 12 12.5 Q 10 13 8 12 Q 6 11.5 6 10 Z" 
      fill="#BAE6FD" 
      stroke="#0284C7" 
      strokeWidth="1.5"
    />
    {/* 少量雨滴 */}
    <path d="M 9 15 L 8.5 17" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M 13 15 L 12.5 17" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/**
 * 手绘涂鸦风格 - 中雨图标
 */
export const ModerateRainIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    {...props}
  >
    {/* 云朵 */}
    <path 
      d="M 6 10 Q 6 8.5 8 8 Q 10 7.5 12 8.5 Q 13.5 7.5 15.5 8.5 Q 17 9.5 17 11 Q 17 12 16 12.5 Q 14 13 12 12.5 Q 10 13 8 12 Q 6 11.5 6 10 Z" 
      fill="#7DD3FC" 
      stroke="#0369A1" 
      strokeWidth="1.5"
    />
    {/* 中等雨滴 */}
    <path d="M 8 14 L 7.5 17" stroke="#0369A1" strokeWidth="2" strokeLinecap="round"/>
    <path d="M 12 15 L 11.5 18" stroke="#0369A1" strokeWidth="2" strokeLinecap="round"/>
    <path d="M 16 14 L 15.5 17" stroke="#0369A1" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

/**
 * 手绘涂鸦风格 - 大雨图标
 */
export const HeavyRainIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    {...props}
  >
    {/* 深色云朵 */}
    <path 
      d="M 6 10 Q 6 8.5 8 8 Q 10 7.5 12 8.5 Q 13.5 7.5 15.5 8.5 Q 17 9.5 17 11 Q 17 12 16 12.5 Q 14 13 12 12.5 Q 10 13 8 12 Q 6 11.5 6 10 Z" 
      fill="#3B82F6" 
      stroke="#1E3A8A" 
      strokeWidth="1.5"
    />
    {/* 密集雨滴 */}
    <path d="M 7 14 L 6 18" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M 10 15 L 9 19" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M 13 14 L 12 18" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M 16 15 L 15 19" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

/**
 * 手绘涂鸦风格 - 阵雨图标
 */
export const ShowersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    {...props}
  >
    {/* 云朵 */}
    <path 
      d="M 6 10 Q 6 8.5 8 8 Q 10 7.5 12 8.5 Q 13.5 7.5 15.5 8.5 Q 17 9.5 17 11 Q 17 12 16 12.5 Q 14 13 12 12.5 Q 10 13 8 12 Q 6 11.5 6 10 Z" 
      fill="#7DD3FC" 
      stroke="#0369A1" 
      strokeWidth="1.5"
    />
    {/* 间歇性雨滴 */}
    <path d="M 8 14 L 7.5 16" stroke="#0369A1" strokeWidth="2" strokeLinecap="round"/>
    <path d="M 12 16 L 11.5 18" stroke="#0369A1" strokeWidth="2" strokeLinecap="round"/>
    <path d="M 15 15 L 14.5 17" stroke="#0369A1" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

/**
 * 手绘涂鸦风格 - 雷阵雨图标
 */
export const ThunderstormIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    {...props}
  >
    {/* 深色云朵 */}
    <path 
      d="M 6 9 Q 6 7.5 8 7 Q 10 6.5 12 7.5 Q 13.5 6.5 15.5 7.5 Q 17 8.5 17 10 Q 17 11 16 11.5 Q 14 12 12 11.5 Q 10 12 8 11 Q 6 10.5 6 9 Z" 
      fill="#3B82F6" 
      stroke="#1E3A8A" 
      strokeWidth="1.5"
    />
    {/* 闪电 */}
    <path d="M 13 13 L 11 16 L 12.5 16 L 11 20" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* 雨滴 */}
    <path d="M 8 13 L 7.5 15" stroke="#1E3A8A" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M 15 13 L 14.5 15" stroke="#1E3A8A" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/**
 * 手绘涂鸦风格 - 大风图标
 */
export const WindyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    {...props}
  >
    {/* 风线 */}
    <path d="M 4 9 Q 8 8 12 9 Q 16 10 19 9" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
    <path d="M 3 13 Q 7 12 11 13 Q 15 14 20 13" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
    <path d="M 5 17 Q 9 16 13 17 Q 17 18 19 17" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

/**
 * 手绘涂鸦风格 - 热浪图标
 */
export const HeatWaveIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    {...props}
  >
    {/* 太阳 */}
    <circle cx="12" cy="10" r="4" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1.5"/>
    <path d="M 12 4 L 12 5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
    <path d="M 12 15 L 12 16" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
    <path d="M 6 10 L 7 10" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
    <path d="M 17 10 L 18 10" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
    {/* 热浪波纹 */}
    <path d="M 8 18 Q 9 17 10 18 Q 11 19 12 18 Q 13 17 14 18 Q 15 19 16 18" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M 9 20 Q 10 19 11 20 Q 12 21 13 20 Q 14 19 15 20" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/**
 * 天气名称到图标组件的映射表
 */
export const weatherIconMapping: { [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>> } = {
  // 原有天气
  '晴天': SunnyIcon,
  '多云': CloudyIcon,
  '阴天': OvercastIcon,
  '雨天': RainyIcon,
  
  // 新增天气类型
  '多云转晴': PartlyCloudyIcon,
  '小雨': LightRainIcon,
  '中雨': ModerateRainIcon,
  '大雨': HeavyRainIcon,
  '白天有阵雨': ShowersIcon,
  '阵雨': ShowersIcon,
  '雷阵雨': ThunderstormIcon,
  '风': WindyIcon,
  '热浪': HeatWaveIcon,
  
  // 兼容简写
  '晴': SunnyIcon,
  '云': CloudyIcon,
  '阴': OvercastIcon,
  '雨': RainyIcon,
};

