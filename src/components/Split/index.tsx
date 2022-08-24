import React, { CSSProperties, FC, ReactNode } from 'react';

import styles from './style.module.less';

interface IProps {
  split?: ReactNode;
  style?: CSSProperties;
  type?: 'button' | 'text';
}

const btnCls = {
  paddingLeft: 0,
  paddingRight: 0,
  marginBottom: 0,
};

const Split: FC<IProps> = (props) => {
  const { children, split, style, type } = props;
  // 判断是否时按钮
  const cls = type === 'button' ? { ...style, ...btnCls } : style;
  const lastIndex = React.Children.count(children) - 1;
  const elements = React.Children.map(children, (child: any, index: number) => {
    const item = React.cloneElement(child, { style: cls });
    const splitElement = index === lastIndex ? null : <span className={styles.split}>{split}</span>;
    return (
      <>
        {item}
        {splitElement}
      </>
    );
  });

  return <div className={styles.split_container}>{elements}</div>;
};

Split.defaultProps = {
  split: '|',
  style: {},
  type: 'text',
};

export default Split;
