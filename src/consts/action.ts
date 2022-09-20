export enum ActionCodeEnum {
  /** 新增应用 */
  CreateApp = 'createApp',
  /** 编辑应用 */
  UpdateApp = 'updateApp',
  /** 新增同级菜单 */
  CreateSiblingMenu = 'createSiblingMenu',
  /** 新增子菜单 */
  CreateSubMenu = 'createSubMenu',
  /** 编辑菜单 */
  UpdateMenu = 'updateMenu',
  /** 删除菜单 */
  DeleteMenu = 'deleteMenu',
  /** 下移 */
  MoveDown = 'moveDown',
  /** 上移 */
  MoveUp = 'moveUp',
  /** 设置显示 */
  DisplayMenu = 'displayMenu',
  /** 设置隐藏 */
  HideMenu = 'hideMenu',
  /** 同步集群租户 */
  SyncTenant = 'syncTenant',
  /** 同步版本查询 */
  SyncRecord = 'syncRecord',

  /** 新增功能点分组 */
  CreateActionGroup = 'createActionGroup',
  /** 编辑功能点分组 */
  UpdateActionGroup = 'updateActionGroup',
  /** 删除功能点分组 */
  DeleteActionGroup = 'deleteActionGroup',
  /** 新增功能点 */
  CreateAction = 'createAction',
  /** 编辑功能点 */
  UpdateAction = 'updateAction',
  /** 删除功能点 */
  DeleteAction = 'deleteAction',

  /** 查看同步详情 */
  PreviewSyncDetail = 'previewSyncDetail',

  /** 查看详情 */
  PreviewDetail = 'previewDetail',
  /** 修改角色 */
  ChangeRole = 'changeRole',

  QueryStaff = 'queryStaff',

  /** 新增角色分组 */
  CreateRoleGroup = 'createRoleGroup',
  /** 编辑角色分组 */
  UpdateRoleGroup = 'updateRoleGroup',

  /** 分配权限 */
  AssignPermissions = 'assignPermissions',
  /** 新增角色分组 */
  CreateRole = 'createRole',
  /** 编辑角色 */
  UpdateRole = 'updateRole',

  /** 编辑Host */
  UpdateHost = 'updateHost',
  /** 保存权限 */
  SavePermissions = 'savePermissions',
}
