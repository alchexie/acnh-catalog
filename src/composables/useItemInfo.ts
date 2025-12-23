import { computed, type ComputedRef } from 'vue';
import { ItemModel } from '../models';
import type { Item } from '../types';

export interface ItemInfo {
  displayName: string;
  displayImage: string;
  displayId: number;
  displayColors: string[];
  version: string;
  size: string;
  sources: string[];
  seriesName: string;
  hasVariations: boolean;
  variantCount: number;
  canDIY: boolean;
  canCustomize: boolean;
  isOutdoor: boolean;
  isInteractive: boolean;
  buyPrice: number | null;
  sellPrice: number | null;
  owned: boolean;
}

/**
 * 组合函数：使用 ItemModel 获取物品的完整信息
 * 展示 ItemModel 的便捷性，避免重复的 null 检查
 */
export function useItemInfo(item: Item | ComputedRef<Item>): ComputedRef<ItemInfo> {
  const itemRef = computed(() => {
    return 'value' in item ? item.value : item;
  });

  return computed(() => {
    const model = new ItemModel(itemRef.value);

    return {
      // 显示属性（自动处理变体）
      displayName: model.getDisplayName(),
      displayImage: model.getDisplayImage(),
      displayId: model.getDisplayId(),
      displayColors: model.getDisplayColors(),

      // 基础属性（安全访问，总是返回有效值）
      version: model.getVersion(),
      size: model.getSize(),
      sources: model.getSources(),
      seriesName: model.getSeriesName(),

      // 变体信息
      hasVariations: model.hasVariations,
      variantCount: model.getVariantCount(),

      // 物品特性（布尔值，无需 ?? false）
      canDIY: model.isDIY(),
      canCustomize: model.isCustomizable(),
      isOutdoor: model.isOutdoor(),
      isInteractive: model.isInteractive(),

      // 价格信息（可能为 null）
      buyPrice: model.getBuyPrice(),
      sellPrice: model.getSellPrice(),

      // 拥有状态
      owned: model.owned,
    };
  });
}
