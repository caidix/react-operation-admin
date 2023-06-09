import { PlatformConsts } from '@src/consts';

export function getCurrentAppCode(pathname: string) {
  if (pathname.startsWith(PlatformConsts.MICRO_APP_ACTIVE_RULE_PREFIX)) {
    const paths = pathname.split('/');
    const appCode = paths[3];
    return appCode ? appCode : '';
  }
  return '';
}

/**
 * 获取微应用激活路径
 * @param appCode
 * @param slash
 */
export function getMicroActivePath(appCode: string, slash = false): string {
  if (slash) {
    `${PlatformConsts.MICRO_APP_ACTIVE_RULE_PREFIX}/${appCode}/`;
  }
  return `${PlatformConsts.MICRO_APP_ACTIVE_RULE_PREFIX}/${appCode}`;
}


export function formatMenus(list) {
  
}