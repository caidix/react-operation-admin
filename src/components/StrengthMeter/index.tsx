import React, { ChangeEvent, useMemo } from 'react';
import { Input, InputProps } from 'antd';
import { zxcvbn } from '@zxcvbn-ts/core';
import styles from './index.module.less';

const { Password } = Input;

export type IStrengthMeterProps = {
  value?: string;
  disabled?: boolean;
  showInput?: boolean;
  onChange?: (e: string) => void;
} & InputProps;

const StrengthMeter: React.FC<IStrengthMeterProps> = (props) => {
  const { value, disabled, onChange, showInput = true, ...attrs } = props;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange?.(e.target.value);
  }

  const passwordStrength = useMemo(() => {
    if (disabled) {
      return -1;
    }
    const score = value && value.length ? zxcvbn(value).score : -1;
    return score;
  }, [value, disabled]);

  return (
    <div className={styles.relative}>
      {showInput && <Password value={value} onChange={handleChange} disabled={disabled} {...attrs} />}
      <div className={styles['strength-meter-bar']}>
        <div className={styles['strength-meter-bar--fill']} data-score={passwordStrength} />
      </div>
    </div>
  );
};

export default StrengthMeter;
