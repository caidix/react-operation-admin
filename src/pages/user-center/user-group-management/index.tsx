import React, { useRef, useState } from 'react';
import { Button, message } from 'antd';
import ContainerLayout from '@src/layout/ContentLayout';
import { ProTable, ActionType } from '@ant-design/pro-components';
import { IOrganizationListReq, UserGroupItem } from '@src/api/user-center/user-group-management/types';
import { getOrganizationList } from '@src/api/user-center/user-group-management';

import { useSetState } from 'ahooks';
import { requestExecute } from '@src/utils/request/utils';
import { ActionCodeEnum, EMPTY_TABLE } from '@src/consts';
import useUserInfo from '@src/hooks/use-user-info';
import EditGroupModal from './components/EditGroupModal';
import { getColumns } from './config';
import UserPicker from './components/UserPicker';
import { useNavigate } from 'react-router-dom';

interface AppModelInfo {
  visible: boolean;
  data: null | UserGroupItem;
}

const UserGroupManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [_, { isManager }] = useUserInfo();

  /* 新增编辑弹窗 */
  const [appModalInfo, setModalInfo] = useSetState<AppModelInfo>({
    visible: false,
    data: null,
  });
  const [userPickInfo, setUserPickInfo] = useSetState<AppModelInfo>({
    visible: false,
    data: null,
  });

  const changeModelInfo = (data: null | UserGroupItem = null) => {
    setModalInfo({
      visible: !appModalInfo.visible,
      data,
    });
  };
  const changeUserInfo = (data: null | UserGroupItem = null) => {
    setUserPickInfo({
      visible: !userPickInfo.visible,
      data,
    });
  };

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

  const reload = () => {
    actionRef?.current?.reload();
  };
  const navigate = useNavigate();
  /** 基础编辑操作 */
  const handleBaseActions = (record: UserGroupItem, code: ActionCodeEnum) => {
    if (code === ActionCodeEnum.Update) {
      return changeModelInfo(record);
    }
    if (code === ActionCodeEnum.UpdateApp) {
      return navigate('/user/app-auth-management', { state: record });
    }
    changeUserInfo(record);
  };

  const columns = getColumns({ handleBaseActions, isManager });

  return (
    <ContainerLayout
      title='用户组管理'
      custom
      header={
        <>
          <div>1. 每个用户组独立管理自己组内的应用，类似于需求小组的形式</div>
          <div>
            2. 管理员可以管理用户组的成员以及管理的分发，组内的成员拥有该组内分配的权限，管理员拥有组内应用所有的权限
          </div>
          <div>3. 更细粒度的分发则可以以组为维度再新增角色的概念，这里不做开发</div>
        </>
      }
    >
      <ProTable<UserGroupItem>
        className='m-4'
        actionRef={actionRef}
        columns={columns}
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
          <Button
            onClick={() => {
              changeModelInfo();
            }}
            className='mr-2'
            type='primary'
          >
            新增
          </Button>,
        ]}
      />
      <EditGroupModal
        {...appModalInfo}
        onConfirm={() => {
          changeModelInfo();
          reload();
        }}
        onClose={changeModelInfo}
      />
      <UserPicker {...userPickInfo} onClose={changeUserInfo} />
    </ContainerLayout>
  );
};

UserGroupManagement.displayName = 'UserGroupManagement';
export default UserGroupManagement;
