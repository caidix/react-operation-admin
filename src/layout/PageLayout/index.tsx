import { Layout, Menu, Spin } from 'antd';
import React, { FC, useEffect } from 'react';
import { DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
/** React-router v6 版本采用Outlet来替代先前的子组件渲染 */
import { Outlet } from 'react-router-dom';

import { useStore } from 'react-redux';
import router from '@src/router';

import { getCookie } from 'typescript-cookie';
import { store } from '@src/store';
import { RoutePath } from '@src/routes/config';
import { setLogin, setLogout } from '@src/store/user';
import { getUserInfo } from '@src/api/user';
import Brand from './components/Brand';
import Actions from './components/Actions';

import styles from './index.module.less';
import LayoutMenu from './components/Menu';
import { PlatformConsts } from '@src/consts';

const { Header, Sider, Content } = Layout;

interface IProps {
  children?: React.ReactNode;
}

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Option 1', '1', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [getItem('Tom', '3'), getItem('Bill', '4'), getItem('Alex', '5')]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined />),
];

const PageLayout: FC = (props: IProps) => {
  const { user } = store.getState();

  async function validateUser() {
    const sessionId = getCookie('sessionId');
    if (!user.isLogin) {
      if (!sessionId) {
        router.push(RoutePath.LOGIN);
        store.dispatch(setLogout({}));
        return false;
      }
      const res = await getUserInfo();
      console.log({ user }, res);
      await store.dispatch(
        setLogin({
          user: res,
          sessionId,
        }),
      );
    }
  }

  // function renderMenus() {}

  useEffect(() => {
    validateUser();
  }, []);

  useEffect(() => {
    console.log('渲染次数');
  }, []);

  return (
    <Layout className={styles.layout_main}>
      <Header className={styles.layout_header}>
        <div className={styles.layout_header_left}>
          <Brand title='运营平台' />
        </div>
        <div className={styles.layout_header_action}>
          <Actions></Actions>
        </div>
      </Header>
      <Layout className={styles.layout_body}>
        <Sider theme='light'>
          <LayoutMenu></LayoutMenu>
        </Sider>
        <Content>
          <div id={PlatformConsts.MAIN_CONTENT_MOUNTED_ID}>
            <Outlet />
          </div>
          <div id={PlatformConsts.MICRO_APP_MOUNT_ID} />
        </Content>
      </Layout>
    </Layout>
  );
};

PageLayout.displayName = 'PageLayout';

export default PageLayout;
