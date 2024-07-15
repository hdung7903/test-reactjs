import { useEffect, useState } from 'react';
import axios from 'axios';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, message, Select, Space, Typography, Alert } from 'antd';
import { User } from '../../types/auth';
import adminService from '../../Services/adminService';
import { DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import * as ExcelJS from 'exceljs';

const { Text } = Typography;

export default function UsersListPage() {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllUsers();
            setUsers(response);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            const usersData = await adminService.downloadUsersData();

            const blob = new Blob([usersData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', 'users_data.xlsx');
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            message.success('Users data downloaded successfully');
        } catch (error) {
            console.error('Error downloading users data:', error);
            message.error('Failed to download users data');
        }
    };

    const handleChangeRole = async (id: string, role: string) => {
        try {
            await axios.put(`http://localhost:8000/admin/${id}/role`, { role });
            message.success('Role updated successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error during changing role:', error);
            message.error('Error during changing role');
        }
    };

    const handleSoftDelete = async (id: string) => {
        try {
            await axios.delete(`http://localhost:8000/admin/${id}`);
            message.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error during deleting user:', error);
            message.error('Error during deleting user');
        }
    };

    const handleRestore = async (id: string) => {
        try {
            await axios.put(`http://localhost:8000/admin/${id}/restore`);
            message.success('User restored successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error during restoring user:', error);
            message.error('Error during restoring user');
        }
    };

    const handlePermanentDelete = async (id: string) => {
        try {
            await axios.delete(`http://localhost:8000/admin/${id}/force`);
            message.success('User permanently deleted successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error during permanent deletion of user:', error);
            message.error('Error during permanent deletion of user');
        }
    };

    const columns: ProColumns<User>[] = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            sorter: (a, b) => a.username.localeCompare(b.username),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (_, record) => (
                <Select
                    defaultValue={record.role}
                    disabled={record.deletedAt !== null}
                    onChange={(value) => confirmRoleChange(record.id, value)}
                >
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="academic">Academic</Select.Option>
                    <Select.Option value="instructor">Instructor</Select.Option>
                    <Select.Option value="student">Student</Select.Option>
                </Select>
            ),
        },
        {
            title: 'Account Status',
            dataIndex: 'deletedAt',
            key: 'deletedAt',
            render: (_, record) => (
                <Text type={record.deletedAt ? 'danger' : 'success'}>
                    {record.deletedAt ? 'Inactive' : 'Active'}
                </Text>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {record.deletedAt ? (
                        <Button icon={<UndoOutlined />} onClick={() => handleRestore(record.id)}>
                            Restore
                        </Button>
                    ) : (
                        <Popconfirm
                            title="Are you sure to delete this user?"
                            onConfirm={() => handleSoftDelete(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger icon={<DeleteOutlined />}>Delete</Button>
                        </Popconfirm>
                    )}
                    <Popconfirm
                        title="Are you sure to permanently delete this user? This action cannot be undone."
                        onConfirm={() => handlePermanentDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger type="primary" icon={<DeleteOutlined />}>
                            Permanent Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const confirmRoleChange = (id: string, value: string) => {
        Popconfirm({
            title: "Are you sure you want to change this user's role?",
            onConfirm: () => handleChangeRole(id, value),
            okText: "Yes",
            cancelText: "No"
        });
    }

    if (error) {
        return (
            <Alert
                message="Error"
                description="Error on fetching users."
                type="error"
                showIcon
            />
        );
    }

    return (
        <div>
            <ProTable<User>
                columns={columns}
                dataSource={users}
                rowKey="id"
                search={false}
                pagination={{
                    pageSize: 10,
                }}
                headerTitle="User List"
                loading={loading}
                toolBarRender={() => [
                    <Button onClick={handleDownload} type="primary" key="primary">
                        Download Users Data
                    </Button>,
                ]}
            />
        </div>
    );
}
