import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const addToCart = async (productId, quantity) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API_URL}/cart/add`, { productId, quantity }, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const getCart = async () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const checkoutWithVNPay = async (orderId, amount) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/cart/vnpay`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.paymentUrl;
};

export const checkoutWithCOD = async () => {
    const response = await axios.post(`${API_URL}/order/cod`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    return response.data;
}

export const removeItemFromCart = async (productId) => {
    return await axios.delete(`${API_URL}/cart/remove`, {
        data: { productId },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
};