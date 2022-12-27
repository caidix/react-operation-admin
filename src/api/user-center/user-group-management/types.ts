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
export interface UserItem {
  id: number;
  name: string;
}

export interface IOrganizationListReq extends IPagination {
  name?: string;
}

export type IOrganizationListResp = UserGroupItem[];

export type IUpdateOrganizationReq = UserGroupItem;

export interface IDeleteOrganizationReq {
  id: number;
}

export interface IOrganizationUsersReq extends IPagination {
  id?: number;
}

export interface IOrganizationUsersResp extends IPagination {
  list: UserItem[];
}

export interface IRelationOrganizationReq {
  id: number;
  userIds: number[];
}
