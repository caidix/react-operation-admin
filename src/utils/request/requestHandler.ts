// import Configs from './config'
// import store from '@/store'
import { store } from '@src/store';
import { getCookie } from 'typescript-cookie';

import { IAxiosRequestConfig } from './types';

const RequestHandler = () => ({
  async requestResolve(config: IAxiosRequestConfig) {
    // const {} = config;
    // config.baseURL = Configs.getBaseURL(baseApi, config.isLocation || false);
    // Configs.proxyUrl(baseApi, config);
    // // 后台没有统一dns的容器获取操作人，我们先手动加,真的啦跨
    // if (config.method.toLowerCase() !== 'get' && needOperator) {
    //   config.data.operator = store.getters.name || 'linjun';
    // }
    const { user } = store.getState();
    const sessionId = user.sessionId || getCookie('sessionId');

    const headers = config.headers || {};
    if (sessionId) {
      headers.authorization = 'Bearer ' + sessionId;
    }
    config.headers = headers;
    return config;
  },
});

export default RequestHandler;
