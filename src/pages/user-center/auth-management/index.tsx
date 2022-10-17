import { useBoolean } from 'ahooks';
import { Spin, Space, Typography, Button } from 'antd';
import React from 'react';
import styles from './index.module.less';

const { Title } = Typography;
const AuthManagement = () => {
  const [isLoading, loadingFn] = useBoolean();
  const save = () => {};
  return (
    <div className={styles['tabs-content']}>
      <Spin spinning={isLoading}>
        <div className={styles.saveBox}>
          <Space size={30}>
            <Title level={5}>请选择菜单和功能点</Title>
            <div className={styles.tips}>提示：勾选【菜单和功能点】表示 属于该角色的用户可以访问操作该权限点</div>
          </Space>
          <Button type='primary' onClick={save}>
            保存
          </Button>
        </div>
      </Spin>
    </div>
  );
};

export default AuthManagement;
