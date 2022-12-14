import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.less';
import App from './routes/index';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// 如果采用React.StrictMode 用来突出显示应用程序中潜在问题，会渲染两次 这里不使用
root.render(<App />);
