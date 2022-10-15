import { AuthMenuFieldEnum, IUpdateAuthMenuReq } from '@src/api/user-center/app-management/authority/types';
import { MenuBaseData, MenuFieldEnum } from '@src/api/user-center/app-management/menus/types';

import { Key } from 'antd/lib/table/interface';
export type TreeData = {
  level?: number; // 层级
  fullName?: string;
  parent?: string | null;
} & MenuBaseData;
export type TreeItemSelected = PickByObject<TreeData, 'code' | 'name'>;

export interface TreeInfo {
  expandedKeys: Key[];
  data: TreeData[];
  selected: TreeItemSelected;
}

export interface EditAuthMenuInfo {
  visible: boolean;
  isEdit: boolean;
  data: PartialByKeys<IUpdateAuthMenuReq, AuthMenuFieldEnum.Id> | null;
}

export interface EditAuthMenuProps extends EditAuthMenuInfo {
  menuInfo: TreeItemSelected;
  systemCode: string;
  onConfirm?: () => void;
  onClose?: () => void;
}
