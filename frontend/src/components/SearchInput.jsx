import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useMusicStore } from "../stores/useMusicStore";
import SearchResults from "./SearchResults";
import { useDebounce } from "../hooks/useDebounce";

const SearchInput = ({ placeholder = "Tìm kiếm theo tên bài hát hoặc nghệ sĩ..." }) => {
    const [query, setQuery] = useState("");
    const [showResults, setShowResults] = useState(false);
    const { searchSongs, searchResults, isLoading } = useMusicStore();
    const debouncedQuery = useDebounce(query, 300); // Giảm thời gian debounce để kết quả hiện nhanh hơn

    useEffect(() => {
        if (debouncedQuery) {
            searchSongs(debouncedQuery);
            setShowResults(true);
        }
    }, [debouncedQuery, searchSongs]);

    const handleSongSelect = () => {
        setQuery(""); // Xóa nội dung tìm kiếm
        setShowResults(false); // Ẩn danh sách kết quả
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        if (!value.trim()) {
            setShowResults(false);
        } else {
            setShowResults(true);
        }
    };

    return (
        <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
                value={query}
                onChange={handleInputChange}
                className="pl-10 bg-zinc-800 border-zinc-700 transition-all duration-200"
                placeholder={placeholder}
            />
            {showResults && (query || isLoading || searchResults.length > 0) && (
                <SearchResults 
                    results={searchResults} 
                    isLoading={isLoading && query} 
                    onSongSelect={handleSongSelect}
                />
            )}
        </div>
    );
};

export default SearchInput;
