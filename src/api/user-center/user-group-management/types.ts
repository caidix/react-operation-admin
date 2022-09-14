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

export type IOrganizationListReq = {
  name?: string;
} & IPagination;

export type IOrganizationListResp = {
  list: UserGroupItem[];
} & IPagination;

export type IOrganizationUsersReq = {
  id?: number;
};
