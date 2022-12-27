import http from '@src/utils/request';
import {
  IDeleteOrganizationReq,
  IOrganizationListReq,
  IOrganizationListResp,
  IOrganizationUsersReq,
  IOrganizationUsersResp,
  IRelationOrganizationReq,
  IUpdateOrganizationReq,
  UserGroupItem,
} from './types';

export const getOrganizationList = (params: IOrganizationListReq) => {
  return http.get<IOrganizationListResp>('/organization/list', params);
};

export const getAllOrganizationList = () => {
  return http.get<IOrganizationListResp>('/organization/all-list');
};

export const postCreateOrganization = (data = {}) => {
  return http.post('/organization/create', data);
};

export const postUpdateOrganization = (data: IUpdateOrganizationReq) => {
  return http.post('/organization/update', data);
};

export const postDeleteOrganization = (data: IDeleteOrganizationReq) => {
  return http.post('/organization/delete', data);
};

export const postOrganizationUsers = (data: IOrganizationUsersReq = {}) => {
  return http.post<IOrganizationUsersResp>('/organization/get-organization-users', data);
};

export const getUserOrganizations = () => {
  return http.get<UserGroupItem[]>('/organization/get-user-organizations');
};

export const postRelationOrgByUser = (data: IRelationOrganizationReq) => {
  return http.post('/organization/relation-organization-user', data);
};
