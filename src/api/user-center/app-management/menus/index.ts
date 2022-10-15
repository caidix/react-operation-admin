import http from '@src/utils/request';
import {
  IChangeMenuStatusReq,
  ICreateSystemMenuReq,
  IDeleteSystemMenuReq,
  IGetSystemMenuListReq,
  IMoveSystemMenuReq,
  IUpdateSystemMenuReq,
} from './types';

/** 应用菜单相关接口 */
export const getSystemMenuList = (data: IGetSystemMenuListReq) => {
  return http.get<any>('/system-menu/list', data);
};

/**创建菜单 */
export const postCreateSystemMenu = (data: ICreateSystemMenuReq) => {
  return http.post<any>('/system-menu/create', data);
};

/**更新菜单 */
export const postUpdateSystemMenu = (data: IUpdateSystemMenuReq) => {
  return http.post<any>('/system-menu/update', data);
};

/**删除菜单 */
export const postDeleteSystemMenu = (data: IDeleteSystemMenuReq) => {
  return http.post<any>('/system-menu/delete', data);
};

/**获取菜单详情 */
export const postSystemMenuDetail = (data: IDeleteSystemMenuReq) => {
  return http.post<any>('/system-menu/detail', data);
};

/**菜单排序上下移 */
export const postMoveSystemMenu = (data: IMoveSystemMenuReq) => {
  return http.post<any>('/system-menu/move', data);
};

/**菜单显示隐藏 */
export const postChangeMenuStatus = (data: IChangeMenuStatusReq) => {
  return http.post<any>('/system-menu/status', data);
};
