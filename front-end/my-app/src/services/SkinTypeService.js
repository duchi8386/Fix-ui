import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getSkinTypeList = async () => {
    try {
        const res = await axios.get(`${API_URL}/skin-types`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}