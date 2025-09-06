import { Router } from "express";
import { getAllSongs, getFeaturedSongs, getMadeForYouSongs, getTrendingSongs, searchSongs, getMoreSongs } from "../controller/song.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Route tìm kiếm bài hát
// GET /api/songs/search?query=<search_term>
router.get("/search", searchSongs);

// Route lấy tất cả bài hát (chỉ admin mới có quyền truy cập)
// GET /api/songs
router.get("/", protectRoute, requireAdmin, getAllSongs);

// Route lấy các bài hát nổi bật
// GET /api/songs/featured
// Trả về 6 bài hát ngẫu nhiên
router.get("/featured", getFeaturedSongs);

// Route lấy các bài hát được đề xuất cho người dùng
// GET /api/songs/made-for-you
// Trả về 4 bài hát ngẫu nhiên
router.get("/made-for-you", getMadeForYouSongs);

// Route lấy các bài hát đang thịnh hành
// GET /api/songs/trending
// Trả về 4 bài hát ngẫu nhiên
router.get("/trending", getTrendingSongs);

// Route lấy thêm bài hát
// GET /api/songs/more
// Trả về 12 bài hát ngẫu nhiên
router.get("/more", getMoreSongs);

export default router;
