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
  onSubmit: (v: { organization: number }) => Promise<void>;
  onClose: (v?: boolean) => void;
}

const BatchTransfer = (props: IProps) => {
  const { open, data, list, onClose, onSubmit } = props;
  const [form] = Form.useForm<UserItem>();
  const [isLoading, loadingFn] = useBoolean();

  useEffect(() => {
    if (open) {
      form.resetFields();
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
      title={'转移组织'}
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
      layout='horizontal'
    >
      <ProFormTreeSelect
        required
        label='转移组织'
        name='organization'
        fieldProps={{
          fieldNames: {
            label: 'name',
            value: 'id',
          },
          treeData: list,
          showCheckedStrategy: TreeSelect.SHOW_PARENT,
          placeholder: '请选择要转移到的组织',
        }}
        rules={[{ required: true }]}
      />
    </ModalForm>
  );
};
BatchTransfer.displayName = 'BatchTransfer';
export default BatchTransfer;
