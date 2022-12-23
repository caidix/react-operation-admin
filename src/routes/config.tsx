export class RoutePath {
  static readonly BASE_PREFIX = 'user';
  static readonly HOME_PAGE = `${this.BASE_PREFIX}/home`;
  static ROOT = '/';
  static LOGIN = '/login';

  static readonly USER_GROUP_MANAGEMENT = `${this.BASE_PREFIX}/user-group-management`;
  static readonly USER_APPLICATION_MANAGEMENT = `${this.BASE_PREFIX}/app-management`;
  static readonly USER_ApplicationEdit = `${this.BASE_PREFIX}/app-edit`;
  static readonly USER_AUTH_MANAGEMENT = `${this.BASE_PREFIX}/app-auth-management`;
  static readonly USER_ROLE_MANAGEMENT = `${this.BASE_PREFIX}/app-role-management`;

  static ROOT_WHITE_PATH = [RoutePath.LOGIN];
}
