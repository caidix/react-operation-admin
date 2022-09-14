export class RoutePath {
  static readonly BASE_PREFIX = 'user';
  static readonly HOME_PAGE = `${this.BASE_PREFIX}/home`;
  static ROOT = '/';
  static LOGIN = '/login';

  static readonly USER_GROUP_MANAGEMENT = `${this.BASE_PREFIX}/user-group-management`;
  static readonly USER_APPLICATION_MANAGEMENT = `${this.BASE_PREFIX}/app-management`;

  static ROOT_WHITE_PATH = [RoutePath.LOGIN];
}
