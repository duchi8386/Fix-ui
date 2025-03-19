import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getReviewsByProductId = async (productId) => {
    return await axios.get(`${API_URL}/reviews/product/${productId}`);
};

export const createReview = async (reviewData) => {
    return await axios.post(`${API_URL}/reviews`, reviewData, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Nếu có xác thực
        },
    });
};
