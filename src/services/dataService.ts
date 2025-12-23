import type { RawItem, CatalogItem, Translations, Item, VariantGroup } from '../types';
import { CONFIG } from '../config';

let translationsCache: Translations | null = null;

export async function loadTranslations(): Promise<Translations> {
  if (translationsCache) {
    return translationsCache;
  }
  
  try {
    const response = await fetch(CONFIG.DATA_FILES.TRANSLATIONS);
    translationsCache = await response.json();
    return translationsCache!;
  } catch (error) {
    console.error('加载翻译数据失败:', error);
    return { categories: {}, sources: {}, colors: {}, tags: {}, series: {} };
  }
}

export async function loadItemsData(): Promise<RawItem[]> {
  const response = await fetch(CONFIG.DATA_FILES.ITEMS);
  return await response.json();
}

export async function loadCatalogData(): Promise<{ ownedNames: Set<string>; ownedIds: Set<string> }> {
  try {
    const response = await fetch(CONFIG.DATA_FILES.CATALOG);
    const data: { items: CatalogItem[] } = await response.json();
    const ownedNames = new Set<string>();
    const ownedIds = new Set<string>();
    
    data.items.forEach(item => {
      ownedNames.add(item.label);
      ownedIds.add(item.unique_id);
    });
    
    return { ownedNames, ownedIds };
  } catch (error) {
    console.log("无法加载 catalog_items.json，将不显示拥有状态");
    return { ownedNames: new Set(), ownedIds: new Set() };
  }
}

export function processItemsData(
  acnhItems: RawItem[],
  ownedData: { ownedNames: Set<string>; ownedIds: Set<string> }
): Item[] {
  const { ownedNames, ownedIds } = ownedData;
  
  return acnhItems
    .map((item) => {
      const name = item.translations?.cNzh || item.name;
      let id = item.internalId;
      let imageUrl =
        item.image ||
        item.storageImage ||
        item.closetImage ||
        item.framedImage ||
        item.inventoryImage ||
        '';

      const variantGroups: VariantGroup[] = [];
      let hasVariations = false;
      let colors = item.colors || [];
      let owned = false;

      if (item.variations && item.variations.length > 0) {
        const variantMap = new Map<string, VariantGroup>();

        item.variations.forEach((v) => {
          const variantName = v.variantTranslations?.cNzh || v.variation || "";

          if (!variantMap.has(variantName)) {
            variantMap.set(variantName, {
              variantName: variantName,
              patterns: [],
            });
          }
          
          variantMap.get(variantName)!.patterns.push({
            patternName: v.patternTranslations?.cNzh || v.pattern || "",
            imageUrl:
              v.image ||
              v.storageImage ||
              v.closetImage ||
              v.framedImage ||
              item.inventoryImage ||
              imageUrl,
            id: v.internalId || id,
            uniqueEntryId: v.uniqueEntryId,
            colors: v.colors || item.colors || [],
          });
        });

        variantGroups.push(...Array.from(variantMap.values()));
        hasVariations = variantGroups.length > 0;

        if (hasVariations && variantGroups[0] && variantGroups[0].patterns.length > 0) {
          const firstPattern = variantGroups[0].patterns[0];
          if (firstPattern) {
            id = firstPattern.id || id;
            imageUrl = firstPattern.imageUrl || imageUrl;
            colors = firstPattern.colors || colors;
          }
        }
      }
      
      owned = ownedNames.has(name) || ownedIds.has(String(item.internalId)) || ownedIds.has(item.uniqueEntryId);

      return {
        name,
        id,
        category: item.sourceSheet || "Other",
        imageUrl,
        colors,
        owned,
        variantGroups,
        hasVariations,
        vIndex: 0,
        pIndex: 0,
        versionAdded: item.versionAdded,
        source: item.source,
        size: item.size,
        tag: item.tag,
        series: item.series,
        seriesName: item.seriesTranslations?.cNzh || item.series,
        originalData: item,
      };
    })
    .sort((a, b) => a.id - b.id);
}

export function getCategoryName(category: string): string {
  if (!translationsCache || !translationsCache.categories) {
    return category;
  }
  return translationsCache.categories[category] || category;
}

export function getSourceName(source: string): string {
  if (!translationsCache || !translationsCache.sources) {
    return source;
  }
  return translationsCache.sources[source] || source;
}

export function getColorName(color: string): string {
  if (!translationsCache || !translationsCache.colors) {
    return color;
  }
  return translationsCache.colors[color] || color;
}

export function getTagName(tag: string): string {
  if (!translationsCache || !translationsCache.tags) {
    return tag;
  }
  return translationsCache.tags[tag] || tag;
}

export function getSeriesName(series: string): string {
  if (!translationsCache || !translationsCache.series) {
    return series;
  }
  return translationsCache.series[series] || series;
}

export function getCategoryOrder(): string[] {
  if (!translationsCache || !translationsCache.categories) {
    return [];
  }
  return Object.keys(translationsCache.categories);
}

export function getSourceOrder(): string[] {
  if (!translationsCache || !translationsCache.sources) {
    return [];
  }
  return Object.keys(translationsCache.sources);
}

export function getColorOrder(): string[] {
  if (!translationsCache || !translationsCache.colors) {
    return [];
  }
  return Object.keys(translationsCache.colors);
}
