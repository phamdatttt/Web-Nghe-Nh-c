import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

// Khởi tạo và cấu hình Socket.IO server
export const initializeSocket = (server) => {
    // Tạo instance Socket.IO với cấu hình CORS
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173", "http://localhost:5174"],
            credentials: true,
        },
    });

    // Lưu trữ thông tin socket của người dùng
    const userSockets = new Map(); // { userId: socketId} - Map lưu ID socket của mỗi user
    const userActivities = new Map(); // {userId: activity} - Map lưu hoạt động hiện tại của user

    // Xử lý khi có kết nối socket mới
    io.on("connection", (socket) => {
        // Xử lý sự kiện user kết nối
        socket.on("user_connected", (userId) => {
            // Lưu thông tin socket của user
            userSockets.set(userId, socket.id);
            userActivities.set(userId, "Idle");

            // Thông báo cho tất cả client biết user này vừa online
            io.emit("user_connected", userId);

            // Gửi danh sách user đang online cho client mới kết nối
            socket.emit("users_online", Array.from(userSockets.keys()));

            // Gửi danh sách hoạt động của các user cho tất cả client
            io.emit("activities", Array.from(userActivities.entries()));
        });

        // Xử lý sự kiện cập nhật hoạt động của user
        socket.on("update_activity", ({ userId, activity }) => {
            console.log("activity updated", userId, activity);
            userActivities.set(userId, activity);
            // Thông báo cho tất cả client về hoạt động mới
            io.emit("activity_updated", { userId, activity });
        });

        // Xử lý sự kiện gửi tin nhắn
        socket.on("send_message", async (data) => {
            try {
                const { senderId, receiverId, content } = data;

                // Lưu tin nhắn vào database
                const message = await Message.create({
                    senderId,
                    receiverId,
                    content,
                });

                // Gửi tin nhắn realtime đến người nhận nếu họ đang online
                const receiverSocketId = userSockets.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive_message", message);
                }

                // Phản hồi lại người gửi là tin nhắn đã được gửi
                socket.emit("message_sent", message);
            } catch (error) {
                console.error("Message error:", error);
                // Gửi thông báo lỗi cho người gửi
                socket.emit("message_error", error.message);
            }
        });

        // Xử lý sự kiện ngắt kết nối
        socket.on("disconnect", () => {
            let disconnectedUserId;
            // Tìm user vừa ngắt kết nối
            for (const [userId, socketId] of userSockets.entries()) {
                if (socketId === socket.id) {
                    disconnectedUserId = userId;
                    // Xóa thông tin socket và hoạt động của user
                    userSockets.delete(userId);
                    userActivities.delete(userId);
                    break;
                }
            }
            // Thông báo cho tất cả client biết user này vừa offline
            if (disconnectedUserId) {
                io.emit("user_disconnected", disconnectedUserId);
            }
        });
    });
};
