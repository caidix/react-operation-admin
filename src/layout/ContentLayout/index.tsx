// 主体区域布局, 可自行修改或删除

import { FC, useMemo } from 'react';
import classnames from 'classnames';
import { PageHeader } from 'antd';
import React from 'react';

import styles from './index.module.less';

const cx = classnames.bind(styles);
interface IProps {
  flex?: number;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  extraHeader?: React.ReactNode;
  title?: string | React.ReactNode;
  custom?: boolean;
  children?: string | React.ReactNode;
}

const prefixedClassName = 'user-center-page-container';
const renderPageHeader = (content: React.ReactNode, extraContent: React.ReactNode, flex?: number): React.ReactNode => {
  if (!content && !extraContent) {
    return null;
  }
  return (
    <div className={styles[`${prefixedClassName}-detail`]}>
      <div className={styles[`${prefixedClassName}-main`]}>
        <div className={styles[`${prefixedClassName}-row`]}>
          {content && <div className={styles[`${prefixedClassName}-content`]}>{content}</div>}
          {extraContent && <div className={styles[`${prefixedClassName}-extraContent`]}>{extraContent}</div>}
        </div>
      </div>
    </div>
  );
};

const ContainerLayout: FC<IProps> = (props) => {
  const { flex, header, extraHeader, custom, footer, title = '' } = props;
  const isFlex = typeof flex !== 'undefined';
  const cls = cx({ container__scroll: isFlex });
  const style = isFlex ? { flex } : {};
  const { children } = props;

  const Header = (
    <div className={styles[`${prefixedClassName}-warp`]}>
      <PageHeader title={title} footer={footer}>
        {renderPageHeader(header, extraHeader, flex)}
      </PageHeader>
    </div>
  );
  return (
    <div className={cls} style={style}>
      {Header}
      {custom ? children : <div className={styles.content_wrapper}>{children}</div>}
    </div>
  );
};

export default ContainerLayout;

// 面包屑 - 暂时不需要
// const { breadcrumbs } = useSelector((state: RootStoreProps) => state.user);
// const routes: Required<IBreadcrumbs> = useMemo(() => {
//   return breadcrumbs.map((item) => ({
//     ...item,
//     children: undefined,
//   }));
// }, [breadcrumbs]);
// function itemRender(route: any) {
//   return <span>{route.title}</span>;
// }
