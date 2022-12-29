export interface UserItem {
  id: number;
  name: string;
  password: string;
  email: string;
  status: UserStatusEnum;
  phone?: string;
  isSuper?: boolean;
  verifyCode?: string;
  organization?: number;
}

export enum UserStatusEnum {
  Active = 1,
  Disable = 2,
}

export interface ILoginReq {
  name: string;
  password: string;
}

export interface IEmailVerifyCodeReq {
  email: string;
}

export interface IRegisterReq {
  name: string;
  password: string;
  email: string;
  verifyCode: string;
}

export type IGetUserListReq = Partial<UserItem> & IPagination;

export type IPostCreateUserReq = PartialByKeys<UserItem, 'id'>;

export type IPostUpdateUserReq = UserItem;
