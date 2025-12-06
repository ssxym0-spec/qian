/**
 * API 配置工具
 * 根据环境自动判断使用哪个 API 基础地址
 */

/**
 * 获取 API 基础 URL
 * - 开发环境：使用 http://localhost:3000
 * - 生产环境：使用相对路径 /api（通过 rewrites 代理）
 * - 如果设置了 NEXT_PUBLIC_API_BASE_URL 环境变量，优先使用
 */
export function getApiBaseUrl(): string {
  // 如果设置了环境变量，优先使用
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  // 生产环境使用相对路径，通过 rewrites 代理
  if (process.env.NODE_ENV === 'production') {
    return '';
  }

  // 开发环境使用 localhost
  return 'http://localhost:3000';
}

/**
 * 构建完整的 API URL
 * @param path - API 路径（例如：'/api/public/landing-page'）
 * @returns 完整的 API URL
 */
export function getApiUrl(path: string): string {
  const baseUrl = getApiBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // 如果 baseUrl 为空（生产环境），直接返回路径
  if (!baseUrl) {
    return normalizedPath;
  }
  
  return `${baseUrl}${normalizedPath}`;
}

