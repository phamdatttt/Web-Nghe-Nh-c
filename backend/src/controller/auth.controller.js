import { User } from "../models/user.model.js";

// Controller xử lý callback sau khi xác thực từ Clerk
export const authCallback = async (req, res, next) => {
	try {
		// Lấy thông tin người dùng từ request body được gửi từ Clerk
		const { id, firstName, lastName, imageUrl } = req.body;

		// Kiểm tra xem người dùng đã tồn tại trong database chưa
		const user = await User.findOne({ clerkId: id });

		if (!user) {
			// Nếu chưa tồn tại, tạo người dùng mới
			await User.create({
				clerkId: id, // ID từ Clerk
				fullName: `${firstName || ""} ${lastName || ""}`.trim(), // Tạo tên đầy đủ từ firstName và lastName
				imageUrl, // URL ảnh đại diện
			});
		}

		// Trả về phản hồi thành công
		res.status(200).json({ success: true });
	} catch (error) {
		console.log("Error in auth callback", error);
		next(error);
	}
};
