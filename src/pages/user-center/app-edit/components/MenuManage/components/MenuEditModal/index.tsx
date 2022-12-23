import React, { useMemo, useEffect, ChangeEvent, useRef, Ref } from 'react';
import { Modal, message } from 'antd';
import { Input, Form, Select, Radio } from 'antd';
import { requestExecute } from '@src/utils/request/utils';
import useForm, { FormHookProps } from '@src/hooks/use-form';
import {
  MenuFieldEnum,
  MenuShowEnum,
  MenuShowEnums,
  MenuTypeEnum,
  MenuTypeEnums,
  PageOpenEnum,
  PageOpenEnums,
} from '@src/api/user-center/app-management/menus/types';
import { Pattern } from '@src/utils/validate';
import { postCreateSystemMenu, postUpdateSystemMenu } from '@src/api/user-center/app-management/menus';
import { DataType, ModelInfo } from '../../config';

type IProps = {
  code: string;
} & ModelInfo;

const EditApplicationModal: React.FC<IProps> = (props) => {
  const { data, code, visible, parent, type, onClose, onConfirm } = props;

  const [form, { isLoading, layout, loaded, loading }] = useForm({
    cols: [6, 18],
  });

  const isEdit = useMemo(() => type === 'edit', [type]);
  const IRequest = useMemo(() => (isEdit ? postUpdateSystemMenu : postCreateSystemMenu), [isEdit]);

  useEffect(() => {
    if (visible) {
      resetParams();
    }
  }, [visible]);

  const resetParams = () => {
    form.resetFields();
    if (isEdit) {
      return form.setFieldsValue(data);
    }
    const menuType = parent && parent.menuType === MenuTypeEnum.Page ? MenuTypeEnum.Auth : MenuTypeEnum.Page;
    form.setFieldsValue({
      menuType: menuType,
    });
  };

  const handleConfirm = async () => {
    try {
      if (!code) return;

      const res = await form.validateFields();
      loading();
      const params = {
        systemCode: code,
        ...res,
        parentId:
          res?.[MenuFieldEnum.ParentId] !== undefined ? res?.[MenuFieldEnum.ParentId] : parent?.[MenuFieldEnum.Id],
      };
      if (isEdit) {
        params.id = data?.id;
      }
      const [err] = await requestExecute(IRequest, params);
      if (err) return;
      message.success(isEdit ? '编辑菜单成功' : '新增菜单成功');
      props.onConfirm?.();
      props.onClose?.();
    } catch (error) {
      return;
    } finally {
      loaded();
    }
  };

  const menuTypeEnum = useMemo(() => {
    if (!parent) return MenuTypeEnums;
    const isAuth = parent && parent.menuType === MenuTypeEnum.Page;
    return MenuTypeEnums.filter((i) => (isAuth ? i.value === MenuTypeEnum.Auth : i.value !== MenuTypeEnum.Auth));
  }, [parent]);

  return (
    <Modal
      title={isEdit ? '编辑菜单' : '新增菜单  '}
      maskClosable
      width={650}
      open={visible}
      confirmLoading={isLoading}
      onCancel={onClose}
      onOk={handleConfirm}
    >
      <Form form={form} {...layout}>
        <Form.Item label='上级菜单' name='_'>
          {(parent && parent[MenuFieldEnum.Name]) || '无'}
        </Form.Item>
        <Form.Item
          label='菜单类型'
          name={MenuFieldEnum.MenuType}
          rules={[{ required: true, message: '请选择菜单类型' }]}
        >
          <Radio.Group disabled={isEdit}>
            {menuTypeEnum.map(({ value, label }) => (
              <Radio value={value} key={value}>
                {label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label='节点名称' name={MenuFieldEnum.Name} rules={[{ required: true, message: '请输入节点名称' }]}>
          <Input allowClear maxLength={64} placeholder='请输入节点名称，限制最大64个字符' />
        </Form.Item>
        <Form.Item label='节点编码' name={MenuFieldEnum.Code} rules={[{ required: true, message: '请输入节点编码' }]}>
          <Input allowClear maxLength={64} disabled={isEdit} placeholder='请输入节点编码，限制最大64个字符' />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prev, old) => {
            return prev?.[MenuFieldEnum.MenuType] !== old?.[MenuFieldEnum.MenuType];
          }}
        >
          {({ getFieldValue }) => {
            const menuType = getFieldValue(MenuFieldEnum.MenuType);
            return (
              <>
                {menuType !== MenuTypeEnum.Auth && (
                  <>
                    <Form.Item
                      name={MenuFieldEnum.IsShow}
                      label='菜单显示'
                      initialValue={MenuShowEnum.Show}
                      rules={[{ required: true, message: '请选择菜单显示' }]}
                    >
                      <Radio.Group>
                        {MenuShowEnums.map(({ value, label }) => (
                          <Radio value={value} key={value}>
                            {label}
                          </Radio>
                        ))}
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item
                      name={MenuFieldEnum.IconUrl}
                      label='菜单Icon'
                      extra='推荐图片比例 1:1，大小不超过 150kb，仅支持svg格式'
                    >
                      {/* <FormUploader size={150} uploadType={['svg']} /> */}
                    </Form.Item>
                  </>
                )}
                {menuType === MenuTypeEnum.Page && (
                  <>
                    <Form.Item
                      label='页面打开方式'
                      name={MenuFieldEnum.PageOpenMethod}
                      initialValue={PageOpenEnum.Inline}
                      rules={[{ required: true, message: '请选择页面打开方式' }]}
                    >
                      <Radio.Group>
                        {PageOpenEnums.map(({ value, label }) => (
                          <Radio value={value} key={value}>
                            {label}
                          </Radio>
                        ))}
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item
                      label='页面路径'
                      name={MenuFieldEnum.Url}
                      rules={[
                        { required: true, message: '请输入页面路径地址' },
                        {
                          validator: (_rule: any, url: string, callback: (msg?: string) => void) => {
                            const isLinkTo = getFieldValue(MenuFieldEnum.PageOpenMethod) === PageOpenEnum.LinkTo;
                            if (!isLinkTo) return callback();
                            if (!url || Pattern.LINK_PATTERN.test(url)) return callback();
                            callback('地址必须以 https:// 或者 http:// 开头');
                          },
                        },
                      ]}
                    >
                      <Input placeholder='请输入路径地址' />
                    </Form.Item>
                  </>
                )}
              </>
            );
          }}
        </Form.Item>

        <Form.Item name={MenuFieldEnum.Description} label='描述'>
          <Input.TextArea autoSize={false} maxLength={128} placeholder='请输入菜单描述，限制最大128个字符' showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
};

EditApplicationModal.displayName = 'EditApplicationModal';
export default EditApplicationModal;
