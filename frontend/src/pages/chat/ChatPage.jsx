import Topbar from "@/components/Topbar";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";

const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

const ChatPage = () => {
    const { user } = useUser();
    const { messages, selectedUser, fetchUsers, fetchMessages, initSocket } = useChatStore();

    useEffect(() => {
        if (user) {
            fetchUsers();
            initSocket(user.id);
        }
    }, [fetchUsers, initSocket, user]);

    useEffect(() => {
        if (selectedUser) fetchMessages(selectedUser.clerkId);
    }, [selectedUser, fetchMessages]);

    return (
        <div className='h-[calc(100vh-110px)] bg-zinc-900'>
            <div className='h-full'>
                <div className='grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-full'>
                    <div className="bg-gradient-to-b from-zinc-800 to-zinc-900">
                        <UsersList />
                    </div>

                    {/* chat message */}
                    <div className='flex flex-col h-full border-l border-zinc-800 bg-gradient-to-b from-zinc-800 to-zinc-900'>
                        {selectedUser ? (
                            <>
                                <ChatHeader />

                                {/* Messages */}
                                <ScrollArea className='flex-1 min-h-0'>
                                    <div className='p-4 space-y-4'>
                                        {messages.map((message) => (
                                            <div
                                                key={message._id}
                                                className={`flex items-start gap-3 ${
                                                    message.senderId === user?.id ? "flex-row-reverse" : ""
                                                }`}
                                            >
                                                <Avatar className='size-8 shrink-0'>
                                                    <AvatarImage
                                                        src={
                                                            message.senderId === user?.id
                                                                ? user.imageUrl
                                                                : selectedUser.imageUrl
                                                        }
                                                    />
                                                </Avatar>

                                                <div
                                                    className={`rounded-lg p-3 max-w-[70%] break-words
                                                        ${message.senderId === user?.id ? "bg-green-500" : "bg-zinc-800"}
                                                    `}
                                                >
                                                    <p className='text-sm'>{message.content}</p>
                                                    <span className='text-xs text-zinc-300 mt-1 block'>
                                                        {formatTime(message.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>

                                <MessageInput />
                            </>
                        ) : (
                            <NoConversationPlaceholder />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const NoConversationPlaceholder = () => (
    <div className='flex flex-col items-center justify-center h-full space-y-6'>
        <img src='/img/logo.png' alt='Logo' className='size-16 animate-bounce' />
        <div className='text-center'>
            <h3 className='text-zinc-300 text-lg font-medium mb-1'>No conversation selected</h3>
            <p className='text-zinc-500 text-sm'>Choose a friend to start chatting</p>
        </div>
    </div>
);

export default ChatPage;
