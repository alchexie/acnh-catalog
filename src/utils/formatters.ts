/**
 * 格式化工具函数 - 价格、尺寸等格式化
 */
import { type Price, type CusCost } from '../types';
import { Currency, ItemSize } from '../types/item';
import { getCurrencyIcon, getKitTypeIcon, getSizeIcon } from '../services/iconService';
import { getCurrencyName, getKitTypeName, getSizeName } from '../services/nameService';

/**
 * 获取价格字符串（纯文本）
 */
export function getPriceStr(price: Price | null | undefined): string {
  if (!price) return '';
  if (price && !Array.isArray(price)) {
    price = [price, Currency.Bells];
  }
  const [amount, currency] = price as [number, Currency];
  if (amount < 0) return '';

  return `${amount.toLocaleString()} ${getCurrencyName(currency)}`;
}

/**
 * 获取价格字符串（带图标 HTML）
 */
export function getPriceWithIcon(price: Price | null | undefined): string {
  if (!price) return '';
  if (price && !Array.isArray(price)) {
    price = [price, Currency.Bells];
  }
  const [amount, currency] = price as [number, Currency];
  if (amount < 0) return '';

  const icon = getCurrencyIcon(currency);
  return `${amount.toLocaleString()} <img src="${icon}" alt="${getCurrencyName(
    currency
  )}" title="${getCurrencyName(currency)}" class="inline-icon" />`;
}

/**
 * 获取改造花费字符串（带图标 HTML）
 */
export function getCusCost(cusCost: CusCost | null | undefined): string {
  if (!cusCost) return '';
  const [kitCost, kitType] = cusCost;
  if (kitCost <= 0) return '';
  const icon = getKitTypeIcon(kitType);
  return `${kitCost.toLocaleString()} <img src="${icon}" title="${getKitTypeName(kitType)}" class="inline-icon" />`;
}

/**
 * 获取尺寸字符串（带图标 HTML）
 */
export function getSizeWithIcon(size: ItemSize): string {
  const sizeName = getSizeName(size);
  const icon = getSizeIcon(size);
  if (!icon) return sizeName;
  return `${sizeName} <img src="${icon}" class="inline-icon" />`;
}
