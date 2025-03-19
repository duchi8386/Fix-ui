import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

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

export const createBrand = async (brandData) => {
    try {
        const response = await axios.post(`${API_URL}/brand`, brandData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error");
        throw error;
    }
}
