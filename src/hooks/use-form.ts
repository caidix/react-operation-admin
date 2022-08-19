import { useBoolean, useReactive } from 'ahooks';
import { useMemo } from 'react';
import { ColProps, Form, FormInstance, FormItemProps } from 'antd';

type FormInitProps = {
  cols?: [number, number];
  needFormItem?: boolean;
};

type LayoutProps = {
  labelCol?: ColProps;
  wrapperCol?: ColProps;
};

type UiProps = {
  layout: LayoutProps | undefined;
  offsetLayout: LayoutProps | undefined;
};

export type FormHookProps = [
  FormInstance<any>,
  {
    initForm: () => void;
    isLoading: boolean;
    loading: () => void;
    loaded: () => void;
    // Item: FormItemProps;
  } & UiProps,
];

export type ItemProps = {
  rules: any[];
} & FormItemProps;

function createRuleMap() {
  const ruleMap = {
    required: { required: true },

    whitespace: { whitespace: true },
    string: { type: 'string' },
    number: { pattern: /^\d+$/ },
    array: { type: 'array' },
    email: { type: 'email' },
    phone: { pattern: /^1[3456789]\d{9}$/, validateTrigger: 'onBlur' },
    id: { pattern: /^\d+x?$/i },
  };
}

export default function (props: FormInitProps): FormHookProps {
  const [form] = Form.useForm();
  const [isLoading, loadingFn] = useBoolean(false);

  const ui = useMemo(() => {
    const { cols } = props;
    let layout;
    let offsetLayout;
    if (cols && cols.length === 2) {
      const [leftSpan, rightSpan] = cols;
      layout = { labelCol: { span: leftSpan }, wrapperCol: { span: rightSpan } };
      offsetLayout = { wrapperCol: { offset: leftSpan, span: rightSpan } };
    }
    return { layout, offsetLayout };
  }, [props.cols]);

  const initForm = () => {
    form.resetFields();
  };

  let Item;
  // if (props.needFormItem) {
  // }

  return [
    form,
    {
      initForm,
      isLoading,
      loading: loadingFn.setTrue,
      loaded: loadingFn.setFalse,
      ...ui,
    },
  ];
}
