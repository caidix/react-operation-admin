import http from '@src/utils/request';
import {
  IGetAllRoleGroupsResp,
  IGetAllRolesReq,
  IGetAllRolesResp,
  IGetRoleListReq,
  IGetRoleListResp,
  IGetSystemRoleAuthReq,
  IGetSystemRoleAuthResp,
  IPostCreateRoleGroupReq,
  IPostCreateRoleReq,
  IPostMenuAuthListReq,
  IPostMenuAuthListResp,
  IPostUpdateRoleGroupReq,
  IPostUpdateRoleReq,
  IUpdateMenuRoleAuthReq,
  IUpdateSystemRoleAuthReq,
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

export const postMenuAuthList = (data: IPostMenuAuthListReq) => {
  return http.post<IPostMenuAuthListResp>('/role/menu-auth-list', data);
};

export const getSystemRoleAuth = (params: IGetSystemRoleAuthReq) => {
  return http.get<IGetSystemRoleAuthResp>('/role/role-auth-system', params);
};

export const updateSystemRoleAuth = (data: IUpdateSystemRoleAuthReq) => {
  return http.post('/role/update-auth-system', data);
};

export const updateMenuRoleAuth = (data: IUpdateMenuRoleAuthReq) => {
  return http.post('/role/update-auth-menus', data);
};
