import { getAllApplicationList } from '@src/api/user-center/app-management';
import { ApplicationItem } from '@src/api/user-center/app-management/application/types';
import { getAllRoles } from '@src/api/user-center/role';
import { IGetAllRolesResp, RoleListItem } from '@src/api/user-center/role/types';
import ContainerLayout from '@src/layout/ContentLayout';
import { requestExecute } from '@src/utils/request/utils';
import { useBoolean, useRequest, useSetState } from 'ahooks';
import { Spin, Space, Tabs, Typography, Button, Empty, Checkbox, Row, Col, Input, Tree } from 'antd';
import { DataNode } from 'antd/lib/tree';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './index.module.less';

const { Title } = Typography;
const { Search } = Input;

type FilterListNode = RoleListItem & DataNode & { key: string };

const AuthManagement = () => {
  const [isLoading, loadingFn] = useBoolean();
  const [searchRole, setSearchRole] = useState('');
  const [roleList, setRoleList] = useSetState<{
    list: IGetAllRolesResp['list'];
    filterList: FilterListNode[];
    selected: any;
    selectedKeys: string[];
  }>({
    list: [],
    filterList: [],
    selectedKeys: [],
    selected: null,
  });
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const [systemList, setSystemList] = useState<ApplicationItem[]>([]);

  const formatRoles = (list: IGetAllRolesResp['list'], search = searchRole): void => {
    const roleGroupKeys: any = {};
    list.forEach((item) => {
      const group = item.group;
      if ((search && !item.name.includes(search)) || !group) {
        return;
      }
      if (!roleGroupKeys[group.id]) {
        roleGroupKeys[group.id] = {
          id: group.id,
          name: group.name,
          key: group.id,
          selectable: false,
          children: [],
        };
      }
      const children = roleGroupKeys[group.id]['children'];
      children.push({
        ...item,
        key: `${group.id}-${item.id}`,
      });
    });
    const filterList: FilterListNode[] = Object.values(roleGroupKeys);
    let selected;
    const selectedKeys: string[] = [];
    if (filterList[0] && filterList[0]['children']?.length) {
      selected = filterList[0]['children'][0] || null;
      selectedKeys.push(selected.key as string);
      setExpandedKeys([filterList[0].key]);
    }
    setRoleList({ filterList, list: list, selected, selectedKeys });
  };

  const fetchData = async () => {
    const [err, res] = await requestExecute(getAllRoles, {});
    if (!err && res?.list) {
      formatRoles(res.list);
    }
  };

  const handleSearchRole = (search: string) => {
    setSearchRole(search);
    formatRoles(roleList.list, search);
  };

  const handleTreeSelect = (value: Array<string | number>, info: any) => {
    if (!value.length) {
      return setRoleList({
        selectedKeys: [],
        selected: null,
      });
    }
    const node = info.node;

    setRoleList({
      selectedKeys: [node.key],
      selected: node,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ContainerLayout title='后台权限管理' custom>
      <div className='flex p-4'>
        <div className={styles.left}>
          <div className={styles.header}>
            <div className={styles.title}>角色列表</div>
            <Button size='small' type='primary'>
              新增分组
            </Button>
          </div>
          <div className={styles.choosed}>当前选中角色：{}</div>
          <Search placeholder='请输入分组名称' allowClear onSearch={handleSearchRole} />
          <div className={styles['left-content']}>
            <Tree
              blockNode
              fieldNames={{ title: 'name' }}
              treeData={roleList.filterList}
              selectedKeys={roleList.selectedKeys}
              expandedKeys={expandedKeys}
              onExpand={(keys) => setExpandedKeys(keys as string[])}
              onSelect={handleTreeSelect}
            />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.header}>
            <div className={styles.title}>权限配置</div>
            <Button size='small' type='primary'>
              新增角色
            </Button>
          </div>
        </div>
      </div>
    </ContainerLayout>
  );
};

export default AuthManagement;
