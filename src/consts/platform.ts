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
  static readonly APP_PLATFORM_CODE = 'fe-op';
  // 头部限制应用组数量
  static readonly DEFAULT_GROUP_LIMIT = 10;
  // 路由框架前缀
  static readonly ROUTE_FRAME_PREFIX = '/user';
}

/**
 * 路由路径配置
 */
export class RouteURL {
  constructor() {
    throw new Error("can't instantiate this class!");
  }
  static readonly ROOT = '/';
  // 登录页
  static readonly LOGIN_PAGE = '/login';
  // 首页
  static readonly HOME_PAGE = `${PlatformConsts.ROUTE_FRAME_PREFIX}/home`;

  /** **************************************************** 云客用户中心*********************************************/
  // 员工管理
  static readonly STAFF_MANAGEMENT = `${PlatformConsts.ROUTE_FRAME_PREFIX}/staff-management`;
  // 用户组管理
  static readonly USER_GROUP_MANAGEMENT = `${PlatformConsts.ROUTE_FRAME_PREFIX}/user-group-management`;
  // 关联企微组织
  static readonly RELATE_QIWEI_ORGANIZATION = `${PlatformConsts.ROUTE_FRAME_PREFIX}/relate-qiwei-organization`;

  /** ******************************************************授权管理**********************************************/
  // 角色管理
  static readonly ROLE_AUTH_MANAGEMENT = `${PlatformConsts.ROUTE_FRAME_PREFIX}/role-auth-management`;
  // 授权管理
  static readonly AUTHORIZATION_MANAGEMENT = `${PlatformConsts.ROUTE_FRAME_PREFIX}/auth-management`;
  // 角色详情
  static readonly AUTH_DETAIL = `${PlatformConsts.ROUTE_FRAME_PREFIX}/auth-detail`;
  // 角色编辑
  static readonly AUTH_EDIT = `${PlatformConsts.ROUTE_FRAME_PREFIX}/auth-edit`;
  // 数据权限
  static readonly DATA_AUTH = `${PlatformConsts.ROUTE_FRAME_PREFIX}/data-auth`;
  // 查看数据对象
  static readonly DATA_Object = `${PlatformConsts.ROUTE_FRAME_PREFIX}/data-object`;
  // 查看数据授权详情
  static readonly DATA_AUTH_DETAILS = `${PlatformConsts.ROUTE_FRAME_PREFIX}/data-auth-details`;

  // 用户组授权策略
  static readonly USER_GROUP_AUTH_POLICY = `${PlatformConsts.ROUTE_FRAME_PREFIX}/user-group-auth-policy`;
  // 用户组授权策略表单
  static readonly USER_GROUP_AUTH_POLICY_FORM = `${PlatformConsts.ROUTE_FRAME_PREFIX}/auth-policy-form`;
  static readonly AUTH_POLICY_DETAIL = `${PlatformConsts.ROUTE_FRAME_PREFIX}/auth-policy-detail`;

  /** ******************************************************应用管理**********************************************/
  // 应用管理
  static readonly APP_MANAGEMENT = `${PlatformConsts.ROUTE_FRAME_PREFIX}/app-management`;
  // 应用组管理
  static readonly APP_GROUP_MANAGEMENT = `${PlatformConsts.ROUTE_FRAME_PREFIX}/app-group-management`;
  // 编辑应用
  static readonly APP_EDIT = `${PlatformConsts.ROUTE_FRAME_PREFIX}/app-edit`;

  /** ****************************************************系统管理**************************************/
  // 公告
  static readonly ANNOUNCEMENT = `${PlatformConsts.ROUTE_FRAME_PREFIX}/announcement`;
  // 帮助文档
  static readonly HELP_DOC = `${PlatformConsts.ROUTE_FRAME_PREFIX}/help-doc`;
  // 文档编辑
  static readonly DOC_EDITOR = `${PlatformConsts.ROUTE_FRAME_PREFIX}/doc-editor`;
  // 文档预览
  static readonly DOC_VIEW = `${PlatformConsts.ROUTE_FRAME_PREFIX}/doc-view`;
  // 超级管理员设置
  static readonly SUPER_USER = `${PlatformConsts.ROUTE_FRAME_PREFIX}/super-manager`;
  /** ***********************************************日志******************************************/
  // 登录登出日志
  static readonly IN_OUT_LOG = `${PlatformConsts.ROUTE_FRAME_PREFIX}/in-out-log`;
  // 操作日志
  static readonly OPERATION_LOG = `${PlatformConsts.ROUTE_FRAME_PREFIX}/operation-log`;
  // 访问日志
  static readonly VISIT_LOG = `${PlatformConsts.ROUTE_FRAME_PREFIX}/visit-log`;

  /** *********************************************数据资源******************************************/
  static readonly DATA_RESOURCE = `${PlatformConsts.ROUTE_FRAME_PREFIX}/data-resource`;

  /** *********************************************集群管理******************************************/
  static readonly CLUSTER = `${PlatformConsts.ROUTE_FRAME_PREFIX}/cluster`;
}
