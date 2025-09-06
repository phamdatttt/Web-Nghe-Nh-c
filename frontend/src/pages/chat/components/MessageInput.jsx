import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { Send } from "lucide-react";
import { useState } from "react";

const MessageInput = () => {
    const [newMessage, setNewMessage] = useState("");
    const [error, setError] = useState("");
    const { user } = useUser();
    const { selectedUser, sendMessage, socket, isConnected } = useChatStore();

    const handleSend = () => {
        if (!selectedUser || !user || !newMessage) return;
        
        // Kiểm tra trạng thái kết nối
        if (!socket || !isConnected) {
            setError("Không thể gửi tin nhắn. Vui lòng thử lại.");
            return;
        }

        try {
            sendMessage(selectedUser.clerkId, user.id, newMessage.trim());
            setNewMessage("");
            setError("");
        } catch (err) {
            console.error("Error sending message:", err);
            setError("Không thể gửi tin nhắn. Vui lòng thử lại.");
        }
    };

    return (
        <div className='p-4 mt-auto border-t border-zinc-800'>
            {error && (
                <div className="text-red-500 text-sm mb-2 px-2">
                    {error}
                </div>
            )}
            <div className='flex gap-2'>
                <Input
                    placeholder='Type a message'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className='bg-zinc-800 border-none'
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />

                <Button size={"icon"} onClick={handleSend} disabled={!newMessage.trim()}>
                    <Send className='size-4' />
                </Button>
            </div>
        </div>
    );
};

export default MessageInput;
