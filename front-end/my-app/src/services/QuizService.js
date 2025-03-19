import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Hàm lấy token từ localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getQuiz = async () => {
    try {
        const res = await axios.get(`${API_URL}/quiz/questions`, {
            headers: getAuthHeaders(),
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const submitQuiz = async (quizData) => {
    try {
        const res = await axios.post(`${API_URL}/quiz/submit`, quizData, {
            headers: getAuthHeaders(),
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
