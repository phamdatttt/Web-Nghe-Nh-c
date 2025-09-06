import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";

// Hàm hỗ trợ upload file lên Cloudinary
const uploadToCloudinary = async (file) => {
	try {
		const result = await cloudinary.uploader.upload(file.tempFilePath, {
			resource_type: "auto",
		});
		return result.secure_url;
	} catch (error) {
		console.log("Error in uploadToCloudinary", error);
		throw new Error("Error uploading to cloudinary");
	}
};

// Controller tạo bài hát mới
export const createSong = async (req, res, next) => {
	try {
		// Kiểm tra xem đã upload đủ file audio và ảnh chưa
		if (!req.files || !req.files.audioFile || !req.files.imageFile) {
			return res.status(400).json({ message: "Please upload all files" });
		}

		const { title, artist, albumId, duration } = req.body;
		const audioFile = req.files.audioFile;
		const imageFile = req.files.imageFile;

		// Upload file lên Cloudinary
		const audioUrl = await uploadToCloudinary(audioFile);
		const imageUrl = await uploadToCloudinary(imageFile);

		// Tạo đối tượng bài hát mới
		const song = new Song({
			title,
			artist, 
			audioUrl,
			imageUrl,
			duration,
			albumId: albumId || null,
		});

		await song.save();

		// Nếu bài hát thuộc về album nào đó, cập nhật mảng songs của album đó
		if (albumId) {
			await Album.findByIdAndUpdate(albumId, {
				$push: { songs: song._id },
			});
		}
		res.status(201).json(song);
	} catch (error) {
		console.log("Error in createSong", error);
		next(error);
	}
};

// Controller xóa bài hát
export const deleteSong = async (req, res, next) => {
	try {
		const { id } = req.params;

		const song = await Song.findById(id);

		// Nếu bài hát thuộc về album, cập nhật mảng songs của album đó
		if (song.albumId) {
			await Album.findByIdAndUpdate(song.albumId, {
				$pull: { songs: song._id },
			});
		}

		await Song.findByIdAndDelete(id);

		res.status(200).json({ message: "Song deleted successfully" });
	} catch (error) {
		console.log("Error in deleteSong", error);
		next(error);
	}
};

// Controller tạo album mới
export const createAlbum = async (req, res, next) => {
	try {
		const { title, artist, releaseYear } = req.body;
		const { imageFile } = req.files;

		// Upload ảnh album lên Cloudinary
		const imageUrl = await uploadToCloudinary(imageFile);

		// Tạo đối tượng album mới
		const album = new Album({
			title,
			artist,
			imageUrl,
			releaseYear,
		});

		await album.save();

		res.status(201).json(album);
	} catch (error) {
		console.log("Error in createAlbum", error);
		next(error);
	}
};

// Controller xóa album
export const deleteAlbum = async (req, res, next) => {
	try {
		const { id } = req.params;
		// Xóa tất cả bài hát thuộc album này
		await Song.deleteMany({ albumId: id });
		// Xóa album
		await Album.findByIdAndDelete(id);
		res.status(200).json({ message: "Album deleted successfully" });
	} catch (error) {
		console.log("Error in deleteAlbum", error);
		next(error);
	}
};

// Controller kiểm tra quyền admin
export const checkAdmin = async (req, res, next) => {
	res.status(200).json({ admin: true });
};
