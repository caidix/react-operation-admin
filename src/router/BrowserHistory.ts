import qs, { StringifiableRecord } from 'query-string';
import { store } from '@src/store';
// import { setBreadcrumbs } from "@src/store/user/actions";
// import { EventName, PlatformConsts, RouteURL } from "@src/consts";
// import { eventBus, getTreePath } from "@src/utils";
import { History, Blocker, Listener, To } from 'history';

/**
 * 路由拓展接口
 */
export interface IBrowserHistory extends History {
  replace(path: string, addParams?: StringifiableRecord, state?: any): void; // addParams是参数对象
  /** 路由导航**/
  navigate(path: string, query?: StringifiableRecord, isOpen?: boolean): void;
}

export class BrowserHistoryDecorator implements IBrowserHistory {
  private readonly history: History;

  constructor(instance: History) {
    this.history = instance;
    this.history.listen(this.handleBreadcrumb);
  }

  back(): void {
    this.history.back();
  }

  forward(): void {
    this.history.forward();
  }

  get action() {
    return this.history.action;
  }

  get location() {
    return this.history.location;
  }

  go = (n: number): void => this.history.go(n);

  block = (prompt: Blocker) => this.history.block(prompt);

  /**
   * 侦听路由变动
   * @param listener
   */
  listen = (listener: Listener) => this.history.listen(listener);

  createHref = (location: To): string => this.history.createHref(location);

  /**
   * 更新面包屑
   * @param location
   */
  handleBreadcrumb = async (location: any) => {
    const { pathname } = location;
    const state = store.getState();
    const { currentApp } = state.user;
    // const isMicro = pathname.startsWith(
    //   PlatformConsts.MICRO_APP_ACTIVE_RULE_PREFIX
    // );
    // // 切换的路径是主应用 但是当前的 appCode 是微应用
    // if (!isMicro && currentApp?.code !== PlatformConsts.APP_PLATFORM_CODE) {
    //   if (pathname !== RouteURL.LOGIN_PAGE) {
    //     await eventBus.emit(EventName.SWITCH_HOME);
    //   }
    // }
    // // 当前的是微应用路径
    // if (isMicro) {
    //   const paths = pathname.split("/");
    //   const appCode = paths[3];
    //   if (currentApp?.code !== appCode) {
    //     await eventBus.emit(EventName.SWITCH_MICRO, { appCode });
    //   }
    // }
    // const nextState = store.getState();
    // const { menuList } = nextState.user;
    // const breadcrumbs = getTreePath<any>(
    //   menuList,
    //   (item) => item.path === pathname
    // );
    // store.dispatch(setBreadcrumbs({ breadcrumbs }));
  };

  /**
   * 合并路径和参数
   * @param path
   * @param params
   * @private
   */
  private merge(path: To, params: Record<string, string>) {
    if (typeof path !== 'string') {
      path = `${path.pathname}${path.search ? `?${path.search}` : ''}`;
    }
    const qi = path.indexOf('?');
    let query = {};
    if (qi !== -1) {
      query = qs.parse(path.substring(qi));
    }
    query = { ...query, ...params };
    const querystring = qs.stringify(query);
    const base = qi === -1 ? path : path.substring(0, qi);

    return querystring ? `${base}?${querystring}` : base;
  }

  /**
   * 增加历史记录
   * @param path
   * @param state
   */
  push = (path: To, state?: any): void => {
    // state = state || {};
    const url = this.merge(path, state);
    if (url.startsWith('http')) {
      return window.history.pushState(state, '', url);
    }
    this.history.push(path);
  };

  /**
   * 替换历史记录
   * @param path
   * @param state
   */
  replace = (path: To, state?: any): void => {
    console.log({ replace: path });
    const url = this.merge(path, state || {});
    if (url.startsWith('http')) {
      return window.location.replace(url);
    }
    this.history.replace(path);
  };

  /**
   * 导航到某个路径
   * 底层采用 window.location.href
   * @param path
   * @param params
   * @param isOpen
   */
  navigate = (path: string, params = {}, isOpen = false) => {
    console.log('导航到某个路径');
    const url = this.merge(path, params);
    if (isOpen) {
      return window.open(url);
    }
    window.location.href = url;
  };
}
