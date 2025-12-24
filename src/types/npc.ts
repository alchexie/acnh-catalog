import type { Translation } from "./index";

/**
 * NPC数据类型
 */
export interface NPC {
  sourceSheet: string;
  name: string;
  iconImage: string;
  photoImage: string;
  gender: string;
  genderAsia?: string;
  versionAdded: string | null;
  npcId: string;
  internalId: number;
  birthday: string;
  nameColor: string;
  bubbleColor: string;
  iconFilename: string;
  photoFilename: string;
  uniqueEntryId: string;
  translations?: Translation;
}
