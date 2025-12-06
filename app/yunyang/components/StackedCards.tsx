'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getApiBaseUrl } from '../../utils/apiConfig';

interface Card {
  id: string;
  content: string;
  image_url?: string;
}

interface StackedCardsProps {
  cards: Card[];
}

export default function StackedCards({ cards }: StackedCardsProps) {
  const [cardStack, setCardStack] = useState(cards);

  // 点击卡片，将其移到底部
  const handleCardClick = () => {
    setCardStack(prev => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  // 处理图片 URL：如果是相对路径，添加后端服务器地址
  const getImageUrl = (url: string) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (trimmed.startsWith('data:')) {
      return trimmed;
    }
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    if (trimmed.startsWith('/')) {
      return `${getApiBaseUrl()}${trimmed}`;
    }
    return trimmed;
  };

  return (
    <div className="w-full max-w-md mx-auto relative pb-8">
      {/* 卡片堆叠容器 */}
      <div className="relative h-96 md:h-[480px]">
        {cardStack.map((card, index) => {
          const imageUrl = card.image_url ? getImageUrl(card.image_url) : null;
          
          return (
            <div
              key={card.id}
              onClick={index === cardStack.length - 1 ? handleCardClick : undefined}
              className={`
                absolute inset-0 bg-white rounded-xl shadow-lg overflow-hidden
                transition-all duration-500 ease-out
                ${index === cardStack.length - 1 ? 'cursor-pointer hover:shadow-xl' : 'pointer-events-none'}
              `}
              style={{
                transform: `translateY(${index * 12}px) scale(${1 - index * 0.05})`,
                zIndex: cardStack.length - index,
                opacity: index < 3 ? 1 : 0,
              }}
            >
               {/* 如果有图片，显示图片和文案组合布局 */}
               {imageUrl ? (
                 <div className="flex flex-col h-full">
                   {/* 图片区域 - 占据上 3/4 */}
                   <div className="relative h-3/4 w-full bg-stone-100">
                     <Image
                       src={imageUrl}
                       alt={card.content}
                       fill
                       className="object-cover"
                       sizes="(max-width: 768px) 100vw, 448px"
                       quality={80}
                       loading="lazy"
                     />
                   </div>
                 {/* 文案区域 - 占据下 1/4 */}
                 <div className="h-1/4 flex items-center justify-center p-4 bg-white">
                   <p className="text-stone-800 text-lg md:text-xl font-semibold text-center leading-relaxed line-clamp-2">
                     {card.content}
                   </p>
                 </div>
               </div>
             ) : (
               /* 如果没有图片，只显示文案（原有样式） */
               <div className="flex flex-col justify-center items-center h-full p-6">
                 <p className="text-stone-800 text-xl md:text-2xl font-semibold text-center leading-relaxed">
                   {card.content}
                 </p>
               </div>
             )}
            </div>
          );
        })}
        
        {/* 提示胶囊卡片 - 叠在卡片堆叠下方一半位置，在客户案例上方但在客群tabs下方 */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-5 z-30 pointer-events-none">
          <div className="bg-white rounded-full shadow-md px-6 py-3 whitespace-nowrap">
            <p className="text-stone-500 text-sm md:text-base">
              点击卡片查看更多案例
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

