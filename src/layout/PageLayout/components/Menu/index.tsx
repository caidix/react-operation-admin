import { IRouteConfig, routes } from '@src/routes/routes';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number];

const LayoutMenu = () => {
  function handleRoutes(routes: IRouteConfig[], parentPath = '/', key?: string): MenuItem[] {
    return routes.map((item: IRouteConfig, index: number) => {
      const { meta, path, children } = item;
      const hasChild = children && children.length;
      const name = meta?.name || '';
      return {
        label: hasChild ? name : <Link to={`${parentPath}${path}`}>{name}</Link>,
        key: key ? `${key}-${index}` : `${index}`,
        children: hasChild ? handleRoutes(children, path, `${index}`) : undefined,
      };
    });
  }

  return <Menu style={{ borderRight: 'none' }} mode='inline' items={handleRoutes(routes)} />;
};

export default LayoutMenu;
