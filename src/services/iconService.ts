/**
 * 图标服务 - 管理所有图标 URL 获取
 */
import { getImgUrl } from '../utils/imageUtils';
import { CreatureType, Gender, PlantType, Species } from '../types';
import { ConstructionType } from '../types/construction';
import { Catalog, Currency, ItemSize, ItemType, KitType } from '../types/item';
import { RecipeType } from '../types/recipe';
import { Constellation } from '../utils/dateUtils';

// ============ 物品相关图标 ============

export function getItemTypeIcon(type: ItemType): string {
  return getImgUrl(`img/icon/item_type/item_type_${type}.png`);
}

export function getItemSubtypeIcon(type: ItemType, subtype: number): string {
  return getImgUrl(`img/icon/item_subtype/type_${type}_${subtype}.png`);
}

export function getSizeIcon(size: ItemSize): string {
  const iconMap: Record<ItemSize, string> = {
    [ItemSize.The05X1]: 'Size_0.5_x_1.0.png',
    [ItemSize.The1X05]: 'Size_1.0_x_0.5.png',
    [ItemSize.The1X1]: 'Size_1.0_x_1.0.png',
    [ItemSize.The1X15]: 'Size_1.0_x_1.5.png',
    [ItemSize.The1X2]: 'Size_1.0_x_2.0.png',
    [ItemSize.The15X15]: 'Size_1.5_x_1.5.png',
    [ItemSize.The2X05]: 'Size_2.0_x_0.5.png',
    [ItemSize.The2X1]: 'Size_2.0_x_1.0.png',
    [ItemSize.The2X15]: 'Size_2.0_x_1.5.png',
    [ItemSize.The2X2]: 'Size_2.0_x_2.0.png',
    [ItemSize.The3X1]: 'Size_3.0_x_1.0.png',
    [ItemSize.The3X2]: 'Size_3.0_x_2.0.png',
    [ItemSize.The3X3]: 'Size_3.0_x_3.0.png',
    [ItemSize.The4X3]: 'Size_4.0_x_3.0.png',
    [ItemSize.The4X4]: 'Size_4.0_x_4.0.png',
    [ItemSize.The5X5]: 'Size_5.0_x_5.0.png',
  };
  return getImgUrl(`img/icon/size/${iconMap[size]}`);
}

export function getCatalogIcon(catalog: Catalog): string {
  const iconMap: Record<Catalog, string> = {
    [Catalog.NotInCatalog]: '',
    [Catalog.NotForSale]: getImgUrl('img/icon/catalog_2.png'),
    [Catalog.ForSale]: getImgUrl('img/icon/catalog_3.png'),
    [Catalog.Seasonal]: getImgUrl('img/icon/catalog_4.png'),
  };
  return iconMap[catalog];
}

export function getCurrencyIcon(currency: Currency): string {
  return getImgUrl(`img/icon/currency_${currency}.png`);
}

export function getKitTypeIcon(kitType: KitType): string {
  const iconMap: Record<KitType, string> = {
    [KitType.Normal]: getImgUrl('img/icon/kit_type_1.png'),
    [KitType.Pumpkin]: getImgUrl('img/icon/kit_type_2.png'),
    [KitType.RainbowFeather]: getImgUrl('img/icon/kit_type_3.png'),
  };
  return iconMap[kitType];
}

// ============ 生物相关图标 ============

export function getCreatureTypeIcon(type: CreatureType): string {
  const iconMap: Record<CreatureType, string> = {
    [CreatureType.Insects]: getImgUrl('img/icon/creature_type_1.png'),
    [CreatureType.Fish]: getImgUrl('img/icon/creature_type_2.png'),
    [CreatureType.SeaCreatures]: getImgUrl('img/icon/creature_type_3.png'),
  };
  return iconMap[type];
}

// ============ 村民相关图标 ============

export function getSpeciesIcon(species: Species): string {
  return getImgUrl(`img/icon/species/species_${species}.png`);
}

export function getGenderIcon(gender: Gender): string {
  const iconMap: Record<Gender, string> = {
    [Gender.Male]: getImgUrl('img/icon/gender_2.png'),
    [Gender.Female]: getImgUrl('img/icon/gender_1.png'),
  };
  return iconMap[gender];
}

export function getConstellationIcon(constellation: Constellation): string {
  return getImgUrl(`img/icon/constellation/constellation_${constellation}.png`);
}

// ============ 配方相关图标 ============

export function getRecipeTypeIcon(type: RecipeType): string {
  return getImgUrl(`img/icon/recipe_type/recipe_type_${type}.png`);
}

// ============ 建筑相关图标 ============

export function getConstructionTypeIcon(type: ConstructionType): string {
  return getImgUrl(`img/icon/construction_type/construction_type_${type}.png`);
}

// ============ 植物相关图标 ============

export function getPlantTypeIcon(type: PlantType): string {
  return getImgUrl(`img/icon/plant_type/plant_type_${type}.png`);
}
