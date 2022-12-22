declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';
declare module '*.md';

declare interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  ENVIRONMENT_YUNKE: {
    [index: string]: string;
  };
}
/* eslint-disable */
declare namespace UTILS {
  type NoneMethodsKeys<T> = ({ [P in keyof T]: T[P] extends Function ? never : P } & { [x: string]: never })[keyof T];
  type removeMethodsInClass<T> = Pick<T, NoneMethodsKeys<T>>;
}

declare interface IPagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

declare interface IDateParam {
  createTime?: string;
  updateTime?: string;
  deleteTime?: string;
}

declare global {
  declare interface ChangeEvent extends Event {
    target: HTMLInputElement;
  }
}

declare type PickByObject<T extends Record<any, any>, K> = {
  [U in keyof T as U extends K ? U : never]: T[U];
};

declare type Copy<T> = Pick<T, keyof T>;

declare type PartialByKeys<T extends Record<any, any>, K extends keyof T> = K extends never
  ? {
      [k in keyof T]?: T[k];
    }
  : {
      [V in keyof T as V extends K ? V : never]?: T[V];
    } & {
      [V in keyof T as V extends K ? never : V]: T[V];
    };
