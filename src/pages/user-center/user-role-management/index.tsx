import React, { useRef, useState } from 'react';
import { Button, Input, message } from 'antd';
import ContainerLayout from '@src/layout/ContentLayout';
import { ProTable, ActionType } from '@ant-design/pro-components';

import { useRequest, useSetState } from 'ahooks';
import useUserInfo from '@src/hooks/use-user-info';
import { useNavigate } from 'react-router-dom';
import { getAllRoleGroups } from '@src/api/user-center/role';
import classnames from 'classnames';

import { RoleGroupItem, RoleItem } from '@src/api/user-center/role/types';
import EditRoleModal from './components/edit-role-modal';

import styles from './index.module.less';
import { RoleParams, RoleType } from './types';
import { EditOutlined } from '@ant-design/icons';

interface RoleModelInfo {
  visible: boolean;
  data: RoleParams;
  type: RoleType;
}
const { Search } = Input;
const UserGroupManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [_, { isManager }] = useUserInfo();

  const [currentGroup, setCurrentGroup] = useState<RoleGroupItem | null>(null);
  const [currentHoverGroup, setCurrentHoverGroup] = useState(-1);
  const [roleModalInfo, setModalInfo] = useSetState<RoleModelInfo>({
    visible: false,
    data: null,
    type: RoleType.Group,
  });

  const changeModelInfo = (data: RoleParams = null, type: RoleType = RoleType.Group) => {
    setModalInfo({
      visible: !roleModalInfo.visible,
      data,
      type,
    });
  };

  const navigate = useNavigate();

  const { data, run, refresh } = useRequest(getAllRoleGroups, {
    // onSuccess: (data, params) => {
    //   console.log(data, params);
    //   return data.list;
    // },
  });

  const onSearch = () => {};

  const handleRoleModal = () => {
    if (roleModalInfo.type === RoleType.Group) {
      refresh();
    }
  };

  return (
    <ContainerLayout title='后台角色管理' custom>
      <div className='flex p-4'>
        <div className={styles.left}>
          <div className={styles.header}>
            <div className={styles.title}>角色分组</div>
            <Button size='small' type='primary' onClick={() => changeModelInfo()}>
              新增分组
            </Button>
          </div>
          <div className={styles.choosed}>当前选中分组：{currentGroup?.name}</div>
          <Search placeholder='input search text' allowClear onSearch={onSearch} />
          <div className={styles['left-content']} onMouseLeave={() => setCurrentHoverGroup(-1)}>
            {data &&
              data.list.map((item) => {
                return (
                  <div
                    className={classnames([
                      styles['left-item'],
                      currentGroup?.id === item.id ? styles['left-item--active'] : '',
                    ])}
                    onClick={() => setCurrentGroup(item)}
                    onMouseEnter={() => setCurrentHoverGroup(item.id)}
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
        <div className={styles.right}>
          <div className={styles.header}>
            <div className={styles.title}>角色列表</div>
            <Button size='small' type='primary' onClick={() => changeModelInfo(null, RoleType.Item)}>
              新增角色
            </Button>
          </div>
        </div>
      </div>
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
