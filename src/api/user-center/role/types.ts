export interface UserGroupItem {
  id: number;
  name: string;
  desc: string;
  code: string;
  isDelete?: boolean;
  createTime: string;
  updateTime: string;
  deleteTime: string;
  parentId: number | string | null;
}
export interface RoleGroupItem {
  id: number;
  name: string;
  desc?: string;
}

export interface RoleItem {
  id: number;
  name: string;
  roleGroupId: number;
  desc?: string;
  group?: RoleGroupItem;
}

export type IPostCreateRoleGroupReq = Omit<RoleGroupItem, 'id'>;
export type IPostUpdateRoleGroupReq = RoleGroupItem;

export type RoleGroupListItem = RoleGroupItem & IDateParam;

export interface IGetAllRoleGroupsResp {
  list: RoleGroupItem[];
}

export type IGetRoleListReq = IPagination & Partial<RoleItem>;
export type IPostCreateRoleReq = Omit<RoleItem, 'id'>;
export type IPostUpdateRoleReq = RoleItem;

export type RoleListItem = RoleItem & IDateParam;

export interface IGetRoleListResp extends IPagination {
  list: RoleListItem[];
}
export type IGetAllRolesReq = Partial<RoleItem>;
export interface IGetAllRolesResp {
  list: RoleListItem[];
}
