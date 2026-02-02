/**
 * 翻译服务 - 管理翻译缓存和加载
 */
import { type Translations } from '../types';
import { CONFIG } from '../config';

export let translationsCache: Translations | null = null;

/**
 * 从翻译映射中获取翻译文本
 */
export function getTranslation(
  key: string,
  translationMap: Record<string, string> | undefined
): string {
  key = key.trim().toLowerCase();
  return translationMap?.[key] || key;
}

/**
 * 加载翻译数据
 */
export async function loadTranslations(): Promise<Translations> {
  try {
    const response = await fetch(CONFIG.DATA_FILES.TRANSLATIONS);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Translations = (await response.json()) as Translations;
    translationsCache = data;
    // 把 key 小写
    for (const sectionKey in data) {
      const section = data[sectionKey as keyof Translations];
      for (const [key, value] of Object.entries(section)) {
        delete section[key];
        section[key.toLowerCase()] = value;
      }
    }
    return data;
  } catch (error) {
    console.error('加载翻译数据失败:', error);
    throw error;
  }
}
