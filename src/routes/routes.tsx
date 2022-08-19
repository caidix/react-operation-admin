import React from 'react';
import { RouteObject, useRoutes } from 'react-router-dom';
import PageLayout from '@src/layout/PageLayout';
import HomePage from '@src/pages/home';
import Login from '@src/pages/login';
import { RoutePath } from './config';
import Auth from './util';
export interface IRouteConfig extends RouteObject {
  meta?: {
    icon?: string | React.ReactNode;
    name?: string | React.ReactNode;
    auth?: boolean;
  };
  children?: IRouteConfig[];
}

const routes: IRouteConfig[] = [
  {
    path: '/',
    element: <PageLayout />,
    meta: {
      icon: '',
      name: '首页',
    },
    children: [{ path: RoutePath.HOME_PAGE, element: <HomePage /> }],
  },
  { path: '/user', meta: { auth: false }, element: <HomePage /> },
  { path: RoutePath.LOGIN, meta: { auth: false }, element: <Login /> },
];

function renderRoutes(routes: IRouteConfig[]) {
  return routes.map((route) => {
    const { element } = route;
    const { auth = true } = route.meta || {};
    if (auth) {
      route.element = <Auth>{element}</Auth>;
    }
    if (route.children && route.children.length) {
      route.children = renderRoutes(route.children);
    }
    return route;
  });
}

export default renderRoutes(routes);
