import mongoose from "mongoose";

// Định nghĩa schema cho collection Message (tin nhắn)
const messageSchema = new mongoose.Schema(
	{
		// ID người gửi tin nhắn (từ hệ thống Clerk)
		senderId: { type: String, required: true }, // Clerk user ID
		
		// ID người nhận tin nhắn (từ hệ thống Clerk) 
		receiverId: { type: String, required: true }, // Clerk user ID
		
		// Nội dung tin nhắn
		content: { type: String, required: true },
	},
	{ timestamps: true } // Tự động thêm createdAt và updatedAt
);

// Tạo model Message từ schema và export
export const Message = mongoose.model("Message", messageSchema);
