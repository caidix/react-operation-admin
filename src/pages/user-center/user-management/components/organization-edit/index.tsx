import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormTextArea,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { UserGroupItem } from '@src/api/user-center/user-group-management/types';
import { useBoolean } from 'ahooks';
import { Button, Form, message, TreeSelect } from 'antd';
import { useEffect, useMemo } from 'react';
interface IProps {
  open: boolean;
  data?: any;
  list: UserGroupItem[];
  onSubmit: (v: UserGroupItem) => Promise<void>;
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
  wrapperCol: { span: 18 },
};

const OrganizationEdit = (props: IProps) => {
  const { open, data, list, onClose, onSubmit } = props;
  const [form] = Form.useForm<UserGroupItem>();
  const [isLoading, loadingFn] = useBoolean();

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({ ...data, parentId: data?.parentId ? data.parentId : '#' });
    }
  }, [open, data]);

  const onFinish = async (values: UserGroupItem) => {
    loadingFn.setTrue();
    await onSubmit({
      ...data,
      ...values,
      parentId: values.parentId === '#' ? null : values.parentId,
    });
    loadingFn.setFalse();
  };

  const onCancel = () => onClose();

  const treeList = useMemo(
    () => [
      {
        id: '#',
        value: '#',
        name: '全局',
        children: list,
      },
    ],
    [list],
  );

  return (
    <ModalForm<UserGroupItem>
      title={data?.id ? '编辑' : '新建'}
      open={open}
      form={form}
      autoFocusFirstInput
      modalProps={{
        onCancel,
      }}
      width='550px'
      onFinish={onFinish}
      submitter={{
        submitButtonProps: {
          loading: isLoading,
        },
        resetButtonProps: {
          disabled: isLoading,
        },
      }}
      layout='horizontal'
      {...layout}
    >
      <ProFormText
        name='name'
        required
        label='部门名称'
        fieldProps={{
          maxLength: 24,
        }}
        placeholder='请输入名称，最长为 24 位'
        rules={[{ required: true, message: '部门名称不得为空' }]}
      />
      <ProFormTreeSelect
        required
        label='上级组织'
        name='parentId'
        initialValue='#'
        fieldProps={{
          fieldNames: {
            label: 'name',
            value: 'id',
          },
          treeData: treeList,
          showCheckedStrategy: TreeSelect.SHOW_PARENT,
          placeholder: '请选择上级组织',
        }}
        rules={[{ required: true, message: '上级组织不得为空' }]}
      />
      <ProFormTextArea name='desc' label='概述' />
      <ProFormDigit
        extra='数字越大权重越高'
        label='权重'
        name='sort'
        min={0}
        max={1000}
        initialValue={0}
        placeholder='请输入权重'
      />
    </ModalForm>
  );
};

export default OrganizationEdit;
