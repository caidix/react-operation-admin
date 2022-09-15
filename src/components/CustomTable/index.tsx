import { Table, TableProps, Image, ImageProps, Tooltip } from 'antd';
import React, { forwardRef, useMemo } from 'react';
import { TimeFormat } from '@src/utils/format';
import { isEmpty, isObject, toString, trim } from 'lodash-es';
import { TABLE_CELL_EMPTY_TEXT } from '@src/consts/index';
import { FilterColumnType } from '../ColumnsFilter';
/**
 * 自定义Table - 增加定量参数, 简单书写，不满意重构吧
 * isImage(ImageColumnType): 是否为图片，加此参数默认采用Image标签返回值
 * isTime(boolean/TimeColumnType)： 是否需要时间戳转换，传入类型可以更换秒/毫秒， 默认秒
 * enums(EnumColumnType): 枚举值，若传入枚举值，将会将传入值与枚举值进行遍历 传入的枚举需要以 label\value 的形式传入
 * sep: 若为分割枚举值时的分割字符， 默认为 ';'
 * isHover(boolean)：: 是否需要将Hover改成antd的Tooltip组件
 * isCustom: 是否需要自定义render函数，若为false时默认为空的内容里增加 '-' 显示
 */

export type TimeColumnType =
  | {
      type: 'second' | 'millisecond';
    }
  | boolean;
export type ImageColumnType = ImageProps | boolean;
export type EnumColumnType = {
  label: any;
  value: any;
}[];
export type CustomColumnType<T> = {
  isImage?: ImageColumnType;
  isTime?: TimeColumnType;
  isCustom?: boolean;
  isHover?: boolean;
  enums?: EnumColumnType;
  sep?: string;
} & FilterColumnType<T>;

const ICON_SIZE = 30;
const ICON_FAILBACK =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg==';

// 判断空值,使用lodash的toString,帮助修复isEmpty判断数字为空的情况
export function isFullEmpty(value: any) {
  return isEmpty(toString(value)) || trim(value) === '';
}

/** Table表单转义时间戳  */
export function renderTime(value: string | number, isTime: TimeColumnType) {
  if (isObject(isTime)) {
    const { type } = isTime;
    return type === 'second' ? TimeFormat.formatSecondTime(value) : TimeFormat.formatTime(value);
  }
  return TimeFormat.formatSecondTime(value);
}

/** Table表单自定义渲染图片  */
export function renderImg(value: string, isImage: ImageColumnType) {
  if (isFullEmpty(value)) return '';
  let props: ImageProps = {
    width: ICON_SIZE,
    height: ICON_SIZE,
    src: value,
  };
  if (isObject(isImage)) {
    const preview = isImage.preview;
    if (isObject(preview)) {
      preview.src = value || preview.src;
    }
    props = {
      ...props,
      ...isImage,
      preview,
    };
  }
  return <Image fallback={ICON_FAILBACK} {...props} />;
}

export function renderHover(value: any) {
  value = value || TABLE_CELL_EMPTY_TEXT;
  return (
    <Tooltip placement='topLeft' title={value}>
      {value}
    </Tooltip>
  );
}

function getEnumsValue(enums: EnumColumnType = [], _value: any) {
  const match = enums.find(({ value }) => value === _value);
  console.log({ enums, match });

  return (match && match.label) || '';
}

function getListEnumsValue(enums: EnumColumnType = [], data: any = [], sep = ';') {
  return enums
    .filter(({ value }) => data.includes(value))
    .map((item) => item.label)
    .join(sep);
}

/** Table表单默认空值时返回 横杠 -  */
export function renderCustom(value: any) {
  if (React.isValidElement(value)) {
    return value;
  }
  if (isFullEmpty(value)) {
    return TABLE_CELL_EMPTY_TEXT;
  }
  return value;
}
function CustomTable<T>(props: TableProps<any>, ref: React.Ref<HTMLDivElement>) {
  const columns = props.columns as CustomColumnType<T>[];
  const newColumns = useMemo(() => {
    return columns?.map((item) => {
      const render = (value: any, record: T, dataIndex: number) => {
        const { isImage, isTime, isCustom, enums, isHover } = item;
        let result = item.render ? item.render(value, record, dataIndex) : value;

        // 自定义render
        if (isCustom) {
          return result;
        }

        // 分配操作
        if (isImage) {
          result = renderImg(value, isImage);
        } else if (isTime) {
          result = renderTime(value, isTime);
        } else if (enums && Array.isArray(value)) {
          result = getListEnumsValue(enums, value, item.sep);
        } else if (enums) {
          result = getEnumsValue(enums, value);
        }
        if (isHover) {
          result = renderHover(result);
        }

        return renderCustom(result);
      };

      if (item.isHover) {
        item.ellipsis = {
          showTitle: false,
        };
      }

      return {
        ...item,
        render,
      };
    });
  }, [columns]);
  return <Table rowKey='id' ref={ref} {...props} columns={newColumns} />;
}

CustomTable.displayName = 'CustomTable';

export default forwardRef(CustomTable);
