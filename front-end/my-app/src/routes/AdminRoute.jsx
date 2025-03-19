import { Navigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";

const AdminRoute = ({ element }) => {
    const {user} = useAuth();
    console.log(user.role);
    return user?.role === "ADMIN" ? element : <Navigate to="/forbidden" replace />;
};

export default AdminRoute;
