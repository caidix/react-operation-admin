import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ContainerLayout from '@src/layout/ContentLayout';
import { message, Tabs } from 'antd';
import useRouter from '@src/hooks/use-router';
import { useBoolean, useRequest } from 'ahooks';
import { getApplicationDetail } from '@src/api/user-center/app-management/application';
import { TabItemEnum } from './config';
import EditApplicationDetail from './components/EditApplicationDetail';
import MenuManage from './components/MenuManage';
import AuthorityManage from './components/AuthorityManage';
import styles from './index.module.less';

const tabStyles = {
  tabBarGutter: 50,
  tabBarStyle: { background: '#fff', padding: '0 16px' },
};

const AppEditManagement = () => {
  let {
    query: { code },
  } = useRouter();
  code = code || '';
  const [isFetchEnd, setIsFetchEnd] = useState(false);
  const { data, run, refresh } = useRequest(getApplicationDetail, {
    manual: true,
    onSuccess: () => {
      setIsFetchEnd(true);
    },
  });

  useEffect(() => {
    if (code) {
      run({ code });
    } else {
      message.error('缺少应用相关参数！');
    }
  }, []);

  const items = [
    {
      label: '应用信息',
      key: TabItemEnum.ApplicationEdit,
      children: (
        <div className={styles.container}>
          <EditApplicationDetail code={code} data={data} refresh={refresh} isFetchEnd={isFetchEnd} />
        </div>
      ),
    },
    {
      label: '菜单管理',
      key: TabItemEnum.MenuEdit,
      children: (
        <div className={styles.container}>
          <MenuManage code={code} />
        </div>
      ),
    },
    {
      label: '权限管理',
      key: TabItemEnum.AuthorityEdit,
      children: (
        <div className={styles.container}>
          <AuthorityManage code={code} />
        </div>
      ),
    },
    {
      label: '接口管理',
      key: TabItemEnum.InterfaceEdit,
      children: (
        <div className={styles.container}>
          <AuthorityManage code={code} />
        </div>
      ),
    },
  ];
  return (
    <ContainerLayout custom title='应用管理' header={<>当前应用：{data?.name}</>}>
      <Tabs className={styles.tab} items={items} destroyInactiveTabPane {...tabStyles} />
    </ContainerLayout>
  );
};
AppEditManagement.displayName = 'AppEditManagement';
export default AppEditManagement;
