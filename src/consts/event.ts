export class EventName {
  constructor() {
    throw new Error("can't instantiate this class!");
  }
  // 更新菜单
  static UPDATE_MENU = 'UPDATE_MENU';

  // 检查组件
  static CHECK_COMP = 'CHECK_COMP';

  // 获取用户信息
  static GET_USER_INFO = 'GET_USER_INFO';

  static SWITCH_BREADCRUMB = 'SWITCH_BREADCRUMB';

  // 需要进行登录, 此操作会让基座前往登录页面
  static NEED_LOGIN_IN = 'NEED_LOGIN_IN';

  // 切换回主应用
  static SWITCH_HOME = 'SWITCH_HOME';

  // 切换到微应用
  static SWITCH_MICRO = 'SWITCH_MICRO';

  // 更新导航应用组
  static UPDATE_NAV_APP_GROUP = 'UPDATE_NAV_APP_GROUP';

  // 侧边栏搜索
  static SIDE_BAR_COLLAPSE = 'SIDE_BAR_COLLAPSE';

  // 获取用户组 code
  static GET_USER_GROUP_CODE = 'GET_USER_GROUP_CODE';
}
