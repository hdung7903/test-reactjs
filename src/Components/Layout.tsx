import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import type { ProLayoutProps, ProSettings } from '@ant-design/pro-components';
import {
  PageContainer,
  ProFormRadio,
  ProLayout,
  SettingDrawer,
} from '@ant-design/pro-components';
import { Dropdown } from 'antd';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export default ({ defaultProps }: { defaultProps: ProLayoutProps }) => {
  const [pathname, setPathname] = useState('/welcome');
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
    layout: 'mix',
    splitMenus: true,
  });

  const children = (
    <PageContainer>
      <div
        style={{
          height: '120vh',
          minHeight: 600,
        }}
      >
        <Outlet />
      </div>
    </PageContainer>
  );
  const props: ProLayoutProps = {
    ...defaultProps,
    location: {
      pathname,
    },
    collapsed,
    fixSiderbar: true,
    collapsedButtonRender: false,
    menuItemRender: (item, dom) => (
      <a
        onClick={() => {
          setPathname(item.path || '/welcome');
          navigate(item.path || '/welcome');
        }}
      >
        {dom}
      </a>
    ),
  };
  return (
    <ProLayout
      {...props}
      layout="mix"
      onCollapse={setCollapsed}
      avatarProps={{
        src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
        size: 'small',
        title: 'User',
        render: (props, dom) => {
          return (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'profile',
                    icon: <UserOutlined />,
                    onClick: () => {navigate('/profile/dd3ab991-e8ae-44b0-80fb-1db4259ddf78')},
                    label: 'Profile',
                  },
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: 'Log Out',
                  },
                ],
              }}
            >
              {dom}
            </Dropdown>
          );
        },
      }}
      headerContentRender={() => {
        return (
          <div
            onClick={() => setCollapsed(!collapsed)}
            style={{
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
        );
      }}
    >
      {children}
      <SettingDrawer
        pathname={pathname}
        enableDarkTheme
        getContainer={(e: any) => {
          if (typeof window === 'undefined') return e;
          return document.getElementById('test-pro-layout');
        }}
        settings={settings}
        onSettingChange={(changeSetting) => {
          setSetting(changeSetting);
        }}
        disableUrlParams={false}
      />
    </ProLayout>
  );
};