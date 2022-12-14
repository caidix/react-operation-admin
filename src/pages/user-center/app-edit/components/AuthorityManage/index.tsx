import React, { useEffect, useRef, useState } from 'react';
import { Input, Tree, message, Button, Typography, Space, Tabs, Spin, Alert, TreeNodeProps, Table } from 'antd';

import { MenuTypeEnum } from '@src/api/user-center/app-management/menus/types';
import { useRequest, useSetState } from 'ahooks';
import { DataNode } from 'antd/lib/tree';
import { getSystemMenuList } from '@src/api/user-center/app-management/menus';
import { Key } from 'antd/lib/table/interface';
import { AuthMenuFieldEnum, AuthMenuItem } from '@src/api/user-center/app-management/authority/types';
import { CommonFieldEnum } from '@src/api/types';
import Split from '@src/components/Split';
import CustomTable from '@src/components/CustomTable';
import { getAuthMenuList, postDeleteAuthMenu } from '@src/api/user-center/app-management/authority';
import { requestExecute } from '@src/utils/request/utils';
import { EditAuthMenuInfo, TreeData, TreeInfo } from './types';
import styles from './index.module.less';
import EditAuthorityDialog from './EditAuthorityDialog';
import { ColumnSettingProps, FilterColumnType } from '@src/components/ColumnsFilter';
import PageHeader from '@src/layout/PageHeader';
import ColumnSetting from '@src/components/ColumnsFilter/Filter';

const { Title } = Typography;
interface IProps {
  code: string;
}
const AuthorityManage: React.FC<IProps> = ({ code }) => {
  const [authMenuList, setAuthMenuList] = useState<AuthMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [treeInfo, setTreeInfo] = useSetState<TreeInfo>({
    expandedKeys: [],
    data: [],
    selected: { code: '', name: '' },
  });
  const [editModalInfo, setModalInfo] = useSetState<EditAuthMenuInfo>({
    visible: false,
    isEdit: false,
    data: null,
  });

  const { data, run } = useRequest(getSystemMenuList, {
    manual: true,
    onSuccess: (data, params) => {
      console.log(data, params);
      setTreeInfo({ data: formatTrees(data.list) });
    },
  });

  useEffect(() => {
    if (code) {
      run({ code });
    }
  }, [code]);

  useEffect(() => {
    const { code } = treeInfo.selected;
    if (code) {
      fetchAuthMenuList();
    }
  }, [treeInfo.selected]);

  function changeModelInfo(data: null | AuthMenuItem = null, isEdit = false) {
    setModalInfo({
      isEdit,
      visible: !editModalInfo.visible,
      data,
    });
  }

  /** ??????????????? */
  function handleTreeExpand(expandedKeys: Key[]) {
    setTreeInfo({ expandedKeys });
  }

  function handleSelect(selectedKeys: Key[], info: any) {
    const { node } = info;
    const { code, menuType, children, name } = node;
    if (menuType === MenuTypeEnum.Page) {
      return setTreeInfo({ selected: { name, code } });
    }
    setTreeInfo(() => {
      const params: Pick<TreeInfo, 'expandedKeys'> = { expandedKeys: treeInfo.expandedKeys };
      if (children && children.length) {
        params.expandedKeys = treeInfo.expandedKeys.includes(code)
          ? treeInfo.expandedKeys.filter((key) => key !== code)
          : treeInfo.expandedKeys.concat(code);
      }
      return {
        ...params,
      };
    });
  }

  /** ?????????????????? */
  function formatTrees(tree: TreeData[] | undefined, level = 1, parent?: TreeData | undefined) {
    const res: TreeData[] = [];
    if (!tree) {
      return res;
    }
    tree.forEach((item) => {
      if (item.children) {
        item.children = formatTrees(item.children, level + 1, item);
      }
      res.push({
        ...item,
        parent: parent?.code,
        fullName: parent ? `${parent.name}-${item.name}` : item.name,
        level,
      });
    });
    return res;
  }

  function renderTreeItem(node: DataNode & TreeData) {
    const { menuType } = node;
    return (
      <div className={styles['tree-item']}>
        <span className={styles['tree-item-title']}>{node.name}</span>
        {menuType === MenuTypeEnum.Page && (
          <Button onClick={() => changeModelInfo()} type='link' size='small'>
            ??????
          </Button>
        )}
      </div>
    );
  }

  async function fetchAuthMenuList() {
    const menuCode = treeInfo.selected.code;
    if (!menuCode || !code) return;
    const [err, res] = await requestExecute(getAuthMenuList, {
      menuCode,
      systemCode: code,
    });
    if (err) {
      return setAuthMenuList([]);
    }
    const list = res.list ?? [];
    setAuthMenuList(list);
  }

  async function handleDeleteAuthMenu(data: AuthMenuItem) {
    const menuCode = treeInfo.selected.code;
    console.log({ treeInfo, menuCode, code, data });

    if (!menuCode || !code) return;
    const [err] = await requestExecute(postDeleteAuthMenu, {
      code: data[AuthMenuFieldEnum.Code],
      menuCode,
      systemCode: code,
    });
    if (!err) {
      message.success('????????????');
      fetchAuthMenuList();
    }
  }

  const columns = [
    {
      title: '???????????????',
      dataIndex: AuthMenuFieldEnum.Name,
      key: AuthMenuFieldEnum.Name,
      width: 150,
    },
    {
      title: '???????????????',
      dataIndex: AuthMenuFieldEnum.Code,
      key: AuthMenuFieldEnum.Code,
      width: 150,
    },
    {
      title: '??????',
      ellipsis: true,
      width: 150,
      dataIndex: AuthMenuFieldEnum.Description,
      key: AuthMenuFieldEnum.Description,
    },
    {
      title: '????????????',
      dataIndex: CommonFieldEnum.CreateTime,
      key: CommonFieldEnum.CreateTime,
      width: 200,
    },
    {
      title: '?????????',
      dataIndex: CommonFieldEnum.Operator,
      key: CommonFieldEnum.Operator,
      width: 150,
    },
    {
      title: '??????',
      width: 150,
      key: AuthMenuFieldEnum.Action,
      fixed: 'right',
      render: (record: AuthMenuItem) => {
        return (
          <Split>
            <Button onClick={() => changeModelInfo(record, true)} type='link' size='small'>
              ??????
            </Button>
            <Button onClick={() => handleDeleteAuthMenu(record)} type='link' size='small'>
              ??????
            </Button>
          </Split>
        );
      },
    },
  ];
  // const curColumns = useRef(columns);
  // // const [curColumns, setCurColumns] = useState<FilterColumnType<any>[]>(columns);
  // const filterProps: ColumnSettingProps = {
  //   columns,
  //   columnsState: { privateKey: 'authority-system-manage', storageType: 'localStorage' },
  //   callback: (columns) => {
  //     curColumns.current = columns;
  //   },
  // };

  return (
    <div>
      <Alert
        className='mb-4'
        message={
          <div className={styles.alert}>
            <div>???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</div>
          </div>
        }
        type='warning'
      />
      <div className={styles['content-flex']}>
        <div className={styles['content-flex-left']}>
          <Title level={5}>????????????</Title>
          <Tree
            titleRender={renderTreeItem}
            expandedKeys={treeInfo.expandedKeys}
            treeData={treeInfo.data as any}
            onSelect={handleSelect}
            onExpand={handleTreeExpand}
            defaultExpandAll
            fieldNames={{
              title: 'name',
              key: 'code',
            }}
          />
        </div>
        <div className={styles['content-flex-right']}>
          {/* <Spin spinning={isLoading}> */}
          <PageHeader
            text={<Title level={5}>??????????????????: {treeInfo.selected.name || ''}</Title>}
            // rightCtn={<ColumnSetting {...filterProps} />}
          />
          <CustomTable
            columns={columns}
            rowKey={AuthMenuFieldEnum.Id}
            loading={isLoading}
            scroll={{ x: 950 }}
            dataSource={authMenuList}
            pagination={false}
          />
          {/* </Spin> */}
        </div>
        <EditAuthorityDialog
          menuInfo={treeInfo.selected}
          systemCode={code}
          {...editModalInfo}
          onConfirm={fetchAuthMenuList}
          onClose={changeModelInfo}
        />
      </div>
    </div>
  );
};

AuthorityManage.displayName = 'AuthorityManage';

export default AuthorityManage;
