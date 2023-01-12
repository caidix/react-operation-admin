import http from '@src/utils/request';
import {
  IGetAllRoleGroupsResp,
  IGetAllRolesReq,
  IGetAllRolesResp,
  IGetRoleListReq,
  IGetRoleListResp,
  IPostCreateRoleGroupReq,
  IPostCreateRoleReq,
  IPostUpdateRoleGroupReq,
  IPostUpdateRoleReq,
} from './types';

/**
 * 角色分组
 */
export const getAllRoleGroups = () => {
  return http.get<IGetAllRoleGroupsResp>('/role/group/all-list');
};

export const postCreateRoleGroup = (data: IPostCreateRoleGroupReq) => {
  return http.post('/role/group/create', data);
};

export const postUpdateRoleGroup = (data: IPostUpdateRoleGroupReq) => {
  return http.post('/role/group/update', data);
};

/**
 * 角色
 */
export const getRoleList = (params: IGetRoleListReq) => {
  return http.get<IGetRoleListResp>('/role/list', params);
};

export const getAllRoles = (params: IGetAllRolesReq) => {
  return http.get<IGetAllRolesResp>('/role/all-list', params);
};

export const postCreateRole = (data: IPostCreateRoleReq) => {
  return http.post('/role/create', data);
};

export const postUpdateRole = (data: IPostUpdateRoleReq) => {
  return http.post('/role/update', data);
};