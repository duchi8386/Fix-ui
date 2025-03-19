import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProductList from "./ProductList.jsx";
import { Footer } from "../components/Footer.jsx";
import { Header } from "../components/Header.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import { ProductManagement } from "./admin/ProductManagement.jsx";
import { AddProductForm } from "./admin/ProductForm.jsx";
import Forbidden from "./Forbidden.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Home.jsx";
import QuizPage from "./QuizPage.jsx";
import SkincareResult from "./SkincareResult.jsx";
import Cart from "./Cart.jsx";
import OrderList from "./OrderList.jsx";
import PaymentResult from "./PaymentResult.jsx";
import SkincareRoutineManagement from "./admin/SkincareRoutineManagement.jsx";
import { EditProductForm } from "./admin/EditProductForm.jsx";
import ProductDetail from "./ProductDetail.jsx";
import { BrandManagement } from "./admin/BrandManagement.jsx";
import Policy from "./Policy.jsx";
import OrderManagement from "./admin/OrderManagement.jsx";
import ReviewList from "./admin/ReviewList.jsx";
import UserManagement from "./admin/UserManagement.jsx";

const Layout = () => {
    const { role } = useAuth();

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <ToastContainer position="top-right" autoClose={3000} />
            <Header />
            <div className="flex-grow flex justify-center w-full">
                <main className="w-full px-4 py-6 md:py-8 lg:py-10 max-w-5xl mx-auto">
                    <Routes>
                        {/* Admin routes with role checking */}
                        <Route
                            path="/admin/products/new"
                            element={
                                role === null
                                    ? <div className="flex items-center justify-center p-8"><div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>
                                    : role === "ADMIN"
                                        ? <AddProductForm />
                                        : <Navigate to="/forbidden" replace />
                            }
                        />
                        <Route
                            path="/admin/products"
                            element={
                                role === null
                                    ? <div className="flex items-center justify-center p-8"><div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>
                                    : role === "ADMIN"
                                        ? <ProductManagement />
                                        : <Navigate to="/forbidden" replace />
                            }
                        />
                        <Route
                            path="/admin/skincare-routine"
                            element={
                                role === null
                                    ? <div className="flex items-center justify-center p-8"><div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>
                                    : role === "ADMIN"
                                        ? <SkincareRoutineManagement />
                                        : <Navigate to="/forbidden" replace />
                            }
                        />
                        {/* Other admin routes */}
                        <Route path="/admin/products/:productId/edit" element={<EditProductForm isViewOnly={false} />} />
                        <Route path="/admin/products/:productId/view" element={<EditProductForm isViewOnly={true} />} />
                        <Route path="/admin/brands" element={<BrandManagement />} />
                        <Route path="/admin/orders" element={<OrderManagement />} />
                        <Route path="/admin/reviews" element={<ReviewList />} />
                        <Route path="/admin/users" element={<UserManagement />} />

                        {/* Public routes */}
                        <Route path="/skincare-result" element={<SkincareResult />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/quiz" element={<QuizPage />} />
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/forbidden" element={<Forbidden />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/orders" element={<OrderList />} />
                        <Route path="/payment-result" element={<PaymentResult />} />
                        <Route path="/policy" element={<Policy />}></Route>
                    </Routes>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
