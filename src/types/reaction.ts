import type { Translation } from "./index";

/**
 * 表情反应数据类型
 */
export interface Reaction {
  sourceSheet: string;
  num: number;
  name: string;
  image: string;
  source: string[];
  sourceNotes: string | null;
  seasonEvent: string | null;
  seasonEventExclusive: string | null;
  versionAdded: string;
  iconFilename: string;
  internalId: number;
  uniqueEntryId: string;
  translations?: Translation;
}
