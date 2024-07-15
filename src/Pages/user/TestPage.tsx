import React, { useState, useEffect, ChangeEvent, useRef, useCallback } from 'react';
import { Layout, Input, List, Avatar, Button, Space, message } from 'antd';
import { SendOutlined, SmileOutlined, PaperClipOutlined, DeleteOutlined } from '@ant-design/icons';
import io, { Socket } from 'socket.io-client';
import { Message, Conversation, MessageMetaProps, MessageContainerProps, MessageBubbleProps } from '../../types/message';
import styled from 'styled-components';
import { PlusCircleOutlined } from "@ant-design/icons";
import { User } from '../../types/auth';
import adminService from '../../Services/adminService';
import { Modal } from 'antd';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { CurrentUser } from '../../types/auth';
import _ from 'lodash';
import { useSocket } from '../../Context/AppContext';
import { Helmet } from "react-helmet";

const { Header, Content, Footer, Sider } = Layout;
const { TextArea } = Input;


// const socket = io('http://localhost:8000', {
//     withCredentials: true,
//     transports: ['websocket'],
//     reconnection:false
// });

const MessageContainer = styled.div<MessageContainerProps>`
  display: flex;
  justify-content: ${props => props.isSender ? 'flex-end' : 'flex-start'};
  margin-bottom: ${props => props.isConsecutive ? '2px' : '10px'};
  max-width: 70%;
  ${props => props.isSender ? 'margin-left: auto;' : 'margin-right: auto;'}
`;

const MessageContent = styled.div<{ isSender: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isSender ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div<MessageBubbleProps>`
  background-color: ${props => props.isSender ? '#0084ff' : '#ffffff'};
  color: ${props => props.isSender ? '#ffffff' : '#000000'};
   border-radius: ${props => props.isConsecutive
        ? (props.isSender ? '18px 4px 18px 18px' : '4px 18px 18px 18px')
        : '18px'}; 
  padding: 8px 12px;
  max-width: 100%;
  word-wrap: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const MessageMeta = styled.div<{ isSender: boolean }>`
  font-size: 0.75em;
  color: #8e8e8e;
  margin-top: 4px;
  padding: 0 4px;
`;

function TestMessagePage() {
    const { socket } = useSocket();
    const [newMessage, setNewMessage] = useState('');
    const [messageSent, setMessageSent] = useState<boolean>(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [userList, setUserList] = useState<User[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [roomId, setRoomId] = useState<string>('');


    const cookie = Cookies.get('access_token') || '';
    console.time("excute");
    console.log(socket);
    console.timeEnd("excute");
    useEffect(() => {
        if (socket && selectedConversation) {
            socket.emit('join_room', selectedConversation.id);
            console.log('Joined room:', selectedConversation.id);
        }

        scrollToBottom();
        if (!socket) return;

        const handleReceiveMessage = (msg: Message) => {
            setConversations((prevConversations) =>
                prevConversations.map((conv) =>
                    conv.id === msg.conver_id
                        ? {
                            ...conv,
                            lastMessage: typeof msg.content === 'string' ? msg.content : 'File received',
                            messages: [...(conv.messages || []), msg],
                        }
                        : conv
                )
            );

            setSelectedConversation((prev) => {
                if (prev && prev.id === msg.conver_id) {
                    return {
                        ...prev,
                        lastMessage: typeof msg.content === 'string' ? msg.content : 'File received',
                        messages: [...(prev.messages || []), msg],
                    };
                }
                return prev;
            });
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [socket, roomId, selectedConversation]);

    // useEffect(() => {
    //     if (!socket) return;

    //     const handleReceiveMessage = (msg: Message) => {
    //         setConversations((prevConversations) =>
    //             prevConversations.map((conv) =>
    //                 conv.id === msg.conver_id
    //                     ? {
    //                         ...conv,
    //                         lastMessage: typeof msg.content === 'string' ? msg.content : 'File received',
    //                         messages: [...(conv.messages || []), msg],
    //                     }
    //                     : conv
    //             )
    //         );

    //         setSelectedConversation((prev) => {
    //             if (prev && prev.id === msg.conver_id) {
    //                 return {
    //                     ...prev,
    //                     lastMessage: typeof msg.content === 'string' ? msg.content : 'File received',
    //                     messages: [...(prev.messages || []), msg],
    //                 };
    //             }
    //             return prev;
    //         });
    //     };

    //     socket.on('receive_message', handleReceiveMessage);

    //     return () => {
    //         socket.off('receive_message', handleReceiveMessage);
    //     };
    // }, [socket]);

    useEffect(() => {
        const fetchMessages = async (userId: string) => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/chat/conversations/${userId}`);
                setConversations(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchUsers = async (currentUser: CurrentUser) => {
            setLoading(true);
            try {
                const response = await adminService.getAllUsers();
                const data = response.filter((user: User) => user.username !== currentUser.username);
                setUserList(data);
            } catch (error) {
                console.error('Error fetching users:', error);
                message.error('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        const initializeCurrentUser = async () => {
            const decodedToken = jwtDecode<any>(cookie);
            const currentUser: CurrentUser = {
                id: decodedToken.sub,
                username: decodedToken.username,
                email: decodedToken.email,
                role: decodedToken.role,
                imageUrl: decodedToken.imageUrl,
                accessToken: cookie,
            };
            setCurrentUser(currentUser);
            await fetchMessages(currentUser.id);
            await fetchUsers(currentUser);
        };

        initializeCurrentUser();
    }, [cookie]);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = async (user: User) => {
        setSelectedUser(user);
        await startConversation(user.id);
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleSendMessage = useCallback(async () => {
        if (isSending || messageSent) return;

        if (!newMessage.trim() || !selectedConversation || !currentUser?.id) {
            message.error('Unable to send message. Please try again.');
            return;
        }

        setIsSending(true);

        try {
            if (!messageSent) {
                socket?.emit('send_message', {
                    conver_id: selectedConversation.id,
                    content: newMessage,
                    sender_id: currentUser.id,
                });
                console.log('Sent message:', newMessage);
                setMessageSent(true);
            }
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            message.error('Failed to send message');
        } finally {
            setIsSending(false);
        }


    }, [newMessage, selectedConversation, currentUser, isSending, socket]);

    const formatDate = (timestamp?: Date | string): string => {
        if (!timestamp) return '';

        const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
        return date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };


    const startConversation = async (receiverId: string) => {
        try {
            const response = await axios.post(
                'http://localhost:8000/chat/conversations',
                { receiver_id: receiverId },
                {
                    headers: {
                        Authorization: `Bearer ${cookie}`,
                    },
                }
            );
            const newConversation = response.data;
            setConversations([...conversations, newConversation]);
            setSelectedConversation(newConversation);
            setRoomId(newConversation.id);
        } catch (error) {
            console.error('Error starting conversation:', error);
        }
    };

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Test Message Page</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            <Layout style={{ height: '100vh' }}>
                <Sider
                    width={320}
                    style={{ background: '#fff', borderRight: '1px solid #f0f0f0', overflow: 'auto' }}
                >
                    <Header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', justifyContent: 'space-between', margin: 0, display: 'flex', padding: 0 }}>
                        <h2 style={{ marginLeft: "10px", alignContent: 'center' }}>Messages</h2>
                        <div style={{ marginRight: "15px", alignContent: 'center' }}>
                            <PlusCircleOutlined onClick={showModal} />
                        </div>
                    </Header>
                    <List
                        loading={loading}
                        itemLayout="horizontal"
                        dataSource={conversations}
                        renderItem={(item) => {
                            const lastMessage = item.messages && item.messages.length > 0 ? item.messages[item.messages.length - 1] : null;
                            return (
                                <List.Item
                                    style={{ padding: '12px 16px', cursor: 'pointer' }}
                                    onClick={() => {
                                        setSelectedConversation(item);
                                        setRoomId(item.id);
                                        console.log(roomId);
                                    }}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar>{item.name[0]}</Avatar>}
                                        title={
                                            <span>
                                                {item.name}
                                            </span>}
                                        description={lastMessage ? lastMessage.content : "No messages yet"}
                                    />
                                    {/* <DeleteOutlined onClick={() => deleteConversation(item.id)} /> */}
                                </List.Item>
                            );
                        }}
                    />
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: '0 16px', borderBottom: '1px solid #f0f0f0' }}>
                        <h2 style={{ margin: 0 }}>{selectedConversation ? selectedConversation.name : 'Select a conversation'}</h2>
                    </Header>
                    {(currentUser?.id && (selectedConversation && roomId.includes(selectedConversation.id))) && (
                        <Content style={{ padding: '16px', background: '#f0f2f5', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                            {selectedConversation.messages
                                .filter(item => item.createdAt)
                                .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime())
                                .map((item, index) => {
                                    const isSender = item.sender_id === currentUser?.id;
                                    const isConsecutive = index > 0 && selectedConversation.messages[index - 1]?.sender_id === item.sender_id;
                                    return (
                                        <MessageContainer key={item.id} isSender={isSender} isConsecutive={isConsecutive}>
                                            <MessageContent isSender={isSender}>
                                                <MessageBubble isSender={isSender} isConsecutive={isConsecutive}>
                                                    {item.content ? item.content : <h1>Send your first message</h1>}
                                                </MessageBubble>
                                                <MessageMeta isSender={isSender}>
                                                    {formatDate(item.createdAt)}
                                                </MessageMeta>
                                            </MessageContent>
                                        </MessageContainer>
                                    );
                                })}
                            <div ref={messagesEndRef} />
                        </Content>
                    )}
                    {selectedConversation && (
                        <Footer style={{ padding: '16px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button icon={<SmileOutlined />} style={{ marginRight: '8px' }} />
                                <Button icon={<PaperClipOutlined />} style={{ marginRight: '8px' }} onClick={() => alert("In development")} />
                                <input
                                    type="file"
                                    style={{ display: 'none' }}
                                />
                                <TextArea
                                    rows={1}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onPressEnter={(e) => {
                                        if (!e.shiftKey) {
                                            handleSendMessage();
                                            e.preventDefault();
                                        }
                                    }}
                                    placeholder="Type your message..."
                                    autoSize={{ minRows: 1, maxRows: 6 }}
                                />
                                <Button
                                    type="primary"
                                    icon={<SendOutlined />}
                                    loading={isSending}
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim() || !selectedConversation}
                                    style={{ marginTop: 10 }}
                                >
                                    Send
                                </Button>
                            </div>
                        </Footer>
                    )}
                </Layout>
                <Modal
                    title="Send message to:"
                    visible={open}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <List
                        dataSource={userList}
                        renderItem={(user: User) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar>{user.username[0]}</Avatar>}
                                    title={user.username}
                                />
                                <Button type="primary" onClick={() => handleOk(user)}><SendOutlined />Send</Button>
                            </List.Item>
                        )}
                    />
                </Modal>
            </Layout>
        </>
    );
}

export default TestMessagePage;
