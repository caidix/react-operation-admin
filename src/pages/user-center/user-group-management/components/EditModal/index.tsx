import { FC, useEffect, useMemo } from 'react';
import { Modal, Input, Form, Radio, message } from 'antd';
import useForm from '@src/hooks/use-form';

interface IProps {
  visible: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
  data?: any;
}

const UserGroupModal: FC<IProps> = (props) => {};

export default UserGroupModal;
