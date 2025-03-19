import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getOrderListByUser = async () => {
    try {
        const res = await axios.get(`${API_URL}/order`,
            {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}}
        );
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export const cancelOrder = async (orderId) => {
    try {
        const res = await axios.put(`${API_URL}/order/${orderId}/cancel`, {},
            {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export const changeStatusOrder = async (orderId, status) => {
    try {
        const res = axios.put(`${API_URL}/order/${orderId}/change-status`, { status },
            {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
        return res;
    } catch (error) {
        console.log(error);
    }
}

export const getOrderListByAdmin = async (status, page = 1, limit = 10) => {
    try {
        const params = {status, page, limit};
        const res = axios.get(`${API_URL}/order/get-all-orders`,{
            params,
            headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
        });

        return res;
    } catch (error) {
        console.log(error);
    }

}