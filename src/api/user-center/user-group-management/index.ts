import http from '@src/utils/request';
import { IOrganizationListReq } from './types';

export const getOrganizationList = (params: IOrganizationListReq) => {
  return http.get('/organization/list', params);
};

export const postCreateOrganization = (data = {}) => {
  return http.post('/organization/create-organization', data);
};
