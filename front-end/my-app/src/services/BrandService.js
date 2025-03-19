import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

// Get all brands
export const getBrands = async () => {
    try {
        const response = await axios.get(`${API_URL}/brand`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tải danh sách thương hiệu", error);
        throw error;
    }
};

// Create a new brand
export const createBrand = async (brandData) => {
    try {
        const response = await axios.post(`${API_URL}/brand`, brandData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo thương hiệu", error);
        throw error;
    }
};

// Update an existing brand
export const updateBrand = async (id, brandData) => {
    try {
        const response = await axios.put(`${API_URL}/brand/${id}`, brandData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật thương hiệu", error);
        throw error;
    }
};

// Delete a brand
export const deleteBrand = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/brand/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa thương hiệu", error);
        throw error;
    }
};

