import { PlatformConsts } from '@src/consts';

PlatformConsts;
export class RoutePath {
  static readonly HOME_PAGE = `${PlatformConsts.ROUTE_FRAME_PREFIX}/home`;
  static ROOT = '/';
  static LOGIN = '/login';

  static readonly USER_GROUP_MANAGEMENT = `${PlatformConsts.ROUTE_FRAME_PREFIX}/user-group-management`;
  static readonly USER_APPLICATION_MANAGEMENT = `${PlatformConsts.ROUTE_FRAME_PREFIX}/app-management`;
  static readonly USER_ApplicationEdit = `${PlatformConsts.ROUTE_FRAME_PREFIX}/app-edit`;
  static readonly USER_AUTH_MANAGEMENT = `${PlatformConsts.ROUTE_FRAME_PREFIX}/app-auth-management`;
  static readonly USER_ROLE_MANAGEMENT = `${PlatformConsts.ROUTE_FRAME_PREFIX}/app-role-management`;
  static readonly USER_MANAGEMENT = `${PlatformConsts.ROUTE_FRAME_PREFIX}/user-management`;

  static readonly ALL = `${PlatformConsts.MICRO_APP_ACTIVE_RULE_PREFIX}/*`;
  static ROOT_WHITE_PATH = [RoutePath.LOGIN];
}
