/**
 * 菜单相关接口Type
 */

/** 页面打开方式 */
export enum PageOpenEnum {
  Inline = 1,
  LinkTo = 2,
}
export const PageOpenEnums = [
  {
    value: PageOpenEnum.Inline,
    label: '内嵌',
  },
  {
    value: PageOpenEnum.LinkTo,
    label: '跳转',
  },
];

/** 页面内容来源 */
export enum PageSourceEnum {
  System = 1,
  Custom = 2,
}
export const PageSourceEnums = [
  {
    value: PageSourceEnum.System,
    label: '系统',
  },
  {
    value: PageSourceEnum.Custom,
    label: '自定义',
  },
];

/** 页面删除状态 */
export enum PageStatusEnum {
  LIVING = 0,
  DELETE = 1,
}
export const PageStatusEnums = [
  {
    value: PageStatusEnum.LIVING,
    label: '未删除',
  },
  {
    value: PageStatusEnum.DELETE,
    label: '已删除',
  },
];

/** 菜单类型 */
export enum MenuTypeEnum {
  Menu = 1,
  Page = 2,
}

export const MenuTypeEnums = [
  {
    value: MenuTypeEnum.Menu,
    label: '菜单(无跳转地址)',
  },
  {
    value: MenuTypeEnum.Page,
    label: '页面(有跳转地址)',
  },
];

export const MenuTypeTableEnums = [
  {
    value: MenuTypeEnum.Menu,
    label: '菜单',
  },
  {
    value: MenuTypeEnum.Page,
    label: '页面',
  },
];

/** 菜单展示 */
export enum MenuShowEnum {
  Show = 1,
  Hidden = 2,
}
export const MenuShowEnums = [
  {
    value: MenuShowEnum.Show,
    label: '显示',
  },
  {
    value: MenuShowEnum.Hidden,
    label: '隐藏',
  },
];

export enum MenuFieldEnum {
  Id = 'id',
  Name = 'name',
  Code = 'code',
  IconUrl = 'iconUrl',
  MenuType = 'menuType',
  PageOpenMethod = 'pageOpenMethod',
  Url = 'url',
  IsShow = 'isShow',
  Description = 'desc',
  Sort = 'sort',
  IsDelete = 'isDelete',
  ParentId = 'parentId',
  SystemCode = 'systemCode',
}

export interface MenuBaseData {
  [MenuFieldEnum.Id]: number;
  // 名称
  [MenuFieldEnum.Name]: string;
  // 编码
  [MenuFieldEnum.Code]: string;
  // 是否展示
  [MenuFieldEnum.IsShow]: MenuShowEnum;
  // 菜单类型
  [MenuFieldEnum.MenuType]: MenuTypeEnum;
  // Icon
  [MenuFieldEnum.IconUrl]: string;
  // 描述
  [MenuFieldEnum.Description]: string;
  // 页面打开方式
  [MenuFieldEnum.PageOpenMethod]: PageOpenEnum;
  // 页面地址
  [MenuFieldEnum.Url]?: string;
  // 同一父级下的排序，从上到下，从1递增
  [MenuFieldEnum.Sort]?: string;

  // 创建时间
  createTime?: string;
  // 更改时间
  updateTime?: string;
  // 上级菜单id
  [MenuFieldEnum.ParentId]?: number;
  [MenuFieldEnum.SystemCode]: string;
  // 是否删除
  [MenuFieldEnum.IsDelete]?: PageStatusEnum;
  // 子菜单
  children?: MenuBaseData[];
}

export enum ExpandLevel {
  FIRST = 1,
  SECOND,
  THIRD,
}

export const ExpandLevelEnum = [ExpandLevel.FIRST, ExpandLevel.SECOND, ExpandLevel.THIRD];

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

  systemCode: string;

  parentId?: number;
}
export interface IGetSystemMenuListReq {
  code: string;
}

export type HandleMenuBase = { [MenuFieldEnum.Id]: number; [MenuFieldEnum.SystemCode]: string };
export type ICreateSystemMenuReq = MenuItem;
export type IUpdateSystemMenuReq = { [MenuFieldEnum.Id]: number } & MenuItem;
export type IDeleteSystemMenuReq = HandleMenuBase;
export type ISystemMenuDetailReq = HandleMenuBase;
export type IChangeMenuStatusReq = HandleMenuBase & {
  type: number;
};
export type IMoveSystemMenuReq = HandleMenuBase & {
  type: number;
};
