import React, { useMemo } from 'react';
import { Button } from 'antd';
import Split from '@src/components/Split';
import { ActionCodeEnum } from '@src/consts';
import { ApplicationItem } from '@src/api/types';
import { UserGroupItem } from '@src/api/user-center/user-group-management/types';
export enum ColumnEnum {
  /** 系统名称 */
  Name = 'name',
  /** 应用编码 */
  Code = 'code',
  /** 系统ID */
  Id = 'id',
  /** 描述 */
  Description = 'desc',
  /** 资源地址 */
  ResourcesUrl = 'resourcesUrl',
  /** 访问地址 */
  Url = 'url',
  /** LOGO */
  LogoUrl = 'logoUrl',
  /** 密钥 */
  AppSecret = 'appSecret',
  /** 创建时间 */
  CreateTime = 'createTime',
  /** 更新时间 */
  UpdateTime = 'updateTime',
  /** 基础操作 */
  BaseActions = 'baseActions',
}

interface IColumnProps {
  handleBaseActions(R: ApplicationItem, code: ActionCodeEnum): void;
}

export const getColumns = ({ handleBaseActions }: IColumnProps) => {
  return [
    {
      title: '应用名称',
      dataIndex: ColumnEnum.Name,
      key: ColumnEnum.Name,
      width: 160,
      ellipsis: true,
    },
    {
      title: '应用编码',
      dataIndex: ColumnEnum.Code,
      key: ColumnEnum.Code,
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
      title: '资源地址',
      dataIndex: ColumnEnum.ResourcesUrl,
      key: ColumnEnum.ResourcesUrl,
      width: 160,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: ColumnEnum.CreateTime,
      key: ColumnEnum.CreateTime,
      width: 170,
      ellipsis: true,
      show: false,
    },
    {
      title: '更新时间',
      dataIndex: ColumnEnum.UpdateTime,
      key: ColumnEnum.UpdateTime,
      width: 170,
      ellipsis: true,
      show: true,
    },
    {
      title: '操作',
      dataIndex: ColumnEnum.BaseActions,
      key: ColumnEnum.BaseActions,
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
};

export const baseActions = [
  {
    name: '编辑',
    code: ActionCodeEnum.Update,
  },
];
