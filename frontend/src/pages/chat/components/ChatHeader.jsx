import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/useChatStore";

const ChatHeader = () => {
    const { selectedUser, onlineUsers, isConnected, error } = useChatStore();

    if (!selectedUser) return null;

    return (
        <div className='p-4 border-b border-zinc-800 space-y-2'>
            {error && (
                <div className="text-red-500 text-sm bg-red-500/10 rounded-md p-2">
                    {error}
                </div>
            )}
            
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <Avatar>
                        <AvatarImage src={selectedUser.imageUrl} />
                        <AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className='font-medium'>{selectedUser.fullName}</h2>
                        <p className='text-sm text-zinc-400'>
                            {onlineUsers.has(selectedUser.clerkId) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm text-zinc-400">
                        {isConnected ? 'Đã kết nối' : 'Mất kết nối'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
