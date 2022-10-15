import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Spin, Input, message } from 'antd';
import { useBoolean, useRequest } from 'ahooks';
import { postUpdateApplication } from '@src/api/user-center/app-management/application';
import EditApplicationForm, {
  IApplicationFormProps,
} from '@src/pages/user-center/app-management/components/EditApplicationForm';
import FooterToolbar from '@src/components/FooterToolbar';
import { requestExecute } from '@src/utils/request/utils';
import styles from '../../index.module.less';
interface IProps {
  data: any;
  code: string;
  isFetchEnd: boolean;
  refresh: () => void;
}
const EditApplicationDetail: React.FC<IProps> = ({ code, data, refresh, isFetchEnd }) => {
  const formRef = useRef<IApplicationFormProps | null>(null);

  const [isLoading, loadingFn] = useBoolean();

  const handleSubmit = async () => {
    try {
      loadingFn.setTrue();
      const res = await formRef?.current?.form.validateFields();
      const [err] = await requestExecute(postUpdateApplication, {
        ...data,
        ...res,
      });
      if (err) {
        return;
      }
      message.success('编辑应用成功');
      refresh();
    } catch (error) {
      return;
    } finally {
      loadingFn.setFalse();
    }
  };

  const handleReset = () => {
    try {
      formRef.current?.form.setFieldsValue({ ...data });
    } catch (error) {
      return;
    }
  };

  return (
    <Spin spinning={isLoading}>
      <div className={styles['app-edit-form']}>
        <EditApplicationForm ref={formRef} disabled={!isFetchEnd} data={data} />

        <FooterToolbar>
          <Button onClick={handleReset}>重置</Button>
          <Button loading={isLoading} type='primary' onClick={handleSubmit} className='ml-2'>
            提交
          </Button>
        </FooterToolbar>
      </div>
    </Spin>
  );
};
EditApplicationDetail.displayName = 'EditApplicationDetail';
export default EditApplicationDetail;
