import http from '@src/utils/request';
import {
  IEmailVerifyCodeReq,
  IGetUserListReq,
  ILoginReq,
  IPostCreateUserReq,
  IPostUpdateUserReq,
  IRegisterReq,
} from './types';

export const login = (data: ILoginReq) => {
  return http.post('/user/login', data);
};

export const register = (data: IRegisterReq) => {
  return http.post('/user/register', data);
};

export const postCreateUser = (data: IPostCreateUserReq) => {
  return http.post('/user/create', data);
};

export const postUpdateUser = (data: IPostUpdateUserReq) => {
  return http.post('/user/update', data);
};

/**
 * 获取用户信息
 */
export const getUserInfo = (data: IGetUserListReq) => {
  return http.post('/user/get-user-info');
};

/**
 * 获取用户关联用户组列表
 */
export const getAllUserList = () => {
  return http.post('/user/get-all-user-list');
};

/** 获取邮箱验证码 */
export const getEmailVerifyCode = (data: IEmailVerifyCodeReq) => {
  return http.post('/user/send-emailer', data);
};

export const getUserList = (data: IGetUserListReq) => {
  return http.post('/user/get-user-list', data);
};
