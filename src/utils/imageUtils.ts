/**
 * 图片工具函数
 */

/**
 * CDN 主机地址
 */
const CDN_HOST = "https://acnhcdn.com/";

/**
 * 处理图片 URL，如果不是完整 URL 则添加 CDN 前缀
 * @param imageUrl 图片 URL
 * @returns 处理后的完整 URL
 */
export function processImageUrl(imageUrl: string): string {
  if (!imageUrl) return "";

  // 如果已经是完整 URL（包含 http/https），直接返回
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // 否则添加 CDN 前缀
  return CDN_HOST + imageUrl;
}