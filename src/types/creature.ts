import type { Translation } from "./index";

/**
 * 半球时间信息
 */
export interface HemisphereInfo {
  time?: string[];
  timeArray?: number[];
  months?: string[];
  monthsArray?: number[];
}

/**
 * 生物数据类型（昆虫、鱼类等）
 */
export interface Creature {
  sourceSheet: string;
  num: number;
  name: string;
  iconImage: string;
  critterpediaImage: string;
  furnitureImage: string;
  sell: number;
  whereHow?: string;
  weather?: string;
  totalCatchesToUnlock: number;
  spawnRates: string;
  size: string;
  surface?: boolean;
  description?: string[];
  catchPhrase?: string[];
  hhaBasePoints: number;
  hhaCategory: string;
  iconFilename: string;
  critterpediaFilename: string;
  furnitureFilename: string;
  internalId: number;
  uniqueEntryId: string;
  translations?: Translation;
  versionAdded?: string;
  hemispheres?: {
    north?: HemisphereInfo;
    south?: HemisphereInfo;
  };
  // 时间相关（会在某些生物中出现）
  nMonths?: string[];
  sMonths?: string[];
  time?: string;
  isAllDay?: boolean;
  isAllYear?: boolean;
}
