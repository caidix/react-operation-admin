import { Input, InputProps } from 'antd';
import React from 'react';
import CountButton, { CountButtonProps } from './CountButton';
import styles from './index.module.less';

export type CountInputProps = {
  countProps?: CountButtonProps;
} & InputProps;

const CountInput: React.FC<CountInputProps> = (props) => {
  const { countProps = {}, ...inputProps } = props;
  return <Input className={styles.count_input} {...inputProps} addonAfter={<CountButton {...countProps} />} />;
};

export default CountInput;
