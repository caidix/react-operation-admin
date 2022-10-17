import http from '@src/utils/request';
import {
  IOrganizationListReq,
  IOrganizationListResp,
  IOrganizationUsersReq,
  IOrganizationUsersResp,
  IRelationOrganizationReq,
  UserGroupItem,
} from './types';

export const getOrganizationList = (params: IOrganizationListReq) => {
  return http.get<IOrganizationListResp>('/organization/list', params);
};

export const postCreateOrganization = (data = {}) => {
  return http.post('/organization/create-organization', data);
};

export const postUpdateOrganization = (data = {}) => {
  return http.post('/organization/update-organization', data);
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
