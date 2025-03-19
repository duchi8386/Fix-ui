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
import { Toaster } from "react-hot-toast";
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
import { motion, AnimatePresence } from "framer-motion";

const Layout = () => {
    const { role } = useAuth();

    // Page transition variants
    const pageVariants = {
        initial: { opacity: 0 },
        in: { opacity: 1 },
        out: { opacity: 0 },
    };

    // Loading spinner component
    const LoadingSpinner = () => (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative">
                <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
                <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin absolute top-2 left-2"></div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: { icon: '✅' },
                    error: { icon: '❌' },
                }}
            />
            <Header />
            <div className="flex-grow flex justify-center w-full">
                <main className="w-full px-4 py-6 md:py-8 lg:py-10 max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        <Routes>
                            {/* Admin routes with role checking */}
                            <Route
                                path="/admin/products/new"
                                element={
                                    role === null
                                        ? <LoadingSpinner />
                                        : role === "ADMIN"
                                            ? <motion.div
                                                key="add-product"
                                                initial="initial"
                                                animate="in"
                                                exit="out"
                                                variants={pageVariants}
                                                transition={{ type: "tween" }}
                                            >
                                                <AddProductForm />
                                            </motion.div>
                                            : <Navigate to="/forbidden" replace />
                                }
                            />
                            <Route
                                path="/admin/products"
                                element={
                                    role === null
                                        ? <LoadingSpinner />
                                        : role === "ADMIN"
                                            ? <motion.div
                                                key="product-management"
                                                initial="initial"
                                                animate="in"
                                                exit="out"
                                                variants={pageVariants}
                                                transition={{ type: "tween" }}
                                            >
                                                <ProductManagement />
                                            </motion.div>
                                            : <Navigate to="/forbidden" replace />
                                }
                            />
                            <Route
                                path="/admin/skincare-routine"
                                element={
                                    role === null
                                        ? <LoadingSpinner />
                                        : role === "ADMIN"
                                            ? <motion.div
                                                key="skincare-routine"
                                                initial="initial"
                                                animate="in"
                                                exit="out"
                                                variants={pageVariants}
                                                transition={{ type: "tween" }}
                                            >
                                                <SkincareRoutineManagement />
                                            </motion.div>
                                            : <Navigate to="/forbidden" replace />
                                }
                            />
                            {/* Other routes with motion transitions */}
                            <Route path="/admin/products/:productId/edit" element={<EditProductForm isViewOnly={false} />} />
                            <Route path="/admin/products/:productId/view" element={<EditProductForm isViewOnly={true} />} />
                            <Route path="/admin/brands" element={<BrandManagement />} />
                            <Route path="/admin/orders" element={<OrderManagement />} />
                            <Route path="/admin/reviews" element={<ReviewList />} />
                            <Route path="/admin/users" element={<UserManagement />} />

                            {/* Public routes */}
                            <Route path="/skincare-result" element={<SkincareResult />} />
                            <Route path="/home" element={
                                <motion.div
                                    key="home"
                                    initial="initial"
                                    animate="in"
                                    exit="out"
                                    variants={pageVariants}
                                    transition={{ type: "tween" }}
                                >
                                    <Home />
                                </motion.div>
                            } />
                            <Route path="/quiz" element={<QuizPage />} />
                            <Route path="/products" element={
                                <motion.div
                                    key="products"
                                    initial="initial"
                                    animate="in"
                                    exit="out"
                                    variants={pageVariants}
                                    transition={{ type: "tween" }}
                                >
                                    <ProductList />
                                </motion.div>
                            } />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/products/:id" element={
                                <motion.div
                                    key="product-detail"
                                    initial="initial"
                                    animate="in"
                                    exit="out"
                                    variants={pageVariants}
                                    transition={{ type: "tween" }}
                                >
                                    <ProductDetail />
                                </motion.div>
                            } />
                            <Route path="/forbidden" element={<Forbidden />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/orders" element={<OrderList />} />
                            <Route path="/payment-result" element={<PaymentResult />} />
                            <Route path="/policy" element={<Policy />}></Route>
                        </Routes>
                    </AnimatePresence>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
