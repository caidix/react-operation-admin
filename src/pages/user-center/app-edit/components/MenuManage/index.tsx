import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, message, Modal, Row, Select, Space, Table } from 'antd';
import PageHeader from '@src/layout/PageHeader';
import useAntdTable from '@src/hooks/use-antd-table';
import CustomTable from '@src/components/CustomTable';
import { useSetState, useUpdateEffect } from 'ahooks';
import { requestExecute } from '@src/utils/request/utils';
import { ActionCodeEnum, EMPTY_OPTION, EMPTY_TABLE } from '@src/consts';
import { useNavigate } from 'react-router-dom';
import useLevelExpand from '@src/hooks/use-level-expand';

import {
  getSystemMenuList,
  postChangeMenuStatus,
  postDeleteSystemMenu,
  postMoveSystemMenu,
} from '@src/api/user-center/app-management/menus';
import { MenuFieldEnum, MenuShowEnum, MenuTypeEnum } from '@src/api/user-center/app-management/menus/types';
import { TabItemEnum } from '../../config';
import MenuEditModal from './components/MenuEditModal';
import {
  DataType,
  levelActions,
  baseActions,
  getColumns,
  ActionType,
  MAX_LEVEL,
  ModelInfo,
  ModalTypeEnum,
} from './config';

const { Option } = Select;

interface IProps {
  code: string;
}
const AppMenuManage: React.FC<IProps> = ({ code }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [editModalInfo, setModalInfo] = useSetState<ModelInfo>({
    visible: false,
    type: ModalTypeEnum.Create,
    data: null,
    parent: null,
  });

  const closeEditModal = () => setModalInfo({ visible: false });

  const handleModelInfo = ({
    type,
    data = null,
    parent = null,
  }: {
    type: ModalTypeEnum;
    data?: DataType | null;
    parent?: DataType | null;
  }) => {
    const visible = !editModalInfo.visible;
    setModalInfo({
      visible: visible,
      parent,
      type,
      data,
    });
  };

  const { tableProps, search } = useAntdTable(
    async () => {
      if (!code) return EMPTY_TABLE;
      const [err, res] = await requestExecute(getSystemMenuList, {
        code,
      });
      if (err) {
        return EMPTY_TABLE;
      }
      return {
        list: formatTrees(res.list),
        total: res.total || 0,
      };
    },
    { defaultPageSize: 10, form },
  );
  const { submit, reload } = search;
  console.log({ tableProps });

  /** 格式化树数据 */
  const formatTrees = (tree: DataType[], parent: DataType | null = null, level = 1) => {
    const res: DataType[] = [];
    tree.forEach((item) => {
      const node: DataType = {
        ...item,
        parent,
        level,
      };
      const children =
        item.children && item.children.length > 0
          ? formatTrees(item.children as DataType[], node, level + 1)
          : undefined;
      res.push({
        ...node,
        children,
      });
    });
    return res;
  };

  /** 层级操作逻辑、请求 */
  const handleMenuSort = async (code: ActionCodeEnum.MoveDown | ActionCodeEnum.MoveUp, record: DataType) => {
    const [err] = await requestExecute(postMoveSystemMenu, {
      type: ActionType[code],
      [MenuFieldEnum.Id]: record[MenuFieldEnum.Id],
      [MenuFieldEnum.SystemCode]: record[MenuFieldEnum.SystemCode],
    });
    if (err) {
      message.error(err.message);
      return;
    }
    submit();
  };

  const getLevelActions = (record: Required<DataType>) => {
    // 数组长度 - 菜单最高层级3级不可再加 - 子页面可以增加权限
    let temp = levelActions;
    if (record.level >= MAX_LEVEL && record.menuType === MenuTypeEnum.Menu) {
      temp = temp.filter((action) => action.code !== ActionCodeEnum.CreateSubMenu);
    }
    // 上下移动按钮显示
    const siblings = record.level === 1 ? tableProps.dataSource : record.parent?.children;
    console.log({ siblings, record, ...tableProps });
    if (siblings && siblings.length && siblings![siblings!.length - 1].code === record.code) {
      temp = temp.filter((action) => action.code !== ActionCodeEnum.MoveDown);
    }
    if (siblings && siblings.length && siblings![0].code === record.code) {
      temp = temp.filter((action) => action.code !== ActionCodeEnum.MoveUp);
    }
    // 菜单类型为页面无法添加子菜单
    // if (record[MenuFieldEnum.MenuType] === MenuTypeEnum.Page) {
    //   temp = temp.filter((action) => action.code !== ActionCodeEnum.CreateSubMenu);
    // }
    return temp;
  };

  const handleLevelActions = (code: ActionCodeEnum, record: DataType) => {
    switch (code) {
      case ActionCodeEnum.CreateSiblingMenu: {
        return handleModelInfo({ type: ModalTypeEnum.Create, data: null, parent: record.parent });
      }
      // 新增同级菜单时 parentId为其父级， 新增子菜单为其本身
      case ActionCodeEnum.CreateSubMenu: {
        return handleModelInfo({ type: ModalTypeEnum.Create, data: null, parent: record });
      }
      case ActionCodeEnum.MoveDown:
      case ActionCodeEnum.MoveUp:
        return handleMenuSort(code, record);
      default:
        throw new Error('未知层级操作编码!');
    }
  };

  /** 基础操作逻辑、请求 */
  const handleChangeStatus = async (code: ActionCodeEnum.DisplayMenu | ActionCodeEnum.HideMenu, record: DataType) => {
    const [err] = await requestExecute(postChangeMenuStatus, {
      type: ActionType[code],
      [MenuFieldEnum.Id]: record[MenuFieldEnum.Id],
      [MenuFieldEnum.SystemCode]: record[MenuFieldEnum.SystemCode],
    });
    if (!err) {
      submit();
      return message.success('菜单状态修改成功');
    }
  };

  const handleDeleteMenu = (record: DataType) => {
    Modal.confirm({
      centered: true,
      title: `确认删除菜单【${record.name}】吗?`,
      content: '注意：删除操作会进行该菜单的子级菜单和角色菜单权限的关联删除！',
      onOk: async () => {
        const [err] = await requestExecute(postDeleteSystemMenu, {
          [MenuFieldEnum.Id]: record[MenuFieldEnum.Id],
          [MenuFieldEnum.SystemCode]: record[MenuFieldEnum.SystemCode],
        });
        if (!err) {
          await submit();
          return message.success('删除菜单成功');
        }
      },
    });
  };

  const getBaseActions = (record: DataType) => {
    const { isShow, menuType } = record;
    if (menuType === MenuTypeEnum.Auth) {
      return baseActions.filter((i) => ![ActionCodeEnum.DisplayMenu, ActionCodeEnum.HideMenu].includes(i.code));
    }
    if (isShow === MenuShowEnum.Hidden) {
      return baseActions.filter((i) => i.code !== ActionCodeEnum.HideMenu);
    }
    if (isShow === MenuShowEnum.Show) {
      return baseActions.filter((i) => i.code !== ActionCodeEnum.DisplayMenu);
    }
    return baseActions;
  };

  const handleBaseActions = (code: ActionCodeEnum, record: DataType) => {
    switch (code) {
      case ActionCodeEnum.DisplayMenu:
      case ActionCodeEnum.HideMenu:
        return handleChangeStatus(code, record);
      case ActionCodeEnum.DeleteMenu:
        return handleDeleteMenu(record);
      case ActionCodeEnum.UpdateMenu:
        return handleModelInfo({ type: ModalTypeEnum.Edit, data: record, parent: record.parent });
      default:
        throw new Error('未知动作处理编码!');
    }
  };

  const [Level, tableExpandProps] = useLevelExpand({
    maxLevel: MAX_LEVEL,
    data: tableProps.dataSource,
    rowKey: 'id',
  });
  const columns = getColumns({
    Level,
    getLevelActions,
    handleLevelActions,
    getBaseActions,
    handleBaseActions,
  });

  return (
    <div>
      <PageHeader
        rightCtn={
          <>
            <Button onClick={() => handleModelInfo({ type: ModalTypeEnum.Create })} className='mr-2' type='primary'>
              新增
            </Button>
          </>
        }
      />
      <CustomTable
        bordered
        size='middle'
        columns={columns}
        scroll={{ x: 1500 }}
        {...tableExpandProps}
        {...tableProps}
        pagination={false}
      />
      <MenuEditModal {...editModalInfo} code={code} onConfirm={reload} onClose={closeEditModal} />
    </div>
  );
};

AppMenuManage.displayName = 'ApplicationManagement';
export default AppMenuManage;
