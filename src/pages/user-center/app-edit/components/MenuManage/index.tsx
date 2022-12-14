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

  /** ?????????????????? */
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

  /** ??????????????????????????? */
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
    // ???????????? - ????????????3???????????????
    let temp = levelActions;
    if (record.level >= MAX_LEVEL) {
      temp = temp.filter((action) => action.code !== ActionCodeEnum.CreateSubMenu);
    }
    // ????????????????????????
    const siblings = record.level === 1 ? tableProps.dataSource : record.parent?.children;
    console.log({ siblings, record, ...tableProps });
    if (siblings && siblings.length && siblings![siblings!.length - 1].code === record.code) {
      temp = temp.filter((action) => action.code !== ActionCodeEnum.MoveDown);
    }
    if (siblings && siblings.length && siblings![0].code === record.code) {
      temp = temp.filter((action) => action.code !== ActionCodeEnum.MoveUp);
    }
    // ??????????????????????????????????????????
    if (record[MenuFieldEnum.MenuType] === MenuTypeEnum.Page) {
      temp = temp.filter((action) => action.code !== ActionCodeEnum.CreateSubMenu);
    }
    return temp;
  };

  const handleLevelActions = (code: ActionCodeEnum, record: DataType) => {
    switch (code) {
      case ActionCodeEnum.CreateSiblingMenu: {
        return handleModelInfo({ type: ModalTypeEnum.Create, data: null, parent: record.parent });
      }
      // ????????????????????? parentId??????????????? ???????????????????????????
      case ActionCodeEnum.CreateSubMenu: {
        return handleModelInfo({ type: ModalTypeEnum.Create, data: null, parent: record });
      }
      case ActionCodeEnum.MoveDown:
      case ActionCodeEnum.MoveUp:
        return handleMenuSort(code, record);
      default:
        throw new Error('????????????????????????!');
    }
  };

  /** ??????????????????????????? */
  const handleChangeStatus = async (code: ActionCodeEnum.DisplayMenu | ActionCodeEnum.HideMenu, record: DataType) => {
    const [err] = await requestExecute(postChangeMenuStatus, {
      type: ActionType[code],
      [MenuFieldEnum.Id]: record[MenuFieldEnum.Id],
      [MenuFieldEnum.SystemCode]: record[MenuFieldEnum.SystemCode],
    });
    if (!err) {
      submit();
      return message.success('????????????????????????');
    }
  };

  const handleDeleteMenu = (record: DataType) => {
    Modal.confirm({
      centered: true,
      title: `?????????????????????${record.name}???????`,
      content: '?????????????????????????????????????????????????????????????????????????????????????????????',
      onOk: async () => {
        const [err] = await requestExecute(postDeleteSystemMenu, {
          [MenuFieldEnum.Id]: record[MenuFieldEnum.Id],
          [MenuFieldEnum.SystemCode]: record[MenuFieldEnum.SystemCode],
        });
        if (!err) {
          submit();
          return message.success('??????????????????');
        }
      },
    });
  };

  const getBaseActions = (record: DataType) => {
    const { isShow } = record;
    let temp = baseActions;
    console.log({ ...tableProps });
    if (isShow === MenuShowEnum.Hidden) {
      temp = baseActions.filter((i) => i.code !== ActionCodeEnum.HideMenu);
    }
    if (isShow === MenuShowEnum.Show) {
      temp = baseActions.filter((i) => i.code !== ActionCodeEnum.DisplayMenu);
    }
    return temp;
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
        throw new Error('????????????????????????!');
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
              ??????
            </Button>
          </>
        }
      />
      <CustomTable columns={columns} scroll={{ x: 1500 }} {...tableExpandProps} {...tableProps} pagination={false} />
      <MenuEditModal {...editModalInfo} code={code} onConfirm={reload} onClose={closeEditModal} />
    </div>
  );
};

AppMenuManage.displayName = 'ApplicationManagement';
export default AppMenuManage;
