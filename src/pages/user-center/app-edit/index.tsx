import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ContainerLayout from '@src/layout/ContentLayout';
import { Tabs } from 'antd';
import useRouter from '@src/hooks/use-router';
import { TabItemEnum } from './config';
import EditApplicationDetail from './components/EditApplicationDetail';
import MenuManage from './components/MenuManage';
import styles from './index.module.less';
const AppEditManagement = () => {
  let {
    query: { code },
  } = useRouter();
  code = code || '';
  const items = [
    { label: '应用信息', key: TabItemEnum.APPLICATION_EDIT, children: <EditApplicationDetail code={code} /> }, // 务必填写 key
    { label: '菜单管理', key: TabItemEnum.MENU_EDIT, children: <MenuManage code={code} /> },
  ];
  return (
    <ContainerLayout custom title='应用管理' header={<>当前应用：</>}>
      <div className={styles.container}>
        <Tabs items={items} />
      </div>
    </ContainerLayout>
  );
};
AppEditManagement.displayName = 'AppEditManagement';
export default AppEditManagement;
