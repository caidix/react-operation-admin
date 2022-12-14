import React, { useMemo, useEffect, ChangeEvent, useRef, Ref } from 'react';
import { Modal, message } from 'antd';
import { requestExecute } from '@src/utils/request/utils';

import { postCreateApplication } from '@src/api/user-center/app-management/application';
import EditApplicationForm, { IApplicationFormProps } from '../EditApplicationForm';

interface IProps {
  visible: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
  data?: any;
}
const EditApplicationModal: React.FC<IProps> = (props) => {
  const { data, visible, onClose, onConfirm } = props;
  const formRef = useRef<IApplicationFormProps | null>(null);

  useEffect(() => {
    if (!visible) return;
    formRef.current?.form.resetFields();
  }, [visible]);

  const handleConfirm = async () => {
    try {
      const res = await formRef?.current?.form.validateFields();
      const [err] = await requestExecute(postCreateApplication, {
        ...res,
      });
      if (err) {
        return;
      }
      message.success('新增应用成功');
      onConfirm?.();
      onClose?.();
    } catch (error) {
      return;
    }
  };

  return (
    <Modal title='新增应用' open={visible} width={500} onCancel={onClose} onOk={handleConfirm}>
      <EditApplicationForm ref={formRef} data={data} />
    </Modal>
  );
};

EditApplicationModal.displayName = 'EditApplicationModal';
export default EditApplicationModal;
