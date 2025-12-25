import type { FilterOptions } from "../types";
import { ItemModel } from "../models/ItemModel";
import { CONFIG } from "../config";
import { Color, ItemCategory, Version, ItemSize } from "../types/item";

/**
 * 检查物品是否匹配搜索词
 */
function matchesSearchTerm(item: ItemModel, searchTerm: string): boolean {
  return item.name.toLowerCase().includes(searchTerm.toLowerCase());
}

/**
 * 检查物品是否匹配分类筛选
 */
function matchesCategory(item: ItemModel, category?: ItemCategory): boolean {
  if (category === undefined) return true;
  return item.raw.category === category;
}

/**
 * 检查物品是否匹配拥有状态筛选
 */
function matchesOwnedFilter(item: ItemModel, ownedFilter?: boolean): boolean {
  if (ownedFilter === undefined) return true;
  return item.owned === ownedFilter;
}

/**
 * 检查物品是否匹配版本筛选
 */
function matchesVersion(item: ItemModel, version?: Version): boolean {
  if (version === undefined) return true;
  return item.raw.ver === version;
}

/**
 * 检查物品是否匹配来源筛选
 */
function matchesSource(item: ItemModel, sourceFilter: string): boolean {
  return item.matchesSource(sourceFilter);
}

/**
 * 检查物品是否匹配尺寸筛选
 */
function matchesSize(item: ItemModel, size?: ItemSize): boolean {
  if (size === undefined) return true;
  return item.matchesSize(size);
}

/**
 * 检查物品是否匹配标签筛选
 */
function matchesTag(item: ItemModel, tagFilter: string): boolean {
  return item.matchesTag(tagFilter);
}

/**
 * 检查物品是否匹配系列筛选
 */
function matchesSeries(item: ItemModel, seriesFilter: string): boolean {
  return item.matchesSeries(seriesFilter);
}

/**
 * 检查物品或其变体是否匹配颜色筛选
 * 使用 ItemModel 方法进行颜色匹配
 * @returns 是否匹配颜色
 */
function matchesColor(item: ItemModel, color?: Color): boolean {
  if (color === undefined) return true;
  return item.matchesColor(color);
}

/**
 * 筛选物品列表
 * @param allItems 所有物品
 * @param filters 筛选条件
 * @returns 筛选后的物品列表
 */
export function filterItems(allItems: ItemModel[], filters: FilterOptions): ItemModel[] {
  return allItems.filter((item) => {
    // 检查所有筛选条件
    return (
      matchesSearchTerm(item, filters.searchTerm) &&
      matchesCategory(item, filters.category) &&
      matchesOwnedFilter(item, filters.ownedFilter) &&
      matchesVersion(item, filters.versionFilter) &&
      matchesSource(item, filters.sourceFilter) &&
      matchesSize(item, filters.sizeFilter) &&
      matchesTag(item, filters.tagFilter) &&
      matchesSeries(item, filters.seriesFilter) &&
      matchesColor(item, filters.colorFilter)
    );
  });
}

/**
 * 比较函数：按名称升序
 */
function compareByNameAsc(a: ItemModel, b: ItemModel): number {
  return a.name.localeCompare(b.name, "zh-CN");
}

/**
 * 比较函数：按名称降序
 */
function compareByNameDesc(a: ItemModel, b: ItemModel): number {
  return b.name.localeCompare(a.name, "zh-CN");
}

/**
 * 比较函数：按ID升序
 */
function compareByIdAsc(a: ItemModel, b: ItemModel): number {
  return (a.id || 0) - (b.id || 0);
}

/**
 * 比较函数：按ID降序
 */
function compareByIdDesc(a: ItemModel, b: ItemModel): number {
  return (b.id || 0) - (a.id || 0);
}

/**
 * 获取排序比较函数
 */
function getSortComparator(sortValue: string): (a: ItemModel, b: ItemModel) => number {
  switch (sortValue) {
    case CONFIG.SORT_OPTIONS.NAME_ASC:
      return compareByNameAsc;
    case CONFIG.SORT_OPTIONS.NAME_DESC:
      return compareByNameDesc;
    case CONFIG.SORT_OPTIONS.ID_ASC:
      return compareByIdAsc;
    case CONFIG.SORT_OPTIONS.ID_DESC:
      return compareByIdDesc;
    default:
      return () => 0;
  }
}

/**
 * 对物品列表进行排序
 * @param items 要排序的物品列表
 * @param sortValue 排序方式
 * @returns 排序后的物品列表
 */
export function sortItems(items: ItemModel[], sortValue: string): ItemModel[] {
  const sortedItems = [...items];
  const comparator = getSortComparator(sortValue);
  sortedItems.sort(comparator);
  return sortedItems;
}
