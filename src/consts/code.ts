export enum ActionCodeEnum {
  /** 查询应用 */
  QueryApp = 'queryApp',
  /** 新增应用 */
  CreateApp = 'createApp',
  /** 编辑应用 */
  UpdateApp = 'updateApp',
  /** 编辑权限 */
  UpdateAuth = 'updateAuth',
  /** 导入应用配置**/
  ImportApp = 'importApp',
  /** 导出应用配置**/
  ExportApp = 'exportApp',
  /** 设置应用管理员**/
  SetAppAdmin = 'setAppAdmin',
  /** 编辑 */
  Update = 'update',
  /** 删除 */
  Delete = 'delete',
  /** 更新用户权限 */
  UpdateUserList = 'updateUserList',

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
}
