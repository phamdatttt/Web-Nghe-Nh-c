import mongoose from "mongoose";

// Định nghĩa schema cho collection Album
const albumSchema = new mongoose.Schema(
	{
		// Tên album
		title: { type: String, required: true },
		
		// Tên nghệ sĩ
		artist: { type: String, required: true },
		
		// URL ảnh bìa album
		imageUrl: { type: String, required: true },
		
		// Năm phát hành
		releaseYear: { type: Number, required: true },
		
		// Mảng các ID bài hát trong album
		// Tham chiếu đến model Song
		songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
	},
	{ timestamps: true } // Tự động thêm createdAt và updatedAt
);

// Tạo model Album từ schema và export
export const Album = mongoose.model("Album", albumSchema);
