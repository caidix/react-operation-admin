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

import { useBoolean, useSetState } from 'ahooks';
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
import { ActionCodeEnum } from '@src/consts';
import OrganizationEdit from './components/organization-edit';
import styles from './index.module.less';

type UserTreeItem = DataNode & UserGroupItem;

const UserManagement: React.FC = () => {
  const [isOrgListLoading, isOrgListLoadingFn] = useBoolean();
  const [orgInfo, setOrgInfo] = useSetState<{ open: boolean; data: null | UserTreeItem }>({
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

  const handleAddGroup = () => {
    setOrgInfo({
      open: true,
      data: null,
    });
  };

  const changeOrgStatus = (open = false) => {
    setOrgInfo({ open, data: null });
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

  const handleTreeSelect = (_: number[], info: any) => {
    const node = info.node;
    console.log({ info });

    setList({
      selectedKeys: [node.id],
      selected: node,
    });
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

  return (
    <ContainerLayout>
      <ProCard split='vertical'>
        <ProCard
          colSpan='240px'
          title='组织管理'
          headerBordered
          extra={
            <Space>
              <Button type='primary' onClick={handleAddGroup} size='small'>
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
            treeData={list.organizationList}
            expandedKeys={expandedKeys}
            selectedKeys={list.selectedKeys}
            onSelect={handleTreeSelect}
            titleRender={TreeNode}
            onExpand={(keys) => setExpandedKeys(keys as number[])}
          />
        </ProCard>
        <ProCard title={'1321312312'}>13213</ProCard>
      </ProCard>

      <OrganizationEdit
        {...orgInfo}
        list={list.organizationList}
        onSubmit={handleUpdateOrganization}
        onClose={changeOrgStatus}
      />
    </ContainerLayout>
  );
};

UserManagement.displayName = 'UserManagement';

export default UserManagement;
