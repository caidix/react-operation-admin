import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, message, Tooltip, Space, Tree, Dropdown, Menu, Input } from 'antd';
import ContainerLayout from '@src/layout/ContentLayout';
import { ProTable, ActionType, ProCard } from '@ant-design/pro-components';
import {
  SyncOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  SwapOutlined,
} from '@ant-design/icons';

import { useBoolean, useSetState, useUpdateEffect } from 'ahooks';
import {
  getAllOrganizationList,
  postCreateOrganization,
  postDeleteOrganization,
  postUpdateOrganization,
} from '@src/api/user-center/user-group-management';
import { requestExecute } from '@src/utils/request/utils';
import { listToTree } from '@src/utils/format';
import { AntTreeNode, DataNode } from 'antd/lib/tree';
import { IDeleteOrganizationReq, UserGroupItem } from '@src/api/user-center/user-group-management/types';
import { ActionCodeEnum, EMPTY_TABLE } from '@src/consts';
import { getUserList, postCreateUser, postUpdateUser } from '@src/api/user';
import { IGetUserListReq, UserItem } from '@src/api/user/types';
import type { ProColumns, ProFormInstance } from '@ant-design/pro-components';
import styles from './index.module.less';
import OrganizationEdit from './components/organization-edit';
import UserEdit from './components/user-edit';

type UserTreeItem = DataNode & UserGroupItem;

const UserManagement: React.FC = () => {
  const [isOrgListLoading, isOrgListLoadingFn] = useBoolean();
  const userTableRef = useRef<ProFormInstance>();
  const [orgInfo, setOrgInfo] = useSetState<{ open: boolean; data: null | UserTreeItem }>({
    open: false,
    data: null,
  });
  const [userInfo, setUserInfo] = useSetState<{ open: boolean; data: null | UserItem }>({
    open: false,
    data: null,
  });
  const [list, setList] = useSetState<{
    organizationList: UserTreeItem[];
    selected: UserTreeItem | null;
    selectedKeys: number[];
  }>({
    organizationList: [],
    selectedKeys: [],
    selected: null,
  });
  const [expandedKeys, setExpandedKeys] = useState<number[]>([]);

  const changeOrgStatus = (open = false) => {
    setOrgInfo({ open, data: null });
  };

  const changeUserStatus = (open = false) => {
    setUserInfo({ open, data: null });
  };

  const fetchOrganizationList = async () => {
    const [err, res] = await requestExecute(getAllOrganizationList);
    console.log({ res });
    if (err) {
      return;
    }
    const data = listToTree(res);
    setExpandedKeys((pre) => [...pre, ...data.map((n: UserGroupItem) => n.id).filter((n: number) => !pre.includes(n))]);
    setList({
      organizationList: data,
    });
    console.log({ expandedKeys });
  };

  const handleUpdateOrganization = async (data: UserGroupItem) => {
    const request = data.id ? postUpdateOrganization : postCreateOrganization;
    const [err] = await requestExecute(request, data);
    if (err) {
      return;
    }
    message.success(`${data.id ? '更新' : '创建'}成功`);
    fetchOrganizationList();
    changeOrgStatus();
  };

  const handleDeleteOrganization = async (id: number) => {
    const [err] = await requestExecute<IDeleteOrganizationReq>(postDeleteOrganization, { id });
    if (err) {
      return;
    }
    message.success('删除成功');
    fetchOrganizationList();
  };

  const handleTreeSelect = (value: Array<string | number>, info: any) => {
    if (!value.length) {
      return setList({
        selectedKeys: [],
        selected: null,
      });
    }
    const node = info.node;

    setList({
      selectedKeys: [node.id],
      selected: node,
    });
  };

  const fetchUserList = async (params: IGetUserListReq) => {
    const [err, res] = await requestExecute(getUserList, {
      ...params,
    });
    if (err) {
      message.error(err.message);
      return EMPTY_TABLE;
    }
    console.log({ res });

    return {
      data: res.list,
      total: res.total || 0,
      success: true,
    };
  };

  const handleUpdateUser = async (data: UserItem) => {
    const request = data.id ? postUpdateUser : postCreateUser;
    const [err] = await requestExecute(request, data);
    if (err) {
      return;
    }
    message.success(`${data.id ? '更新' : '创建'}用户成功`);
    userTableRef.current?.submit();
    changeUserStatus();
  };

  useEffect(() => {
    fetchOrganizationList();
  }, []);

  const TreeNode = (data: UserTreeItem) => {
    const menu = [
      {
        label: (
          <div>
            编辑 <EditOutlined />
          </div>
        ),
        key: ActionCodeEnum.UpdateOrganization,
      },
      {
        label: (
          <div>
            删除 <DeleteOutlined />
          </div>
        ),
        disabled: !!(data.children && data.children.length),
        key: ActionCodeEnum.Delete,
      },
    ];
    const onClick = ({ key }: { key: string }) => {
      if (key === ActionCodeEnum.UpdateOrganization) {
        setOrgInfo({
          open: true,
          data: { ...data },
        });
      }
      handleDeleteOrganization(data.id);
    };
    return (
      <Dropdown menu={{ items: menu, onClick }} trigger={['contextMenu']}>
        <div>{data.name}</div>
      </Dropdown>
    );
  };

  const columns: ProColumns<UserItem>[] = [
    {
      title: 'ID',
      width: 80,
      dataIndex: 'id',
      key: 'id',
      valueType: 'digit',
    },
    {
      title: '用户名',
      width: 100,
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '昵称',
      dataIndex: 'nick',
      key: 'nick',
    },
    {
      title: '创建时间',
      width: 140,
      key: 'createTime',
      hideInSearch: true,
      dataIndex: 'createTime',
    },
    {
      title: '更新时间',
      width: 140,
      key: 'updateTime',
      hideInSearch: true,
      dataIndex: 'updateTime',
    },
    {
      title: '操作',
      width: 80,
      key: 'option',
      valueType: 'option',
      render: (_: unknown, data: UserItem) => (
        <Button type='link' onClick={() => setUserInfo({ data, open: true })}>
          编辑
        </Button>
      ),
    },
  ];

  return (
    <ContainerLayout custom>
      <div className='m-4'>
        <ProCard split='vertical'>
          <ProCard
            colSpan='240px'
            title='组织管理'
            headerBordered
            className={styles['content-flex']}
            extra={
              <Space>
                <Button type='primary' onClick={() => changeOrgStatus(true)} size='small'>
                  新增
                </Button>
                <Button onClick={fetchOrganizationList} loading={isOrgListLoading} size='small'>
                  刷新
                </Button>
              </Space>
            }
          >
            <div className={styles.title}>当前选中组织：{list.selected?.name || '-'}</div>
            <Tree<UserTreeItem>
              fieldNames={{ key: 'id' }}
              autoExpandParent
              blockNode
              showLine
              height={650}
              treeData={list.organizationList}
              expandedKeys={expandedKeys}
              selectedKeys={list.selectedKeys}
              onSelect={handleTreeSelect}
              titleRender={TreeNode}
              onExpand={(keys) => setExpandedKeys(keys as number[])}
            />
          </ProCard>
          <ProCard title='成员管理' headerBordered>
            <ProTable
              formRef={userTableRef}
              columns={columns}
              request={fetchUserList}
              params={{
                organization: list.selected?.id,
              }}
              search={{
                labelWidth: 'auto',
              }}
              pagination={{
                pageSize: 5,
              }}
              toolBarRender={() => [
                <Button type='primary' onClick={() => changeUserStatus(true)}>
                  新增
                </Button>,
                <Button onClick={fetchOrganizationList} loading={isOrgListLoading}>
                  转移
                </Button>,
                <Button onClick={fetchOrganizationList} loading={isOrgListLoading}>
                  删除
                </Button>,
              ]}
              headerTitle='成员列表'
              columnsState={{
                persistenceKey: 'org-user-list',
                persistenceType: 'localStorage',
              }}
              rowKey='id'
              scroll={{ x: 700 }}
            />
          </ProCard>
        </ProCard>

        <OrganizationEdit
          {...orgInfo}
          list={list.organizationList}
          onSubmit={handleUpdateOrganization}
          onClose={changeOrgStatus}
        />
        <UserEdit {...userInfo} list={list.organizationList} onSubmit={handleUpdateUser} onClose={changeUserStatus} />
      </div>
    </ContainerLayout>
  );
};

UserManagement.displayName = 'UserManagement';

export default UserManagement;
