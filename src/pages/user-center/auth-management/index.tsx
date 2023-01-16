import { getAllApplicationList } from '@src/api/user-center/app-management';
import { ApplicationItem } from '@src/api/user-center/app-management/application/types';
import { getAllRoles, getSystemRoleAuth, postMenuAuthList, updateSystemRoleAuth } from '@src/api/user-center/role';
import { IGetAllRolesResp, IGetSystemRoleAuthResp, RoleListItem } from '@src/api/user-center/role/types';
import ColumnPanel from '@src/components/ColumnPanel';
import ContainerLayout from '@src/layout/ContentLayout';
import { requestExecute } from '@src/utils/request/utils';
import { useBoolean, useRequest, useSetState, useUpdateEffect } from 'ahooks';
import { Spin, Space, Tabs, Typography, Button, Empty, Checkbox, Row, Col, Input, Tree, Table, message } from 'antd';
import { DataNode } from 'antd/lib/tree';
import React, { useEffect, useMemo, useState } from 'react';
import classnames from 'classnames';
import EditAppModal from './components/EditAppDialog';
import styles from './index.module.less';

const { TabPane } = Tabs;
const { Title } = Typography;
const { Search } = Input;

type FilterListNode = RoleListItem & DataNode & { key: string };

const AuthManagement = () => {
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
  const [appModalInfo, setModalInfo] = useSetState<any>({
    visible: false,
    data: null,
  });
  const [appModalShow, setAppModalShow] = useBoolean();
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<any[]>();
  const [activeTabKey, setActiveTabKey] = useState('');
  const [roleAuth, setRoleAuth] = useSetState<{
    list: IGetSystemRoleAuthResp;
    checked: number;
  }>({ list: [], checked: -1 });

  const [tableTreeState, setTableTreeState] = useSetState({
    menuList: [],
    checkedList: [],
  });

  const [loadingEnum, setLoading] = useSetState({
    system: false,
    table: false,
    role: false,
  });

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

  const getAuthSystemList = async () => {
    if (!roleList.selected.id) return;
    setLoading({ system: true });
    const [err, res] = await requestExecute(getSystemRoleAuth, {
      roleId: roleList.selected.id,
    });
    if (err) {
      return;
    }

    let checked = roleAuth.checked;
    const hasAuth = res.find((auth) => auth.systemId === checked);
    if (!hasAuth) {
      checked = res.length ? res[0].systemId : -1;
    }

    setRoleAuth({ list: res, checked });
    setLoading({ system: false });
  };

  const fetchSystemMenus = async (id: number) => {
    const system = roleAuth.list.find((i) => i.id === +id);
    console.log({ system: roleAuth.list, id });

    if (!system) return;
    const [err, res] = await requestExecute(postMenuAuthList, {
      systemId: system.id,
      code: system.code,
      roleId: roleList.selected.id,
    });
    if (err) {
      return;
    }
  };

  const handleSystemAuth = async (systemIds: number[]) => {
    const [err, res] = await requestExecute(updateSystemRoleAuth, {
      systemIds,
      roleId: roleList.selected.id,
    });
    if (err) {
      return;
    }
    message.success('配置成功');
    setAppModalShow.setFalse();
    getAuthSystemList();
  };

  const handleSearchRole = (search: string) => {
    setSearchRole(search);
    formatRoles(roleList.list, search);
  };

  const handleTreeSelect = (value: Array<string | number>, info: any) => {
    if (!value.length) {
      return;
    }
    const node = info.node;

    setRoleList({
      selectedKeys: [node.key],
      selected: node,
    });
  };

  const handleSave = () => {};

  useEffect(() => {
    fetchData();
  }, []);

  useUpdateEffect(() => {
    getAuthSystemList();
  }, [roleList.selected]);

  const columns = [];

  return (
    <ContainerLayout title='后台权限管理' custom>
      <ColumnPanel
        leftTitle='角色列表'
        rightTitle='权限列表'
        rightExtra={
          <Button type='primary' onClick={setAppModalShow.setTrue}>
            授权应用设置
          </Button>
        }
      >
        <div slot='left' className={styles.panel}>
          <div className={styles.choosed}>当前选中角色：{}</div>
          <Search placeholder='请输入分组名称' allowClear onSearch={handleSearchRole} />

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
        <div slot='right' className='mt-2'>
          <Spin spinning={loadingEnum.system}>
            <div className={styles['checked-panel']}>
              <Row gutter={[16, 16]}>
                {roleAuth.list.map((auth) => (
                  <Col
                    xs={24}
                    sm={12}
                    md={6}
                    lg={3}
                    onClick={() => setRoleAuth({ checked: auth.systemId })}
                    className={classnames([
                      'single-ellipsis',
                      styles['system-item'],
                      roleAuth.checked === auth.systemId ? styles['system-item--active'] : '',
                    ])}
                    key={auth.id}
                  >
                    {auth.systemName}
                  </Col>
                ))}
              </Row>
            </div>
            {/* 菜单权限 */}
            <Space size={30}>
              <div className={styles.title}>请选择菜单和功能点</div>
              <div className={styles.tips}>提示：勾选【菜单和功能点】表示 属于该角色的用户可以访问操作该权限点</div>
            </Space>
            {/* {systemList.list
              .filter((i) => i.id && systemList.checked.includes(i.id))
              .map((item) => (
                <Table
                  key={item.id}
                  loading={loadingEnum.table}
                  dataSource={[] as any}
                  columns={columns}
                  showHeader={false}
                  pagination={false}
                  expandable={{
                    expandedRowKeys: expandedRowKeys,
                    onExpandedRowsChange: (expandedRows: any) => {
                      setExpandedRowKeys(expandedRows);
                    },
                  }}
                />
              ))} */}
          </Spin>
        </div>
      </ColumnPanel>
      <EditAppModal
        visible={appModalShow}
        authList={roleAuth.list}
        onClose={setAppModalShow.setFalse}
        onConfirm={handleSystemAuth}
      />
    </ContainerLayout>
  );
};

export default AuthManagement;
