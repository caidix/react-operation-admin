import { Button, message as Message } from 'antd';
import { store } from '@src/store';
import { setLogout } from '@src/store/user';
import { IAxiosError, IAxiosResponse } from './types';
import { HttpError } from './utils';
const responseHandler = () => ({
  responseResolve(response: IAxiosResponse) {
    const { isResponseHandle = true } = response.config;
    const data = response.data || {};
    if (!isResponseHandle) {
      return data;
    }
    const errCode = data.code;
    if (errCode) {
      Message.error({
        content: data.message,
      });
      throw data.message;
    }

    if (!errCode) return data.data;
  },
  async responseReject(error: IAxiosError) {
    const config = error.config;
    console.log({ error });

    if (config && config.handleError) {
      return Promise.reject(error);
    }
    if (!error.response) {
      // 极端情况下
      Message.error({
        content: error.message || '请求发生错误, 请稍后再试',
      });
      return Promise.reject(error);
    }
    const data = error.response.data || {};
    if (error.response.status === 404) {
      Message.error({
        content: '请求的接口没有找到！请联系开发查看',
      });
    } else if (error.response.status === 403) {
      Message.error({
        content: 'Forbidden：' + data?.message || '',
      });
      /** 未登录，移除缓存 - 跳转登录页 */
    } else if (error.response.status === 401) {
      Message.error({
        content: '用户未登录或登录态失效,请重新登录',
      });
      store.dispatch(setLogout({}));
    } else {
      Message.error({
        content: data?.message || '',
      });
    }
    const httpError = new HttpError(data.code || error.response.status, data.message || error.message);
    return Promise.reject(httpError);
  },
});
export default responseHandler;
