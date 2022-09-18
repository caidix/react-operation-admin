import http from '@src/utils/request';
import {
  IApplicationBaseReq,
  IApplicationBaseResp,
  IDeleteApplicationReq,
  IApplicationListResp,
  IApplicationListReq,
  IGetApplicationDetailReq,
  ApplicationItem,
} from './types';

/** 应用菜单相关接口 */
export const postCreateApplication = (data: IApplicationBaseReq) => {
  return http.post<IApplicationBaseResp>('/system/create-system', data);
};

export const postUpdateApplication = (data: IApplicationBaseReq) => {
  return http.post<IApplicationBaseResp>('/system/update-system', data);
};

export const postDeleteApplication = (data: IDeleteApplicationReq) => {
  return http.post<IApplicationBaseResp>('/system/delete-system', data);
};

export const getApplicationList = (query: IApplicationListReq) => {
  return http.get<IApplicationListResp>('/system/list', query);
};

export const getApplicationDetail = (data: IGetApplicationDetailReq) => {
  return http.post<ApplicationItem>('/system/system-detail', data);
};
