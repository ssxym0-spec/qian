/**
 * 品类相关的工具函数
 * 用于从后端 API 获取动态品类列表
 * 
 * 🎯 重要：品类的 slug 由后端 API 直接提供，前端无需维护映射表
 */
import { getApiUrl } from '../../utils/apiConfig';

export interface Category {
  name: string;
  slug: string;
  count?: number;
}

export interface CategoryApiResponse {
  name: string;
  slug: string;  // 🎯 后端直接返回 slug
  count: number;
}

/**
 * 从后端 API 获取所有可用的品类列表
 * 🎯 后端直接返回 slug，前端无需转换
 */
export async function getAvailableCategories(): Promise<Category[]> {
  try {
    console.log('📋 [CategoryUtils] 正在获取品类列表...');
    
    const response = await fetch(getApiUrl('/api/public/categories'), {
      cache: 'no-store', // 总是获取最新数据
    });
    
    if (!response.ok) {
      const errorMsg = response.status === 401 
        ? '后端服务需要认证，请检查后端配置' 
        : `HTTP ${response.status}`;
      console.error(`❌ [CategoryUtils] 获取品类列表失败: ${errorMsg}`);
      
      // 401 错误时提供更详细的提示
      if (response.status === 401) {
        console.warn('⚠️ [CategoryUtils] 提示: /api/public/categories 是公开接口，不应需要认证');
        console.warn('⚠️ [CategoryUtils] 请检查后端服务是否正常运行');
      }
      
      return [];
    }
    
    const categories: CategoryApiResponse[] = await response.json();
    console.log(`✅ [CategoryUtils] 成功获取 ${categories.length} 个品类`);
    
    // 输出品类映射关系供调试
    if (categories.length > 0) {
      console.table(categories.map(c => ({ 
        品类: c.name, 
        Slug: c.slug,
        数量: c.count 
      })));
    }
    
    // 🎯 直接返回后端数据，无需转换
    return categories;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    console.error('❌ [CategoryUtils] 获取品类列表时出错:', errorMessage);
    
    // 网络错误提示
    if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
      console.warn('⚠️ [CategoryUtils] 网络错误: 请确保后端服务正常运行');
    }
    
    return [];
  }
}

/**
 * 验证给定的 slug 是否对应一个有效的品类
 */
export async function validateCategorySlug(slug: string): Promise<boolean> {
  const categories = await getAvailableCategories();
  return categories.some(cat => cat.slug === slug);
}

/**
 * 根据 slug 获取品类信息
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getAvailableCategories();
  const category = categories.find(cat => cat.slug === slug);
  
  if (category) {
    console.log(`✅ [CategoryUtils] 找到品类: ${slug} -> ${category.name}`);
  } else {
    console.warn(`⚠️ [CategoryUtils] 未找到品类: ${slug}`);
  }
  
  return category || null;
}

/**
 * 根据品类名称获取 slug
 * 用于首页跳转等场景
 */
export async function getSlugByName(categoryName: string): Promise<string | null> {
  const categories = await getAvailableCategories();
  const category = categories.find(cat => cat.name === categoryName);
  
  if (category) {
    console.log(`✅ [CategoryUtils] ${categoryName} -> ${category.slug}`);
    return category.slug;
  } else {
    console.warn(`⚠️ [CategoryUtils] 未找到品类: ${categoryName}`);
    return null;
  }
}

