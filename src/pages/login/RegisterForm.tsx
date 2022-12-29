import React from 'react';
import { Button, Tabs, Form, Input, Modal, Col, message } from 'antd';
import StrengthMeter from '@src/components/StrengthMeter';
import CountInput from '@src/components/CountDown/CountInput';
import { getEmailVerifyCode, register } from '@src/api/user';
import { IRegisterReq } from '@src/api/user/types';
import { useBoolean } from 'ahooks';
import { TabsEnum } from './types';
import styles from './index.module.less';

interface UserRegisterProps {
  changeTabs: (value: TabsEnum) => void;
}

const UserRegister: React.FC<UserRegisterProps> = (props) => {
  const [form] = Form.useForm();
  const [isLoading, LoadingFn] = useBoolean();

  const fetchverifyCode = async () => {
    try {
      const data = await form.validateFields(['email']);
      await getEmailVerifyCode(data);
      message.success('已发送邮件');
      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (values: IRegisterReq) => {
    LoadingFn.setTrue();
    console.log('Received values of form: ', values);
    try {
      await register(values);
      message.success('注册成功');
      form.resetFields();
      props.changeTabs(TabsEnum.Login);
    } catch (error) {
      return false;
    } finally {
      LoadingFn.setFalse();
    }
  };

  return (
    <Form
      wrapperCol={{ span: 24 }}
      form={form}
      size='large'
      name='normal_login'
      disabled={isLoading}
      onFinish={registerUser}
    >
      <Form.Item name='name' rules={[{ required: true, message: '请输入用户名' }]}>
        <Input placeholder='用户名' />
      </Form.Item>
      <Form.Item
        name='email'
        rules={[
          { required: true, message: '请输入邮箱' },
          {
            type: 'email',
            message: '邮箱格式有误',
          },
        ]}
      >
        <Input placeholder='邮箱' />
      </Form.Item>
      <Form.Item name='verifyCode' dependencies={['email']} rules={[{ required: true, message: '请输入验证码' }]}>
        <CountInput placeholder='验证码，5分钟内有效' countProps={{ beforeStartFunc: fetchverifyCode }} />
      </Form.Item>
      <Form.Item name='password' rules={[{ required: true, message: '请输入密码' }]}>
        <StrengthMeter placeholder='密码' minLength={6} maxLength={16} />
      </Form.Item>
      <Form.Item
        name='nextPassword'
        dependencies={['password']}
        rules={[
          { required: true, message: '请再次输入密码' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入密码不一致'));
            },
          }),
        ]}
      >
        <Input.Password placeholder='确认密码' minLength={6} maxLength={16} />
      </Form.Item>
      <Button type='primary' htmlType='submit' loading={isLoading} className={styles.login_button}>
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

export default UserRegister;
