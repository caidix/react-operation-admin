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
  desc?: string;
  roleGroupId: string;
}

export interface IGetAllRoleGroupsResp {
  list: RoleGroupItem[];
}
