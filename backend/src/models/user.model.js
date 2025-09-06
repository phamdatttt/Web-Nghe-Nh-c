import mongoose from "mongoose";

// Định nghĩa schema cho collection User (người dùng)
const userSchema = new mongoose.Schema(
	{
		// Tên đầy đủ của người dùng
		fullName: {
			type: String,
			required: true,
		},
		
		// URL ảnh đại diện
		imageUrl: {
			type: String,
			required: true,
		},
		
		// ID của người dùng từ hệ thống Clerk
		// unique: true - đảm bảo không có 2 người dùng có cùng clerkId
		clerkId: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ timestamps: true } // Tự động thêm createdAt và updatedAt
);

// Tạo model User từ schema và export
export const User = mongoose.model("User", userSchema);
