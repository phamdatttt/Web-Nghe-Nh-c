import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllUsers, getMessages } from "../controller/user.controller.js";
const router = Router();

// Route lấy danh sách tất cả người dùng (trừ người dùng hiện tại)
// GET /api/users
// Yêu cầu đăng nhập (protectRoute)
router.get("/", protectRoute, getAllUsers);

// Route lấy tin nhắn giữa người dùng hiện tại và một người dùng khác
// GET /api/users/messages/:userId
// - userId: ID của người dùng muốn xem tin nhắn
// Yêu cầu đăng nhập (protectRoute)
router.get("/messages/:userId", protectRoute, getMessages);

export default router;
