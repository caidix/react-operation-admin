import { Layout, Menu, message, Spin } from 'antd';
import React, { FC, useEffect, useMemo } from 'react';
import { DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
/** React-router v6 版本采用Outlet来替代先前的子组件渲染 */
import { Outlet } from 'react-router-dom';

import { useSelector, useStore } from 'react-redux';
import router from '@src/router';

import { getCookie } from 'typescript-cookie';
import { RootState, store } from '@src/store';
import { RoutePath } from '@src/routes/config';
import { setLogin, setLogout } from '@src/store/user';
import { getUserInfo } from '@src/api/user';
import { PlatformConsts } from '@src/consts';
import { setCollapsed } from '@src/store/setting';

import { addGlobalUncaughtErrorHandler, removeGlobalUncaughtErrorHandler } from 'qiankun';

import eventBus from '@src/utils/eventBus';
import { initMicroApp } from '../../utils/micro-app/index';
import Brand from './components/Brand';
import Actions from './components/Actions';
import LayoutMenu from './components/Menu';

import styles from './index.module.less';
import { getMicroActivePath } from './utils';
import { requestExecute } from '@src/utils/request/utils';
import { getApplicationDetail } from '@src/api/user-center/app-management';

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

const PageLayout: FC = (props: IProps) => {
  const { setting, user } = useSelector((state: RootState) => state);

  async function validateUser() {
    const sessionId = getCookie('sessionId');
    if (!user.isLogin) {
      if (!sessionId) {
        router.push(RoutePath.LOGIN);
        store.dispatch(setLogout({}));
        return false;
      }
      const res = await getUserInfo({});
      console.log({ user }, res);
      await store.dispatch(
        setLogin({
          user: res,
          sessionId,
        }),
      );
      // loadMicro(
      //   {
      //     isDelete: 0,
      //     createTime: '2023-01-16 16:28:37',
      //     updateTime: '2023-01-17 20:40:47',
      //     deleteTime: '',
      //     creator: 1,
      //     operator: 1,
      //     id: 1,
      //     name: '测试应用',
      //     desc: '',
      //     appSecret: '',
      //     resourcesUrl: 'http://localhost:9529/user/micro/test-code/',
      //     url: 'http://localhost:9528/user/micro/TEST_CODE/',
      //     logoUrl: '',
      //     code: 'TEST_CODE',
      //   },
      //   {
      //     user: res,
      //     sessionId,
      //   },
      // );
    }
  }

  /**
   * 初始化主应用
   * @returns
   */
  const initPlatform = async () => {
    const [err, res] = await requestExecute(getApplicationDetail, {
      code: PlatformConsts.APP_PLATFORM_CODE,
    });
    if (err) return;
    document.title = res.name;
  };

  // function renderMenus() {}

  const loadMicro = (appBase: any, intState: any) => {
    let entry;
    const SLASH = '/';
    if (appBase.resourcesUrl?.startsWith('http')) {
      entry = appBase.resourcesUrl;
    } else {
      entry = appBase.resourcesUrl?.startsWith(SLASH) ? appBase.resourcesUrl : `/${appBase.resourcesUrl}`;
    }
    if (entry === '' || entry === SLASH) {
      return void message.error('载入地址无效');
    }

    const activeRule = getMicroActivePath(appBase.code);
    console.log({ entry, appBase, activeRule });
    const appConfig = {
      name: appBase.name,
      entry,
      props: { ...intState, eventBus },
    };
    initMicroApp(appConfig, activeRule);
  };

  function handleSettingCollapse(value: boolean) {
    store.dispatch(setCollapsed(value));
  }

  const collapsed = useMemo(() => {
    console.log({ set: setting.collapsed });
    return setting.collapsed;
  }, [setting.collapsed]);

  useEffect(() => {
    validateUser();
    initPlatform();
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
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={handleSettingCollapse}
          theme='light'
          className={styles.sidebar}
        >
          <LayoutMenu />
        </Sider>
        <Content className={styles.content}>
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
