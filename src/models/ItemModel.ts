import type { Item, VariantGroup, Pattern, ItemCategory } from "../types";
import { reactive } from "vue";
import { processImageUrl } from "../utils/imageUtils";
import {
  ItemCategoryNameMap,
  versionNameMap,
  itemSizeNameMap,
} from "../services/dataService";
import { Color, Version, ItemSize } from "../types/item";

/**
 * 物品模型类
 * 封装物品数据的访问逻辑，提供便捷的 API
 * 用于需要业务逻辑和状态管理的场景
 */
export class ItemModel {
  private readonly _data: Item;
  // 响应式状态
  private _state: {
    currentVariantIndex: number;
    currentPatternIndex: number;
    owned: boolean;
  };

  constructor(item: Item) {
    this._data = item;
    this._state = reactive({
      currentVariantIndex: 0,
      currentPatternIndex: 0,
      owned: false, // 初始未拥有
    });
  }

  /**
   * 获取原始数据
   */
  get raw(): Item {
    return this._data;
  }

  // ============ 基础属性访问 ============

  /**
   * 物品名称
   */
  get name(): string {
    return this._data.name;
  }

  /**
   * 物品ID
   */
  get id(): number {
    return this._data.id;
  }

  /**
   * 物品分类
   */
  get category(): ItemCategory {
    return this._data.category;
  }

  /**
   * 是否已拥有
   */
  get owned(): boolean {
    return this._state.owned;
  }

  /**
   * 设置拥有状态
   */
  set owned(value: boolean) {
    this._state.owned = value;
  }

  // ============ 可选属性安全访问 ============

  /**
   * 获取分类名称
   */
  getCategoryName(): string {
    return ItemCategoryNameMap[this._data.category] || "未知分类";
  }

  /**
   * 获取版本信息（安全访问）
   */
  getVersion(): string {
    if (this._data.ver === undefined) return "未知版本";
    return versionNameMap[this._data.ver] || "未知版本";
  }

  /**
   * 获取尺寸信息（安全访问）
   */
  getSize(): string {
    if (this._data.size === undefined) return "未知尺寸";
    return itemSizeNameMap[this._data.size] || "未知尺寸";
  }

  /**
   * 获取系列ID（安全访问）
   */
  getSeries(): string {
    return this._data.series || "";
  }

  /**
   * 获取系列名称（翻译后，安全访问）
   * 注意：需要配合翻译服务使用，这里只返回原始 series 值
   */
  getSeriesName(): string {
    return this._data.series || "无系列";
  }

  /**
   * 获取标签（安全访问）
   */
  getTag(): string {
    return this._data.tag || "";
  }

  /**
   * 获取来源列表（安全访问）
   */
  getSources(): string[] {
    return this._data.source || [];
  }

  /**
   * 检查是否有指定来源
   */
  hasSource(source: string): boolean {
    return this.getSources().includes(source);
  }

  /**
   * 获取颜色列表（安全访问）
   */
  getColors(): Color[] {
    return this._data.colors;
  }

  /**
   * 检查是否包含指定颜色
   */
  hasColor(color: Color): boolean {
    return this.getColors().includes(color);
  }

  // ============ 变体相关 ============

  /**
   * 是否有变体
   */
  get hasVariations(): boolean {
    const groups = this.getVariantGroups();
    return (
      groups.length > 0 &&
      (groups.length > 1 || (groups[0]?.patterns.length ?? 0) > 1)
    );
  }

  /**
   * 获取变体组列表
   */
  getVariantGroups(): VariantGroup[] {
    return this._data.variants || [];
  }

  /**
   * 获取变体总数
   */
  getVariantCount(): number {
    return this.getVariantGroups().length;
  }

  /**
   * 是否有多个变体
   */
  hasMultipleVariants(): boolean {
    return this.getVariantGroups().length > 1;
  }

  /**
   * 当前变体是否有多个图案
   */
  hasPatterns(): boolean {
    const variant = this.getCurrentVariant();
    return variant ? variant.patterns.length > 1 : false;
  }

  /**
   * 获取当前选中的变体索引
   */
  getVariantIndex(): number {
    return this._state.currentVariantIndex;
  }

  /**
   * 设置当前变体索引
   */
  setVariantIndex(index: number): void {
    if (index >= 0 && index < this.getVariantCount()) {
      this._state.currentVariantIndex = index;
      this._state.currentPatternIndex = 0; // 切换变体时重置图案
    }
  }

  /**
   * 获取当前选中的图案索引
   */
  getPatternIndex(): number {
    return this._state.currentPatternIndex;
  }

  /**
   * 设置当前图案索引
   */
  setPatternIndex(index: number): void {
    const currentVariant = this.getCurrentVariant();
    if (
      currentVariant &&
      index >= 0 &&
      index < currentVariant.patterns.length
    ) {
      this._state.currentPatternIndex = index;
    }
  }

  /**
   * 获取当前选中的变体
   */
  getCurrentVariant(): VariantGroup | null {
    const variants = this.getVariantGroups();
    if (variants.length === 0) return null;

    const index = Math.max(
      0,
      Math.min(this._state.currentVariantIndex, variants.length - 1)
    );
    return variants[index] || null;
  }

  /**
   * 获取当前选中的图案
   */
  getCurrentPattern(): Pattern | null {
    const variant = this.getCurrentVariant();
    if (!variant || variant.patterns.length === 0) return null;

    const index = Math.max(
      0,
      Math.min(this._state.currentPatternIndex, variant.patterns.length - 1)
    );
    return variant.patterns[index] || null;
  }

  /**
   * 根据索引获取变体
   */
  getVariantByIndex(index: number): VariantGroup | null {
    const variants = this.getVariantGroups();
    return variants[index] || null;
  }

  /**
   * 根据名称获取变体
   */
  getVariantByName(name: string): VariantGroup | null {
    return this.getVariantGroups().find((v) => v.name === name) || null;
  }

  // ============ 显示属性（根据当前选中的变体/图案） ============

  /**
   * 获取当前显示的图片URL
   */
  getDisplayImage(): string {
    const pattern = this.getCurrentPattern();
    const imageUrl = pattern?.image || this._data.images[0] || "";
    return processImageUrl(imageUrl);
  }

  /**
   * 获取当前显示的ID
   */
  getDisplayId(): number {
    const pattern = this.getCurrentPattern();
    return pattern?.id || this._data.id;
  }

  /**
   * 获取当前显示的颜色列表
   */
  getDisplayColors(): Color[] {
    const pattern = this.getCurrentPattern();
    return pattern?.colors || this._data.colors;
  }

  /**
   * 获取当前显示的完整名称（包含变体和图案）
   */
  getDisplayName(): string {
    const parts = [this.name];

    const variant = this.getCurrentVariant();
    if (variant?.name) {
      parts.push(variant.name);
    }

    const pattern = this.getCurrentPattern();
    if (pattern?.name) {
      parts.push(pattern.name);
    }

    return parts.join(" - ");
  }

  // ============ 原始数据访问 ============

  /**
   * 获取购买价格
   */
  getBuyPrice(): number | null {
    return this._data.buy ?? null;
  }

  /**
   * 获取出售价格
   */
  getSellPrice(): number | null {
    return this._data.sell ?? null;
  }

  /**
   * 获取图片URL列表
   */
  get images(): string[] {
    return this._data.images;
  }

  // /**
  //  * 是否可DIY
  //  */
  // isDIY(): boolean {
  //   return this._data.originalData?.diy ?? false;
  // }

  // /**
  //  * 是否可定制
  //  */
  // isCustomizable(): boolean {
  //   const bodyCustomize = this._data.originalData?.bodyCustomize ?? false;
  //   const patternCustomize = this._data.originalData?.patternCustomize ?? false;
  //   return bodyCustomize || patternCustomize;
  // }

  // /**
  //  * 是否为户外物品
  //  */
  // isOutdoor(): boolean {
  //   return this._data.originalData?.outdoor ?? false;
  // }

  // /**
  //  * 是否可交互
  //  */
  // isInteractive(): boolean {
  //   return this._data.originalData?.interact ?? false;
  // }

  // /**
  //  * 获取HHA基础分数
  //  */
  // getHHAPoints(): number | null {
  //   return this._data.originalData?.hhaBasePoints ?? null;
  // }

  // /**
  //  * 获取堆叠数量
  //  */
  // getStackSize(): number {
  //   return this._data.originalData?.stackSize ?? 1;
  // }

  // ============ 工具方法 ============

  /**
   * 根据颜色筛选查找匹配的变体和图案
   */
  findVariantByColor(
    color: Color
  ): { variantIndex: number; patternIndex: number } | null {
    if (!color) return null;
    // 遍历所有变体和图案
    const variants = this.getVariantGroups();
    if (variants.length === 0) {
      // 没有变体，检查物品本身的颜色
      return this.hasColor(color)
        ? { variantIndex: 0, patternIndex: 0 }
        : null;
    }
    // 有变体的情况
    for (let vIdx = 0; vIdx < variants.length; vIdx++) {
      const variant = variants[vIdx];
      if (variant) {
        for (let pIdx = 0; pIdx < variant.patterns.length; pIdx++) {
          const pattern = variant.patterns[pIdx];
          if (pattern?.colors?.includes(color)) {
            return { variantIndex: vIdx, patternIndex: pIdx };
          }
        }
      }
    }

    return null;
  }

  /**
   * 切换到指定颜色的变体
   */
  switchToColorVariant(color: Color): boolean {
    const match = this.findVariantByColor(color);
    if (match) {
      this.setVariantIndex(match.variantIndex);
      this.setPatternIndex(match.patternIndex);
      return true;
    }
    return false;
  }

  /**
   * 克隆物品模型
   */
  clone(): ItemModel {
    return new ItemModel({ ...this._data });
  }

  /**
   * 转换为JSON
   */
  toJSON(): Item {
    return this._data;
  }

  /**
   * 从普通对象创建物品模型
   */
  static fromJSON(data: Item): ItemModel {
    return new ItemModel(data);
  }

  /**
   * 批量创建物品模型
   */
  static fromArray(items: Item[]): ItemModel[] {
    return items.map((item) => new ItemModel(item));
  }

  // ============ 匹配筛选方法 ============

  /**
   * 检查物品是否匹配指定颜色
   */
  matchesColor(color: Color): boolean {
    // 检查物品本身的颜色
    if (this._data.colors?.includes(color)) {
      return true;
    }

    // 检查所有变体和图案是否包含该颜色
    if (this.getVariantGroups() && this.getVariantGroups().length > 0) {
      return this.getVariantGroups().some((variant) =>
        variant.patterns.some((pattern) => pattern.colors?.includes(color))
      );
    }

    return false;
  }

  /**
   * 检查物品是否匹配指定版本
   */
  matchesVersion(version: Version): boolean {
    return this.raw.ver === version;
  }

  /**
   * 检查物品是否匹配指定尺寸
   */
  matchesSize(size: ItemSize): boolean {
    return this.raw.size === size;
  }

  /**
   * 检查物品是否匹配指定标签
   */
  matchesTag(tag: string): boolean {
    return !tag || this.raw.tag === tag;
  }

  /**
   * 检查物品是否匹配指定系列
   */
  matchesSeries(series: string): boolean {
    return !series || this.raw.series === series;
  }

  /**
   * 检查物品是否匹配指定来源
   */
  matchesSource(source: string): boolean {
    return !source || this.getSources().includes(source);
  }
}
