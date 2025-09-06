import { create } from "zustand";
import { useChatStore } from "./useChatStore";

export const usePlayerStore = create((set, get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: -1,
    isShuffling: false,
    repeatMode: 'OFF', // 'OFF', 'ONE', 'ALL'
    shuffledQueue: [], // Lưu trữ danh sách phát ngẫu nhiên

    toggleShuffle: () => {
        const { isShuffling, queue, currentSong } = get();
        if (!isShuffling) {
            // Bật chế độ phát ngẫu nhiên
            const currentSongIndex = queue.findIndex(song => song._id === currentSong?._id);
            const remainingSongs = [...queue];
            if (currentSongIndex !== -1) {
                remainingSongs.splice(currentSongIndex, 1);
            }
            
            // Trộn ngẫu nhiên các bài hát còn lại
            for (let i = remainingSongs.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [remainingSongs[i], remainingSongs[j]] = [remainingSongs[j], remainingSongs[i]];
            }
            
            // Đặt bài hát hiện tại lên đầu
            const shuffledQueue = currentSong ? [currentSong, ...remainingSongs] : remainingSongs;
            
            set({
                isShuffling: true,
                shuffledQueue,
                currentIndex: 0
            });
        } else {
            // Tắt chế độ phát ngẫu nhiên
            const currentSongIndex = queue.findIndex(song => song._id === currentSong?._id);
            set({
                isShuffling: false,
                shuffledQueue: [],
                currentIndex: currentSongIndex !== -1 ? currentSongIndex : 0
            });
        }
    },

    toggleRepeat: () => {
        set(state => {
            const modes = ['OFF', 'ONE', 'ALL'];
            const currentIndex = modes.indexOf(state.repeatMode);
            const nextIndex = (currentIndex + 1) % modes.length;
            return { repeatMode: modes[nextIndex] };
        });
    },

    initializeQueue: (songs) => {
        set({
            queue: songs,
            currentSong: get().currentSong || songs[0],
            currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
            shuffledQueue: [], // Reset danh sách phát ngẫu nhiên
            isShuffling: false // Reset trạng thái phát ngẫu nhiên
        });
    },

    playAlbum: (songs, startIndex = 0) => {
        if (songs.length === 0) return;

        const song = songs[startIndex];

        const socket = useChatStore.getState().socket;
        if (socket.auth) {
            socket.emit("update_activity", {
                userId: socket.auth.userId,
                activity: `Playing ${song.title} by ${song.artist}`,
            });
        }
        set({
            queue: songs,
            currentSong: song,
            currentIndex: startIndex,
            isPlaying: true,
            shuffledQueue: [], // Reset danh sách phát ngẫu nhiên
            isShuffling: false // Reset trạng thái phát ngẫu nhiên
        });
    },

    setCurrentSong: (song) => {
        if (!song) return;

        const socket = useChatStore.getState().socket;
        if (socket.auth) {
            socket.emit("update_activity", {
                userId: socket.auth.userId,
                activity: `Playing ${song.title} by ${song.artist}`,
            });
        }

        const { isShuffling, queue, shuffledQueue } = get();
        const songIndex = isShuffling 
            ? shuffledQueue.findIndex((s) => s._id === song._id)
            : queue.findIndex((s) => s._id === song._id);

        set({
            currentSong: song,
            isPlaying: true,
            currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
        });
    },

    togglePlay: () => {
        const willStartPlaying = !get().isPlaying;

        const currentSong = get().currentSong;
        const socket = useChatStore.getState().socket;
        if (socket.auth) {
            socket.emit("update_activity", {
                userId: socket.auth.userId,
                activity:
                    willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle",
            });
        }

        set({
            isPlaying: willStartPlaying,
        });
    },

    playNext: () => {
        const { currentIndex, queue, isShuffling, shuffledQueue, repeatMode, currentSong } = get();
        const songs = isShuffling ? shuffledQueue : queue;
        
        // Nếu đang ở chế độ lặp lại 1 bài
        if (repeatMode === 'ONE' && currentSong) {
            const socket = useChatStore.getState().socket;
            if (socket.auth) {
                socket.emit("update_activity", {
                    userId: socket.auth.userId,
                    activity: `Playing ${currentSong.title} by ${currentSong.artist}`,
                });
            }
            // Phát lại bài hiện tại
            set({
                isPlaying: true
            });
            return;
        }

        let nextIndex = currentIndex + 1;

        // Nếu đang ở chế độ lặp lại tất cả và đã hết danh sách
        if (nextIndex >= songs.length && repeatMode === 'ALL') {
            nextIndex = 0;
        }

        // if there is a next song to play, let's play it
        if (nextIndex < songs.length) {
            const nextSong = songs[nextIndex];

            const socket = useChatStore.getState().socket;
            if (socket.auth) {
                socket.emit("update_activity", {
                    userId: socket.auth.userId,
                    activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
                });
            }

            set({
                currentSong: nextSong,
                currentIndex: nextIndex,
                isPlaying: true,
            });
        } else {
            // no next song and not repeating
            set({ isPlaying: false });

            const socket = useChatStore.getState().socket;
            if (socket.auth) {
                socket.emit("update_activity", {
                    userId: socket.auth.userId,
                    activity: `Idle`,
                });
            }
        }
    },

    playPrevious: () => {
        const { currentIndex, queue, isShuffling, shuffledQueue, repeatMode, currentSong } = get();
        const songs = isShuffling ? shuffledQueue : queue;
        
        // Nếu đang ở chế độ lặp lại 1 bài
        if (repeatMode === 'ONE' && currentSong) {
            const socket = useChatStore.getState().socket;
            if (socket.auth) {
                socket.emit("update_activity", {
                    userId: socket.auth.userId,
                    activity: `Playing ${currentSong.title} by ${currentSong.artist}`,
                });
            }
            // Phát lại bài hiện tại
            set({
                isPlaying: true
            });
            return;
        }

        let prevIndex = currentIndex - 1;

        // Nếu đang ở chế độ lặp lại tất cả và đang ở bài đầu tiên
        if (prevIndex < 0 && repeatMode === 'ALL') {
            prevIndex = songs.length - 1;
        }

        // theres a prev song
        if (prevIndex >= 0) {
            const prevSong = songs[prevIndex];

            const socket = useChatStore.getState().socket;
            if (socket.auth) {
                socket.emit("update_activity", {
                    userId: socket.auth.userId,
                    activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
                });
            }

            set({
                currentSong: prevSong,
                currentIndex: prevIndex,
                isPlaying: true,
            });
        } else {
            // no prev song and not repeating
            set({ isPlaying: false });

            const socket = useChatStore.getState().socket;
            if (socket.auth) {
                socket.emit("update_activity", {
                    userId: socket.auth.userId,
                    activity: `Idle`,
                });
            }
        }
    },
}));
