import { SettingOutlined } from '@ant-design/icons';
import { Button, Popover, Space } from 'antd';

import { Checkbox, Tooltip, Tree } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import type { DataNode } from 'antd/lib/tree';

import React, { useMemo, useState } from 'react';
import useContainer, {
  FilterColumnType,
  ColumnsKey,
  ColumnsState,
  genColumnKey,
  UseContainerProps,
} from './utils/use-container';

import styles from './index.module.less';

type CheckboxListProps = {
  checkable: boolean;
  draggable: boolean;
  list: any;
  setColumns: React.Dispatch<React.SetStateAction<FilterColumnType<any>[] | null>>;
  columnsKeyMap: Record<string, ColumnsState>;
  setColumnsKeyMap: (value: Record<string, ColumnsState>) => void;
};
const CheckboxList = ({
  checkable,
  draggable,
  list,
  setColumns,
  columnsKeyMap,
  setColumnsKeyMap,
}: CheckboxListProps) => {
  const show = list && list.length > 0;
  const treeDataConfig = useMemo(() => {
    if (!list || !list.length) return {};
    const checkedKeys: string[] = [];
    const loopData = (data: any[], parentConfig?: ColumnsState): DataNode[] =>
      data.map(({ key, title, children }) => {
        const columnKey = key;
        const config = columnsKeyMap[columnKey || 'null'] || { show: true };
        if (config.show !== false && parentConfig?.show !== false && !children) {
          checkedKeys.push(columnKey);
        }
        const item: DataNode = {
          title,
          key: columnKey,
          selectable: false,
          disabled: config.disable === true,
          disableCheckbox: typeof config.disable === 'boolean' ? config.disable : config.disable?.checkbox,
          isLeaf: parentConfig ? true : undefined,
        };
        if (children) {
          item.children = loopData(children, config);
        }
        return item;
      });
    return { list: loopData(list), keys: checkedKeys };
  }, [list, columnsKeyMap]);

  const move = (id: React.Key, targetId: React.Key, dropPosition: number) => {
    const newMap = { ...columnsKeyMap };
    const newColumns = [...list];
    const findIndex = newColumns.findIndex(({ key }) => key === id);
    const targetIndex = newColumns.findIndex(({ key }) => key === targetId);
    const isDownWord = dropPosition > targetIndex;
    if (findIndex < 0) return;
    const targetItem = newColumns[findIndex];
    newColumns.splice(findIndex, 1);

    if (dropPosition === 0) {
      newColumns.unshift(targetItem);
    } else {
      newColumns.splice(isDownWord ? targetIndex : targetIndex + 1, 0, targetItem);
    }
    // 重新生成排序数组
    newColumns.forEach(({ key, dataIndex }, order) => {
      const columnKey = genColumnKey(key ?? (dataIndex as React.Key), order);
      newMap[columnKey] = { ...(newMap[columnKey] || {}), order };
    });
    // 更新数组
    setColumnsKeyMap(newMap);
    setColumns(newColumns);
  };

  const onCheckTree = (e: any) => {
    const columnKey = e.node.key;
    const newSetting = { ...columnsKeyMap[columnKey] };

    newSetting.show = e.checked;

    setColumnsKeyMap({
      ...columnsKeyMap,
      [columnKey]: newSetting,
    });
  };
  const handleSelect = (_: (string | number)[], e: any) => {
    const columnKey = e.node.key;
    const checked = !columnsKeyMap[columnKey];
    onCheckTree({ ...e, checked });
  };
  return (
    show && (
      <Tree
        treeData={treeDataConfig.list}
        itemHeight={24}
        height={288}
        checkable={checkable}
        draggable={{
          icon: false,
          nodeDraggable: () => draggable,
        }}
        blockNode
        selectable
        showLine={false}
        onCheck={(_, e) => onCheckTree(e)}
        checkedKeys={treeDataConfig.keys}
        onSelect={handleSelect}
        onDrop={(info) => {
          const dropKey = info.node.key;
          const dragKey = info.dragNode.key;
          const { dropPosition, dropToGap } = info;
          const position = dropPosition === -1 || !dropToGap ? dropPosition + 1 : dropPosition;
          move(dragKey, dropKey, position);
        }}
        titleRender={(_node) => {
          return <>{_node.title}</>;
        }}
      />
    )
  );
};
export type ColumnSettingProps<T = any> = {
  draggable?: boolean;
  checkable?: boolean;
  extra?: React.ReactNode;
  children?: React.ReactNode;
} & UseContainerProps;
function ColumnSetting<T>(props: ColumnSettingProps<T>) {
  let { draggable, checkable } = props;
  if (typeof checkable !== 'boolean') {
    checkable = true;
  }
  if (typeof draggable !== 'boolean') {
    draggable = false;
  }

  const {
    sortColumns,
    columnsKeyMap,
    defaultColumnKeyMap,
    setColumns,
    initColumns,
    setColumnsKeyMap,
    resetColumnKeyMap,
    setPrivateStorage,
  } = useContainer({ ...props });
  const [visible, setVisible] = useState(false);

  const visibleChange = (val: boolean) => {
    if (val) {
      initColumns();
    }
    setVisible(val);
  };

  // 未选中的 key 列表
  const unCheckedKeys = Object.values(columnsKeyMap).filter((value) => !value || value.show === false);

  // 是否已经选中
  const indeterminate = unCheckedKeys.length > 0 && unCheckedKeys.length !== Object.keys(defaultColumnKeyMap).length;

  const setAllSelectAction = (show: boolean = true) => {
    const columnKeyMap: ColumnsKey = {};
    Object.keys(columnsKeyMap).forEach((key) => {
      const item = columnsKeyMap[key];
      columnKeyMap[key] = {
        ...item,
        show: item.disable ? item.show : show,
      };
    });
    setColumnsKeyMap(columnKeyMap);
  };

  /** 全选和反选 */
  const checkedAll = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setAllSelectAction();
    } else {
      setAllSelectAction(false);
    }
  };

  const handleConfirm = () => {
    setPrivateStorage();
    setVisible(false);
  };

  const handleClear = () => {
    resetColumnKeyMap();
  };

  return (
    <Popover
      arrowPointAtCenter
      open={visible}
      onOpenChange={visibleChange}
      overlayClassName={styles.list_overlay}
      trigger='click'
      placement='bottomRight'
      title={
        <div className={styles.list_title}>
          <Checkbox
            indeterminate={indeterminate}
            checked={unCheckedKeys.length === 0 && unCheckedKeys.length !== sortColumns.length}
            onChange={(e) => checkedAll(e)}
          >
            显示字段
          </Checkbox>
          {props?.extra ? (
            <Space size={12} align='center'>
              {props.extra}
            </Space>
          ) : null}
        </div>
      }
      content={
        <>
          <div className={styles.list_container}>
            <CheckboxList
              draggable={draggable}
              checkable={checkable}
              list={sortColumns}
              columnsKeyMap={columnsKeyMap}
              setColumns={setColumns}
              setColumnsKeyMap={setColumnsKeyMap}
            />
          </div>

          {draggable && <p className={styles.tip_text}>拖拽字段可修改展示顺序</p>}
          <div className={styles.btns}>
            <Button type='link' size='small' onClick={handleClear}>
              重置
            </Button>
            <Button type='primary' size='small' onClick={handleConfirm}>
              确定
            </Button>
          </div>
        </>
      }
    >
      {props.children || (
        <Tooltip title='列设置'>
          <SettingOutlined />
        </Tooltip>
      )}
    </Popover>
  );
}

export default ColumnSetting;
