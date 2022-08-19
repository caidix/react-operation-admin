/**
 * 判空函数
 * @param {*} source
 * @returns
 */
export function isEmpty(source: any) {
  const type = Object.prototype.toString.call(source).slice(8, -1);
  switch (type) {
    case 'String':
      return source.trim().length === 0;
    case 'Number':
      return Number.isNaN(source);
    case 'Boolean':
      return false;
    case 'Undefined':
      return true;
    case 'Null':
      return true;
    case 'Object':
      return Object.keys(source).length === 0;
    case 'Array':
      return source.length === 0;
    case 'Map':
      return source.size() === 0;
    case 'Set':
      return source.size() === 0;
    default:
      return false;
  }
}

/**
 * 判断host
 * @param url
 * @returns boolean
 */
export function isHost(url: string) {
  const reg = /^http(s)?:\/\/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
  return reg.test(url);
}

export class Pattern {
  constructor() {
    throw new Error("can't instantiate this class!");
  }
  // 链接url
  static LINK_PATTERN = /^(https:\/\/|http:\/\/|\/)\w*/;

  static HTTP_PREFIX_PATTERN = /^(http[s]{0,1}:\/\/)/;

  static MOBILE_PATTERN = /^1[3-9]\d{9}$/;

  static CODE_PATTERN = /^[A-Za-z0-9_]*$/;

  // 小写 code
  static LOWER_CODE_PATTER = /^[a-z](([a-z]|[0-9]|_)*)$/;
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str: string) {
  const valid_map = ['admin', 'editor'];
  return valid_map.indexOf(str.trim()) >= 0;
}

export function getParamType(param: string) {
  const toString = Object.prototype.toString;
  return toString.call(param).slice(8, -1);
}

export function validateTypes(param: string, type: string) {
  return getParamType(param) === type;
}
