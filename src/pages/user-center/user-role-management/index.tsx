import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, message } from 'antd';
import ContainerLayout from '@src/layout/ContentLayout';
import { ProTable, ActionType, ProColumns } from '@ant-design/pro-components';

import { useAntdTable, useRequest, useSetState } from 'ahooks';
import { getAllRoleGroups, getRoleList } from '@src/api/user-center/role';
import classnames from 'classnames';

import { RoleGroupItem, RoleListItem } from '@src/api/user-center/role/types';

import { EditOutlined } from '@ant-design/icons';
import { EMPTY_TABLE } from '@src/consts';
import { requestExecute } from '@src/utils/request/utils';
import Split from '@src/components/Split';
import ColumnPanel from '@src/components/ColumnPanel';
import { RoleParams, RoleType } from './types';
import EditRoleModal from './components/edit-role-modal';

import styles from './index.module.less';
interface RoleModelInfo {
  visible: boolean;
  data: RoleParams;
  type: RoleType;
}
const { Search } = Input;
const UserGroupManagement: React.FC = () => {
  // const [_, { isManager }] = useUserInfo();
  const actionRef = useRef<ActionType>();
  const [searchGroup, setSearchGroup] = useState('');
  const [currentGroup, setCurrentGroup] = useState<RoleGroupItem | null>(null);
  const [currentHoverGroup, setCurrentHoverGroup] = useState<number>(-1);
  const [roleModalInfo, setModalInfo] = useSetState<RoleModelInfo>({
    visible: false,
    data: null,
    type: RoleType.Group,
  });

  const fetchRoleList = async (params: IPagination & { name?: string; group: typeof currentGroup }) => {
    const { group, name, current, pageSize } = params;
    const [err, res] = await requestExecute(getRoleList, {
      name,
      current,
      pageSize,
      roleGroupId: group?.id,
    });

    if (err) {
      return EMPTY_TABLE;
    }
    return {
      data: res.list,
      total: res.total || 0,
      success: true,
    };
  };

  const { data, refresh } = useRequest(getAllRoleGroups, {
    onSuccess: (params) => {
      const { list } = params;
      if (!currentGroup && list[0]) {
        setCurrentGroup(list[0]);
      }
    },
  });

  const handleRoleModal = () => {
    if (roleModalInfo.type === RoleType.Group) {
      return refresh();
    }
    actionRef.current?.reload();
  };

  const changeModelInfo = (data: RoleParams = null, type: RoleType = RoleType.Group) => {
    setModalInfo({
      visible: !roleModalInfo.visible,
      data,
      type,
    });
  };

  const groupList = useMemo(() => {
    return (data?.list || []).filter((item) => item.name.includes(searchGroup));
  }, [data, searchGroup]);

  const columns: ProColumns<RoleListItem>[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
      width: 120,
      ellipsis: true,
    },
    {
      title: '角色概述',
      dataIndex: 'desc',
      width: 200,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 170,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 170,
    },
    {
      title: '操作',
      key: 'option',
      width: 120,
      fixed: 'right',
      valueType: 'option',
      render: (_, record) => (
        <Split type='button'>
          <Button
            type='link'
            onClick={() => {
              changeModelInfo(record, RoleType.Item);
            }}
          >
            编辑
          </Button>
        </Split>
      ),
    },
  ];

  return (
    <ContainerLayout title='后台角色管理' custom>
      <ColumnPanel
        leftTitle='角色分组'
        leftExtra={
          <Button size='small' type='primary' onClick={() => changeModelInfo()}>
            新增分组
          </Button>
        }
        rightTitle='角色列表'
        rightExtra={
          <Button size='small' type='primary' onClick={() => changeModelInfo(null, RoleType.Item)}>
            新增角色
          </Button>
        }
      >
        <div slot='left'>
          <div className={styles.choosed}>当前选中分组：{currentGroup?.name}</div>
          <Search placeholder='请输入分组名称' allowClear onSearch={setSearchGroup} />
          <div className={styles['left-content']} onMouseLeave={() => setCurrentHoverGroup(-1)}>
            {groupList.map((item) => {
              return (
                <div
                  className={classnames([
                    styles['left-item'],
                    currentGroup?.id === item.id ? styles['left-item--active'] : '',
                  ])}
                  onClick={() => setCurrentGroup(item)}
                  onMouseEnter={() => setCurrentHoverGroup(item.id)}
                  key={item.id}
                >
                  <span>{item.name}</span>
                  {currentHoverGroup === item.id && (
                    <>
                      <EditOutlined onClick={() => changeModelInfo(item)} />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div slot='right'>
          <ProTable
            className='mt-4'
            actionRef={actionRef}
            search={false}
            columns={columns}
            pagination={{
              pageSize: 5,
            }}
            options={{
              search: {
                name: 'name',
                placeholder: '请输入角色名称',
              },
            }}
            rowKey='id'
            request={fetchRoleList}
            manualRequest
            params={{ group: currentGroup }}
            scroll={{ x: '100%' }}
          />
        </div>
      </ColumnPanel>
      <EditRoleModal
        {...roleModalInfo}
        onConfirm={handleRoleModal}
        onClose={changeModelInfo}
        groupList={data?.list ?? []}
      />
    </ContainerLayout>
  );
};

UserGroupManagement.displayName = 'UserGroupManagement';
export default UserGroupManagement;
