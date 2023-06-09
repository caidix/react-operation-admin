import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, message, Modal, Row, Select, Space, Table } from 'antd';
import ContainerLayout from '@src/layout/ContentLayout';
import PageHeader from '@src/layout/PageHeader';
import useAntdTable from '@src/hooks/use-antd-table';
import ColumnSetting, { ColumnSettingProps } from '@src/components/ColumnsFilter/Filter';
import CustomTable from '@src/components/CustomTable';
import { requestExecute } from '@src/utils/request/utils';
import { ActionCodeEnum, EMPTY_OPTION, EMPTY_TABLE, PlatformConsts } from '@src/consts';
import { ApplicationItem } from '@src/api/user-center/app-management/application/types';
import { getApplicationList } from '@src/api/user-center/app-management/application';

import { useNavigate } from 'react-router-dom';
import { RoutePath } from '@src/routes/config';
import Split from '@src/components/Split';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import router from '@src/router';
import { baseActions, ColumnEnum, getColumns } from './config';
import EditApplicationModal from './components/EditApplicationModal';

const { Option } = Select;

const ApplicationManagement: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  /* 新增弹窗 */
  const [visibleEditModal, setVisibleEditModal] = useState<boolean>(false);

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
  const { submit, reset, reload } = search;

  /** 基础编辑操作 */
  const handleBaseActions = (record: ApplicationItem, code: ActionCodeEnum) => {
    if (code === ActionCodeEnum.Update) {
      navigate(`/${RoutePath.USER_ApplicationEdit}?code=${record.code}`, { replace: true });
    }
  };

  const handleLink = async (item: ApplicationItem) => {
    if (item.code === PlatformConsts.APP_PLATFORM_CODE) {
      return router.push(RoutePath.HOME_PAGE);
    }

    const path = `${PlatformConsts.MICRO_APP_ACTIVE_RULE_PREFIX}/${item.code}/`;
    return router.push(path);

    // 申请token

    router.navigate(path, {}, true);
  };

  const columns: ProColumns<ApplicationItem>[] = [
    {
      title: '应用名称',
      dataIndex: ColumnEnum.Name,
      key: ColumnEnum.Name,
      width: 160,
      render: (name: string, record: ApplicationItem) => {
        return <div onClick={() => handleLink(record)}>{name}123</div>;
      },
    },
    {
      title: '应用编码',
      dataIndex: ColumnEnum.Code,
      width: 160,
    },
    {
      title: '描述',
      dataIndex: ColumnEnum.Description,
      key: ColumnEnum.Description,
      width: 160,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '资源地址',
      dataIndex: ColumnEnum.ResourcesUrl,
      key: ColumnEnum.ResourcesUrl,
      width: 160,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: ColumnEnum.CreateTime,
      key: ColumnEnum.CreateTime,
      width: 170,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: ColumnEnum.UpdateTime,
      key: ColumnEnum.UpdateTime,
      width: 170,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: ColumnEnum.BaseActions,
      key: ColumnEnum.BaseActions,
      valueType: 'option',
      width: 90,
      fixed: 'right',
      render: (_: unknown, record: ApplicationItem) => {
        return (
          <Split type='button'>
            {baseActions.map(({ code, name }) => (
              <Button onClick={() => handleBaseActions(record, code)} type='link' size='small' key={code}>
                {name}
              </Button>
            ))}
          </Split>
        );
      },
    },
  ];
  /** 获取所有用户组 */
  // useRequest(getUserOrganizations, {
  //   cacheKey: 'getUserOrganizations',
  //   onSuccess: (res) => {
  //     setOrganizationList([EMPTY_OPTION, ...res]);
  //   },
  //   onError: () => {
  //     setOrganizationList([EMPTY_OPTION]);
  //   },
  // });

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
      <EditApplicationModal visible={visibleEditModal} onConfirm={reload} onClose={() => setVisibleEditModal(false)} />
      <ProTable
        toolBarRender={() => [
          <Button onClick={() => setVisibleEditModal(true)} className='mr-2' type='primary'>
            新增应用
          </Button>,
        ]}
        rowKey='id'
        search={false}
        scroll={{ x: 1500 }}
        {...tableProps}
        columns={columns}
      />
    </ContainerLayout>
  );
};

ApplicationManagement.displayName = 'ApplicationManagement';
export default ApplicationManagement;
