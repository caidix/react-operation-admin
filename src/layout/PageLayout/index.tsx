import { Layout, Menu, message, Spin } from 'antd';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
/** React-router v6 版本采用Outlet来替代先前的子组件渲染 */
import { Outlet } from 'react-router-dom';

import { useSelector, useStore } from 'react-redux';
import router from '@src/router';

import { getCookie } from 'typescript-cookie';
import { RootState, store } from '@src/store';
import { RoutePath } from '@src/routes/config';
import { setAuthList, setCurrentApp, setLogin, setLogout } from '@src/store/user';
import { getUserInfo } from '@src/api/user';
import { PlatformConsts } from '@src/consts';
import { setCollapsed } from '@src/store/setting';

import { addGlobalUncaughtErrorHandler, removeGlobalUncaughtErrorHandler } from 'qiankun';

import eventBus from '@src/utils/eventBus';

import { requestExecute } from '@src/utils/request/utils';
import { getApplicationDetail } from '@src/api/user-center/app-management';
import useRouter from '@src/hooks/use-router';
import { getAppUserMenu } from '@src/api/user-center/role';
import { MenuTypeEnum } from '@src/api/user-center/app-management/menus/types';

import { MenuItem as BaseMenuItem } from '@src/api/user-center/app-management/menus/types';
import { initMicroApp } from '../../utils/micro-app/index';
import { getCurrentAppCode, getMicroActivePath } from './utils';
import styles from './index.module.less';
import LayoutMenu from './components/Menu';
import Actions from './components/Actions';
import Brand from './components/Brand';

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
  const { pathname, navigate, query } = useRouter();
  const [menu, setMenu] = useState<BaseMenuItem[]>([]);

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

  /**
   * 初始化子应用
   * @param appCode
   * @param isRedirect
   * @param canLoadMicro
   * @returns
   */
  const initSubPlatform = async () => {
    const currentAppCode = getCurrentAppCode(pathname);
    if (!currentAppCode) {
      return;
    }
    const [err, res] = await requestExecute(getApplicationDetail, {
      code: currentAppCode,
    });
    if (err) {
      return message.error(err.message);
    }
    console.log({ currentAppCode, res });
    handleMenuList(currentAppCode);
    await store.dispatch(
      setCurrentApp({
        currentApp: res,
      }),
    );

    if (currentAppCode !== PlatformConsts.APP_PLATFORM_CODE) {
      loadMicro(res!, {});
    }
  };

  /** 获取左侧菜单 */
  const handleMenuList = async (code: string) => {
    const [err, res] = await requestExecute(getAppUserMenu, {
      systemCode: code,
    });
    if (err) return;

    // 权限点
    const authList = res.list.map((i) => i.code);
    const menus = res.list.filter((i) => i.menuType !== MenuTypeEnum.Auth);

    setMenu(menus);
    console.log({ res, authList });
    store.dispatch(
      setAuthList({
        authList,
      }),
    );
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
    console.log({ appConfig, activeRule });

    initMicroApp(appConfig, activeRule);

    // const homePage = getMicroActivePath(appBase.code, true);
    // router.push(homePage);
    // this.loadingMicro = false;
  };

  function handleSettingCollapse(value: boolean) {
    store.dispatch(setCollapsed(value));
  }

  const collapsed = useMemo(() => {
    console.log({ set: setting.collapsed });
    return setting.collapsed;
  }, [setting.collapsed]);

  const initApp = async () => {
    await initPlatform();
    await initSubPlatform();
  };

  useEffect(() => {
    validateUser();
    initApp();
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
          <Actions />
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
          <LayoutMenu menus={menu} />
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
