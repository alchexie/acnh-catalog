// 物品数据类型定义

export interface Translation {
  sourceSheet: string;
  id: string | number;
  eUde?: string;
  eUen?: string;
  eUit?: string;
  eUnl?: string;
  eUru?: string;
  eUfr?: string;
  eUes?: string;
  uSen?: string;
  uSfr?: string;
  uSes?: string;
  jPja?: string;
  kRko?: string;
  tWzh?: string;
  cNzh?: string;
  plural?: boolean;
}

export interface Pattern {
  patternName: string;
  imageUrl: string;
  id: number;
  uniqueEntryId: string;
  colors: string[];
}

export interface VariantGroup {
  variantName: string;
  patterns: Pattern[];
}

export interface Item {
  name: string;
  id: number;
  category: string;
  imageUrl: string;
  colors: string[];
  owned: boolean;
  variantGroups: VariantGroup[];
  hasVariations: boolean;
  vIndex: number;
  pIndex: number;
  versionAdded?: string;
  source?: string[];
  size?: string;
  tag?: string;
  series?: string;
  seriesName?: string;
  originalData?: RawItem;
}

export interface RawItem {
  sourceSheet: string;
  name: string;
  image?: string;
  storageImage?: string;
  closetImage?: string;
  framedImage?: string;
  inventoryImage?: string;
  variation?: string;
  bodyTitle?: string;
  pattern?: string;
  patternTitle?: string;
  diy: boolean;
  bodyCustomize: boolean;
  patternCustomize: boolean;
  stackSize?: number;
  kitCost?: number;
  kitType?: string;
  cyrusCustomizePrice?: number;
  buy?: number;
  sell?: number;
  size?: string;
  surface: boolean;
  exchangePrice?: number;
  exchangeCurrency?: string;
  source?: string[];
  sourceNotes?: string;
  seasonEvent?: string;
  seasonEventExclusive?: boolean;
  hhaBasePoints?: number;
  hhaCategory?: string;
  interact: boolean;
  tag?: string;
  outdoor: boolean;
  speakerType?: string;
  lightingType?: string;
  foodPower?: number;
  catalog?: string;
  versionAdded?: string;
  unlocked: boolean;
  filename: string;
  variantId?: string;
  internalId: number;
  uniqueEntryId: string;
  seriesTranslations?: Translation;
  translations?: Translation;
  colors?: string[];
  concepts?: string[];
  set?: string;
  series?: string;
  recipe?: any;
  variations?: RawVariation[];
}

export interface RawVariation {
  variation?: string;
  pattern?: string;
  image?: string;
  storageImage?: string;
  closetImage?: string;
  framedImage?: string;
  inventoryImage?: string;
  internalId?: number;
  uniqueEntryId: string;
  colors?: string[];
  variantTranslations?: Translation;
  patternTranslations?: Translation;
}

export interface CatalogItem {
  label: string;
  unique_id: string;
}

export interface Translations {
  categories: Record<string, string>;
  sources: Record<string, string>;
  colors: Record<string, string>;
  tags: Record<string, string>;
  series: Record<string, string>;
}

export interface FilterOptions {
  searchTerm: string;
  category: string;
  ownedFilter: 'all' | 'owned' | 'not-owned';
  versionFilter: string;
  sourceFilter: string;
  sizeFilter: string;
  tagFilter: string;
  colorFilter: string;
  seriesFilter: string;
}

export interface SortOption {
  value: string;
  label: string;
}
