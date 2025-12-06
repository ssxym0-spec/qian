import { Suspense } from 'react';
import SuyuanIndexRedirect from './components/SuyuanIndexRedirect';

/**
 * 溯源页面入口组件
 * 根据 URL 参数 index 跳转到对应的品类页面
 * 
 * 使用场景：
 * - 从首页点击品类卡片时，传入品类的显示顺序编号
 * - 根据顺序编号找到对应的品类并跳转
 * 
 * URL 格式: /suyuan?index=0
 * - index: 品类在首页列表中的顺序编号（从0开始）
 */

// 强制动态渲染，避免预渲染时的 Suspense 问题
export const dynamic = 'force-dynamic';

export default function SuyuanIndexPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-grain-rain-gold mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">正在跳转到品类页面...</p>
          </div>
        </div>
      }
    >
      <SuyuanIndexRedirect />
    </Suspense>
  );
}

