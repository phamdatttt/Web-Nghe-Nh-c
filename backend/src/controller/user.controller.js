import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

// Controller lấy danh sách tất cả người dùng (trừ người dùng hiện tại)
export const getAllUsers = async (req, res, next) => {
	try {
		// Lấy ID người dùng hiện tại từ thông tin xác thực
		const currentUserId = req.auth.userId;
		
		// Tìm tất cả người dùng trừ người dùng hiện tại
		// $ne: not equal - không bằng với currentUserId
		const users = await User.find({ clerkId: { $ne: currentUserId } });
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

// Controller lấy tin nhắn giữa người dùng hiện tại và một người dùng khác
export const getMessages = async (req, res, next) => {
	try {
		// Lấy ID người dùng hiện tại
		const myId = req.auth.userId;
		// Lấy ID người dùng đối thoại từ params
		const { userId } = req.params;

		// Tìm tất cả tin nhắn giữa 2 người dùng
		const messages = await Message.find({
			// $or: tìm tin nhắn thỏa mãn một trong hai điều kiện
			$or: [
				{ senderId: userId, receiverId: myId },     // Tin nhắn từ người kia gửi đến mình
				{ senderId: myId, receiverId: userId },     // Tin nhắn từ mình gửi đến người kia
			],
		}).sort({ createdAt: 1 }); // Sắp xếp theo thời gian tạo tăng dần

		res.status(200).json(messages);
	} catch (error) {
		next(error);
	}
};
