import React, { useState } from 'react';
import { Button, Col, Form, Input, message, Modal, Row, Space, Table } from 'antd';
import ContainerLayout from '@src/layout/ContentLayout';
import PageHeader from '@src/layout/PageHeader';
import useAntdTable from '@src/hooks/use-antd-table';
import NumberInput from '@src/components/NumberInput';
import ColumnSetting, { ColumnSettingProps } from '@src/components/ColumnsFilter/Filter';
import { UserGroupItem } from '@src/api/user-center/user-group-management/types';
import { FilterColumnType } from '@src/components/ColumnsFilter';
import CustomTable from '@src/components/CustomTable';
import { getColumns } from './config';

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

  /** 基础编辑操作 */
  function handleBaseActions(record: UserGroupItem) {}

  const columns = getColumns({ handleBaseActions });
  const [curColumns, setCurColumns] = useState<FilterColumnType<any>[]>(columns);
  const filterProps: ColumnSettingProps = {
    columns,
    columnsState: { privateKey: 'role-system-manage', storageType: 'localStorage' },
    callback: setCurColumns,
  };

  const { submit, reset, reload } = search;

  const Header = (
    <Form form={form}>
      <Row gutter={24}>
        {/** 角色系统 */}
        <Col span={16}>
          <Form.Item shouldUpdate label='用户组名称' name='name'>
            <Input placeholder='请输入用户组名称' allowClear />
          </Form.Item>
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          <Space>
            <Button type='primary' htmlType='submit' onClick={submit}>
              查询
            </Button>
            <Button onClick={() => reset()}>重置</Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );
  const changeModelInfo = () => {};
  return (
    <ContainerLayout title='用户组管理' header={Header}>
      <PageHeader
        rightCtn={
          <>
            <Button onClick={() => changeModelInfo()} className='mr-8' type='primary'>
              新增
            </Button>
            <ColumnSetting {...filterProps} />
          </>
        }
      />
      <CustomTable columns={curColumns} scroll={{ x: 1500 }} {...tableProps} />
    </ContainerLayout>
  );
};

export default UserGroupManagement;
