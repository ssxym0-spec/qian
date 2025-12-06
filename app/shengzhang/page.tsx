import { Suspense } from 'react';
import GrowthPageClientWrapper from '../components/growth/GrowthPageClientWrapper';
import { GrowthData } from '../components/growth/types';

/**
 * 生长过程页 - 服务器组件
 * 负责从后端API获取数据，然后传递给客户端组件处理交互
 * 
 * 缓存配置：完全禁用所有缓存，确保数据实时性
 */

// 强制动态渲染，禁用静态生成
export const dynamic = 'force-dynamic';
// 禁用路由缓存
export const revalidate = 0;
// 禁用fetch缓存
export const fetchCache = 'force-no-store';

export default async function ShengzhangPage({
  searchParams,
}: {
  searchParams: { month?: string; date?: string };
}) {
  // 获取当前月份或从URL参数中获取月份
  const now = new Date();
  const currentMonth = searchParams.month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  // 获取目标日期（用于自动打开对应的卡片）
  const targetDate = searchParams.date;
  
  // 从后端API获取数据
  let data: GrowthData | null = null;
  let error: string | null = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/public/growth-data?month=${currentMonth}`,
      {
        cache: 'no-store', // 不缓存，确保数据实时性
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('后端服务认证失败，请检查后端配置。公开接口不应需要认证。');
      }
      throw new Error(`API请求失败: ${response.status}`);
    }

    const raw = (await response.json()) as GrowthData;
    // 直接使用后端返回的原始结构，字段映射与容错在前端适配层中完成
    data = raw;
  } catch (e) {
    error = e instanceof Error ? e.message : '数据加载失败';
    console.error('获取生长数据失败:', e);
    
    // 提供更详细的错误信息
    if (error.includes('401') || error.includes('认证')) {
      console.warn('⚠️ 提示: /api/public/growth-data 是公开接口，不应需要认证');
      console.warn(`⚠️ 请检查后端服务是否正常运行在 ${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}`);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {error ? (
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">数据加载失败</h2>
          <p className="text-gray-600">{error}</p>
          <p className="text-gray-500 mt-2">请确保后端服务运行在 {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}</p>
        </div>
      ) : data ? (
        <GrowthPageClientWrapper 
          initialData={data} 
          currentMonth={currentMonth}
          targetDate={targetDate}
        />
      ) : (
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-gray-600">加载中...</p>
        </div>
      )}
    </div>
  );
}

