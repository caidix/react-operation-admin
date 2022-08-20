import React, { ChangeEvent, forwardRef, useImperativeHandle, useMemo } from 'react';
import { Input, InputProps } from 'antd';
import { zxcvbn } from '@zxcvbn-ts/core';
import styles from './index.module.less';

const { Password } = Input;

export type StrengthMeterProps = {
  value?: string;
  disabled?: boolean;
  showInput?: boolean;
  onChange?: (e: string) => void;
} & InputProps;

export type StrengthMeterRefProps = {
  strength: number; // 强度值
};

const StrengthMeter = forwardRef<StrengthMeterRefProps, StrengthMeterProps>((props, ref) => {
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

  useImperativeHandle(ref, () => ({
    strength: passwordStrength,
  }));

  return (
    <div className={styles.relative}>
      {showInput && <Password value={value} onChange={handleChange} disabled={disabled} {...attrs} />}
      <div className={styles['strength-meter-bar']}>
        <div className={styles['strength-meter-bar--fill']} data-score={passwordStrength} />
      </div>
    </div>
  );
});

StrengthMeter.displayName = 'StrengthMeter';
export default StrengthMeter;
