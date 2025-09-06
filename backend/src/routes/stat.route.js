import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { getStats } from "../controller/stat.controller.js";

const router = Router();

// Route lấy thống kê tổng quan của hệ thống (chỉ admin mới có quyền truy cập)
// GET /api/stats
// Trả về các thông số:
// - Tổng số album
// - Tổng số bài hát
// - Tổng số người dùng
// - Tổng số nghệ sĩ duy nhất
router.get("/", protectRoute, requireAdmin, getStats);

export default router;
