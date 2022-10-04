import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Spin, Input, message } from 'antd';
import useRouter from '@src/hooks/use-router';
import { useBoolean, useRequest } from 'ahooks';
import { getApplicationDetail, postUpdateApplication } from '@src/api/user-center/app-management';
import EditApplicationForm, {
  IApplicationFormProps,
} from '@src/pages/user-center/app-management/components/EditApplicationForm';
import FooterToolbar from '@src/components/FooterToolbar';
import { requestExecute } from '@src/utils/request/utils';
import styles from '../../index.module.less';
interface IProps {
  code: string;
}
const EditApplicationDetail: React.FC<IProps> = ({ code }) => {
  const [disabled, setdisabled] = useState(true);
  const formRef = useRef<IApplicationFormProps | null>(null);
  const { data, loading, run, runAsync, refresh } = useRequest(getApplicationDetail, {
    manual: true,
    onSuccess: () => {
      setdisabled(false);
    },
  });
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

  useEffect(() => {
    if (code) {
      run({ code });
    } else {
      message.error('缺少应用相关参数！');
    }
  }, []);

  return (
    <Spin spinning={loading}>
      <div className={styles['app-edit-form']}>
        <EditApplicationForm ref={formRef} disabled={disabled} data={data} />

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
