import React from 'react';
import { useRoutes, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

import router from '@src/router';
import { store } from '@src/store';
import routes from './routes';
// import { hocComponents } from "./util";

/*
  message/notification/Modal.confirm 等静态方法
  无法共享 ConfigProvider 提供的 context 信息
  所以需要通过下面的方法全局设置prefixCls
*/
ConfigProvider.config({
  prefixCls: 'mp-antd',
});

const App = () => {
  function getPopupContainer() {
    return document.body;
  }

  const Route = () => useRoutes(routes);
  console.log({ env: process.env });
  return (
    <ConfigProvider
      locale={zhCN}
      // 和上面的全局设置不重复, 需要同时设置
      getPopupContainer={getPopupContainer}
      prefixCls='mp-antd'
    >
      <Provider store={store}>
        <HistoryRouter history={router}>
          <Route />
        </HistoryRouter>
      </Provider>
    </ConfigProvider>
  );
};

export default App;
