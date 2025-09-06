import { Song } from "../models/song.model.js";

// Controller tìm kiếm bài hát theo tên hoặc nghệ sĩ
// Controller lấy thêm bài hát
export const getMoreSongs = async (req, res, next) => {
    try {
        // Lấy 12 bài hát ngẫu nhiên
        const songs = await Song.aggregate([
            { $sample: { size: 12 } },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                    duration: 1
                }
            }
        ]);
        res.json(songs);
    } catch (error) {
        next(error);
    }
};

export const searchSongs = async (req, res, next) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.json([]);
        }

        // Tìm kiếm bài hát với title hoặc artist chứa query (case insensitive)
        const songs = await Song.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { artist: { $regex: query, $options: 'i' } }
            ]
        }).limit(10);

        res.json(songs);
    } catch (error) {
        next(error);
    }
};

// Controller lấy tất cả bài hát
export const getAllSongs = async (req, res, next) => {
	try {
		// Lấy tất cả bài hát và sắp xếp theo thời gian tạo
		// -1 = Giảm dần => mới nhất -> cũ nhất
		// 1 = Tăng dần => cũ nhất -> mới nhất
		const songs = await Song.find().sort({ createdAt: -1 });
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

// Controller lấy các bài hát nổi bật
export const getFeaturedSongs = async (req, res, next) => {
	try {
		// Lấy ngẫu nhiên 6 bài hát sử dụng MongoDB aggregation pipeline
		const songs = await Song.aggregate([
			{
				// Lấy mẫu ngẫu nhiên 6 bài hát
				$sample: { size: 6 },
			},
			{
				// Chỉ lấy các trường cần thiết
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.json(songs);
	} catch (error) {
		next(error);
	}
};

// Controller lấy các bài hát được đề xuất cho người dùng
export const getMadeForYouSongs = async (req, res, next) => {
    try {
        // Lấy ngẫu nhiên 12 bài hát cho Made For You
        const songs = await Song.aggregate([
            {
                $sample: { size: 12 },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                    duration: 1
                },
            },
        ]);

        res.json(songs);
    } catch (error) {
        next(error);
    }
};

// Controller lấy các bài hát đang thịnh hành
export const getTrendingSongs = async (req, res, next) => {
    try {
        // Lấy ngẫu nhiên 12 bài hát cho Trending
        const songs = await Song.aggregate([
            {
                $sample: { size: 12 },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                    duration: 1
                },
            },
        ]);

        res.json(songs);
    } catch (error) {
        next(error);
    }
};
