import { Router } from "express";
import { authCallback } from "../controller/auth.controller.js";

const router = Router();

// Route xử lý callback sau khi xác thực từ Clerk
// POST /api/auth/callback
// Được gọi sau khi người dùng đăng nhập/đăng ký thành công qua Clerk
// để lưu thông tin người dùng vào database của ứng dụng
router.post("/callback", authCallback);

export default router;
