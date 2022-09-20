import http from '@src/utils/request';
import { ICreateSystemMenuReq, IDeleteSystemMenuReq, IGetSystemMenuListReq, IUpdateSystemMenuReq } from './types';

/** 应用菜单相关接口 */
export const getSystemMenuList = (data: IGetSystemMenuListReq) => {
  return http.post<any>('/system-menu/list', data);
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
