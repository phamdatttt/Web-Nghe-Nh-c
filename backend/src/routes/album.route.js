import { Router } from "express";
import { getAlbumById, getAllAlbums } from "../controller/album.controller.js";

const router = Router();

// Route lấy tất cả album
// GET /api/albums
router.get("/", getAllAlbums);

// Route lấy thông tin chi tiết của một album theo ID
// GET /api/albums/:albumId
router.get("/:albumId", getAlbumById);

export default router;
