import axios from 'axios';
import { omit, isEqual } from 'lodash';
class Queue {
  constructor(delay = 500) {
    this.delay = delay;
    this.queue = [];
  }
  push(url, method, params, data) {
    this.queue.push({
      url,
      method,
      params,
      data,
    });
  }
  pop(url, method) {
    const query = this.queue.find((item) => {
      return url === item.url && method === item.method;
    });
    if (query) this.queue.splice(this.queue.indexOf(query), 1);
  }
  exists(url, method) {
    return this.queue.some((item) => {
      return url === item.url && method === item.method;
    });
  }
  remove(_url, _method, _params, _data) {
    const request = this.queue.find(
      ({ url, method, params, data }) =>
        url === _url && method === _method && isEqual(params, _params) && isEqual(data, _data),
    );
    if (request) {
      this.queue.splice(this.queue.indexOf(request), 1);
    }
  }
  toFilterParams(params) {
    if (!params) return '';
    return JSON.stringify(omit(params, ['appid', 'timestamp', 'sign']).join('&'));
  }
}

const queue = new Queue();
const { CancelToken } = axios;
const source = CancelToken.source();
const debounceHandler = () => {
  return {
    async requestResolve(config) {
      const { debounce = true } = config;
      if (debounce) {
        const { url, method, params, data } = config;
        if (!queue.exists(url, method)) {
          queue.push(url, method, params, data);
          setTimeout(() => {
            queue.remove(url, method, params, data);
          }, queue.delay);
        } else {
          config.cancelToken = source.token;
          source.cancel('DEBOUNCE');
        }
      }
      return config;
    },
  };
};

export default debounceHandler;
