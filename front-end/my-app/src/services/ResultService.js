import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getQuizResult = async () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/result`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};