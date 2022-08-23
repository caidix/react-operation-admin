import type { TableColumnType } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import StorageUtil from '@src/utils/storage';
import { isNumber, isBoolean } from 'lodash-es';
import { useRafState, useMount } from 'ahooks';

type Storage = 'localStorage' | 'sessionStorage';

export type ColumnsState = {
  show?: boolean;
  fixed?: 'right' | 'left' | undefined;
  order?: number;
  disable?:
    | boolean
    | {
        checkbox: boolean;
      };
};
export type FilterColumnType<T> = ColumnsState & TableColumnType<T>;
export type UseContainerProps<T = any> = {
  columnsState?: {
    storageType: Storage;
    privateKey: string;
    immediate?: boolean;
    value?: Record<string, ColumnsState>;
    onChange?: (map: Record<string, ColumnsState>) => void;
  };
  columns: FilterColumnType<T>[];
  callback: (map: FilterColumnType<T>[]) => void;
};
export type ColumnsKey = {
  [propsName: string]: ColumnsState;
};
export type ContainerProps<T = any> = {
  columns: FilterColumnType<T>[] | null;
  sortColumns: FilterColumnType<T>[];
  defaultColumnKeyMap: ColumnsKey;
  columnsKeyMap: Record<string, ColumnsState>;
  setColumns: React.Dispatch<React.SetStateAction<FilterColumnType<T>[] | null>>;
  initColumns: () => void;
  setColumnsKeyMap: React.Dispatch<React.SetStateAction<Record<string, ColumnsState>>>;
  resetColumnKeyMap: () => void;
  setPrivateStorage: () => void;
};

const DEFAULT_TAB_NAME = '_PAGE_FILTER_KEY_';

export const genColumnKey = (key?: React.ReactText | undefined, index?: number): string => {
  if (key) {
    return Array.isArray(key) ? key.join('-') : key.toString();
  }
  return `${index}`;
};

const getStorage = (type: Storage, key?: string) => {
  const storage = StorageUtil[type];
  if (!storage) return;
  try {
    let tabs = storage?.getItem(DEFAULT_TAB_NAME);
    if (tabs && tabs !== 'undefined') {
      tabs = JSON.parse(tabs);
      return key ? tabs[key] : tabs;
    }
  } catch (error) {
    console.error(error);
  }
};

const setStorage = (type: Storage, key: string, value: any) => {
  const storage = StorageUtil[type];
  if (!storage) return;
  try {
    const tabs = getStorage(type) || {};
    if (value) {
      tabs[key] = {
        ...(tabs[key] || {}),
        ...value,
      };
    } else {
      tabs[key] = value;
    }
    storage?.setItem(DEFAULT_TAB_NAME, JSON.stringify(tabs));
  } catch (error) {
    console.error(error);
  }
};

function useContainer<T>(props: UseContainerProps): ContainerProps {
  const [columns, setColumns] = useState<FilterColumnType<T>[] | null>(null);

  // 默认列KeyMap - 默认全选
  const defaultColumnKeyMap = useMemo(() => {
    const keyMap: ColumnsKey = {};
    props.columns?.forEach(({ key, dataIndex, fixed, disable, show }, index) => {
      const columnKey = genColumnKey(key ?? (dataIndex as React.Key), index);
      if (columnKey) {
        keyMap[columnKey] = {
          show: isBoolean(show) ? show : true,
          fixed,
          disable,
        };
      }
    });
    return keyMap;
  }, [props.columns]);

  const [columnsKeyMap, setColumnsKeyMap] = useRafState<Record<string, ColumnsState>>({});

  const sortColumns = useMemo(() => {
    return (columns || props.columns || []) as FilterColumnType<T>[];
  }, [columns, props.columns, columnsKeyMap]);

  const getFilterColumns = (sortColumns: FilterColumnType<T>[], keysMap: Record<string, ColumnsState>) => {
    return sortColumns.filter(({ key, dataIndex }, index) => {
      const columnKey = genColumnKey(key ?? (dataIndex as React.Key), index);
      return columnKey && keysMap[columnKey] && keysMap[columnKey].show;
    });
  };

  const initColumns = () => {
    const { storageType, privateKey } = props.columnsState || {};
    if (storageType && privateKey) {
      /** 从持久化中读取数据 */
      let res = getStorage(storageType, privateKey);
      if (res) {
        res = { ...defaultColumnKeyMap, ...res };
        setColumnsKeyMap(res);
        const curColumns: FilterColumnType<T>[] = [];
        props.columns?.forEach((item, index) => {
          const { key, dataIndex } = item;
          const columnKey = genColumnKey(key ?? (dataIndex as React.Key), index);
          const keyMap = res[columnKey];
          if (keyMap && isNumber(keyMap.order)) {
            curColumns[keyMap.order] = item;
          } else {
            curColumns[index] = item;
          }
        });
        setColumns(curColumns);
        props.callback && props.callback(getFilterColumns(curColumns, res));
        return;
      }
    }
    setColumnsKeyMap(props.columnsState?.value || defaultColumnKeyMap);
    props.callback && props.callback(getFilterColumns(props.columns, props.columnsState?.value || defaultColumnKeyMap));
  };

  const resetColumnKeyMap = () => {
    const newKeyMap = {
      ...defaultColumnKeyMap,
    };
    Object.keys(columnsKeyMap).forEach((key) => {
      const currentItem = columnsKeyMap[key];
      if (isNumber(currentItem?.order)) {
        newKeyMap[key]['order'] = currentItem.order;
      }
    });
    setColumnsKeyMap(newKeyMap);
  };

  const setPrivateStorage = () => {
    const { privateKey, storageType } = props.columnsState || {};
    if (!privateKey || !storageType) {
      return;
    }
    /** 给持久化中设置数据 */
    try {
      setStorage(storageType, privateKey, columnsKeyMap);
      props.callback && props.callback(getFilterColumns(sortColumns, columnsKeyMap));
    } catch (error) {
      console.error(error);
    }
  };
  // 配置变更时清空持久化数据
  const clearPrivateStorage = useCallback(() => {
    const { storageType, privateKey } = props.columnsState || {};

    if (!privateKey || !storageType) return;
    setStorage(storageType, privateKey, null);
  }, [props.columnsState, sortColumns]);

  useMount(() => {
    initColumns();
  });

  const Container = {
    setColumns,
    initColumns,
    setColumnsKeyMap,
    setPrivateStorage,
    clearPrivateStorage,
    resetColumnKeyMap,
    columns,
    sortColumns,
    columnsKeyMap,
    defaultColumnKeyMap,
  };
  return Container;
}

export default useContainer;
