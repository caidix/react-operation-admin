import React, { useMemo, useEffect } from 'react';
import { Modal, Input, Form, Radio, message } from 'antd';
import useForm from '@src/hooks/use-form';
import { requestExecute } from '@src/utils/request/utils';
import { postCreateOrganization, postUpdateOrganization } from '@src/api/user-center/user-group-management';
import { Pattern } from '@src/utils/validate';
import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { postCreateRoleGroup, postUpdateRoleGroup } from '@src/api/user-center/role';
import { RoleGroupItem } from '@src/api/user-center/role/types';
import { ColumnEnum } from '../../config';
import { RoleParams, RoleType } from '../../types';

interface IProps {
  visible: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
  data?: any;
  type: RoleType;
  groupList: RoleGroupItem[];
}
const requestEnum = {
  ['true' + RoleType.Group]: postUpdateRoleGroup,
  ['false' + RoleType.Group]: postCreateRoleGroup,
};
const EditGroupModal: React.FC<IProps> = (props) => {
  const { data, visible, type, groupList, onClose, onConfirm } = props;
  const [form, { isLoading, layout, loaded, loading }] = useForm({
    cols: [6, 18],
  });

  const isEdit = useMemo(() => !!data, [data]);
  useEffect(() => {
    if (!visible) return;
    isEdit ? form.setFieldsValue({ ...data }) : form.resetFields();
  }, [visible, isEdit]);

  const handleConfirm = async (values: RoleParams | undefined) => {
    try {
      const request = requestEnum[`${isEdit}${type}`];
      if (!request) return;
      loading();
      const [err] = await requestExecute(request, {
        ...data,
        ...values,
      });
      if (err) {
        return;
      }
      message.success(isEdit ? `编辑${pre}成功` : `新增${pre}成功`);
      onConfirm?.();
      onClose?.();
    } finally {
      loaded();
    }
  };

  const pre = useMemo(() => {
    return type === RoleType.Group ? '角色分组' : '角色';
  }, [type]);

  const roleGroupList = useMemo(() => groupList.map((item) => ({ label: item.name, value: item.id })), [groupList]);

  return (
    <ModalForm
      title={`${isEdit ? '编辑' : '新增'}${pre}`}
      open={visible}
      width={480}
      form={form}
      autoFocusFirstInput
      modalProps={{
        onCancel: onClose,
      }}
      submitter={{
        submitButtonProps: {
          loading: isLoading,
        },
        resetButtonProps: {
          disabled: isLoading,
        },
      }}
      layout='horizontal'
      onFinish={handleConfirm}
      {...layout}
    >
      <ProFormText
        name='name'
        required
        label={`${pre}名称`}
        fieldProps={{
          maxLength: 24,
        }}
        placeholder={`请输入${pre}名称，最长为 24 位`}
        rules={[{ required: true, message: '名称不得为空' }]}
      />
      {type === RoleType.Item && (
        <ProFormSelect
          showSearch
          options={roleGroupList}
          name='roleGroupId'
          label='所属分组'
          rules={[{ required: true, message: '所属分组不得为空' }]}
        />
      )}
      <ProFormTextArea name='desc' label={`${pre}概述`} placeholder={`请输入${pre}概述`} />
    </ModalForm>
  );
};

export default EditGroupModal;
