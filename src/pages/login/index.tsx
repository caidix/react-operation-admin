import React, { useState } from 'react';
import { Tabs } from 'antd';
import LoginIllustration from '@src/assets/svg/login_Illustration.svg';
import UserLogin from './LoginForm';
import UserRegister from './RegisterForm';
import styles from './index.module.less';
import { TabsEnum } from './types';

const { TabPane } = Tabs;

const LoginPanel: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(TabsEnum.Login);
  return (
    <div className={styles.login_container}>
      <div className={styles.left_panel}>
        <img src={LoginIllustration} className={styles.illustration} />
        {/* <div className={styles.title}>后台管理系统</div> */}
      </div>
      <div className={styles.right_panel}>
        <div className={styles.login}>
          <Tabs activeKey={currentTab} onChange={(key) => setCurrentTab(key as TabsEnum)} tabBarGutter={20}>
            <TabPane tab='登录' key={TabsEnum.Login}>
              <UserLogin key={TabsEnum.Login} />
            </TabPane>
            <TabPane tab='注册' key={TabsEnum.Register}>
              <UserRegister key={TabsEnum.Register} changeTabs={setCurrentTab} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LoginPanel;
