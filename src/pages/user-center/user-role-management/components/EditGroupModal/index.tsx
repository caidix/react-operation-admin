import React, { useMemo, useEffect } from 'react';
import { Modal, Input, Form, Radio, message } from 'antd';
import useForm from '@src/hooks/use-form';
import { requestExecute } from '@src/utils/request/utils';
import { postCreateOrganization, postUpdateOrganization } from '@src/api/user-center/user-group-management';
import { ColumnEnum } from '../../config';
import { Pattern } from '@src/utils/validate';

interface IProps {
  visible: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
  data?: any;
}
const EditGroupModal: React.FC<IProps> = (props) => {
  const { data, visible, onClose, onConfirm } = props;
  const [form, { isLoading, layout, loaded, loading }] = useForm({
    cols: [6, 18],
  });

  const isEdit = useMemo(() => !!data, [data]);
  useEffect(() => {
    if (!visible) return;
    isEdit ? form.setFieldsValue({ ...data }) : form.resetFields();
  }, [visible, isEdit]);

  const handleConfirm = async () => {
    try {
      const res = await form.validateFields();
      const request = isEdit ? postUpdateOrganization : postCreateOrganization;
      loading();
      const [err] = await requestExecute(request, {
        ...data,
        ...res,
      });
      if (err) {
        return;
      }
      message.success(isEdit ? '编辑系统成功' : '新增系统成功');
      onConfirm?.();
    } catch (error) {
      return;
    } finally {
      loaded();
    }
  };

  return (
    <Modal
      title={isEdit ? '编辑' : '新增用户组'}
      visible={visible}
      width={560}
      onCancel={onClose}
      onOk={handleConfirm}
      confirmLoading={isLoading}
      destroyOnClose
    >
      <Form form={form} {...layout}>
        <Form.Item label='名称' required name={ColumnEnum.Name}>
          <Input placeholder='请输入用户组名称' maxLength={64} />
        </Form.Item>
        <Form.Item
          label='用户组编码'
          name={ColumnEnum.Code}
          rules={[
            { required: true, message: '请输入组编码' },
            { pattern: Pattern.LOWER_CODE_PATTER, message: '请输入正确的用户组编码' },
          ]}
          extra='用户组编码唯一，只允许小写的英文+下划线+数字，不能数字和下划线开头。'
        >
          <Input maxLength={32} disabled={isEdit} placeholder='请输入组编码' allowClear />
        </Form.Item>
        <Form.Item name={ColumnEnum.Description} label='描述' initialValue={''}>
          <Input.TextArea autoSize={false} maxLength={2048} placeholder='请输入用户组描述' showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditGroupModal;
