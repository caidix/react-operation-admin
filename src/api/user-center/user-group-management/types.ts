export interface UserGroupItem {
  id: number;
  name: string;
  desc: string;
  code: string;
  managers?: number[];
  users?: number[];
  systems?: number[];
  isDelete?: boolean;
  createTime: string;
  updateTime: string;
  deleteTime: string;
}
export interface UserItem {
  id: number;
  name: string;
}

export interface IOrganizationListReq extends IPagination {
  name?: string;
}

export interface IOrganizationListResp extends IPagination {
  list: UserGroupItem[];
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
