import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, message, Tooltip, Space, Tree, Dropdown, Menu, Input, Table, Popconfirm, SelectProps } from 'antd';
import ContainerLayout from '@src/layout/ContentLayout';
import { ProTable, ActionType, ProCard } from '@ant-design/pro-components';
import type { ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { AntTreeNode, DataNode } from 'antd/lib/tree';

import { useBoolean, useSetState } from 'ahooks';
import {
  batchTransferUsers,
  getAllOrganizationList,
  postCreateOrganization,
  postDeleteOrganization,
  postUpdateOrganization,
} from '@src/api/user-center/user-group-management';
import { getAllRoles } from '@src/api/user-center/role';
import { getUserList, postCreateUser, postDeleteUser, postUpdateUser } from '@src/api/user';
import { IGetUserListReq, UserItem } from '@src/api/user/types';
import { IDeleteOrganizationReq, UserGroupItem } from '@src/api/user-center/user-group-management/types';
import { RoleListItem } from '@src/api/user-center/role/types';

import { requestExecute } from '@src/utils/request/utils';
import { listToTree } from '@src/utils/format';
import { ActionCodeEnum, EMPTY_TABLE } from '@src/consts';

import Split from '@src/components/Split';
import OrganizationEdit from './components/organization-edit';
import UserEdit from './components/user-edit';
import BatchTransfer from './components/batch-transfer';

import styles from './index.module.less';
import ColumnPanel from '@src/components/ColumnPanel';

type UserTreeItem = DataNode & UserGroupItem;
type RoleListNode = RoleListItem & DataNode & { key: string };

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
  const [batchInfo, setBatchInfo] = useSetState<{ open: boolean; data: undefined | Array<string | number> }>({
    open: false,
    data: undefined,
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
  const [roleList, setRoleList] = useState<RoleListNode[]>([]);
  const changeOrgStatus = (open = false) => {
    setOrgInfo({ open, data: null });
  };

  const changeUserStatus = (open = false) => {
    setUserInfo({ open, data: null });
  };

  const changeBatchStatus = (open = false) => {
    setBatchInfo({ open, data: undefined });
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
  };

  const fetchUserRoleList = async () => {
    const [err, res] = await requestExecute(getAllRoles);
    if (err) {
      return;
    }
    const roleGroupKeys: any = {};
    res.list.forEach((item) => {
      const group = item.group;
      if (!group) return;
      if (!roleGroupKeys[group.id]) {
        roleGroupKeys[group.id] = {
          ...group,
          checkable: false,
          id: `none_${group.id}`,
          children: [],
        };
      }
      const children = roleGroupKeys[group.id]['children'];
      children.push({
        ...item,
      });
      setRoleList(Object.values(roleGroupKeys));
    });
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

  const handleBatchTransferUsers = async (data: { organization: number }) => {
    const { organization } = data;
    if (organization === list?.selected?.id) {
      return message.info('当前用户已在该组织下，请重新选择');
    }
    if (!batchInfo.data) {
      return message.error('当前未选中用户');
    }
    const [err] = await requestExecute(batchTransferUsers, {
      organization,
      userIds: batchInfo.data,
    });
    if (err) {
      return;
    }
    message.success('转移用户成功');
    userTableRef.current?.submit();
    changeBatchStatus();
  };

  const handleDeleteUsers = async (userIds: Array<string | number>) => {
    const [err] = await requestExecute(postDeleteUser, {
      userIds,
    });
    if (err) {
      return;
    }
    message.success('删除用户成功');
    userTableRef.current?.submit();
  };

  useEffect(() => {
    fetchOrganizationList();
    fetchUserRoleList();
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
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '昵称',
      dataIndex: 'nick',
      width: 100,
      ellipsis: true,
    },
    {
      title: '所属组织',
      dataIndex: 'orgName',
      width: 140,
    },
    {
      title: '所属角色',
      dataIndex: 'rolesName',
      ellipsis: true,
      width: 140,
    },
    {
      title: '创建时间',
      width: 140,
      hideInSearch: true,
      dataIndex: 'createTime',
    },
    {
      title: '更新时间',
      width: 140,
      hideInSearch: true,
      dataIndex: 'updateTime',
    },
    {
      title: '操作',
      width: 140,
      fixed: 'right',
      valueType: 'option',
      render: (_: unknown, data: UserItem) => (
        <Split type='button'>
          <Button type='link' onClick={() => setUserInfo({ data, open: true })}>
            编辑
          </Button>
          <Popconfirm title='确认删除吗?' onConfirm={() => handleDeleteUsers([data.id])}>
            <a>删除</a>
          </Popconfirm>
        </Split>
      ),
    },
  ];

  return (
    <ContainerLayout custom>
      <ColumnPanel
        leftTitle='组织管理'
        leftExtra={
          <Space>
            <Button type='primary' onClick={() => changeOrgStatus(true)} size='small'>
              新增
            </Button>
            <Button onClick={fetchOrganizationList} loading={isOrgListLoading} size='small'>
              刷新
            </Button>
          </Space>
        }
        rightTitle='成员管理'
      >
        <div slot='left'>
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
        </div>
        <div slot='right'>
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
            ]}
            rowSelection={{
              selectedRowKeys: batchInfo.data,
              onChange(selectedRowKeys) {
                setBatchInfo({ data: selectedRowKeys });
              },
            }}
            tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
              <span>已选 {selectedRowKeys.length} 项</span>
            )}
            tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => {
              return (
                <>
                  <Button type='link' onClick={onCleanSelected}>
                    取消选择
                  </Button>
                  <Button
                    type='link'
                    onClick={() => {
                      setBatchInfo({
                        open: true,
                        data: selectedRowKeys,
                      });
                    }}
                    loading={isOrgListLoading}
                  >
                    批量转移
                  </Button>
                  <Button type='link' onClick={() => handleDeleteUsers(selectedRowKeys)} loading={isOrgListLoading}>
                    批量删除
                  </Button>
                </>
              );
            }}
            headerTitle='成员列表'
            columnsState={{
              persistenceKey: 'org-user-list',
              persistenceType: 'localStorage',
            }}
            rowKey='id'
            scroll={{ x: 700 }}
          />
        </div>
      </ColumnPanel>
      <OrganizationEdit
        {...orgInfo}
        list={list.organizationList}
        onSubmit={handleUpdateOrganization}
        onClose={changeOrgStatus}
      />
      <UserEdit
        {...userInfo}
        list={list.organizationList}
        roleList={roleList}
        onSubmit={handleUpdateUser}
        onClose={changeUserStatus}
      />
      <BatchTransfer
        open={batchInfo.open}
        list={list.organizationList}
        onSubmit={handleBatchTransferUsers}
        onClose={changeBatchStatus}
      />
    </ContainerLayout>
  );
};

UserManagement.displayName = 'UserManagement';

export default UserManagement;
