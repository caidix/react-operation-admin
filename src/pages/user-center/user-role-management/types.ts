import { RoleGroupItem, RoleItem } from '@src/api/user-center/role/types';
export type RoleParams = null | RoleGroupItem | RoleItem;
export enum RoleType {
  /** 角色分组弹窗 */
  Group = 1,
  /** 角色弹窗 */
  Item = 2,
}
