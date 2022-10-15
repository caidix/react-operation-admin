import http from '@src/utils/request';
import {
  ICreateAuthMenuReq,
  IDeleteAuthMenuReq,
  IGetAuthMenuListReq,
  IGetAuthMenuListResp,
  IUpdateAuthMenuReq,
} from './types';

/** 权限功能点相关接口 */
export const getAuthMenuList = (query: IGetAuthMenuListReq) => {
  return http.get<IGetAuthMenuListResp>('/auth-menu/list', query);
};

export const postCreateAuthMenu = (data: ICreateAuthMenuReq) => {
  return http.post('/auth-menu/create', data);
};

export const postUpdateAuthMenu = (data: IUpdateAuthMenuReq) => {
  return http.post('/auth-menu/update', data);
};

export const postDeleteAuthMenu = (data: IDeleteAuthMenuReq) => {
  return http.post('/auth-menu/delete', data);
};
