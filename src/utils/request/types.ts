import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
export interface RequestConfig extends AxiosRequestConfig {
  // 是否调用元素定义上的loading？
  loading?: boolean;
  loadingTip?: string;
  curloading?: boolean;
  debounce?: boolean;
  tipErr?: boolean;
  handleError?: boolean;
}

export type IAxiosRequestConfig = AxiosRequestConfig<any> & {
  isResponseHandle?: boolean;
  handleError?: boolean;
  tipErr?: boolean;
};

export type IAxiosResponseData<T> = {
  code?: number;
  data?: T;
  message?: string;
  url?: string;
};

export type IAxiosResponse<T = any> = {
  config?: IAxiosRequestConfig;
} & AxiosResponse<IAxiosResponseData<T>>;

export type IAxiosError = {
  config: IAxiosRequestConfig;
  response: IAxiosResponse;
} & AxiosError;

export interface DebounceQueue {
  url: string;
  method: string;
  params: object;
  data: object;
}

export interface HandlerFunction {
  requestResolve?: (value: IAxiosRequestConfig) => IAxiosRequestConfig | Promise<IAxiosRequestConfig>;
  requestReject?: (error: IAxiosError) => any;
  responseResolve?: (value: IAxiosResponse) => IAxiosResponse | Promise<IAxiosResponse> | Promise<any>;
  responseReject?: (error: IAxiosError) => any;
}

export type Handler = (Vue?: any) => HandlerFunction;
