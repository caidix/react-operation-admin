import React from 'react';
import { Button, Col, Form, Input, message, Modal, Row, Space, Table } from 'antd';
import ContainerLayout from '@src/layout/ContentLayout';
import PageHeader from '@src/layout/PageHeader';
import useAntdTable from '@src/hooks/use-antd-table';
import NumberInput from '@src/components/NumberInput';

const UserGroupManagement: React.FC = () => {
  const [form] = Form.useForm();
  const { tableProps, search } = useAntdTable(
    async ({ current, pageSize }, formData: any) => {
      // const [err, res] = await ;
      // if (err) {
      //   message.error(err.message);
      //   return EMPTY_TABLE;
      // }
      return {
        list: [],
        total: 10 || 0,
      };
    },
    { defaultPageSize: 10, form },
  );

  const { submit, reset, reload } = search;

  const Header = (
    <Form form={form}>
      <Row gutter={24}>
        {/** 角色系统 */}
        <Col span={8}>
          <Form.Item shouldUpdate label='角色系统名称' name='name'>
            <Input placeholder='请输入角色系统名称' />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='角色系统ID' name='roleSystemId'>
            <NumberInput form={form} name='roleSystemId' placeholder='请输入角色系统ID' />
          </Form.Item>
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          <Space>
            <Button type='primary' htmlType='submit' onClick={submit}>
              查询
            </Button>
            <Button onClick={() => reset({ exclude: [] })}>重置</Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );

  const changeModelInfo = () => {};
  return (
    <ContainerLayout title='角色系统管理' header={Header}>
      <PageHeader
        rightCtn={
          <>
            <Button onClick={() => changeModelInfo()} className='mr-8' type='primary'>
              新增
            </Button>
            {/* <ColumnSetting {...filterProps} /> */}
          </>
        }
      />
    </ContainerLayout>
  );
};

export default UserGroupManagement;
