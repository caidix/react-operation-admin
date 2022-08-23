import React from 'react';
import classnames from 'classnames';
import styles from './index.module.less';
/** 页面级的模块Header */
interface HeaderProps {
  /** 头部右侧组件 */
  rightCtn?: React.ReactNode;
  /** 头部标题 */
  text?: React.ReactNode;

  className?: string;
  /** 字体大小 */
  fontSize?: number;
  /** 头部样式 */
  style?: React.CSSProperties;
  /** 温馨提示内容 */
  tip?: React.ReactNode;
}

const PageHeader: React.FC<HeaderProps> = ({
  rightCtn = null,
  className,
  text = '',
  fontSize = 16,
  style = {},
  tip,
}: HeaderProps) => (
  <div className={styles.pages_warp}>
    <div className={classnames([className, styles.header_warp])} style={style}>
      <div className={styles.left_ctn}>
        <div className={classnames(['bg-primary-color', styles.flag])} />
        <div className={styles.header_text} style={{ fontSize }}>
          {text}
        </div>
      </div>
      <div className={styles.right_ctn}>{rightCtn}</div>
    </div>
  </div>
);

export default PageHeader;
