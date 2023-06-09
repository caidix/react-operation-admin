import { IRouteConfig, routes } from '@src/routes/routes';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MenuItem as BaseMenuItem } from '@src/api/user-center/app-management/menus/types';
import { listToTree } from '@src/utils/format';

type MenuItem = Required<MenuProps>['items'][number];

type BaseMenus = BaseMenuItem & { children?: BaseMenus[] };
interface IProps {
  menus?: BaseMenus[];
}
const LayoutMenu: React.FC<IProps> = (props) => {
  const handleRoutes = (routes: IRouteConfig[], parentPath = '/', key?: string): MenuItem[] => {
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
  };

  const handleMenus = (menus: IProps['menus']): MenuItem[] => {
    if (!menus) return [];
    return menus.map((i) => {
      const hasChild = i.children && i.children.length;
      return {
        label: i.name,
        key: i.id,
        children: hasChild ? handleMenus(i.children) : undefined,
      };
    });
  };

  const { menus = [] } = props;
  const menu = useMemo(() => {
    if (!menus.length) return handleRoutes(routes);
    const menuList = listToTree(menus, 'id', 'parentId', 'children');
    return handleMenus(menuList);
  }, [menus]);

  return <Menu style={{ borderRight: 'none' }} mode='inline' items={menu} />;
};

export default LayoutMenu;
