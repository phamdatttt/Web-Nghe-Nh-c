import { useState } from 'react';
import SectionGridSkeleton from "./SectionGridSkeleton";
import { Button } from "@/components/ui/button";
import PlayButton from "./PlayButton";

const SectionGrid = ({ songs, title, isLoading }) => {
    const [showingMore, setShowingMore] = useState(false);

    // Hiển thị 4 bài đầu hoặc tất cả tùy thuộc vào trạng thái
    const displayedSongs = showingMore ? songs : songs.slice(0, 4);

    const handleToggleView = () => {
        setShowingMore(!showingMore);
    };

    if (isLoading) return <SectionGridSkeleton />;

    // Chỉ hiện nút khi có nhiều hơn 4 bài hát
    const showButton = songs.length > 4;

    return (
        <div className='mb-8'>
            <div className='flex items-center justify-between mb-4'>
                <h2 className='text-xl sm:text-2xl font-bold'>{title}</h2>
                {showButton && (
                    <Button 
                        variant='link' 
                        className='text-sm text-zinc-400 hover:text-white'
                        onClick={handleToggleView}
                    >
                        {showingMore ? 'Thu gọn' : 'Xem thêm'}
                    </Button>
                )}
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                {displayedSongs.map((song) => (
                    <div
                        key={song._id}
                        className='bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer'
                    >
                        <div className='relative mb-4'>
                            <div className='aspect-square rounded-md shadow-lg overflow-hidden'>
                                <img
                                    src={song.imageUrl}
                                    alt={song.title}
                                    className='w-full h-full object-cover transition-transform duration-300 
                                    group-hover:scale-105'
                                />
                            </div>
                            <PlayButton song={song} />
                        </div>
                        <h3 className='font-medium mb-2 truncate'>{song.title}</h3>
                        <p className='text-sm text-zinc-400 truncate'>{song.artist}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SectionGrid;
