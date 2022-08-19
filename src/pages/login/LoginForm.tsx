import React from 'react';
import { Button, Tabs, Form, Input, Row, Col } from 'antd';
import { login } from '@src/api/user';
import { setLogin } from '@src/store/user';
import { requestExecute } from '@src/utils/request/utils';
import { useLocation, useMatch, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useRouter from '@src/hooks/use-router';
import styles from './index.module.less';

const UserLogin = () => {
  const { navigate, query } = useRouter();
  const dispatch = useDispatch();
  console.log({ location, query });

  const onFinish = async (values: any) => {
    const [_, res] = await requestExecute(login, values);
    const { user, token } = res;
    if (token.accessToken) {
      const from = query.from || '/';
      console.log('Received values of form: ', res, from);
      dispatch(
        setLogin({
          user,
          sessionId: token.accessToken || '',
        }),
      );
      navigate(from);
    }
  };
  return (
    <Form
      wrapperCol={{ span: 24 }}
      initialValues={{ name: 'admin', password: '123456' }}
      size='large'
      onFinish={onFinish}
    >
      <Form.Item name='name' rules={[{ required: true, message: '请输入用户名' }]}>
        <Input placeholder='请输入用户名' />
      </Form.Item>
      <Form.Item name='password' rules={[{ required: true, message: '请输入密码' }]}>
        <Input.Password placeholder='请输入密码' />
      </Form.Item>
      <Button type='primary' htmlType='submit' className={styles.login_button}>
        登录
      </Button>
      <div className={styles.actions}>
        <a className={styles.actions_end} href=''>
          忘记密码？
        </a>
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
