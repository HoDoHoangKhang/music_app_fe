import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/music";

const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Toggle like/unlike cho bài hát
export const toggleSongLike = async (songId) => {
    if (!songId) return null;

    try {
        const response = await axios.post(
            `${API_BASE_URL}/songs/${songId}/like-toggle/`,
            {},
            { headers: getAuthHeaders() }
        );
        console.log(`${songId} ${response.data}`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            console.warn("Chưa đăng nhập! Không thể like/unlike bài hát.");
            return null;
        }
        console.error("Error toggling song like:", error);
        return null;
    }
};

// Toggle like/unlike cho album
export const toggleAlbumLike = async (albumId) => {
    if (!albumId) return null;

    try {
        const response = await axios.post(
            `${API_BASE_URL}/albums/${albumId}/like-toggle/`,
            {},
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            console.warn("Chưa đăng nhập! Không thể like/unlike album.");
            return null;
        }
        console.error("Error toggling album like:", error);
        return null;
    }
};

// Kiểm tra trạng thái like của bài hát
export const checkSongLikeStatus = async (songId) => {
    if (!songId) return false;

    try {
        const response = await axios.get(
            `${API_BASE_URL}/likes/check/song/${songId}/`,
            { headers: getAuthHeaders() }
        );
        return response.data.liked;
    } catch (error) {
        if (error.response?.status === 401) {
            console.warn(
                "Chưa đăng nhập! Không thể kiểm tra trạng thái like bài hát."
            );
            return false;
        }
        console.error("Error checking song like status:", error);
        return false;
    }
};

// Kiểm tra trạng thái like của album
export const checkAlbumLikeStatus = async (albumId) => {
    if (!albumId) return false;

    try {
        const response = await axios.get(
            `${API_BASE_URL}/likes/check/album/${albumId}/`,
            { headers: getAuthHeaders() }
        );
        return response.data.liked;
    } catch (error) {
        if (error.response?.status === 401) {
            console.warn(
                "Chưa đăng nhập! Không thể kiểm tra trạng thái like album."
            );
            return false;
        }
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
