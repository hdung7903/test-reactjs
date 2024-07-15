import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import PublicRoute from './Routes/PublicRoute';
import { ConfigProvider } from 'antd';
import en_US from 'antd/locale/en_US';
import { AppProvider } from './Context/AppContext';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.Fragment>
    <ConfigProvider locale={en_US}>
      <BrowserRouter>
        <AppProvider>
          <PublicRoute />
        </AppProvider>
      </BrowserRouter>
    </ConfigProvider>
  </React.Fragment>
);

