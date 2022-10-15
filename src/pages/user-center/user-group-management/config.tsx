import React from 'react';
import { Button } from 'antd';
import Split from '@src/components/Split';
import { ActionCodeEnum } from '@src/consts';
import { UserGroupItem } from '@src/api/user-center/user-group-management/types';
import { CommonFieldEnum } from '@src/api/types';
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
}

export const getColumns = ({ handleBaseActions }: IColumnProps) => {
  return [
    {
      title: 'ID',
      dataIndex: ColumnEnum.Id,
      key: ColumnEnum.Id,
      width: 100,
      ellipsis: true,
    },
    {
      title: '名称',
      dataIndex: ColumnEnum.Name,
      key: ColumnEnum.Name,
      width: 160,
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: ColumnEnum.Description,
      key: ColumnEnum.Description,
      width: 160,
      ellipsis: true,
    },
    {
      title: '编码',
      dataIndex: ColumnEnum.Code,
      key: ColumnEnum.Code,
      width: 160,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: CommonFieldEnum.CreateTime,
      key: CommonFieldEnum.CreateTime,
      width: 170,
      ellipsis: true,
      show: false,
    },
    {
      title: '更新时间',
      dataIndex: CommonFieldEnum.UpdateTime,
      key: CommonFieldEnum.UpdateTime,
      width: 170,
      ellipsis: true,
      show: true,
    },
    {
      title: '操作',
      dataIndex: ColumnEnum.BaseActions,
      key: ColumnEnum.BaseActions,
      width: 180,
      render: (_: unknown, record: UserGroupItem) => {
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
};

export const baseActions = [
  {
    name: '编辑',
    code: ActionCodeEnum.Update,
  },
  {
    name: '添加/移除用户',
    code: ActionCodeEnum.UpdateUserList,
  },
];
