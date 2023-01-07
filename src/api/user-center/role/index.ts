import http from '@src/utils/request';
import { IGetAllRoleGroupsResp, IPostCreateRoleGroupReq, IPostUpdateRoleGroupReq } from './types';

export const getAllRoleGroups = () => {
  return http.get<IGetAllRoleGroupsResp>('/role/group/all-list');
};

export const postCreateRoleGroup = (data: IPostCreateRoleGroupReq) => {
  return http.post('/role/group/create', data);
};

export const postUpdateRoleGroup = (data: IPostUpdateRoleGroupReq) => {
  return http.post('/role/group/update', data);
};
