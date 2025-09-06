import mongoose from "mongoose";

// Hàm kết nối đến MongoDB
export const connectDB = async () => {
	try {
		// Thực hiện kết nối đến MongoDB sử dụng URI từ biến môi trường
		const conn = await mongoose.connect(process.env.MONGODB_URI);
		
		// In thông báo kết nối thành công và tên host của database
		console.log(`Connected to MongoDB ${conn.connection.host}`);
	} catch (error) {
		// Xử lý lỗi kết nối
		console.log("Failed to connect to MongoDB", error);
		// Thoát ứng dụng với mã lỗi 1 (1 là thất bại, 0 là thành công)
		process.exit(1);
	}
};
