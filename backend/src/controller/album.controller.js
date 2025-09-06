import { Album } from "../models/album.model.js";

// Controller lấy tất cả album
export const getAllAlbums = async (req, res, next) => {
	try {
		// Tìm tất cả album trong database
		const albums = await Album.find();
		res.status(200).json(albums);
	} catch (error) {
		next(error);
	}
};

// Controller lấy thông tin chi tiết của một album theo ID
export const getAlbumById = async (req, res, next) => {
	try {
		const { albumId } = req.params;

		// Tìm album theo ID và populate (lấy thêm thông tin) các bài hát trong album
		const album = await Album.findById(albumId).populate("songs");

		// Nếu không tìm thấy album, trả về lỗi 404
		if (!album) {
			return res.status(404).json({ message: "Album not found" });
		}

		res.status(200).json(album);
	} catch (error) {
		next(error);
	}
};
