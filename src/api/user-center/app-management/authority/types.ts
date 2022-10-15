export enum AuthMenuFieldEnum {
  Id = 'id',
  Name = 'name',
  Code = 'code',
  Description = 'desc',
  IsDelete = 'isDelete',
  SystemCode = 'systemCode',
  MenuCode = 'menuCode',
  Action = 'action',
}

export interface AuthMenuItem {
  // 功能点名称
  [AuthMenuFieldEnum.Name]: string;

  // 功能点编码
  [AuthMenuFieldEnum.Code]: string;

  // 功能点描述
  [AuthMenuFieldEnum.Description]?: string;

  // 归属应用code
  [AuthMenuFieldEnum.SystemCode]: string;

  // 归属菜单code
  [AuthMenuFieldEnum.MenuCode]: string;
}

export type ICreateAuthMenuReq = AuthMenuItem;

export interface IGetAuthMenuListReq {
  [AuthMenuFieldEnum.SystemCode]: string;
  [AuthMenuFieldEnum.MenuCode]: string;
}
export interface IGetAuthMenuListResp extends IPagination {
  list: AuthMenuItem[];
}

export interface IUpdateAuthMenuReq extends AuthMenuItem {
  [AuthMenuFieldEnum.Id]: string;
}

export interface IDeleteAuthMenuReq extends IGetAuthMenuListReq {
  [AuthMenuFieldEnum.Code]: string;
}
