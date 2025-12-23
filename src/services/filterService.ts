import type { Item, FilterOptions } from '../types';
import { CONFIG } from '../config';

export function filterItems(allItems: Item[], filters: FilterOptions): Item[] {
  return allItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesCategory = !filters.category || item.category === filters.category;
    const matchesOwned = filters.ownedFilter === CONFIG.FILTER_OPTIONS.ALL || 
                        (filters.ownedFilter === CONFIG.FILTER_OPTIONS.OWNED && item.owned) ||
                        (filters.ownedFilter === CONFIG.FILTER_OPTIONS.NOT_OWNED && !item.owned);
    const matchesVersion = !filters.versionFilter || item.versionAdded === filters.versionFilter;
    const matchesSource = !filters.sourceFilter || (item.source && item.source.includes(filters.sourceFilter));
    const matchesSize = !filters.sizeFilter || item.size === filters.sizeFilter;
    const matchesTag = !filters.tagFilter || item.tag === filters.tagFilter;
    const matchesSeries = !filters.seriesFilter || item.series === filters.seriesFilter;
    
    let matchesColor = !filters.colorFilter || (item.colors && item.colors.includes(filters.colorFilter));
    
    if (!matchesColor && item.variantGroups) {
      for (let i = 0; i < item.variantGroups.length; i++) {
        const variation = item.variantGroups[i];
        if (variation) {
          for (let j = 0; j < variation.patterns.length; j++) {
            const pattern = variation.patterns[j];
            if (pattern && pattern.colors && pattern.colors.includes(filters.colorFilter)) {
              matchesColor = true;
              item.vIndex = i;
              item.pIndex = j;
              break;
            }
          }
        }
        if (matchesColor) break;
      }
    }
    
    const matches = matchesSearch && matchesCategory && matchesOwned && matchesVersion && 
                   matchesSource && matchesSize && matchesTag && matchesColor && matchesSeries;
    
    if (matches && filters.colorFilter && item.hasVariations && item.variantGroups) {
      for (const variantGroup of item.variantGroups) {
        for (const pattern of variantGroup.patterns) {
          if (pattern.colors && pattern.colors.includes(filters.colorFilter)) {
            item.id = pattern.id;
            item.imageUrl = pattern.imageUrl;
            return true;
          }
        }
      }
    }
    
    return matches;
  });
}

export function sortItems(items: Item[], sortValue: string): Item[] {
  const sortedItems = [...items];
  
  sortedItems.sort((a, b) => {
    switch (sortValue) {
      case CONFIG.SORT_OPTIONS.NAME_ASC:
        return a.name.localeCompare(b.name, 'zh-CN');
      case CONFIG.SORT_OPTIONS.NAME_DESC:
        return b.name.localeCompare(a.name, 'zh-CN');
      case CONFIG.SORT_OPTIONS.ID_ASC:
        return (a.id || 0) - (b.id || 0);
      case CONFIG.SORT_OPTIONS.ID_DESC:
        return (b.id || 0) - (a.id || 0);
      default:
        return 0;
    }
  });
  
  return sortedItems;
}
