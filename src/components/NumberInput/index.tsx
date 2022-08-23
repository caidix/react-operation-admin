import React, { useState } from 'react';
import { Input } from 'antd';

interface IProps {
  placeholder: string;
  form: any;
  name?: string;
}

export default function NumberInput(props: IProps) {
  const { placeholder, form, name = 'id' } = props;
  const [value, setValue] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    const reg = /(^[1-9]\d*$)/;
    if (reg.test(inputValue) || inputValue === '') {
      setValue(inputValue);
      form.setFieldsValue({
        [name]: inputValue,
      });
    }
  };

  return <Input placeholder={placeholder} value={value} onChange={handleChange} />;
}
