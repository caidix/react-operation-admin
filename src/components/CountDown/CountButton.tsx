import React, { useMemo, useState } from 'react';
import { Button, ButtonProps } from 'antd';
import { isFunction } from 'lodash-es';
import { useBoolean, useCountDown } from 'ahooks';

export type CountButtonProps = {
  count?: number;
  text?: string | React.ReactNode;
  beforeStartFunc?: () => Promise<boolean>;
} & ButtonProps;

const CountButton: React.FC<CountButtonProps> = (props) => {
  const { count = 60, text = '获取验证码', beforeStartFunc = null, ...attr } = props;
  const [targetDate, setTargetDate] = useState<number>(0);
  const [isLoading, { setTrue, setFalse }] = useBoolean();
  const [_, formattedRes] = useCountDown({
    targetDate,
  });

  const isStart = useMemo(() => {
    const { seconds } = formattedRes;
    return seconds > 0;
  }, [formattedRes]);

  const buttonText = useMemo(() => {
    const { seconds } = formattedRes;
    return seconds > 0 ? `${seconds}秒后重新获取` : text;
  }, [formattedRes]);

  // effect;

  async function handleStart() {
    if (beforeStartFunc && isFunction(beforeStartFunc)) {
      setTrue();
      try {
        const canStart = await beforeStartFunc();
        canStart && setTargetDate(Date.now() + count * 1000);
      } finally {
        setFalse();
      }
    } else {
      console.log('faqi操作');
      setTargetDate(Date.now() + count * 1000);
    }
  }
  return (
    <div>
      <Button {...attr} loading={isLoading} disabled={isStart} onClick={handleStart}>
        {buttonText}
      </Button>
    </div>
  );
};

export default CountButton;
