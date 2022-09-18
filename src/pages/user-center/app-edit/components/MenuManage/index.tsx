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

const { Option } = Select;

const AppMenuManage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  /* 新增弹窗 */
  const [visibleEditModal, setVisibleEditModal] = useState<boolean>(false);

  const { tableProps, search } = useAntdTable(
    async ({ current, pageSize }, formData: any) => {
      let organization = formData.organization;
      organization = organization === EMPTY_OPTION.code ? '' : organization;
      const [err, res] = await requestExecute(getApplicationList, {
        size: pageSize,
        page: current,
        ...formData,
        organization,
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

  const columns = getColumns({ handleBaseActions, organizationList });

  const [curColumns, setCurColumns] = useState<FilterColumnType<any>[]>(columns);
  const filterProps: ColumnSettingProps = {
    columns,
    columnsState: { privateKey: 'app-manage', storageType: 'localStorage' },
    callback: setCurColumns,
  };

  return (
    <div>
      <CustomTable columns={curColumns} scroll={{ x: 1500 }} {...tableProps} />
    </div>
  );
};

AppMenuManage.displayName = 'ApplicationManagement';
export default AppMenuManage;
