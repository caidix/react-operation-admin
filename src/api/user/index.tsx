import http from '@src/utils/request';
import { IEmailVerifyCodeReq, ILoginReq, IRegisterReq } from './types';

export const login = (data: ILoginReq) => {
  return http.post('/user/login', data);
};

export const register = (data: IRegisterReq) => {
  return http.post('/user/register', data);
};

export const getUserInfo = () => {
  return http.post('/user/get-user-info');
};

/** 获取邮箱验证码 */
export const getEmailVerifyCode = (data: IEmailVerifyCodeReq) => {
  return http.post('/user/send-emailer', data);
};
