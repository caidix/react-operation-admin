import React, { useEffect, useState } from 'react';
import { Button, Col, Spin, Input, message } from 'antd';
import useRouter from '@src/hooks/use-router';
import { useRequest } from 'ahooks';
import { getApplicationDetail } from '@src/api/user-center/app-management';
import EditApplicationForm from '@src/pages/user-center/app-management/components/EditApplicationForm';
import styles from '../../index.module.less';
const EditApplicationDetail = () => {
  const {
    query: { code },
  } = useRouter();
  const [disabled, setdisabled] = useState(true);
  const { data, loading, run, runAsync } = useRequest(getApplicationDetail, {
    manual: true,
    onSuccess: () => {
      setdisabled(false);
    },
  });
  useEffect(() => {
    if (code) {
      run({ code });
    } else {
      message.error('缺少应用相关参数！');
    }
  }, [code]);

  return (
    <Spin spinning={loading}>
      <div className={styles['app-edit-form']}>
        <EditApplicationForm disabled={disabled} data={data} />
      </div>
    </Spin>
  );
};
EditApplicationDetail.displayName = 'EditApplicationDetail';
export default EditApplicationDetail;
