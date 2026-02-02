/**
 * 目录数据加载服务
 */
import { type CatalogItem } from '../types';
import { CONFIG } from '../config';

/**
 * 加载用户拥有的物品目录数据
 */
export async function loadCatalogData(): Promise<Set<number>> {
  if (!import.meta.env.DEV) {
    return new Set();
  }

  try {
    const response = await fetch(CONFIG.DATA_FILES.CATALOG);
    if (!response.ok) {
      console.log('无法加载 catalog_items.json，将不显示拥有状态');
      return new Set();
    }

    const data: { items: CatalogItem[] } = (await response.json()) as {
      items: CatalogItem[];
    };
    const ownedIds = new Set<number>();

    data.items.forEach((item) => {
      ownedIds.add(item.unique_id);
    });
    console.log(`已加载 ${ownedIds.size} 个拥有的物品`);
    return ownedIds;
  } catch (error) {
    console.log('无法加载 catalog_items.json，将不显示拥有状态');
    return new Set();
  }
}
