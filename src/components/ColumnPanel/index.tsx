import React from 'react';
import styles from './index.module.less';

type INode = string | number | React.ReactNode;
interface IProps {
  leftTitle?: INode;
  leftExtra?: INode;
  rightTitle?: INode;
  rightExtra?: INode;
  children?: React.ReactNode | undefined;
}
const ColumnPanel = (props: IProps) => {
  const getRenderChildren = (slotName: string) => {
    let dom = null;
    React.Children.map(props.children, (child) => {
      if (!React.isValidElement(child)) return;
      const slot = child.props?.slot || '';
      if (slot === slotName) dom = React.cloneElement(child);
    });
    return dom;
  };

  return (
    <>
      <div className='flex p-4'>
        <div className={styles.left}>
          <div className={styles.header}>
            <div className={styles.title}>{props.leftTitle}</div>
            <div>{props.leftExtra}</div>
          </div>
          {getRenderChildren('left')}
        </div>
        <div className={styles.right}>
          <div className={styles.header}>
            <div className={styles.title}>{props.rightTitle}</div>
            <div>{props.rightExtra}</div>
          </div>
          {getRenderChildren('right')}
        </div>
      </div>
    </>
  );
};

export default ColumnPanel;
