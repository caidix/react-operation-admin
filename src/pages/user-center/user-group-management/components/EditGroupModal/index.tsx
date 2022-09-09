import { FC, useEffect, useMemo } from 'react';
import { Modal, Input, Form, Radio, message } from 'antd';
import useForm from '@src/hooks/use-form';
import { ColumnEnum } from '../../config';

interface IProps {
  visible: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
  data?: any;
}
const EditGroupModal: FC<IProps> = (props) => {
  const { data, visible, onClose, onConfirm } = props;
  const [form, { isLoading, layout, loaded, loading }] = useForm({
    cols: [8, 16],
  });
  const handleConfirm = () => {};
  const isEdit = useMemo(() => !!data, [data]);

  return (
    <Modal
      title={isEdit ? '新增用户组' : '编辑'}
      visible={visible}
      onCancel={onClose}
      onOk={handleConfirm}
      confirmLoading={isLoading}
      destroyOnClose
    >
      <Form form={form} {...layout}>
        <Form.Item label='名称' required>
          <Input value={data[ColumnEnum.Id]} disabled placeholder='请输入用户组名称' maxLength={64} />
        </Form.Item>
        <Form.Item
          label='用户组编码'
          name={ColumnEnum.Code}
          rules={[
            { required: true, message: '请输入组编码' },
            { pattern: /^[a-z](([a-z]|[0-9]|_)*)$/, message: '请输入正确的用户组编码' },
          ]}
          extra='只允许小写的英文+下划线+数字，不能数字和下划线开头。'
        >
          <Input maxLength={32} disabled={isEdit} placeholder='请输入组编码' allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditGroupModal;
