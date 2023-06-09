import React from 'react';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { getOrganizationList } from '@src/api/user-center/user-group-management';
import { IOrganizationListReq } from '@src/api/user-center/user-group-management/types';
import { EMPTY_TABLE } from '@src/consts';
import { requestExecute } from '@src/utils/request/utils';
import { Button, message } from 'antd';
import { useRef } from 'react';
import { getColumns } from './config';
import styles from './index.module.less';
const UserGroupManagement = () => {
  const request = async (params: IOrganizationListReq) => {
    const [err, res] = await requestExecute(getOrganizationList, {
      ...params,
    });

    if (err) {
      message.error(err.message);
      return EMPTY_TABLE;
    }
    return {
      data: res.list,
      total: res.total || 0,
      success: true,
    };
  };

  const actionRef = useRef<ActionType>();

  const columns = getColumns({
    handleBaseActions: () => {},
    isManager: (c) => true,
  });

  return (
    <div className={styles.wrap}>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={request}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          onChange(value) {
            console.log('value: ', value);
          },
        }}
        scroll={{ x: 1300 }}
        rowKey='id'
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        pagination={{
          pageSize: 10,
        }}
        dateFormatter='string'
        headerTitle='高级表格'
        toolBarRender={() => [
          <Button className='mr-2' type='primary'>
            新增
          </Button>,
        ]}
      />
    </div>
  );
};

export default UserGroupManagement;
