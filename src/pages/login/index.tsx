import React from 'react';
import { Button, Tabs, Form, Input, Row, Col } from 'antd';
import LoginIllustration from '@src/assets/svg/login_Illustration.svg';
import UserLogin from './LoginForm';
import UserRegister from './RegisterForm';
import styles from './index.module.less';

const { TabPane } = Tabs;

const Login = () => {
  return (
    <div className={styles.login_container}>
      <div className={styles.left_panel}>
        <img src={LoginIllustration} className={styles.illustration} />
        {/* <div className={styles.title}>后台管理系统</div> */}
      </div>
      <div className={styles.right_panel}>
        <div className={styles.login}>
          <Tabs defaultActiveKey='1' tabBarGutter={20}>
            <TabPane tab='登录' key='1'>
              <UserLogin />
            </TabPane>
            <TabPane tab='注册' key='2'>
              <UserRegister />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
