import { RootState } from '@src/store';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import styles from './index.module.less';
export interface IFooterToolbarProps {
  isMobile?: boolean;
  siderWidth?: number | undefined;
  extra?: string | React.ReactNode;
  children?: string | React.ReactNode;
}

const FooterToolbar: React.FC<IFooterToolbarProps> = (props) => {
  const { isMobile = false, siderWidth, extra, children } = props;
  const { collapsed } = useSelector((state: RootState) => state.setting);
  const barWidth = useMemo(() => {
    return isMobile ? undefined : `calc(100% - ${collapsed ? 80 : siderWidth || 200}px)`;
  }, [isMobile, siderWidth, collapsed]);
  return (
    <div className={styles['footer-bar']} style={{ width: barWidth, transition: '0.2s all' }}>
      <div className={styles['fl']}>{extra && extra}</div>
      <div className={styles['fr']}>{children && children}</div>
    </div>
  );
};

FooterToolbar.displayName = 'FooterToolbar';

export default FooterToolbar;
