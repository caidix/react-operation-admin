import http from '@src/utils/request';
import { ILoginReq } from './types';

export const login = (data: ILoginReq) => {
  return http.post('/user/login', data);
};

export const getUserInfo = () => {
  return http.post('/user/get-user-info');
};
