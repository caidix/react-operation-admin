import React, { useMemo, useEffect, ChangeEvent, forwardRef, useImperativeHandle } from 'react';
import { Input, Form } from 'antd';
import useForm, { FormHookProps } from '@src/hooks/use-form';
import { requestExecute } from '@src/utils/request/utils';
import { PlatformConsts } from '@src/consts';
import { Pattern } from '@src/utils/validate';
import { ColumnEnum } from '../../config';
interface IProps {
  data?: any;
}
export interface IApplicationFormProps {
  form: FormHookProps[0];
}
const EditApplicationForm = forwardRef<IApplicationFormProps, IProps>((props, ref) => {
  const { data } = props;
  const [form, formMethod] = useForm({
    cols: [6, 18],
  });

  useImperativeHandle(ref, () => ({ form }));

  useEffect(() => {
    form.setFieldsValue({ ...data });
  }, [data]);

  const handleAppCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const code = event.target.value;
    const appURL = code ? `${code}/` : '';
    const url = `${window.location.origin}${PlatformConsts.MICRO_APP_ACTIVE_RULE_PREFIX}/${appURL}`;
    form.setFieldsValue({ [ColumnEnum.Url]: url });
  };

  return (
    <Form form={form} {...formMethod.layout}>
      <Form.Item label='应用名称' rules={[{ required: true, message: '请输入应用名称' }]} name={ColumnEnum.Name}>
        <Input maxLength={64} placeholder='请输入应用名称' />
      </Form.Item>
      <Form.Item label='应用编码' rules={[{ required: true, message: '请输入应用编码' }]} name={ColumnEnum.Code}>
        <Input maxLength={32} placeholder='请输入应用编码, 即微前端应用路由编码' onChange={handleAppCodeChange} />
      </Form.Item>
      <Form.Item
        label='访问地址'
        name={ColumnEnum.Url}
        rules={[
          {
            pattern: Pattern.HTTP_PREFIX_PATTERN,
            message: '访问地址必须以https://、http://开头',
          },
          { required: true, message: '请输入访问地址' },
        ]}
      >
        <Input disabled placeholder='请输入访问地址' />
      </Form.Item>
      <Form.Item
        label='资源地址'
        name={ColumnEnum.ResourcesUrl}
        rules={[
          {
            pattern: Pattern.LINK_PATTERN,
            message: '资源地址必须以https://、http://、/开头',
          },
          { required: true, message: '请填写资源载入地址' },
        ]}
        extra='微前端拉取资源地址'
      >
        <Input placeholder='请输入资源地址' />
      </Form.Item>
      <Form.Item label='LOGO图片' name={ColumnEnum.LogoUrl}>
        <Input maxLength={32} disabled placeholder='' allowClear />
      </Form.Item>
      <Form.Item label='所属项目组' name={ColumnEnum.Organization}>
        <Input maxLength={32} placeholder='请输入组编码' allowClear />
      </Form.Item>
      <Form.Item name={ColumnEnum.Description} label='描述' initialValue={''}>
        <Input.TextArea autoSize={false} maxLength={2048} placeholder='请输入用户组描述' showCount />
      </Form.Item>
    </Form>
  );
});

EditApplicationForm.displayName = 'EditApplicationForm';
export default EditApplicationForm;
