import {
  MenuFieldEnum,
  MenuShowEnums,
  PageOpenEnums,
  MenuBaseData,
  MenuShowEnum,
  MenuTypeEnum,
  MenuTypeTableEnums,
  PageOpenEnum,
  PageSourceEnums,
  PageSourceEnum,
} from '@src/consts/menu';
import type { ColumnsType as TableColumnsType } from 'antd/lib/table';
import { Button } from 'antd';
import Split from '@src/components/Split';
import { ActionCodeEnum } from '@src/consts/action';

export type DataType = {
  level?: number; // 层级
  fullName?: string;
  parent?: DataType | null;
} & MenuBaseData;

export type ColumnsType = TableColumnsType<DataType>;

export enum HandleTypeEnum {
  Up = 1,
  Down = 2,
  Show = 3,
  Hidden = 4,
}

export const MAX_LEVEL = 3;

export const getColumns = ({
  Level,
  getLevelActions,
  getBaseActions,
  getSyncActions,
  handleBaseActions,
  handleLevelActions,
  handleSyncActions,
}: any) => {
  return [
    {
      title: (
        <>
          <span>菜单名称</span>
          <Level />
        </>
      ),
      width: 200,
      dataIndex: MenuFieldEnum.Name,
      key: MenuFieldEnum.Name,
      ellipsis: true,
    },
    {
      title: '菜单编码',
      dataIndex: MenuFieldEnum.Code,
      key: MenuFieldEnum.Code,
      width: 160,
      ellipsis: true,
    },
    {
      title: '菜单Icon',
      dataIndex: MenuFieldEnum.IconUrl,
      key: MenuFieldEnum.IconUrl,
      width: 100,
      isImage: true,
      ellipsis: true,
    },
    {
      title: '菜单类型',
      dataIndex: MenuFieldEnum.MenuType,
      key: MenuFieldEnum.MenuType,
      width: 100,
      enums: MenuTypeTableEnums,
      ellipsis: true,
    },
    {
      title: '页面地址',
      dataIndex: MenuFieldEnum.Url,
      key: MenuFieldEnum.Url,
      width: 120,
      ellipsis: true,
    },
    {
      title: '页面打开方式',
      dataIndex: MenuFieldEnum.PageOpenMethod,
      key: MenuFieldEnum.PageOpenMethod,
      width: 120,
      enums: PageOpenEnums,
      ellipsis: true,
    },
    {
      title: '菜单显示',
      dataIndex: MenuFieldEnum.IsShow,
      key: MenuFieldEnum.IsShow,
      width: 100,
      enums: MenuShowEnums,
    },
    {
      title: '描述',
      dataIndex: MenuFieldEnum.Description,
      key: MenuFieldEnum.Description,
      width: 200,
      ellipsis: true,
    },
    {
      title: '层级操作',
      key: 'levelAction',
      fixed: 'right',
      width: 330,
      render: (_: unknown, record: DataType) => {
        const actions = getLevelActions(record);
        return (
          <Split type='button'>
            {actions.map(({ code, name }: any) => (
              <Button onClick={() => handleLevelActions(code, record)} type='link' size='small' key={code}>
                {name}
              </Button>
            ))}
          </Split>
        );
      },
    },
    {
      title: '基础操作',
      key: 'syncAction',
      fixed: 'right',
      width: 200,
      render: (_: unknown, record: DataType) => {
        const actions = getBaseActions(record);
        return (
          <Split type='button'>
            {actions.map(({ code, name }: any) => (
              <Button onClick={() => handleBaseActions(code, record)} type='link' size='small' key={code}>
                {name}
              </Button>
            ))}
          </Split>
        );
      },
    },
  ] as ColumnsType;
};

export const ActionType = {
  [ActionCodeEnum.DisplayMenu]: 1,
  [ActionCodeEnum.HideMenu]: 2,
  [ActionCodeEnum.MoveUp]: 3,
  [ActionCodeEnum.MoveDown]: 4,
};

export const levelActions = [
  {
    name: '上移',
    code: ActionCodeEnum.MoveUp,
  },
  {
    name: '下移',
    code: ActionCodeEnum.MoveDown,
  },
  {
    name: '新增同级菜单',
    code: ActionCodeEnum.CreateSiblingMenu,
  },
  {
    name: '新增子菜单',
    code: ActionCodeEnum.CreateSubMenu,
  },
] as Array<any>;

export const baseActions = [
  {
    name: '编辑',
    code: ActionCodeEnum.UpdateMenu,
  },
  {
    name: '删除',
    code: ActionCodeEnum.DeleteMenu,
  },
  {
    name: '设置显示',
    code: ActionCodeEnum.DisplayMenu,
  },
  {
    name: '设置隐藏',
    code: ActionCodeEnum.HideMenu,
  },
] as Array<any>;

/** 弹窗传参 */
export interface IModelInfo {
  visible: boolean;
  code: ActionCodeEnum;
  data: null | DataType;
  parent: null | DataType;
}

export interface EditModelInfo {
  code: ActionCodeEnum;
  data?: null | DataType;
  parent?: null | DataType;
}
