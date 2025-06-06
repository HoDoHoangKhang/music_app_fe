import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/music";

const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const isAuthenticated = () => {
    const token = localStorage.getItem("access_token");
    return !!token;
};

// Toggle like/unlike cho bài hát
export const toggleSongLike = async (songId) => {
    if (!songId || !isAuthenticated()) {
        console.warn("Chưa đăng nhập! Không thể like/unlike bài hát.");
        return null;
    }

    try {
        const response = await axios.post(
            `${API_BASE_URL}/songs/${songId}/like-toggle/`,
            {},
            { headers: getAuthHeaders() }
        );
        console.log(`${songId} ${response.data}`);
        return response.data;
    } catch (error) {
        console.error("Error toggling song like:", error);
        return null;
    }
};

// Toggle like/unlike cho album
export const toggleAlbumLike = async (albumId) => {
    if (!albumId || !isAuthenticated()) {
        console.warn("Chưa đăng nhập! Không thể like/unlike album.");
        return null;
    }

    try {
        const response = await axios.post(
            `${API_BASE_URL}/albums/${albumId}/like-toggle/`,
            {},
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error("Error toggling album like:", error);
        return null;
    }
};

// Kiểm tra trạng thái like của bài hát
export const checkSongLikeStatus = async (songId) => {
    if (!songId || !isAuthenticated()) {
        console.warn(
            "Chưa đăng nhập! Không thể kiểm tra trạng thái like bài hát."
        );
        return false;
    }

    try {
        const response = await axios.get(
            `${API_BASE_URL}/likes/check/song/${songId}/`,
            { headers: getAuthHeaders() }
        );
        return response.data.liked;
    } catch (error) {
        console.error("Error checking song like status:", error);
        return false;
    }
};

// Kiểm tra trạng thái like của album
export const checkAlbumLikeStatus = async (albumId) => {
    if (!albumId || !isAuthenticated()) {
        console.warn(
            "Chưa đăng nhập! Không thể kiểm tra trạng thái like album."
        );
        return false;
    }

    try {
        const response = await axios.get(
            `${API_BASE_URL}/likes/check/album/${albumId}/`,
            { headers: getAuthHeaders() }
        );
        return response.data.liked;
    } catch (error) {
        console.error("Error checking album like status:", error);
        return false;
    }
};

// Lấy toàn bộ playlists của user
export const getUserPlaylist = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/my-playlists/`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            console.warn("Chưa đăng nhập! Không thể lấy danh sách playlist.");
            return false;
        }
        console.error("Error get user playlist:", error);
        return false;
    }
};

// Lấy 1 playlist theo id của user
export const getUserPlaylistDetail = async (playlistId) => {
    if (!playlistId) return false;

    try {
        const response = await axios.get(
            `${API_BASE_URL}/my-playlists/${playlistId}/`,
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            console.warn("Chưa đăng nhập! Không thể lấy chi tiết playlist.");
            return false;
        }
        console.error("Error get user playlist detail:", error);
        return false;
    }
};

// Tạo playlist mới và thêm bài hát vào playlist
export const createPlaylist = async (name, songId) => {
    try {
        // 1. Tạo playlist mới
        const response = await axios.post(
            `${API_BASE_URL}/playlists/`,
            { name: name },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(
                        "access_token"
                    )}`,
                },
            }
        );
        const playlist = response.data;

        // 2. Thêm bài hát vào playlist vừa tạo

        if (songId) {
            await addSongToPlaylist(playlist.id, songId);
        }
        return playlist;
    } catch (error) {
        console.error(
            "Error creating playlist:",
            error.response?.data || error
        );
        throw error;
    }
};

// Tạo playlist mới rỗng
export const createEmptyPlaylist = async (name) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/playlists/`,
            { name: name },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(
                        "access_token"
                    )}`,
                },
            }
        );
        const playlist = response.data;

        return playlist;
    } catch (error) {
        console.error(
            "Error creating playlist:",
            error.response?.data || error
        );
        throw error;
    }
};

// Thêm bài hát vào playlist
export const addSongToPlaylist = async (playlistId, songId) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/playlists/${playlistId}/songs/${songId}/`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(
                        "access_token"
                    )}`,
                },
            }
        );
        return response.data; // hoặc return true nếu không cần dữ liệu trả về
    } catch (error) {
        console.error(
            "Error adding song to playlist:",
            error.response?.data || error
        );
        throw error;
    }
};

// Lấy danh sách playlist của user đang đăng nhập
export const getCurrentUserPlaylists = async () => {
    if (!isAuthenticated()) {
        console.warn("Chưa đăng nhập! Không thể lấy danh sách playlist.");
        return null;
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/me/playlists/`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Error getting current user playlists:", error);
        return null;
    }
};

// Lấy chi tiết playlist theo ID
export const getPlaylistDetail = async (playlistId) => {
    if (!playlistId) {
        console.warn("Playlist ID không hợp lệ!");
        return null;
    }

    try {
        const response = await axios.get(
            `${API_BASE_URL}/playlists/${playlistId}/`,
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error("Error getting playlist detail:", error);
        return null;
    }
};

// Cập nhật thông tin playlist
export const updatePlaylist = async (playlistId, formData) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/playlists/${playlistId}/`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem(
                        "access_token"
                    )}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(
            "Error updating playlist:",
            error.response?.data || error
        );
        throw error;
    }
};
export const getLikedAlbums = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/albums/liked/`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            console.warn(
                "Chưa đăng nhập! Không thể lấy danh sách album yêu thích."
            );
            return null;
        }
        console.error("Error fetching liked albums:", error);
        return null;
    }
};

// Lấy danh sách tất cả video
export const getAllVideos = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/videos/`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching videos:", error);
        return null;
    }
};

// Lấy chi tiết một video theo ID
export const getVideoDetail = async (videoId) => {
    if (!videoId) {
        console.warn("Video ID không hợp lệ!");
        return null;
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/videos/${videoId}/`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching video detail:", error);
        return null;
    }
};

// Xóa video
export const deleteVideo = async (videoId) => {
    try {
        await axios.delete(`${API_BASE_URL}/videos/${videoId}/`, {
            headers: getAuthHeaders(),
        });
        return true;
    } catch (error) {
        console.error("Error deleting video:", error);
        return false;
    }
};

// Tăng số lượt xem của video
export const incrementVideoViews = async (videoId) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/videos/${videoId}/increment_views/`,
            {},
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error("Error incrementing video views:", error);
        return null;
    }
};
