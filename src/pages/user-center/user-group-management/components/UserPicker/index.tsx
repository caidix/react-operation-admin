import React, { useMemo, useEffect, useState } from 'react';
import { Modal, Transfer, Descriptions, message } from 'antd';
import useForm from '@src/hooks/use-form';
import { requestExecute } from '@src/utils/request/utils';
import { postOrganizationUsers, postRelationOrgByUser } from '@src/api/user-center/user-group-management';
import { getAllUserList } from '@src/api/user';
import { UserGroupItem, UserItem } from '@src/api/user-center/user-group-management/types';

interface IProps {
  visible: boolean;
  onClose?: () => void;
  data: UserGroupItem | null;
}

const UserPicker: React.FC<IProps> = (props) => {
  const { data, visible, onClose } = props;
  const [form, { isLoading, layout, loaded, loading }] = useForm({
    cols: [6, 18],
  });
  const [userList, setUserList] = useState<UserItem[]>([]);
  const [userChoosedList, setUserChoosedList] = useState<string[]>([]);

  const isEdit = useMemo(() => !!data, [data]);
  useEffect(() => {
    if (!visible) return;
    isEdit ? form.setFieldsValue({ ...data }) : form.resetFields();
  }, [visible, isEdit]);

  const handleConfirm = async () => {
    try {
      if (!data?.id) {
        return;
      }
      loading();
      const [err] = await requestExecute(postRelationOrgByUser, {
        id: data.id,
        userIds: userChoosedList.map((i) => Number(i)),
      });
      if (!err) {
        message.success('关联用户成功!');
        onClose?.();
      }
    } catch (error) {
      return;
    } finally {
      loaded();
    }
  };

  const getUserList = async () => {
    try {
      loading();
      const [err, res] = await requestExecute(getAllUserList, {});
      if (err) {
        return;
      }
      setUserList(res.list || []);
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

      setUserChoosedList(res.list.map((user: UserItem) => String(user.id)) || []);
    } catch (error) {
      return;
    }
  };

  const handleChange = (newTargetKeys: string[]) => {
    setUserChoosedList(newTargetKeys);
  };

  useEffect(() => {
    if (visible) {
      getUserList();
      getOrganizationUsers();
    }
  }, [visible]);

  return (
    <Modal
      title='新增/移除用户'
      width={760}
      open={visible}
      onCancel={onClose}
      onOk={handleConfirm}
      confirmLoading={isLoading}
    >
      <Descriptions column={1}>
        <Descriptions.Item label='当前用户组'>{data?.name}</Descriptions.Item>
        <Descriptions.Item label='用户组成员'>
          <Transfer
            dataSource={userList}
            targetKeys={userChoosedList}
            render={(item) => item.name}
            rowKey={(record) => String(record.id)}
            listStyle={{
              width: 280,
            }}
            titles={['候选成员', '当前成员']}
            disabled={isLoading}
            onChange={handleChange}
          />
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default UserPicker;
