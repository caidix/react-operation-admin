import React, { useMemo, useEffect, useState } from 'react';
import { Modal, Input, Form, Radio, message, Space, Checkbox, Col, Row, Spin, Empty } from 'antd';

import { useRequest } from 'ahooks';
import { getAllApplicationList } from '@src/api/user-center/app-management';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import styles from '../../index.module.less';

interface IProps {
  visible: boolean;
  authList: { systemId: number }[];
  onConfirm?: (v: number[]) => Promise<void>;
  onClose?: () => void;
}

const EditAppModal: React.FC<IProps> = (props) => {
  const { visible, authList, onClose, onConfirm } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [checkedKey, setCheckedKey] = useState<Array<CheckboxValueType>>([]);
  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm?.(checkedKey.map((i) => +i));
    } finally {
      setIsLoading(false);
    }
  };

  const { data, run, loading } = useRequest(getAllApplicationList, {
    manual: true,
    staleTime: 10000,
  });

  const init = () => {
    const checked = authList.map((i) => +i.systemId);
    setCheckedKey(checked);
  };

  useEffect(() => {
    if (visible) {
      run();
      init();
    }
  }, [visible]);

  return (
    <Modal
      title='授权应用设置'
      width={600}
      confirmLoading={isLoading}
      onOk={handleConfirm}
      open={visible}
      onCancel={onClose}
    >
      <Spin spinning={loading}>
        <Space size={30}>
          <div className={styles.title}>请选择应用</div>
          <div className={styles.tips}>提示：勾选【应用】表示 属于该角色的用户可以授权访问该应用</div>
        </Space>
        {data?.list.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        <div className={styles.model}>
          <Checkbox.Group value={checkedKey} onChange={(v) => setCheckedKey(v)}>
            <Row gutter={10}>
              {data?.list.map((item) => (
                <Col key={item.id} span={6} className={styles['grid-item']}>
                  <Checkbox value={item.id}>{item.name}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </div>
      </Spin>
    </Modal>
  );
};

export default EditAppModal;
