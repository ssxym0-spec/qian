'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Category } from '../utils/categoryUtils';

/**
 * 品类筛选器组件
 * 采用动态网格布局，根据品类数量自动调整列数
 * 支持从后端 API 动态获取品类列表
 */

interface CategoryFilterProps {
  categories: Category[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const pathname = usePathname();

  // 计算网格列数（最多5列，最少1列）
  const gridCols = Math.min(categories.length, 5);

  return (
    <div className="sticky top-0 z-40 bg-emerald-50/95 backdrop-blur-lg border-b border-emerald-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* 标题区 */}
        <div className="text-center mb-4">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            批次追溯
          </h1>
          <p className="text-gray-600 text-sm">
            追溯手中茶叶从鲜叶采集到匠心制作的全过程
          </p>
        </div>

        {/* 动态网格布局的品类筛选器 */}
        <div 
          className="grid gap-1 md:gap-2"
          style={{ 
            gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` 
          }}
        >
          {categories.map((category) => {
            const href = `/suyuan/${category.slug}`;
            const isActive = pathname === href;

            return (
              <Link
                key={category.slug}
                href={href}
                className={`
                  text-center py-2 px-1 md:px-2 rounded-lg text-sm md:text-base font-medium
                  transition-all duration-200
                  ${isActive 
                    ? 'text-amber-600 bg-amber-50 border-b-2 border-amber-600' 
                    : 'text-gray-600 hover:text-amber-600 hover:bg-gray-50'
                  }
                `}
              >
                {category.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
