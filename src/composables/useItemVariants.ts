import { computed } from 'vue';
import { ItemModel } from '../models';
import type { Item } from '../types';

/**
 * 组合函数：使用 ItemModel 管理物品变体和图案
 * 基于 ItemModel 的简化版本，提供响应式的变体管理
 */
export function useItemVariants(item: Item) {
  // 创建 ItemModel 实例
  const itemModel = computed(() => new ItemModel(item));

  /**
   * 当前选中的变体组
   */
  const currentVariant = computed(() => itemModel.value.getCurrentVariant());

  /**
   * 当前选中的图案
   */
  const currentPattern = computed(() => itemModel.value.getCurrentPattern());

  /**
   * 显示的图片URL
   */
  const displayImage = computed(() => itemModel.value.getDisplayImage());

  /**
   * 显示的物品ID
   */
  const displayId = computed(() => itemModel.value.getDisplayId());

  /**
   * 显示的颜色列表
   */
  const displayColors = computed(() => itemModel.value.getDisplayColors());

  /**
   * 显示的完整名称（包含变体和图案）
   */
  const displayName = computed(() => itemModel.value.getDisplayName());

  /**
   * 是否有多个变体
   */
  const hasMultipleVariants = computed(() => itemModel.value.getVariantCount() > 1);

  /**
   * 当前变体是否有多个图案
   */
  const hasPatterns = computed(() => {
    const variant = currentVariant.value;
    return variant ? variant.patterns.length > 1 : false;
  });

  /**
   * 当前变体索引
   */
  const vIndex = computed({
    get: () => itemModel.value.getVariantIndex(),
    set: (value: number) => {
      itemModel.value.setVariantIndex(value);
    }
  });

  /**
   * 当前图案索引
   */
  const pIndex = computed({
    get: () => itemModel.value.getPatternIndex(),
    set: (value: number) => {
      itemModel.value.setPatternIndex(value);
    }
  });

  /**
   * 选择变体
   */
  const selectVariant = (index: number): void => {
    itemModel.value.setVariantIndex(index);
  };

  /**
   * 选择图案
   */
  const selectPattern = (index: number): void => {
    itemModel.value.setPatternIndex(index);
  };

  return {
    itemModel,
    vIndex,
    pIndex,
    currentVariant,
    currentPattern,
    displayImage,
    displayId,
    displayColors,
    displayName,
    hasMultipleVariants,
    hasPatterns,
    selectVariant,
    selectPattern
  };
}
