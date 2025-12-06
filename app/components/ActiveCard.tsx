'use client';

import React, { ReactNode } from 'react';

interface ActiveCardProps {
  /** 卡片是否处于激活状态 */
  isActive: boolean;
  /** 点击回调 */
  onClick?: () => void;
  /** 卡片内容 */
  children: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 元素类型（默认为 div） */
  as?: 'div' | 'a' | 'button';
  /** 其他属性（如 href 用于链接） */
  [key: string]: any;
}

/**
 * 带激活状态的卡片包装组件
 * 
 * 功能：
 * - 默认状态：透明边框（2px）
 * - 激活状态：五彩霓虹流光边框（2px），顺时针流动
 * - 平滑过渡效果
 * 
 * 使用示例：
 * ```tsx
 * <ActiveCard 
 *   isActive={isCardActive(card.id)}
 *   onClick={() => setActiveCard(card.id)}
 * >
 *   {卡片内容}
 * </ActiveCard>
 * ```
 */
export default function ActiveCard({ 
  isActive, 
  onClick, 
  children, 
  className = '',
  as = 'div',
  ...restProps 
}: ActiveCardProps) {
  const Component = as;
  
  // 组合类名
  const containerClasses = `
    ${isActive ? 'active-card-border' : 'active-card-border-default'}
    ${className}
  `.trim();
  
  return (
    <Component
      className={containerClasses}
      onClick={onClick}
      {...restProps}
    >
      <div className="active-card-content">
        {children}
      </div>
    </Component>
  );
}

