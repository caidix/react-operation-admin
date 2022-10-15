export enum CommonFieldEnum {
  /** 创建时间 */
  CreateTime = 'createTime',
  /** 更新时间 */
  UpdateTime = 'updateTime',
  /** 删除时间 */
  DeleteTime = 'deleteTime',
  /** 操作者id */
  Operator = 'operator',
  /** 创建者id */
  Creator = 'creator',
}
export interface CommonFieldItem {
  [CommonFieldEnum.CreateTime]: string;
  [CommonFieldEnum.UpdateTime]: string;
  [CommonFieldEnum.DeleteTime]: string;
  [CommonFieldEnum.Operator]: number;
  [CommonFieldEnum.Creator]: number;
}
