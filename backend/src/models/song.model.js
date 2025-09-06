import mongoose from "mongoose";

// Định nghĩa schema cho collection Song (bài hát)
const songSchema = new mongoose.Schema(
	{
		// Tên bài hát
		title: {
			type: String,
			required: true,
		},
		
		// Tên nghệ sĩ
		artist: {
			type: String,
			required: true,
		},
		
		// URL ảnh bìa bài hát
		imageUrl: {
			type: String,
			required: true,
		},
		
		// URL file âm thanh
		audioUrl: {
			type: String,
			required: true,
		},
		
		// Thời lượng bài hát (tính bằng giây)
		duration: {
			type: Number,
			required: true,
		},
		
		// ID của album chứa bài hát (nếu có)
		// Tham chiếu đến model Album
		// required: false - không bắt buộc (bài hát có thể không thuộc album nào)
		albumId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Album",
			required: false,
		},
	},
	{ timestamps: true } // Tự động thêm createdAt và updatedAt
);

// Tạo model Song từ schema và export
export const Song = mongoose.model("Song", songSchema);
