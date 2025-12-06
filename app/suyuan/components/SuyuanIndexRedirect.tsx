'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface LandingPageCategory {
  name: string;
  slug?: string;  // 🎯 后端可能直接返回 slug
  image_url: string;
  description: string;
  yield_percentage: number;
  picking_period: string;
}

interface CategoryWithSlug {
  name: string;
  slug: string;
}

/**
 * 从品类API获取品类名称到slug的映射
 * 🎯 动态获取，不再使用静态映射表
 */
async function getCategorySlugMapping(): Promise<Map<string, string>> {
  try {
    const response = await fetch('http://localhost:3000/api/public/categories', {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      const errorMsg = response.status === 401 
        ? '后端服务需要认证，请检查后端配置' 
        : `HTTP ${response.status}`;
      console.error(`❌ [SuyuanIndex] 获取品类映射失败: ${errorMsg}`);
      
      // 401 错误时提供更详细的提示
      if (response.status === 401) {
        console.warn('⚠️ [SuyuanIndex] 提示: /api/public/categories 是公开接口，不应需要认证');
        console.warn('⚠️ [SuyuanIndex] 请检查后端服务是否正常运行在 http://localhost:3000');
      }
      
      return new Map();
    }
    
    const categories: CategoryWithSlug[] = await response.json();
    const mapping = new Map<string, string>();
    
    categories.forEach(cat => {
      mapping.set(cat.name, cat.slug);
    });
    
    console.log('✅ [SuyuanIndex] 品类映射:', Object.fromEntries(mapping));
    return mapping;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    console.error('❌ [SuyuanIndex] 获取品类映射时出错:', errorMessage);
    
    // 网络错误提示
    if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
      console.warn('⚠️ [SuyuanIndex] 网络错误: 请确保后端服务运行在 http://localhost:3000');
    }
    
    return new Map();
  }
}

export default function SuyuanIndexRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function handleRedirect() {
      try {
        // 获取 URL 参数中的顺序编号
        const indexParam = searchParams.get('index');
        
        if (indexParam === null) {
          // 如果没有传入 index 参数，默认跳转到第一个品类
          console.warn('⚠️ [SuyuanIndex] 未提供 index 参数，将获取第一个品类');
        }
        
        const categoryIndex = indexParam ? parseInt(indexParam, 10) : 0;
        
        // 🎯 并行获取：首页品类列表 + 品类slug映射
        const [landingResponse, slugMapping] = await Promise.all([
          fetch('http://localhost:3000/api/public/landing-page', {
            cache: 'no-store',
          }),
          getCategorySlugMapping()
        ]);
        
        if (!landingResponse.ok) {
          throw new Error('无法获取品类数据');
        }
        
        const data = await landingResponse.json();
        const categories: LandingPageCategory[] = data.categories || [];
        
        if (categories.length === 0) {
          console.error('❌ [SuyuanIndex] 品类列表为空');
          router.push('/404');
          return;
        }
        
        // 验证 index 是否有效
        if (categoryIndex < 0 || categoryIndex >= categories.length) {
          console.error(`❌ [SuyuanIndex] 无效的 index: ${categoryIndex}，品类总数: ${categories.length}`);
          // 如果 index 无效，跳转到第一个品类
          const firstCategory = categories[0];
          const firstSlug = firstCategory.slug || slugMapping.get(firstCategory.name);
          
          if (!firstSlug) {
            console.error('❌ [SuyuanIndex] 无法获取第一个品类的slug');
            router.push('/');
            return;
          }
          
          console.log(`✅ [SuyuanIndex] 跳转到第一个品类: ${firstCategory.name} (${firstSlug})`);
          router.push(`/suyuan/${firstSlug}`);
          return;
        }
        
        // 根据 index 获取对应的品类
        const targetCategory = categories[categoryIndex];
        
        // 🎯 优先使用首页API返回的slug，如果没有则从映射中获取
        const targetSlug = targetCategory.slug || slugMapping.get(targetCategory.name);
        
        if (!targetSlug) {
          console.error(`❌ [SuyuanIndex] 无法获取品类 "${targetCategory.name}" 的slug`);
          router.push('/');
          return;
        }
        
        console.log(`✅ [SuyuanIndex] 品类 #${categoryIndex}: ${targetCategory.name} -> ${targetSlug}`);
        console.log(`📋 [SuyuanIndex] 完整品类列表:`, categories.map((c, i) => `${i}: ${c.name}`));
        console.log(`🔗 [SuyuanIndex] 将跳转到: /suyuan/${targetSlug}`);
        
        // 跳转到对应的品类页面
        router.push(`/suyuan/${targetSlug}`);
        
      } catch (error) {
        console.error('❌ [SuyuanIndex] 处理跳转时出错:', error);
        // 出错时跳转到首页
        router.push('/');
      }
    }
    
    handleRedirect();
  }, [searchParams, router]);

  // 显示加载中状态
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-grain-rain-gold mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">正在跳转到品类页面...</p>
      </div>
    </div>
  );
}

