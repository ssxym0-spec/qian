'use client';

import { useEffect, useRef } from 'react';
import { DailyLog, MonthlySummary } from './types';
import DailyLogCard from './DailyLogCard';
import MonthlySummaryCard from './MonthlySummaryCard';
import { useActiveCard } from '../../hooks/useActiveCard';

interface CardStreamProps {
  dailyLogs: DailyLog[];
  monthlySummary: MonthlySummary | null;
  onOpenDaily: (log: DailyLog) => void;
  onOpenMonthly: (summary: MonthlySummary) => void;
  targetDate?: string; // 🆕 目标日期，用于自动选中卡片
}

/**
 * 卡片流组件
 * 负责渲染所有卡片，实现排序逻辑：月度汇总置顶，每日日志按日期排序
 */
export default function CardStream({
  dailyLogs = [], // 添加默认空数组，防止 undefined 导致崩溃
  monthlySummary,
  onOpenDaily,
  onOpenMonthly,
  targetDate,
}: CardStreamProps) {
  // 卡片激活状态管理
  const { isCardActive, setActiveCard } = useActiveCard('daily-logs');
  
  // 用于存储卡片 DOM 引用
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // 对每日日志按日期排序（从早到晚）
  const sortedLogs = [...dailyLogs].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  /**
   * 🆕 当有 targetDate 时，自动选中对应的卡片并滚动到该位置
   */
  useEffect(() => {
    if (!targetDate || sortedLogs.length === 0) {
      return;
    }

    // 查找匹配的日志记录
    const targetLogIndex = sortedLogs.findIndex(log => {
      const logDate = new Date(log.date);
      const logDay = logDate.getDate();
      
      // 如果 targetDate 只是数字，比较日期
      if (/^\d+$/.test(targetDate)) {
        return logDay === parseInt(targetDate, 10);
      }
      
      // 否则比较完整日期字符串
      return log.date === targetDate;
    });

    if (targetLogIndex !== -1) {
      const targetLog = sortedLogs[targetLogIndex];
      const cardId = `${targetLog.date}-${targetLogIndex}`;
      
      console.log('🎯 [CardStream] 找到目标日期的卡片，自动选中:', cardId);
      
      // 延迟设置激活状态和滚动，确保 DOM 已渲染
      setTimeout(() => {
        // 设置激活状态（显示橙色呼吸边框）
        setActiveCard(cardId);
        
        // 滚动到对应卡片
        const cardElement = cardRefs.current[cardId];
        if (cardElement) {
          cardElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
          console.log('📍 [CardStream] 已滚动到卡片位置');
        }
      }, 500); // 延迟500ms确保页面完全渲染和动画加载
    } else {
      console.warn('⚠️ [CardStream] 未找到目标日期的卡片:', targetDate);
    }
  }, [targetDate, sortedLogs, setActiveCard]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 如果存在月度汇总，置顶显示 */}
      {monthlySummary && (
        <div className="animate-fadeIn">
          <MonthlySummaryCard
            summary={monthlySummary}
            onClick={() => onOpenMonthly(monthlySummary)}
          />
        </div>
      )}

      {/* 渲染每日日志卡片 */}
      {sortedLogs.length > 0 ? (
        sortedLogs.map((log, index) => {
          // 使用日期+索引作为唯一ID
          const cardId = `${log.date}-${index}`;
          
          return (
            <div
              key={cardId}
              ref={(el) => { cardRefs.current[cardId] = el; }}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <DailyLogCard
                log={log}
                isActive={isCardActive(cardId)}
                onClick={() => {
                  setActiveCard(cardId);
                  onOpenDaily(log);
                }}
              />
            </div>
          );
        })
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">本月暂无记录</p>
        </div>
      )}
    </div>
  );
}

