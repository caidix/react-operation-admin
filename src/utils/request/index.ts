/**
 * axios接口使用tips
 * baseApi： 在config.js内配置的url为本地请求的baseUrl
 * needOperator： 目前本地的接口除了get请求默认加了operator操作人，不需要的设置其为false，避免在formdata的传输等特殊情况下无法进行
 * isResponseHandle： 是否直接返回完整的返回值进行单独处理
 */
import axios, { AxiosRequestHeaders } from 'axios';
import responseHandler from './responseHandler';
import RequestHandler from './requestHandler';
import { Handler, IAxiosRequestConfig, IAxiosResponse, IAxiosError } from './types';

const handlers = [RequestHandler, responseHandler];

function normalRequestResolve(config: IAxiosRequestConfig) {
  return config;
}

function normalResponseResolve(response: IAxiosResponse) {
  return response;
}

function normalReject(error: IAxiosError) {
  return Promise.reject(error);
}
const initHandler = () => {
  console.log(process.env);

  const instance = axios.create({
    baseURL: `${process.env.APP_ENV_PROXY_PATH}`,
    headers: { 'Content-Type': 'application/json' },
  });

  handlers.forEach((handler: Handler) => {
    const handlerContext = handler();
    const {
      requestResolve = normalRequestResolve,
      requestReject = normalReject,
      responseResolve = normalResponseResolve,
      responseReject = normalReject,
    } = handlerContext;
    instance.interceptors.request.use(requestResolve, requestReject);
    instance.interceptors.response.use(responseResolve, responseReject);
  });
  return instance;
};

class HTTP {
  public axios;

  static POST = 'post';

  static GET = 'get';

  constructor() {
    const axios = initHandler();
    this.axios = axios;
  }

  addHeader(headers: AxiosRequestHeaders) {
    Object.entries(headers).forEach(([k, v]) => {
      this.axios.defaults.headers.common[k] = v;
    });
  }

  /** 只为统一get， post的书写格式，不做额外逻辑，额外逻辑在handler内管理 */
  request(method: string, url: string, data: any, config: IAxiosRequestConfig) {
    this.addHeader(config.headers || {});
    const req = method === HTTP.GET ? { params: data } : { data };

    const msg = {
      url,
      method,
      ...req,
    };
    return this.axios.request(msg);
  }

  get(url: string, params = {}, config = {}) {
    return this.request(HTTP.GET, url, params, config);
  }

  post(url: string, data = {}, config = {}): Promise<any> {
    return this.request(HTTP.POST, url, data, config);
  }
}

export default new HTTP();
