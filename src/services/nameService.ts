/**
 * 名称服务 - 管理所有名称映射和翻译
 */
import { CreatureType, Gender, Hobby, Personality, PlantType, Species } from '../types';
import { ConstructionType } from '../types/construction';
import { Catalog, Color, Currency, ItemSize, ItemType, KitType, Version } from '../types/item';
import { RecipeType } from '../types/recipe';
import { translationsCache, getTranslation } from './translationService';
import {
  PersonalityNameMap,
  HobbyNameMap,
  SpeciesNameMap,
  ConstellationNameMap,
} from './mappings/villagerMappings';
import {
  ItemTypeNameMap,
  VersionNameMap,
  ItemSizeNameMap,
  ColorNameMap,
  CatalogNameMap,
  CurrencyNameMap,
} from './mappings/itemMappings';
import { RecipeTypeNameMap } from './mappings/recipeMappings';
import { CreatureTypeNameMap } from './mappings/creatureMappings';
import { ConstructionTypeNameMap } from './mappings/constructionMappings';
import { PlantTypeNameMap } from './mappings/plantMappings';
import { Constellation } from '../utils/dateUtils';

// ============ 物品相关名称 ============

export function getItemTypeName(type: ItemType): string {
  return ItemTypeNameMap[type];
}

export function getVersionName(ver: Version): string {
  return VersionNameMap[ver];
}

export function getSizeName(size: ItemSize): string {
  return ItemSizeNameMap[size];
}

export function getColorName(color: Color | string): string {
  if (typeof color === 'string') {
    color = Object.entries(Color).find(([k]) => k === color)?.[1] as Color;
  }
  return ColorNameMap[color];
}

export function getCatalogName(catalog: Catalog): string {
  return CatalogNameMap[catalog];
}

export function getCurrencyName(currency: Currency): string {
  return CurrencyNameMap[currency];
}

export function getKitTypeName(kitType: KitType): string {
  const nameMap: Record<KitType, string> = {
    [KitType.Normal]: '改造工具组',
    [KitType.Pumpkin]: '南瓜',
    [KitType.RainbowFeather]: '彩虹羽毛',
  };
  return nameMap[kitType];
}

// ============ 翻译相关名称 ============

export function getSourceName(source: string): string {
  return getTranslation(source, translationsCache?.sources);
}

export function getTagName(tag: string): string {
  return getTranslation(tag, translationsCache?.tags);
}

export function getItemVariantTitle(title: string): string {
  return getTranslation(title, translationsCache?.itemVariantTitles);
}

// ============ HHA 相关名称 ============

export function getHHASeriesName(series: string): string {
  return getTranslation(series, translationsCache?.series);
}

export function getHHASeriesOrder(): string[] {
  return Object.keys(translationsCache?.series || {});
}

export function getHHASetName(set: string): string {
  return getTranslation(set, translationsCache?.sets);
}

export function getHHASetsOrder(): string[] {
  return Object.keys(translationsCache?.sets || {});
}

export function getHHAConceptName(concept: string): string {
  return getTranslation(concept, translationsCache?.concepts);
}

export function getHHAConceptsOrder(): string[] {
  return Object.keys(translationsCache?.concepts || {});
}

export function getHHACategoryName(category: string): string {
  return getTranslation(category, translationsCache?.categories);
}

// ============ 服饰相关名称 ============

export function getClothingStyleName(style: string): string {
  return getTranslation(style, translationsCache?.styles);
}

export function getClothingThemeName(theme: string): string {
  return getTranslation(theme, translationsCache?.themes);
}

// ============ 生物相关名称 ============

export function getCreatureTypeName(type: CreatureType): string {
  return CreatureTypeNameMap[type];
}

// ============ 村民相关名称 ============

export function getPersonalityName(personality: Personality): string {
  return PersonalityNameMap[personality];
}

export function getHobbyName(hobby: Hobby): string {
  return HobbyNameMap[hobby];
}

export function getSpeciesName(species: Species): string {
  return SpeciesNameMap[species];
}

export function getGenderName(gender: Gender): string {
  if (gender === Gender.Male) return '男性';
  if (gender === Gender.Female) return '女性';
  return gender;
}

export function getConstellationName(constellation: Constellation): string {
  return ConstellationNameMap[constellation];
}

// ============ 配方相关名称 ============

export function getRecipeTypeName(type: RecipeType): string {
  return RecipeTypeNameMap[type] || '';
}

// ============ 建筑相关名称 ============

export function getConstructionTypeName(type: ConstructionType): string {
  return ConstructionTypeNameMap[type];
}

// ============ 植物相关名称 ============

export function getPlantTypeName(type: PlantType): string {
  return PlantTypeNameMap[type];
}
