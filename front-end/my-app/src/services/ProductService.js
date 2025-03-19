import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

export const getProductList = async ({ category = "", skinType = "", page = 1, limit = 8 }) => {
    try {
        const res = await axios.get(`${API_URL}/products`, {
            params: { category, skinType, page, limit },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};


export const getProductListForUser = async ({ category = "", skinType = "", page = 1, limit = 8 }) => {
    try {
        const res = await axios.get(`${API_URL}/products/product-list/active`, {
            params: { category, skinType, page, limit }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};


export const createProduct = async (createProductRequest) => {
    try {
        const res = await axios.post(`${API_URL}/products`, createProductRequest, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (error) {
        console.error(error);
    }
};

export const updateProduct = async (id, updateProductRequest) => {
    try {
        const res = await axios.put(`${API_URL}/products/${id}`, updateProductRequest, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (error) {
        console.error(error);
    }
};

export const getProductDetail = async (id) => {
    try {
        const res = await axios.get(`${API_URL}/products/${id}`);
        return res.data;
    } catch (error) {
        console.error(error);
    }
}

export const changeStatusProduct = async (id) => {
    try {
        const response = await axios.patch(`${API_URL}/products/${id}/status`,{},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
        } 
    });
        return response.data;
    } catch(error){
        console.log(error);
    }
}