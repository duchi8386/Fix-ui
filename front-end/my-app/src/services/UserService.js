import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getUserById = async (id) => {
    try {
        const user = await axios.get(`${API_URL}/users/${id}`);
        return user.data;
    } catch (error) {
        console.log(error);
    }

}