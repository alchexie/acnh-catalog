/**
 * 日期相关工具函数
 */

/**
 * 星座枚举
 */
export enum Constellation {
  Aries = 1,
  Taurus = 2,
  Gemini = 3,
  Cancer = 4,
  Leo = 5,
  Virgo = 6,
  Libra = 7,
  Scorpio = 8,
  Sagittarius = 9,
  Capricorn = 10,
  Aquarius = 11,
  Pisces = 12,
}

/**
 * 根据生日计算星座
 */
export function getConstellation(birthday: string): Constellation {
  const [monthStr, dayStr] = birthday.split('/');
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (!month || !day) return Constellation.Aries;

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return Constellation.Aries;
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return Constellation.Taurus;
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return Constellation.Gemini;
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return Constellation.Cancer;
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return Constellation.Leo;
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return Constellation.Virgo;
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return Constellation.Libra;
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return Constellation.Scorpio;
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return Constellation.Sagittarius;
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return Constellation.Capricorn;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return Constellation.Aquarius;
  return Constellation.Pisces;
}
