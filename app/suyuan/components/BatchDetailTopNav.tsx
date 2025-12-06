'use client';

import Link from 'next/link';

/**
 * 批次详情页顶部导航栏
 * 固定在页面顶部，采用半透明玻璃效果
 */

interface BatchDetailTopNavProps {
  categoryName: string;  // 品类名称，如"秋茶"
  batchNumber: string;   // 批次编号，如"QC-20251003-1"
  categorySlug: string;  // 品类 URL slug，用于返回
}

export default function BatchDetailTopNav({
  categoryName,
  batchNumber,
  categorySlug,
}: BatchDetailTopNavProps) {
  // 防御性处理：避免 batchNumber 为空或非字符串时调用 replace 报错
  const safeBatchNumber =
    typeof batchNumber === 'string' && batchNumber
      ? batchNumber
      : '未知批次';
  const displayBatchNumber = safeBatchNumber.replace(
    /^.*?([A-Z]{2}-\d{8}(?:-\d+)?).*$/,
    '$1'
  );

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-emerald-50/95 backdrop-blur-md border-b border-emerald-100 z-50">
      <div className="h-full flex items-center justify-between px-4">
        {/* 左侧：返回按钮 */}
        <Link
          href={`/suyuan/${categorySlug}`}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100/80 transition-colors group"
          aria-label="返回"
        >
          <svg 
            className="w-6 h-6 text-gray-700 group-hover:-translate-x-0.5 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        {/* 中间：品类与批次号 */}
        <div className="flex-1 text-center px-4">
          <h1 className="text-base font-semibold text-gray-900 truncate">
          {categoryName} {displayBatchNumber}
          </h1>
        </div>

        {/* 右侧：占位空间，保持居中对齐 */}
        <div className="w-10 h-10" />
      </div>
    </nav>
  );
}

