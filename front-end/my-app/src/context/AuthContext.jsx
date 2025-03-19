import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import {getUserById} from "../services/UserService.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            const userId = decoded.userId;
            setRole(decoded.role);
            fetchUserInfo(userId);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserInfo = async (userId) => {
        try {
            const response = await getUserById(userId);
            setUser(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
        } finally {
            setLoading(false);
        }
    };

    const loginUser = async (token) => {
        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        fetchUserInfo(decoded.userId);
    };

    const logoutUser = () => {
        localStorage.removeItem("token");
        setUser(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ user, role, loginUser, logoutUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
