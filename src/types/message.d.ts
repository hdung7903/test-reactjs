export interface Message {
    id: string;
    sender_id: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
    conver_id: string;
}

export interface Conversation {
    id: string;
    name: string;
    lastMessage?: string;
    messages: Message[];
}

interface MessageMetaProps {
    isSender: boolean;
}

interface MessageContainerProps {
    isSender: boolean;
    isConsecutive?: boolean;
}

interface MessageBubbleProps {
    isSender: boolean;
    isConsecutive?: boolean;
}