import dayjs from 'dayjs';
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
export class TimeFormat {
  static DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
  static DATE_FORMAT = 'YYYY-MM-DD';
  /**
   *
   * @param time 时间戳 毫秒
   * @param format 格式
   */
  static formatTime(time: string | number, format: string = TimeFormat.DATE_TIME_FORMAT, display: string = '-') {
    if (!time) return display;
    const stamp = typeof time === 'string' ? Number(time) : time;
    return dayjs(stamp).format(format);
  }
  /**
   *
   * @param time 时间戳 毫秒
   * @param format 格式
   */
  static formatSecondTime(time: string | number, format: string = TimeFormat.DATE_TIME_FORMAT, display: string = '-') {
    if (!time) return display;
    const stamp = typeof time === 'string' ? Number(time) : time;
    if (typeof stamp !== 'number') return display;
    return dayjs(stamp * 1e3).format(format);
  }
}
