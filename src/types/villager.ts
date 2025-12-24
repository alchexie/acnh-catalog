import type { Translation } from "./index";

/**
 * 村民数据类型
 */
export interface Villager {
  sourceSheet: string;
  name: string;
  iconImage: string;
  photoImage: string;
  houseImage: string | null;
  species: string;
  gender: string;
  personality: string;
  subtype: string;
  hobby: string;
  birthday: string;
  catchphrase: string;
  favoriteSong: string;
  favoriteSaying: string;
  defaultClothing: string;
  defaultUmbrella: string;
  wallpaper: string;
  flooring: string;
  furnitureList: number[];
  furnitureNameList?: string[];
  diyWorkbench?: string;
  kitchenware?: string;
  versionAdded?: string;
  translations?: Translation;
  bubbleColor?: string;
  nameColor?: string;
}
