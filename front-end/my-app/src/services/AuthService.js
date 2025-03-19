import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async(email, password) => {
    try {
        const res = await axios.post(`${API_URL}/auth/login`, {email, password});
        return res.data;
    } catch (error) {
        console.error(error);
    }
}

export const register = async (user) => {
    try {
        const res = await axios.post(`${API_URL}/auth/register`, user);
        return res.data;
    } catch (error) {
        console.error(error);
    }
}