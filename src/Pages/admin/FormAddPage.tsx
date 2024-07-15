import React, { useState } from 'react';
import { ProColumns, EditableProTable, ProCard, ProFormField } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { v4 as uuid } from 'uuid';
import adminService from '../../Services/adminService';
import { CreateUserDto, Role } from '../../types/auth';

type DataSourceType = {
  id: React.Key;
  username?: string;
  password?: string;
  email?: string;
  role?: string;
};

const defaultData: DataSourceType[] = [];

function FormAddPage() {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => defaultData.map((item) => item.id));
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>(() => defaultData);

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: 'Username',
      dataIndex: 'username',
      width: '15%',
      formItemProps: {
        rules: [
          { required: true, whitespace: true, message: 'This field is required' },
          { max: 16, whitespace: true, message: 'Max length is 16 characters' },
          { min: 6, whitespace: true, message: 'Min length is 6 characters' },
        ],
      },
    },
    {
      title: 'Password',
      dataIndex: 'password',
      width: '15%',
      formItemProps: {
        rules: [
          { required: true, whitespace: true, message: 'This field is required' },
          { pattern: /[0-9]/, message: 'Must contain a number' },
          { max: 16, whitespace: true, message: 'Max length is 16 characters' },
          { min: 6, whitespace: true, message: 'Min length is 6 characters' },
        ],
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '20%',
      formItemProps: {
        rules: [
          { required: true, whitespace: true, message: 'This field is required' },
          { type: 'email', message: 'Invalid email format' },
        ],
      },
    },
    {
      title: 'Role',
      key: 'role',
      dataIndex: 'role',
      valueType: 'select',
      valueEnum: {
        admin: { text: 'Admin', status: 'Success' },
        academic: { text: 'Academic', status: 'Success' },
        instructor: { text: 'Instructor', status: 'Success' },
        student: { text: 'Student', status: 'Success' },
      },
      formItemProps: {
        rules: [{ required: true, message: 'This field is required' }],
      },
    },
    {
      title: 'Action',
      valueType: 'option',
      width: 250,
      render: () => null,
    },
  ];

  const handleSubmit = async () => {
    try {
      const users: CreateUserDto[] = dataSource.map((item) => ({
        username: item.username?.trim() || '',
        password: item.password?.trim() || '',
        email: item.email?.trim() || '',
        role: (item.role as Role) || Role.STUDENT, 
      }));
  
      console.log(users);
      await adminService.addUsers(users);
      message.success('Users added successfully');
      setDataSource([]);
    } catch (error: any) {
      message.error(`Failed to add users: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <>
      <EditableProTable<DataSourceType>
        headerTitle="Add Users by Form"
        columns={columns}
        rowKey="id"
        scroll={{ x: 960 }}
        value={dataSource}
        onChange={setDataSource}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          record: () => ({ id: uuid() }),
        }}
        toolBarRender={() => [
          <Button type="primary" key="save" onClick={handleSubmit}>
            Submit
          </Button>,
        ]}
        editable={{
          type: 'multiple',
          editableKeys,
          actionRender: (row, config, defaultDoms) => [defaultDoms.delete],
          onValuesChange: (record, recordList) => setDataSource(recordList),
          onChange: setEditableRowKeys,
        }}
      />
      {/* <ProCard title="JSON Result Data" headerBordered collapsible defaultCollapsed>
        <ProFormField
          ignoreFormItem
          fieldProps={{ style: { width: '100%' } }}
          mode="read"
          valueType="jsonCode"
          text={JSON.stringify(dataSource)}
        />
      </ProCard> */}
    </>
  );
}

export default FormAddPage;
