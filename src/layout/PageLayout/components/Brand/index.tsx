import React, { FC } from 'react';
import styles from './index.module.less';

interface IProps {
  logo?: string;
  title?: string;
  onClick?: () => void;
}

const Brand: FC<IProps> = (props) => {
  const { logo = '', title = '' } = props;

  const handleClick = () => {
    props.onClick?.();
  };
  return (
    <div className={styles.brand} onClick={handleClick}>
      {logo && <img src={logo} className={styles.brand_img} />}
      <div className={styles.brand_text}>{title}</div>
    </div>
  );
};

export default Brand;
