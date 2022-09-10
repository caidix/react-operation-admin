export interface UserGroupItem {
  id: number;
  name: string;
  desc: string;
  code: string;
  managers?: unknown[];
  users?: unknown[];
  systems?: unknown[];
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
