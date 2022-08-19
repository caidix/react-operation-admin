/**
 * 深克隆数据, 对字符串进行两边空格去除
 * @param {*} source
 * @returns
 */
export function deepRemoveBlank(source: any): any {
  if (typeof source === 'string') {
    return source.trim();
  }
  if (typeof source === 'object' && source !== null) {
    const temp: any = Array.isArray(source) ? [] : {};
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        temp[key] = deepRemoveBlank(source[key]);
      }
    }
    return temp;
  }
  return source;
}
