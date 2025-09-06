import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Cấu hình biến môi trường
dotenv.config();

// Cấu hình Cloudinary - dịch vụ lưu trữ file đám mây
// Sử dụng các biến môi trường từ file .env:
// - CLOUDINARY_CLOUD_NAME: Tên cloud của tài khoản
// - CLOUDINARY_API_KEY: Khóa API để xác thực
// - CLOUDINARY_API_SECRET: Khóa bí mật để xác thực
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Export instance cloudinary đã được cấu hình để sử dụng trong ứng dụng
export default cloudinary;
