import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ContainerLayout from '@src/layout/ContentLayout';
import { Tabs } from 'antd';
import useRouter from '@src/hooks/use-router';
import { useRequest } from 'ahooks';
import { getApplicationDetail } from '@src/api/user-center/app-management';
import EditApplicationForm from '../app-management/components/EditApplicationForm';
import { TabItemEnum } from './config';
import EditApplicationDetail from './components/EditApplicationDetail';
import styles from './index.module.less';
const AppEditManagement = () => {
  const items = [
    { label: '应用信息', key: TabItemEnum.APPLICATION_EDIT, children: <EditApplicationDetail /> }, // 务必填写 key
    { label: '项目 2', key: 'item-2', children: '内容 2' },
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
