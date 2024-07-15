import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProConfigProvider,
  ProFormCheckbox,
  ProFormText,
  setAlpha,
} from '@ant-design/pro-components';
import { message, theme } from 'antd';
import type { CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../Services/authService';
import { LoginDto } from '../../types/auth';
import Cookies from 'js-cookie';

const LoginPage = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const iconStyles: CSSProperties = {
    marginInlineStart: '16px',
    color: setAlpha(token.colorTextBase, 0.2),
    fontSize: '24px',
    verticalAlign: 'middle',
    cursor: 'pointer',
  };

  const handleSubmit = async (values: LoginDto) => {
    try {
      const response = await authService.login(values);

      Cookies.set('access_token', response.accessToken, {
        expires: values.rememberMe ? 7 : 1, 
        secure: false,
        sameSite: 'lax',
        path: '/'
      });
      message.success(response.message);
      navigate('/admin/home');
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('An unexpected error occurred during login.');
      }
    }
  };

  return (
    <ProConfigProvider hashed={false}>
      <div style={{ backgroundColor: token.colorBgContainer }}>
        <LoginForm
          logo="https://github.githubassets.com/favicons/favicon.png"
          title="Github"
          subTitle="World's largest code hosting platform"
          onFinish={handleSubmit}
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={'prefixIcon'} />,
            }}
            placeholder={'Enter your username'}
            rules={[
              {
                required: true,
                message: 'Please enter your username!',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />,
            }}
            placeholder={'Enter your password'}
            rules={[
              {
                required: true,
                message: 'Please enter your password!',
              },
            ]}
          />
          <div style={{ marginBottom: 24 }}>
            <ProFormCheckbox noStyle name="rememberMe">
              Remember me
            </ProFormCheckbox>
            <Link to="/forgot-password" style={{ float: 'right' }}>
              Forgot password
            </Link>
          </div>
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};

export default LoginPage;