/**
 * 图片 URL 工具函数
 */

/**
 * 将相对路径转换为完整的图片 URL
 * @param url - 图片 URL（可能是相对路径或完整 URL）
 * @param baseUrl - 后端服务器地址，默认为 http://localhost:3000
 * @returns 完整的图片 URL
 */
export function getFullImageUrl(url: string | undefined, baseUrl: string = 'http://localhost:3000'): string {
  if (!url) return '';
  
  // 如果已经是完整 URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // 如果是相对路径，添加后端服务器地址
  // 确保 URL 以 / 开头
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${normalizedUrl}`;
}

/**
 * 判断 URL 是否为视频
 * @param url - 媒体 URL
 * @returns 是否为视频
 */
export function isVideoUrl(url: string | undefined): boolean {
  if (!url) return false;
  return !!url.match(/\.(mp4|webm|ogg|mov)$/i);
}
