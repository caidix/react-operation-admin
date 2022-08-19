import React from 'react';
import { Button, Tabs, Form, Input, Row, Col } from 'antd';
import StrengthMeter from '@src/components/StrengthMeter';
import styles from './index.module.less';

const UserLogin = () => {
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };
  return (
    <Form wrapperCol={{ span: 24 }} size='large' name='normal_login' onFinish={onFinish}>
      <Form.Item name='name' rules={[{ required: true, message: '请输入用户名' }]}>
        <Input placeholder='用户名' />
      </Form.Item>
      <Form.Item name='prePassword' rules={[{ required: true, message: '请输入密码' }]}>
        <StrengthMeter placeholder='密码' />
      </Form.Item>
      <Form.Item name='nextPassword' rules={[{ required: true, message: '请输入密码' }]}>
        <Input.Password placeholder='确认密码' />
      </Form.Item>
      <Button type='primary' htmlType='submit' className={styles.login_button}>
        注册
      </Button>
      <div className={styles.actions}>
        {/* <a className={styles.actions_end} href=''>
          忘记密码？
        </a> */}
      </div>
      {/* <div className={styles.sns_login}>
        <Row>
          <Col md={8} xs={24}>
            <Button shape='circle' icon={<WechatOutlined />}></Button>
          </Col>
        </Row>
      </div> */}
    </Form>
  );
};

export default UserLogin;
