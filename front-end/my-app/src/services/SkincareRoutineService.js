import axios from "axios";

const API_BASE_URL = "http://localhost:9999";

const getAuthToken = () => {
    return localStorage.getItem("token");
};

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const getSkincareRoutines = async () => {
    const response = await axiosInstance.get(`/skincare-routine`);
    return response.data;
};

export const addProductToStep = async (routineId, stepNumber, productId) => {
    const response = await axiosInstance.put(`/skincare-routine/${routineId}/steps/${stepNumber}`, {
        productId
    });
    return response.data;
};
