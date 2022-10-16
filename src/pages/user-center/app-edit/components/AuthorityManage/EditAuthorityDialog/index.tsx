import React, { FC, useEffect, useMemo, useState } from 'react';
import { Modal, Form, Input, message, Radio } from 'antd';
import { trim } from 'lodash-es';
import { postUpdateAuthMenu, postCreateAuthMenu } from '@src/api/user-center/app-management/authority';
import { requestExecute } from '@src/utils/request/utils';
import useForm from '@src/hooks/use-form';
import {
  AuthMenuFieldEnum,
  AuthMenuItem,
  IUpdateAuthMenuReq,
} from '@src/api/user-center/app-management/authority/types';
import { EditAuthMenuProps } from '../types';

const FORM_ITEM_LAYOUT = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const EditAuthorityDialog: FC<EditAuthMenuProps> = (props) => {
  const { visible, isEdit, data, menuInfo, systemCode, onConfirm, onClose } = props;
  const [form, { isLoading, layout, loaded, loading }] = useForm({
    cols: [6, 18],
  });
  const [isDisabled, setIsDisabled] = useState(true);

  const typeText = `${isEdit ? '编辑' : '新增'}`;

  const handleSubmit = async () => {
    try {
      if (isDisabled) {
        return message.warning('缺乏必要参数 -- 菜单code OR 应用code!');
      }
      const params = await form.validateFields();
      if (data && isEdit) {
        params[AuthMenuFieldEnum.Id] = data[AuthMenuFieldEnum.Id];
      }
      const request = isEdit ? postUpdateAuthMenu : postCreateAuthMenu;
      const [err] = await requestExecute(request, {
        ...params,
        systemCode,
        menuCode: menuInfo.code,
      });
      if (err) {
        return;
      }
      message.success(`${typeText}功能点成功`);
      onConfirm?.();
      onClose?.();
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    if (visible) {
      isEdit ? form.setFieldsValue(data) : form.resetFields();
    }
  }, [visible]);

  useEffect(() => {
    setIsDisabled(!menuInfo.code && !systemCode);
  }, [menuInfo, systemCode]);

  return (
    <Modal open={visible} title={`${typeText}功能点`} centered onOk={handleSubmit} onCancel={onClose}>
      <div>
        <Form form={form} {...FORM_ITEM_LAYOUT} disabled={isDisabled}>
          <Form.Item label='所属菜单'>{menuInfo.name}</Form.Item>
          <Form.Item
            label='功能点名称'
            name={AuthMenuFieldEnum.Name}
            required
            rules={[
              {
                validator(_, value, callback) {
                  return callback(!value || !trim(value) ? '功能点名称必填' : undefined);
                },
              },
            ]}
          >
            <Input allowClear maxLength={64} placeholder='请输入功能点名称，限制最大64个字符' />
          </Form.Item>
          <Form.Item
            label='功能点编码'
            name={AuthMenuFieldEnum.Code}
            rules={[{ required: true, message: '请输入功能点编码' }]}
          >
            <Input maxLength={32} disabled={isEdit} placeholder='请输入功能点编码' allowClear />
          </Form.Item>
          <Form.Item label='描述' name={AuthMenuFieldEnum.Description}>
            <Input.TextArea autoSize={false} maxLength={128} placeholder='请输入描述，限制最大128个字符' showCount />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default EditAuthorityDialog;
