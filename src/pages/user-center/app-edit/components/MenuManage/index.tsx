import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, message, Modal, Row, Select, Space, Table } from 'antd';
import ContainerLayout from '@src/layout/ContentLayout';
import PageHeader from '@src/layout/PageHeader';
import useAntdTable from '@src/hooks/use-antd-table';
import ColumnSetting, { ColumnSettingProps } from '@src/components/ColumnsFilter/Filter';
import CustomTable from '@src/components/CustomTable';
import { useRequest, useSetState } from 'ahooks';
import { requestExecute } from '@src/utils/request/utils';
import { ActionCodeEnum, EMPTY_OPTION, EMPTY_TABLE } from '@src/consts';
import { ApplicationItem } from '@src/api/user-center/app-management/types';
import { getApplicationList } from '@src/api/user-center/app-management';
import { FilterColumnType } from '@src/components/ColumnsFilter';
import { getOrganizationList, getUserOrganizations } from '@src/api/user-center/user-group-management';

import { useNavigate } from 'react-router-dom';
import { RoutePath } from '@src/routes/config';
import useLevelExpand from '@src/hooks/use-level-expand';

import { getSystemMenuList } from '@src/api/user-center/app-management/menus';
import {
  DataType,
  EditModelInfo,
  levelActions,
  baseActions,
  getColumns,
  ActionType,
  IModelInfo,
  MAX_LEVEL,
} from './config';

const { Option } = Select;
interface IProps {
  code: string | undefined;
}
const AppMenuManage: React.FC<IProps> = ({ code }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  /* 新增弹窗 */
  const [visibleEditModal, setVisibleEditModal] = useState<boolean>(false);

  const { tableProps, search } = useAntdTable(
    async () => {
      if (!code) return EMPTY_TABLE;
      const [err, res] = await requestExecute(getSystemMenuList, {
        code,
      });
      if (err) {
        return EMPTY_TABLE;
      }
      return {
        list: res.list,
        total: res.total || 0,
      };
    },
    { defaultPageSize: 10, form },
  );
  const { submit, reset, reload } = search;

  /** 基础编辑操作 */
  function handleBaseActions(record: ApplicationItem, code: ActionCodeEnum) {
    if (code === ActionCodeEnum.Update) {
      navigate(`/${RoutePath.USER_APPLICATION_EDIT}?code=${record.code}`, { replace: true });
    }
  }
  const [Level, tableExpandProps] = useLevelExpand({
    maxLevel: MAX_LEVEL,
    data: tableProps.dataSource,
    rowKey: 'id',
  });
  const columns = getColumns({
    Level,
    getLevelActions: () => {},
    handleLevelActions: () => {},
    getBaseActions: () => {},
    handleBaseActions: () => {},
    getSyncActions: () => {},
    handleSyncActions: () => {},
  });

  const [curColumns, setCurColumns] = useState<FilterColumnType<any>[]>(columns);
  const filterProps: ColumnSettingProps = {
    columns,
    columnsState: { privateKey: 'app-menu-edit', storageType: 'localStorage' },
    callback: setCurColumns,
  };

  return (
    <div>
      <CustomTable columns={curColumns} scroll={{ x: 1500 }} {...tableExpandProps} {...tableProps} pagination={false} />
    </div>
  );
};

AppMenuManage.displayName = 'ApplicationManagement';
export default AppMenuManage;
