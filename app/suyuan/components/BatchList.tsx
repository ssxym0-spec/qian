'use client';

import { useActiveCard } from '../../hooks/useActiveCard';
import BatchCard from './BatchCard';
import { BatchListItem } from '../types';

interface BatchListProps {
  batches: BatchListItem[];
}

/**
 * 批次列表客户端组件
 * 管理批次卡片的激活状态
 */
export default function BatchList({ batches }: BatchListProps) {
  // 卡片激活状态管理
  const { isCardActive, setActiveCard } = useActiveCard('batch-list');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {batches.map((batch) => (
        <BatchCard 
          key={batch._id} 
          batch={batch}
          isActive={isCardActive(batch._id)}
          onCardClick={() => setActiveCard(batch._id)}
        />
      ))}
    </div>
  );
}

