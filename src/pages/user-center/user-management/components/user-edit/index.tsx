import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormTextArea,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { UserGroupItem } from '@src/api/user-center/user-group-management/types';
import { UserItem, UserStatusEnum } from '@src/api/user/types';
import { Pattern } from '@src/utils/validate';
import { useBoolean } from 'ahooks';
import { Button, Form, message, TreeSelect } from 'antd';
import { useEffect, useMemo } from 'react';

interface IProps {
  open: boolean;
  data?: any;
  list: UserGroupItem[];
  onSubmit: (v: UserItem) => Promise<void>;
  onClose: (v?: boolean) => void;
}

const treeData = [
  {
    value: '#',
    name: '全局',
    key: '#',
  },
];

const layout = {
  labelCol: { span: 5 },
};

const UserEdit = (props: IProps) => {
  const { open, data, list, onClose, onSubmit } = props;
  const [form] = Form.useForm<UserItem>();
  const [isLoading, loadingFn] = useBoolean();

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({
        status: UserStatusEnum.Active,
        isSuper: false,
        paasword: 123456,
        ...data,
      });
    }
  }, [open, data]);

  const onFinish = async (values: UserItem) => {
    loadingFn.setTrue();
    await onSubmit({
      ...data,
      ...values,
    });
    loadingFn.setFalse();
  };

  const onCancel = () => onClose();

  return (
    <ModalForm<UserItem>
      title={data?.id ? '编辑' : '新建'}
      open={open}
      form={form}
      autoFocusFirstInput
      modalProps={{
        onCancel,
      }}
      width='650px'
      onFinish={onFinish}
      submitter={{
        submitButtonProps: {
          loading: isLoading,
        },
        resetButtonProps: {
          disabled: isLoading,
        },
      }}
      grid
      layout='horizontal'
    >
      <ProFormTreeSelect
        required
        label='所属组织'
        name='organization'
        fieldProps={{
          fieldNames: {
            label: 'name',
            key: 'id',
            value: 'id',
          },
          treeData: list,
          showCheckedStrategy: TreeSelect.SHOW_PARENT,
          placeholder: '请选择所属组织',
        }}
        labelCol={{ span: 4 }}
        rules={[{ required: true }]}
      />
      <ProFormText
        name='name'
        label='用户名'
        fieldProps={{
          maxLength: 8,
        }}
        labelCol={{ span: 8 }}
        colProps={{ span: 12 }}
        rules={[
          {
            required: true,
          },
        ]}
        placeholder='请输入用户名'
      />
      <ProFormText
        name='company'
        fieldProps={{
          maxLength: 8,
        }}
        labelCol={{ span: 4 }}
        colProps={{ span: 12 }}
        label='昵称'
        placeholder='请输入昵称'
      />
      <ProFormText
        labelCol={{ span: 8 }}
        colProps={{ span: 12 }}
        rules={[
          {
            pattern: Pattern.MOBILE_PATTERN,
            message: '电话号码格式有误',
          },
        ]}
        name='phone'
        label='电话'
      />
      <ProFormText
        labelCol={{ span: 4 }}
        colProps={{ span: 12 }}
        rules={[
          { required: true, message: '请输入邮箱' },
          {
            type: 'email',
            message: '邮箱格式有误',
          },
        ]}
        name='email'
        label='邮箱'
      />
      {!data?.id && (
        <ProFormText
          labelCol={{ span: 4 }}
          fieldProps={{ minLength: 6, maxLength: 16 }}
          name='paasword'
          label='初始密码'
        />
      )}
      <ProFormTextArea labelCol={{ span: 4 }} name='desc' label='个人简介' />
      <ProFormRadio.Group
        labelCol={{ span: 8 }}
        colProps={{ span: 12 }}
        label='是否启用'
        name='status'
        options={[
          {
            label: '启用',
            value: UserStatusEnum.Active,
          },
          {
            label: '禁用',
            value: UserStatusEnum.Disable,
          },
        ]}
      />
      <ProFormRadio.Group
        colProps={{ span: 12 }}
        label='超管账户'
        name='isSuper'
        options={[
          {
            label: '启用',
            value: true,
          },
          {
            label: '关闭',
            value: false,
          },
        ]}
      />
    </ModalForm>
  );
};
UserEdit.displayName = 'UserEdit';
export default UserEdit;
