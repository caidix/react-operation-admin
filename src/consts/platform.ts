/**
 * 路由路径配置
 */
export class PlatformConsts {
  constructor() {
    throw new Error("can't instantiate this class!");
  }
  // 子应用路由激活前缀
  static readonly MICRO_APP_ACTIVE_RULE_PREFIX = '/user/micro';
  // 子应用挂载点id
  static readonly MICRO_APP_MOUNT_ID = 'micro-container';

  static readonly MAIN_CONTENT_MOUNTED_ID = 'main-container';
  // 本应用编码
  static readonly APP_PLATFORM_CODE = 'fe-operate';
  // 头部限制应用组数量
  static readonly DEFAULT_GROUP_LIMIT = 10;
  // 路由框架前缀
  static readonly ROUTE_FRAME_PREFIX = 'user';
}
