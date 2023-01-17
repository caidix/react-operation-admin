import React, { useEffect, useMemo, useRef, useState } from 'react';
import classnames from 'classnames';
import { useBoolean, useSetState, useUpdateEffect } from 'ahooks';
import { Spin, Space, Button, Empty, Row, Col, Input, Tree, message } from 'antd';

import {
  getAllRoles,
  getSystemRoleAuth,
  postMenuAuthList,
  updateMenuRoleAuth,
  updateSystemRoleAuth,
} from '@src/api/user-center/role';
import { IGetAllRolesResp, IGetSystemRoleAuthResp, RoleListItem } from '@src/api/user-center/role/types';
import { DataNode } from 'antd/lib/tree';

import ColumnPanel from '@src/components/ColumnPanel';
import ContainerLayout from '@src/layout/ContentLayout';
import { requestExecute } from '@src/utils/request/utils';
import { listToTree } from '@src/utils/format';
import EditAppModal from './components/EditAppDialog';

import styles from './index.module.less';

const { Search } = Input;

type FilterListNode = RoleListItem & DataNode & { key: string };

const AuthManagement = () => {
  const [loadingEnum, setLoading] = useSetState({
    system: false,
    role: false,
  });

  /** 角色列表操作 -- start */
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

  const fetchRoleList = async () => {
    const [err, res] = await requestExecute(getAllRoles, {});
    if (!err && res?.list) {
      formatRoles(res.list);
    }
  };

  const handleSearchRole = (search: string) => {
    setSearchRole(search);
    formatRoles(roleList.list, search);
  };

  const handleRoleSelect = (value: Array<string | number>, info: any) => {
    if (!value.length) {
      return;
    }
    const node = info.node;
    setRoleList({
      selectedKeys: [node.key],
      selected: node,
    });
  };
  /** 角色列表操作 -- end */

  /** 当前角色所拥有的应用权限操作 -- start */
  const [appModalShow, setAppModalShow] = useBoolean();
  const [roleAuth, setRoleAuth] = useSetState<{
    list: IGetSystemRoleAuthResp;
    checked: number | null;
  }>({ list: [], checked: null });

  const getAuthSystemList = async () => {
    if (!roleList.selected.id) return;
    setLoading({ system: true });
    setRoleAuth({ list: [], checked: null });
    const [err, res] = await requestExecute(getSystemRoleAuth, {
      roleId: roleList.selected.id,
    });
    if (err) {
      return;
    }

    let checked = roleAuth.checked;
    const hasAuth = res.find((auth) => auth.systemId === checked);
    if (!hasAuth) {
      checked = res.length ? res[0].systemId : null;
    }

    setRoleAuth({ list: res, checked });
    setLoading({ system: false });
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

  /** 当前角色所拥有的应用权限操作 -- end */

  /** 获取当前应用的菜单及权限操作 -- start */
  const [expandedRowKeys, setExpandedRowKeys] = useState<any[]>();
  const [menus, setMenus] = useSetState<{ menuList: any; checkedKeys: React.Key[] }>({
    menuList: [],
    checkedKeys: [],
  });
  const treeRef = useRef<any>();

  const fetchSystemMenus = async () => {
    setLoading({ role: true });
    const system = roleAuth.list.find((i) => i.systemId === roleAuth.checked);
    if (!system) return;
    const [err, res] = await requestExecute(postMenuAuthList, {
      systemId: system.systemId,
      systemCode: system.systemCode,
      roleId: roleList.selected.id,
    });
    if (err) {
      return;
    }
    const list = listToTree(res.list, 'id', 'parentId', 'children');
    const checkedKeys = getCheckedKeys(res.auths, list);
    setExpandedRowKeys(res.list.map((v: { id: any }) => v.id));
    setMenus({ menuList: list, checkedKeys });
    setLoading({ role: false });
  };

  const handleSaveMenuAuth = async () => {
    try {
      setLoading({ role: true });
      if (!roleAuth.checked || !roleList.selected.id) {
        return message.error('请先选择角色/应用后进行操作');
      }
      const halfCheckedKeys = treeRef.current?.state.halfCheckedKeys || [];
      const menuIds = [...menus.checkedKeys, ...halfCheckedKeys];
      const [err, res] = await requestExecute(updateMenuRoleAuth, {
        menuIds,
        systemId: roleAuth.checked,
        roleId: roleList.selected.id,
      });
      if (err) {
        return;
      }
      message.success('更新权限配置成功');
    } finally {
      setLoading({ role: false });
    }
  };

  const onCheckMenus = (checkedKeysValue: React.Key[]) => {
    setMenus({ checkedKeys: checkedKeysValue });
  };

  const getCheckedKeys = (checkedList: React.Key[], options: any[], total = []) => {
    return options.reduce<number[]>((prev, curr) => {
      if (curr.children?.length) {
        getCheckedKeys(checkedList, curr.children, total);
      } else {
        if (checkedList.includes(curr.id)) {
          prev.push(curr.id);
        }
      }
      return prev;
    }, total);
  };
  /** 获取当前应用的菜单及权限操作 -- end */

  useEffect(() => {
    fetchRoleList();
  }, []);

  useUpdateEffect(() => {
    getAuthSystemList();
  }, [roleList.selected]);

  useUpdateEffect(() => {
    if (roleAuth.checked) {
      fetchSystemMenus();
    }
  }, [roleAuth.checked]);

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
            onSelect={handleRoleSelect}
          />
        </div>
        <div slot='right' className='mt-2'>
          <Spin spinning={loadingEnum.system}>
            <div className={styles['checked-panel']}>
              {roleAuth.list.length ? (
                <Row gutter={[16, 16]}>
                  {roleAuth.list.map((auth) => (
                    <Col
                      xs={24}
                      sm={12}
                      md={6}
                      lg={4}
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
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无相关应用权限，请授权' />
              )}
            </div>
          </Spin>
          {/* 菜单权限 */}
          {roleAuth.checked ? (
            <>
              <Spin spinning={loadingEnum.role}>
                <Space size={30} className='mt-4 mb-4'>
                  <div className={styles.title}>请选择菜单和功能点</div>
                  <div className={styles.tips}>提示：勾选【菜单和功能点】表示 属于该角色的用户可以访问操作该权限点</div>
                </Space>
                {menus.menuList.length ? (
                  <>
                    <div className={styles['checked-panel']}>
                      <Tree
                        ref={treeRef}
                        checkable
                        onExpand={setExpandedRowKeys}
                        expandedKeys={expandedRowKeys}
                        onCheck={onCheckMenus as any}
                        checkedKeys={menus.checkedKeys}
                        treeData={menus.menuList}
                        fieldNames={{ title: 'name', key: 'id' }}
                      />
                    </div>
                    <div className={styles.submit}>
                      <Button type='primary' loading={loadingEnum.role} onClick={handleSaveMenuAuth}>
                        保存
                      </Button>
                    </div>
                  </>
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description='该应用暂无菜单权限，请通过应用管理进行配置'
                  />
                )}
              </Spin>
            </>
          ) : null}
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
