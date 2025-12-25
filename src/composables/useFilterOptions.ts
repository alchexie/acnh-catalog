import { ref, type Ref } from "vue";
import { ItemModel } from "../models/ItemModel";
import { Color, ItemCategory, ItemSize, Version } from "../types/item";
import { getCategoryName, getColorName, getSizeName, getVersionName } from "../services/dataService";

export interface FilterOption<T = string> {
  value?: T;
  name: string;
}

export interface FilterOptionsData {
  categories: Ref<FilterOption<ItemCategory>[]>;
  versions: Ref<FilterOption<Version>[]>;
  sources: Ref<FilterOption[]>;
  sizes: Ref<FilterOption<ItemSize>[]>;
  tags: Ref<FilterOption[]>;
  colors: Ref<FilterOption<Color>[]>;
  series: Ref<FilterOption[]>;
  populateFilters: (items: ItemModel[]) => void;
}

/**
 * 组合函数：管理筛选器选项
 * 从物品列表中提取并维护各种筛选器选项
 */
export function useFilterOptions(): FilterOptionsData {
  const categories = ref<FilterOption<ItemCategory>[]>([]);
  const versions = ref<FilterOption<Version>[]>([]);
  const sources = ref<FilterOption[]>([]);
  const sizes = ref<FilterOption<ItemSize>[]>([]);
  const tags = ref<FilterOption[]>([]);
  const colors = ref<FilterOption<Color>[]>([]);
  const series = ref<FilterOption[]>([]);

  const populateCategories = (): void => {
    categories.value = Object.values(ItemCategory).map((category) => ({
      value: category,
      name: getCategoryName(category),
    }));
  }

  const populateVersions = (): void => {
    versions.value = Object.values(Version).map((version) => ({
      value: version,
      name: getVersionName(version),
    }));
  }

  const populateSources = (items: ItemModel[]): void => {
    const itemSources = new Set<string>();

    items.forEach((item) => {
      item.getSources().forEach((s) => itemSources.add(s));
    });

    sources.value = [...itemSources].sort().map((source) => ({
      value: source,
      name: source,
    }));
  };

  const populateSizes = (): void => {
    sizes.value = Object.values(ItemSize).map((size) => ({
      value: size,
      name: getSizeName(size),
    }));
  }

  /**
   * 从物品列表中填充标签选项
   */
  const populateTags = (items: ItemModel[]): void => {
    const tagsSet = new Set(
      items.map((item) => item.getTag()).filter((t): t is string => !!t)
    );

    tags.value = [...tagsSet].sort().map((tag) => ({
      value: tag,
      name: tag,
    })).sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
  };

  const populateColors = (): void => {
    colors.value = Object.values(Color).map((color) => ({
      value: color,
      name: getColorName(color),
    }));
  }

  /**
   * 从物品列表中填充系列选项
   */
  const populateSeries = (items: ItemModel[]): void => {
    const seriesMap = new Map<string, string>();

    items.forEach((item) => {
      const series = item.getSeries();
      if (series && !seriesMap.has(series)) {
        // 从原始数据中获取翻译后的系列名称
        const seriesName = series;
        seriesMap.set(series, seriesName);
      }
    });

    series.value = [...seriesMap.entries()]
      .map(([value, name]) => ({ value, name }))
      .sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
  };

  /**
   * 填充所有筛选器选项
   */
  const populateFilters = (items: ItemModel[]): void => {
    populateCategories();
    populateVersions();
    populateSources(items);
    populateSizes();
    populateTags(items);
    populateColors();
    populateSeries(items);
  };

  return {
    categories,
    versions,
    sources,
    sizes,
    tags,
    colors,
    series,
    populateFilters,
  };
}
