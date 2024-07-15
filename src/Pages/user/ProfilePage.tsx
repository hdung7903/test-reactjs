import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import userService from '../../Services/userService';
import { User } from '../../types/auth';
import { Button, Card, Spin, Alert, message, Descriptions, Modal, Upload, Space } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import Moment from 'react-moment';
import { storage } from '../../Config/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { RcFile } from 'antd/lib/upload';
import { v4 as uuid } from 'uuid';
import AvatarEditor from 'react-avatar-editor';
import {FileImageOutlined,InfoCircleOutlined} from '@ant-design/icons';

const ProfilePage: React.FC = () => {
    const { id = '' } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [imageModal, setImageModal] = useState<boolean>(false);
    const [newImage, setNewImage] = useState<File | null>(null);
    const [scale, setScale] = useState(1);
    const editorRef = useRef<AvatarEditor | null>(null);

    const defaultImage = "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg";

    useEffect(() => {
        const fetchUserAndImage = async () => {
            try {
                const response = await userService.getUserById(id);
                setUser(response);
                if (response.imageUrl) {
                    setImageUrl(response.imageUrl);
                }
            } catch (err) {
                console.error(err);
                setImageUrl(defaultImage);
            } finally {
                setLoading(false);
            }
        };
    
        fetchUserAndImage();
    }, [id]);;

    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must be smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleImageChange = (info: any) => {
        const file = info.file.originFileObj;
        if (file) {
            setNewImage(file);
            setImageModal(true);
        }
    };

    const handleScale = (e: React.ChangeEvent<HTMLInputElement>) => {
        const scale = parseFloat(e.target.value);
        setScale(scale);
    };

    const handleSave = async () => {
        if (editorRef.current) {
            const canvas = editorRef.current.getImageScaledToCanvas();
            setUploading(true);
            try {
                const blob = await new Promise<Blob>((resolve, reject) => {
                    canvas.toBlob(blob => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Failed to create blob from canvas'));
                        }
                    });
                });
    
                const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
                const formData = new FormData();
                formData.append('avatar', file);
    
                const response = await userService.updateAvatar(id, formData);
                setImageUrl(response.imageUrl);
                setUser(prevUser => prevUser ? { ...prevUser, imageUrl: response.imageUrl } : null);
                message.success('Image uploaded successfully');
            } catch (error) {
                console.error(error);
                message.error('Failed to upload image');
            } finally {
                setUploading(false);
                setImageModal(false);
            }
        }
    };

    const handleUpdateInfo = () => {
        message.info('Update Information functionality is not implemented yet.');
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Alert message={error} type="error" showIcon />
            </div>
        );
    }

    return (
        <>
            <ProCard split="vertical">
                <ProCard title="Image" colSpan="30%">
                    <Card
                        hoverable
                        style={{ width: 240 }}
                        cover={<img style={{pointerEvents: 'none'}} alt="user avatar" src={imageUrl || defaultImage} />}
                    >
                        <Space wrap>
                            <Upload
                                beforeUpload={beforeUpload}
                                onChange={handleImageChange}
                                showUploadList={false}
                            >
                                <Button loading={uploading}><FileImageOutlined />Change Avatar Image</Button>
                            </Upload>
                            <Button type="primary" onClick={handleUpdateInfo}>
                            <InfoCircleOutlined />Update Information
                            </Button>
                        </Space>
                    </Card>
                </ProCard>
                <ProCard title="User Information" headerBordered>
                    {user ? (
                        <Descriptions bordered>
                            <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
                            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                            <Descriptions.Item label="Role">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Descriptions.Item>
                            <Descriptions.Item label="Created At"><Moment>{user.createdAt}</Moment></Descriptions.Item>
                            <Descriptions.Item label="Updated At"><Moment>{user.updatedAt}</Moment></Descriptions.Item>
                        </Descriptions>
                    ) : (
                        <div>No user found</div>
                    )}
                </ProCard>
            </ProCard>

            <Modal
                title="Edit Avatar"
                centered
                open={imageModal}
                onOk={handleSave}
                onCancel={() => {
                    setImageModal(false);
                    setNewImage(null);
                }}
                confirmLoading={uploading}
            >
                {newImage && (
                    <AvatarEditor
                        ref={editorRef}
                        image={newImage}
                        width={250}
                        height={250}
                        border={50}
                        color={[255, 255, 255, 0.6]}
                        scale={scale}
                        rotate={0}
                    />
                )}
                <input
                    type="range"
                    onChange={handleScale}
                    min={1}
                    max={2}
                    step={0.01}
                    defaultValue={1}
                />
            </Modal>
        </>
    );
};

export default ProfilePage;
