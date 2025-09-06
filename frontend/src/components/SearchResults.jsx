import { usePlayerStore } from "../stores/usePlayerStore";
import { Card } from "./ui/card";
import { PlayCircle } from "lucide-react";

const SearchResults = ({ results, isLoading, onSongSelect }) => {
    const { setCurrentSong } = usePlayerStore();

    const handlePlay = (song) => {
        setCurrentSong(song);
        onSongSelect();
    };

    if (isLoading) {
        return (
            <div className="absolute top-full mt-2 w-full bg-zinc-900 rounded-md border border-zinc-800 shadow-lg max-h-96 overflow-y-auto z-50">
                <div className="p-4">
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-zinc-800 rounded animate-pulse"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse"></div>
                                    <div className="h-3 bg-zinc-800 rounded w-1/2 animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!results?.length) {
        return null;
    }

    return (
        <div className="absolute top-full mt-2 w-full bg-zinc-900 rounded-md border border-zinc-800 shadow-lg max-h-96 overflow-y-auto z-50">
            <div className="p-2">
                {results.map((song) => (
                    <Card
                        key={song._id}
                        className="flex items-center space-x-4 p-2 hover:bg-zinc-800/50 cursor-pointer transition-colors group"
                        onClick={() => handlePlay(song)}
                    >
                        <img
                            src={song.imageUrl}
                            alt={song.title}
                            className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate group-hover:text-white">
                                {song.title}
                            </p>
                            <p className="text-xs text-zinc-400 truncate group-hover:text-zinc-300">
                                {song.artist}
                            </p>
                        </div>
                        <PlayCircle className="w-8 h-8 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SearchResults;
