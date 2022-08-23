/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef, useState } from 'react';
import { useMemoizedFn, usePagination, useUpdateEffect } from 'ahooks';

import type {
  Antd4ValidateFields,
  AntdTableOptions,
  ResetParams,
  Data,
  Params,
  Service,
  AntdTableResult,
} from './types';

const useAntdTable = <TData extends Data, TParams extends Params>(
  service: Service<TData, TParams>,
  options: AntdTableOptions<TData, TParams> = {},
) => {
  const {
    form,
    defaultType = 'simple',
    defaultParams,
    manual = false,
    refreshDeps = [],
    ready = true,
    ...rest
  } = options;

  const result = usePagination<TData, TParams>(service, {
    manual: true,
    ...rest,
  });

  const { params = [], run } = result;

  const cacheFormTableData = params[2] || ({} as any);

  const [type, setType] = useState(cacheFormTableData?.type || defaultType);

  const allFormDataRef = useRef<Record<string, any>>({});
  const defaultDataSourceRef = useRef([]);
  // get current active field values
  const getActivetFieldValues = () => {
    if (!form) {
      return {};
    }

    return form.getFieldsValue(null, () => true);
  };

  const validateFields = (): Promise<Record<string, any>> => {
    if (!form) {
      return Promise.resolve({});
    }
    const activeFieldsValue = getActivetFieldValues();
    const fields = Object.keys(activeFieldsValue);

    // antd 4
    return (form.validateFields as Antd4ValidateFields)(fields);
  };

  const restoreForm = () => {
    if (!form) {
      return;
    }

    // antd v4
    return form.setFieldsValue(allFormDataRef.current);
  };

  const changeType = () => {
    const activeFieldsValue = getActivetFieldValues();
    allFormDataRef.current = {
      ...allFormDataRef.current,
      ...activeFieldsValue,
    };
    setType((t: any) => (t === 'simple' ? 'advance' : 'simple'));
  };

  const _submit = (initPagination?: TParams[0]) => {
    if (!ready) {
      return;
    }
    setTimeout(() => {
      validateFields()
        .then((values = {}) => {
          const pagination = initPagination || {
            pageSize: options.defaultPageSize || 10,
            ...(params?.[0] || {}),
            current: 1,
          };
          // eslint-disable-next-line promise/always-return
          if (!form) {
            // @ts-ignore
            run(pagination);
            return;
          }

          // record all form data
          allFormDataRef.current = {
            ...allFormDataRef.current,
            ...values,
          };

          // @ts-ignore
          run(pagination, values, {
            allFormData: allFormDataRef.current,
            type,
          });
        })
        .catch((err) => err);
    });
  };

  const getCurrentNamePath = () => {
    if (form) {
      const res = form.getFieldsValue();
      return Object.keys(res);
    }
    return [];
  };

  const reset = (params?: ResetParams) => {
    if (form) {
      const { include = [], exclude = ['roleSystemId'] } = params || {};
      const keys = getCurrentNamePath();
      if (include.length) {
        form.resetFields(include);
      } else {
        form.resetFields(keys.filter((key) => !exclude.includes(key)));
      }
    }
    _submit();
  };

  const submit = (e?: any) => {
    e?.preventDefault?.();
    _submit();
  };

  const reload = () => {
    _submit({ pageSize: options.defaultPageSize || 10, current: 1, ...(params?.[0] || {}) });
  };

  const onTableChange = (pagination: any, filters: any, sorter: any) => {
    const [oldPaginationParams, ...restParams] = params || [];
    run(
      // @ts-ignore
      {
        ...oldPaginationParams,
        current: pagination.current,
        pageSize: pagination.pageSize,
        filters,
        sorter,
      },
      ...restParams,
    );
  };

  // init
  useEffect(() => {
    // if has cache, use cached params. ignore manual and ready.
    if (params.length > 0) {
      allFormDataRef.current = cacheFormTableData?.allFormData || {};
      restoreForm();
      // @ts-ignore
      run(...params);
      return;
    }
    if (!manual && ready) {
      allFormDataRef.current = defaultParams?.[1] || {};
      restoreForm();
      _submit(defaultParams?.[0]);
    }
  }, []);

  // change search type, restore form data
  useUpdateEffect(() => {
    if (!ready) {
      return;
    }
    restoreForm();
  }, [type]);

  // refresh & ready change on the same time
  const hasAutoRun = useRef(false);
  hasAutoRun.current = false;

  useUpdateEffect(() => {
    if (!manual && ready) {
      hasAutoRun.current = true;
      if (form) {
        form.resetFields();
      }
      allFormDataRef.current = defaultParams?.[1] || {};
      restoreForm();
      _submit(defaultParams?.[0]);
    }
  }, [ready]);

  useUpdateEffect(() => {
    if (hasAutoRun.current) {
      return;
    }
    if (!ready) {
      return;
    }
    if (!manual) {
      hasAutoRun.current = true;
      result.pagination.changeCurrent(1);
    }
  }, [...refreshDeps]);

  return {
    ...result,
    tableProps: {
      dataSource: result.data?.list || defaultDataSourceRef.current,
      loading: result.loading,
      onChange: useMemoizedFn(onTableChange),
      pagination: {
        current: result.pagination.current,
        pageSize: result.pagination.pageSize,
        total: result.pagination.total,
      },
    },
    search: {
      submit: useMemoizedFn(submit),
      type,
      changeType: useMemoizedFn(changeType),
      reset: useMemoizedFn(reset),
      reload: useMemoizedFn(reload),
    },
  } as AntdTableResult<TData, TParams>;
};

export default useAntdTable;
