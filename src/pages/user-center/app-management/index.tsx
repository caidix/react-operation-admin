import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, message, Modal, Row, Select, Space, Table } from 'antd';
import ContainerLayout from '@src/layout/ContentLayout';
import PageHeader from '@src/layout/PageHeader';
import useAntdTable from '@src/hooks/use-antd-table';
import ColumnSetting, { ColumnSettingProps } from '@src/components/ColumnsFilter/Filter';
import CustomTable from '@src/components/CustomTable';
import { useSetState } from 'ahooks';
import { requestExecute } from '@src/utils/request/utils';
import { ActionCodeEnum, EMPTY_OPTION, EMPTY_TABLE } from '@src/consts';
import { ApplicationItem } from '@src/api/user-center/app-management/types';
import { getApplicationList } from '@src/api/user-center/app-management';
import { FilterColumnType } from '@src/components/ColumnsFilter';
import { getOrganizationList } from '@src/api/user-center/user-group-management';
import { UserGroupItem } from '@src/api/user-center/user-group-management/types';
import { getColumns } from './config';
import EditApplicationModal from './components/EditApplicationModal';

const { Option } = Select;

const ApplicationManagement: React.FC = () => {
  const [form] = Form.useForm();
  /* 新增弹窗 */
  const [visibleEditModal, setVisibleEditModal] = useState<boolean>(false);
  const [organizationList, setOrganizationList] = useState<
    {
      name: string;
      code: string;
    }[]
  >([]);

  const { tableProps, search } = useAntdTable(
    async ({ current, pageSize }, formData: any) => {
      let organization = formData.organization;
      organization = organization === EMPTY_OPTION.code ? '' : organization;
      const [err, res] = await requestExecute(getApplicationList, {
        size: pageSize,
        page: current,
        ...formData,
        organization,
      });
      if (err) {
        return EMPTY_TABLE;
      }
      return {
        list: res.list,
        total: res.total || 0,
      };
    },
    { defaultPageSize: 10, form },
  );
  /** 基础编辑操作 */
  function handleBaseActions(record: ApplicationItem, code: ActionCodeEnum) {
    if (code === ActionCodeEnum.Update) {
      // return changeModelInfo(record);
    }
  }

  const columns = getColumns({ handleBaseActions });
  const [curColumns, setCurColumns] = useState<FilterColumnType<any>[]>(columns);
  const filterProps: ColumnSettingProps = {
    columns,
    columnsState: { privateKey: 'app-manage', storageType: 'localStorage' },
    callback: setCurColumns,
  };

  const { submit, reset, reload } = search;

  const handleFetchOrganizationList = async () => {
    const [err, res] = await requestExecute(getOrganizationList, {
      size: 10000,
      page: 1,
    });
    if (err) return setOrganizationList([EMPTY_OPTION]);
    setOrganizationList([EMPTY_OPTION, ...res.list]);
  };

  useEffect(() => {
    handleFetchOrganizationList();
  }, []);

  const Header = (
    <Form form={form}>
      <Row gutter={24}>
        {/** 角色系统 */}
        <Col span={8}>
          <Form.Item shouldUpdate label='名称或编码' name='search'>
            <Input placeholder='请输入应用名称或编码' allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='所属用户组' name='organization'>
            <Select
              placeholder='请选择用户组'
              showSearch
              defaultValue={EMPTY_OPTION.code}
              optionFilterProp='label'
              onSelect={submit}
            >
              {organizationList.map((org) => (
                <Option key={org.code} value={org.code} label={org.name}>
                  {org.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8} className='text-right'>
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

  return (
    <ContainerLayout title='应用管理' header={Header}>
      <PageHeader
        rightCtn={
          <>
            <Button onClick={() => setVisibleEditModal(true)} className='mr-2' type='primary'>
              新增应用
            </Button>
            <ColumnSetting {...filterProps} />
          </>
        }
      />
      <EditApplicationModal
        visible={visibleEditModal}
        onConfirm={() => {
          setVisibleEditModal(false);
          reload();
        }}
        onClose={() => setVisibleEditModal(false)}
      />
      <CustomTable columns={curColumns} scroll={{ x: 1500 }} {...tableProps} />
    </ContainerLayout>
  );
};

ApplicationManagement.displayName = 'ApplicationManagement';
export default ApplicationManagement;
