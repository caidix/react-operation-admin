import React from 'react';
import { Dropdown, Menu, Space, Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@src/store';
import { setLogout } from '@src/store/user';

import styles from './index.module.less';

const Actions: React.FC<any> = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const { info, isLogin } = user;

  const handleLogin = () => {
    dispatch(setLogout({}));
  };

  const getDropdownMenu = () => {
    const menu = [
      {
        label: <span className={styles.user_dropdown_item}>个人信息</span>,
        key: 'user-info',
        isLogin: true,
      },
      {
        label: (
          <span onClick={handleLogin} className={styles.user_dropdown_item}>
            登录
          </span>
        ),
        key: 'login',
        isLogin: false,
      },
      {
        label: (
          <span onClick={handleLogin} className={styles.user_dropdown_item}>
            退出登录
          </span>
        ),
        key: 'logout',
        isLogin: true,
      },
    ];
    return menu.filter((item) => item.isLogin === isLogin);
  };
  return (
    <>
      <Dropdown overlay={<Menu items={getDropdownMenu()} />} className={styles.user_dropdown}>
        <a onClick={(e) => e.preventDefault()}>
          {isLogin ? (
            <Space>
              <Avatar src='https://joeschmoe.io/api/v1/random' />
              {info.name}
            </Space>
          ) : (
            <>未登录</>
          )}
        </a>
      </Dropdown>
    </>
  );
};

export default Actions;
