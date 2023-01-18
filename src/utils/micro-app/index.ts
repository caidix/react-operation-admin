import { PlatformConsts } from '@src/consts';
import { registerMicroApps, RegistrableApp, start, LoadableApp } from 'qiankun';
import { emitLoginInfo } from './tasks';

const TaskList = [emitLoginInfo];

// https://qiankun.umijs.org/zh/api#registermicroappsapps-lifecycles
// name - string - 必选，微应用的名称，微应用之间必须确保唯一。
// entry - string | { scripts?: string[]; styles?: string[]; html?: string } - 必选，微应用的入口（详细说明同上）。
// container - string | HTMLElement - 必选，微应用的容器节点的选择器或者 Element 实例。如container: '#root' 或 container: document.querySelector('#root')。
// props - object - 可选，初始化时需要传递给微应用的数据。
// activeRule： string | (location: Location) => boolean | Array<string | (location: Location) => boolean> - 必选，微应用的激活规则。
export function initMicroApp<T extends object>(config: Omit<LoadableApp<T>, 'container'>, activeRule: string) {
  const app: RegistrableApp<T> = {
    activeRule,
    container: `#${PlatformConsts.MICRO_APP_MOUNT_ID}`,
    ...config,
  };

  const appList: RegistrableApp<T>[] = [app];
  registerMicroApps(appList, {
    afterMount: () => {
      TaskList.forEach((task) => {
        task?.();
      });
      return Promise.resolve();
    },
  });

  start({
    sandbox: {
      //当 experimentalStyleIsolation 被设置为 true 时，qiankun 会改写子应用所添加的样式为所有样式规则增加一个特殊的选择器规则来限定其影响范围
      experimentalStyleIsolation: true,
    },
    // 是否同一时间只会渲染一个微应用
    singular: true,
  });
}

/**
 * 载入script 标签
 * @param url
 * @param isAsync
 */
export function loadScript(url: string, isAsync = false): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.onload = function () {
      resolve();
    };
    script.onerror = (err) => {
      reject(err);
    };
    script.async = isAsync;
    script.src = url;
    document.body.appendChild(script);
  });
}
