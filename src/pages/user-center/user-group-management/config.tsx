import React from 'react';
import { Button, Space } from 'antd';
import Split from '@src/components/Split';
import { ActionCodeEnum } from '@src/consts';
import { UserGroupItem } from '@src/api/user-center/user-group-management/types';
import { CommonFieldEnum } from '@src/api/types';
import type { ProColumns } from '@ant-design/pro-components';
export enum SupportGroupEnum {
  Default = 1,
  Support = 2,
  Unsupported = 3,
}

export enum ColumnEnum {
  /** 角色系统名称 */
  Name = 'name',
  /** 应用编码 */
  Code = 'code',
  /** 角色系统ID */
  Id = 'id',
  /** 描述 */
  Description = 'desc',
  /** 显示状态 */
  Managers = 'managers',
  Users = 'users',
  Systems = 'systems',
  /** logo */
  IsDelete = 'isDelete',
  /** 基础操作 */
  BaseActions = 'baseActions',
}

interface IColumnProps {
  handleBaseActions(R: UserGroupItem, code: ActionCodeEnum): void;
  isManager: (code: string) => boolean;
}

export const getColumns = ({ handleBaseActions, isManager }: IColumnProps): ProColumns<UserGroupItem>[] => {
  return [
    {
      title: 'ID',
      dataIndex: ColumnEnum.Id,
      width: 100,
      hideInSearch: true,
    },
    {
      title: '用户组名称',
      dataIndex: ColumnEnum.Name,
      width: 160,
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: ColumnEnum.Description,
      hideInSearch: true,
      width: 160,
      ellipsis: true,
    },
    {
      title: '编码',
      dataIndex: ColumnEnum.Code,
      width: 160,
    },
    {
      title: '创建时间',
      dataIndex: CommonFieldEnum.CreateTime,
      hideInSearch: true,
      width: 170,
    },
    {
      title: '更新时间',
      dataIndex: CommonFieldEnum.UpdateTime,
      hideInSearch: true,
      width: 170,
    },
    {
      title: '操作',
      dataIndex: ColumnEnum.BaseActions,
      valueType: 'option',
      width: 180,
      fixed: 'right',
      render: (_: unknown, record: UserGroupItem) => {
        return (
          <Split type='button'>
            {baseActions.map(({ code, name }) => (
              <Button onClick={() => handleBaseActions(record, code)} type='link' size='small' key={code}>
                {name}
              </Button>
            ))}
            {isManager(record.code) &&
              baseManagerActions.map(({ code, name }) => (
                <Button onClick={() => handleBaseActions(record, code)} type='link' size='small' key={code}>
                  {name}
                </Button>
              ))}
          </Split>
        );
      },
    },
  ];
};

export const baseActions = [
  {
    name: '查看',
    code: ActionCodeEnum.View,
  },
];

export const baseManagerActions = [
  {
    name: '编辑',
    code: ActionCodeEnum.Update,
  },
  {
    name: '添加/移除用户',
    code: ActionCodeEnum.UpdateUserList,
  },
  {
    name: '编辑权限',
    code: ActionCodeEnum.UpdateApp,
  },
];
