import React, { useMemo, useEffect, useState } from 'react';
import { Modal, Input, Form, Radio, message } from 'antd';
import useForm from '@src/hooks/use-form';
import { requestExecute } from '@src/utils/request/utils';
import {
  postCreateOrganization,
  postOrganizationUsers,
  postUpdateOrganization,
} from '@src/api/user-center/user-group-management';
import { getAllUserList } from '@src/api/user';
import { UserGroupItem } from '@src/api/user-center/user-group-management/types';
import { ColumnEnum } from '../../config';

interface IProps {
  visible: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
  data?: UserGroupItem;
}
const UserPicker: React.FC<IProps> = (props) => {
  const { data, visible, onClose, onConfirm } = props;
  const [form, { isLoading, layout, loaded, loading }] = useForm({
    cols: [6, 18],
  });
  const [userList, setUserList] = useState([]);
  const [userChoosedList, setUserChoosedList] = useState([]);

  const isEdit = useMemo(() => !!data, [data]);
  useEffect(() => {
    if (!visible) return;
    isEdit ? form.setFieldsValue({ ...data }) : form.resetFields();
  }, [visible, isEdit]);

  const handleConfirm = async () => {};

  const getUserList = async () => {
    try {
      loading();
      const [err, res] = await requestExecute(getAllUserList, {});
      if (err) {
        return;
      }
      setUserList(res.data || []);
    } catch (error) {
      return;
    } finally {
      loaded();
    }
  };

  const getOrganizationUsers = async () => {
    try {
      const [err, res] = await requestExecute(postOrganizationUsers, {
        id: data?.id,
      });
      if (err) {
        return;
      }
      setUserChoosedList(res.data || []);
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    getUserList();
  }, []);

  useEffect(() => {
    if (visible) {
      getOrganizationUsers();
    }
  }, [visible]);

  return (
    <Modal
      title='新增/移除用户'
      visible={visible}
      onCancel={onClose}
      onOk={handleConfirm}
      confirmLoading={isLoading}
    ></Modal>
  );
};

export default UserPicker;
