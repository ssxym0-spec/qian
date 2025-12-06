'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * 卡片激活状态管理 Hook
 * 
 * 功能：
 * - 管理列表中卡片的激活状态（每个列表只能有一个激活的卡片）
 * - 使用 localStorage 持久化状态，支持从详情页返回后保持激活状态
 * - 支持多个独立的列表（通过 listKey 区分）
 * 
 * @param listKey - 列表的唯一标识符（如 'daily-logs', 'batch-list', 'categories'）
 * @returns { activeCardId, setActiveCard, isCardActive }
 */
export function useActiveCard(listKey: string) {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  
  // 从 localStorage 读取初始状态
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const storageKey = `active-card-${listKey}`;
      const savedId = localStorage.getItem(storageKey);
      if (savedId) {
        setActiveCardId(savedId);
      }
    } catch (error) {
      console.warn('[useActiveCard] Failed to load from localStorage:', error);
    }
  }, [listKey]);
  
  /**
   * 设置激活的卡片
   * @param cardId - 卡片的唯一标识符
   */
  const setActiveCard = useCallback((cardId: string) => {
    setActiveCardId(cardId);
    
    // 保存到 localStorage
    try {
      const storageKey = `active-card-${listKey}`;
      localStorage.setItem(storageKey, cardId);
    } catch (error) {
      console.warn('[useActiveCard] Failed to save to localStorage:', error);
    }
  }, [listKey]);
  
  /**
   * 检查指定卡片是否处于激活状态
   * @param cardId - 卡片的唯一标识符
   */
  const isCardActive = useCallback((cardId: string) => {
    return activeCardId === cardId;
  }, [activeCardId]);
  
  /**
   * 清除激活状态
   */
  const clearActiveCard = useCallback(() => {
    setActiveCardId(null);
    try {
      const storageKey = `active-card-${listKey}`;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('[useActiveCard] Failed to clear localStorage:', error);
    }
  }, [listKey]);
  
  return {
    activeCardId,
    setActiveCard,
    isCardActive,
    clearActiveCard
  };
}

