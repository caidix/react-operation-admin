import { getAllApplicationList } from '@src/api/user-center/app-management';
import { ApplicationItem } from '@src/api/user-center/app-management/application/types';
import ContainerLayout from '@src/layout/ContentLayout';
import { requestExecute } from '@src/utils/request/utils';
import { useBoolean } from 'ahooks';
import { Spin, Space, Tabs, Typography, Button, Empty, Checkbox, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './index.module.less';

const { Title } = Typography;
const AuthManagement = () => {
  const [isLoading, loadingFn] = useBoolean();
  const [systemList, setSystemList] = useState<ApplicationItem[]>([]);
  const [systemIds, setSystemIds] = useState([]);
  const save = () => {};

  const fetchData = async () => {
    const [err, res] = await requestExecute(getAllApplicationList, {});
    console.log({ err, res });
    if (res?.list) {
      setSystemList(res.list);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ContainerLayout
      title='分配权限'
      // header={
      //   <>
      //     <Title level={5}>分配权限</Title>
      //     <div className={styles.saveBox}>
      //       <div className={styles.tips}>提示：勾选【菜单和功能点】表示 属于该角色的用户可以访问操作该权限点</div>
      //       <Button type='primary' onClick={save}>
      //         保存
      //       </Button>
      //     </div>
      //   </>
      // }
    >
      <Spin spinning={isLoading}>
        <div className={styles.saveBox}>
          <Space size={30}>
            <Title level={5}>请选择应用</Title>
            <div className={styles.tips}>提示：勾选【应用】表示 属于该角色的用户可以授权访问该应用</div>
          </Space>
          <Button type='primary' onClick={save}>
            保存
          </Button>
        </div>
        {systemList.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        <div className={styles.model}>
          <Checkbox.Group value={systemIds} onChange={setSystemIds}>
            <Row>
              {systemList.map((item) => (
                <Col lg={4} xxl={3} className={styles.gridItem} key={item.id}>
                  <Checkbox value={item.id}>{item.name}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </div>
        {/* <Tabs
          defaultActiveKey='1'
          tabPosition={'left'}
          style={{ height: 220 }}
          items={systemList.map((sys) => ({
            label: sys.name,
            key: sys.code,
          }))}
        /> */}
      </Spin>
    </ContainerLayout>
  );
};

export default AuthManagement;
