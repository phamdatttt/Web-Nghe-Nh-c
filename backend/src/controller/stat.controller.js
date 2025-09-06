import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";

// Controller lấy thống kê tổng quan của hệ thống
export const getStats = async (req, res, next) => {
	try {
		// Sử dụng Promise.all để thực hiện đồng thời nhiều truy vấn
		const [totalSongs, totalAlbums, totalUsers, uniqueArtists] = await Promise.all([
			// Đếm tổng số bài hát
			Song.countDocuments(),
			// Đếm tổng số album
			Album.countDocuments(),
			// Đếm tổng số người dùng
			User.countDocuments(),

			// Đếm số nghệ sĩ duy nhất bằng cách aggregate
			Song.aggregate([
				{
					// Kết hợp dữ liệu từ collection albums
					$unionWith: {
						coll: "albums",
						pipeline: [],
					},
				},
				{
					// Nhóm theo tên nghệ sĩ
					$group: {
						_id: "$artist",
					},
				},
				{
					// Đếm số lượng nhóm (số nghệ sĩ duy nhất)
					$count: "count",
				},
			]),
		]);

		// Trả về kết quả thống kê
		res.status(200).json({
			totalAlbums,      // Tổng số album
			totalSongs,       // Tổng số bài hát
			totalUsers,       // Tổng số người dùng
			totalArtists: uniqueArtists[0]?.count || 0,  // Tổng số nghệ sĩ duy nhất
		});
	} catch (error) {
		next(error);
	}
};
