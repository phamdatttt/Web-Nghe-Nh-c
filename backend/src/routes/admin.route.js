import { Router } from "express";
import { checkAdmin, createAlbum, createSong, deleteAlbum, deleteSong } from "../controller/admin.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Áp dụng middleware bảo vệ cho tất cả routes admin
// Yêu cầu người dùng phải đăng nhập (protectRoute) và phải có quyền admin (requireAdmin)
router.use(protectRoute, requireAdmin);

// Route kiểm tra quyền admin
// GET /api/admin/check
router.get("/check", checkAdmin);

// Routes quản lý bài hát
// POST /api/admin/songs - Tạo bài hát mới
router.post("/songs", createSong);
// DELETE /api/admin/songs/:id - Xóa bài hát theo ID
router.delete("/songs/:id", deleteSong);

// Routes quản lý album
// POST /api/admin/albums - Tạo album mới
router.post("/albums", createAlbum);
// DELETE /api/admin/albums/:id - Xóa album theo ID
router.delete("/albums/:id", deleteAlbum);

export default router;
