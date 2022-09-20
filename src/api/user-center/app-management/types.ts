import { MenuShowEnum, MenuTypeEnum } from '@src/consts/menu';

/**
 * 应用相关接口Type
 */
export interface ApplicationBaseItem {
  name: string;

  // 组织归属
  organization: number;

  // 应用编码
  code: string;

  // 资源地址
  resourcesUrl: string;

  // 应用密钥
  appSecret?: string;

  // LOGO地址
  logoUrl?: string;

  // 访问地址
  url?: string;

  // 描述
  desc?: string;
}

export type ApplicationItem = ApplicationBaseItem & IDateParam;

export type IApplicationBaseReq = ApplicationBaseItem;
export type IApplicationBaseResp = {
  data: null;
};

export interface IDeleteApplicationReq {
  id: number;
}

export type IApplicationListReq = {
  name?: string;
  code?: string;
} & IPagination;

export type IApplicationListResp = {
  list: ApplicationItem[];
} & IPagination;

export type IGetApplicationDetailReq = {
  id?: number;
  code?: string;
};

/**
 * 菜单相关接口Type
 */
export enum IMenuTypeEnum {
  MENU = 'menu',
  PAGE = 'page',
}

export interface MenuItem {
  name: string;

  code?: string;

  url: string;

  desc: string;

  menuType: MenuTypeEnum;

  sort?: number;

  isShow: MenuShowEnum;

  systemId: number;

  parentId?: number;
}
export interface IGetSystemMenuListReq {
  code: string;
}

export type ICreateSystemMenuReq = MenuItem;
export type IUpdateSystemMenuReq = { id: number } & MenuItem;
export type IDeleteSystemMenuReq = { id: number };
export type ISystemMenuDetailReq = { id: number };
