import React, { useMemo, useEffect, useState } from 'react';
import { Modal, Input, Form, Radio, message, Space, Checkbox, Col, Row, Spin, Empty } from 'antd';
import useForm from '@src/hooks/use-form';
import { requestExecute } from '@src/utils/request/utils';
import { postCreateOrganization, postUpdateOrganization } from '@src/api/user-center/user-group-management';
import { Pattern } from '@src/utils/validate';
import { ModalForm, ProFormCheckbox, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { postCreateRole, postCreateRoleGroup, postUpdateRole, postUpdateRoleGroup } from '@src/api/user-center/role';
import { RoleGroupItem } from '@src/api/user-center/role/types';
import { ColumnEnum } from '../../config';
import { RoleParams, RoleType } from '../../types';
import { ApplicationItem } from '@src/api/user-center/app-management/application/types';

import styles from '../../index.module.less';
import { useRequest } from 'ahooks';
import { getAllApplicationList } from '@src/api/user-center/app-management';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
interface IProps {
  visible: boolean;
  systemList: ApplicationItem[];
  onConfirm?: () => void;
  onClose?: () => void;
  checked?: number[];
}

const EditAppModal: React.FC<IProps> = (props) => {
  const { visible, systemList, checked = [], onClose, onConfirm } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [checkedKey, setCheckedKey] = useState<Array<CheckboxValueType>>([]);
  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      // const [err] = await requestExecute(request, {
      //   ...data,
      //   ...values,
      // });
      // if (err) {
      //   return;
      // }
      message.success('配置成功');
      onConfirm?.();
      onClose?.();
    } finally {
      setIsLoading(false);
    }
  };

  const { data, run, loading } = useRequest(getAllApplicationList, {
    manual: true,
    staleTime: 10000,
  });

  const init = () => {
    run();
    setCheckedKey(checked);
  };

  useEffect(() => {
    if (visible) {
      init();
    }
  }, [visible]);

  return (
    <Modal title='授权应用设置' width={600} confirmLoading={isLoading} onOk={handleConfirm} open={visible} onCancel={onClose}>
      <Spin spinning={loading}>
        <Space size={30}>
          <div className={styles.title}>请选择应用</div>
          <div className={styles.tips}>提示：勾选【应用】表示 属于该角色的用户可以授权访问该应用</div>
        </Space>
        {data?.list.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        <div className={styles.model}>
          <Checkbox.Group value={checkedKey} onChange={(v) => setCheckedKey(v)}>
            <Row>
              {data?.list.map((item) => (
                <Col key={item.id} lg={4} xxl={3} className={styles['grid-item']}>
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
