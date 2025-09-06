import { clerkClient } from "@clerk/express";

// Middleware bảo vệ route - yêu cầu người dùng phải đăng nhập
export const protectRoute = async (req, res, next) => {
	// Kiểm tra xem có userId trong thông tin xác thực không
	if (!req.auth.userId) {
		// Nếu không có, trả về lỗi 401 Unauthorized
		return res.status(401).json({ message: "Không được phép - bạn phải đăng nhập" });
	}
	// Nếu có userId, cho phép request đi tiếp
	next();
};

// Middleware yêu cầu quyền admin
export const requireAdmin = async (req, res, next) => {
	try {
		// Lấy thông tin người dùng hiện tại từ Clerk
		const currentUser = await clerkClient.users.getUser(req.auth.userId);
		
		// Kiểm tra xem email của người dùng có phải là email admin không
		// So sánh với biến môi trường ADMIN_EMAIL
		const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

		// Nếu không phải admin, trả về lỗi 403 Forbidden
		if (!isAdmin) {
			return res.status(403).json({ message: "Không được phép - bạn phải là quản trị viên" });
		}

		// Nếu là admin, cho phép request đi tiếp
		next();
	} catch (error) {
		// Nếu có lỗi, chuyển đến middleware xử lý lỗi
		next(error);
	}
};
