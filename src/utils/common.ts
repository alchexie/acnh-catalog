/**
 * 颜色变浅工具函数（支持 #RRGGBB 格式），白色边框时返回浅灰色
 * @param hex 颜色字符串
 * @param percent 变浅比例，默认0.7
 */
export function lightenColor(hex: string, percent = 0.7): string {
  if (!hex) return "#f5f5f5";
  const c = hex.replace("#", "").toLowerCase();
  // 判断常见白色
  if (c === "fff" || c === "ffffff" || c === "fffce9" || c === "fffbe6")
    return "#f5f5f5";
  if (c.length === 3) {
    if (c === "fff") return "#f5f5f5";
    hex =
      "#" +
      c
        .split("")
        .map((x) => x + x)
        .join("");
  }
  if (c.length !== 6) return "#f5f5f5";
  const num = parseInt(c, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.round(r + (255 - r) * percent);
  g = Math.round(g + (255 - g) * percent);
  b = Math.round(b + (255 - b) * percent);
  return `rgb(${r},${g},${b})`;
}

/**
 * 连接数组元素为字符串
 * @param arr 字符串数组
 * @param separator 分隔符，默认为逗号
 * @param fallback 数组为空时的回退值
 * @returns 连接后的字符串
 */
export function joinArray(
  arr: string[] | undefined,
  separator = ", ",
  fallback = "--"
): string {
  if (!arr || arr.length === 0) return fallback;
  return arr.join(separator);
}

/**
 * 延迟执行
 * @param ms 延迟毫秒数
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 安全的JSON解析
 * @param json JSON字符串
 * @param fallback 解析失败时的回退值
 * @returns 解析结果或回退值
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * 深度克隆对象
 * @param obj 要克隆的对象
 * @returns 克隆后的对象
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 生成范围数组
 * @param start 起始值
 * @param end 结束值
 * @returns 数字数组
 */
export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
