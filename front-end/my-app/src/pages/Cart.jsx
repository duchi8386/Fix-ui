import React, { useEffect, useState } from "react";
import { getCart, checkoutWithVNPay, checkoutWithCOD, removeItemFromCart } from "../services/CartService";
import { useNavigate } from "react-router-dom";
import { Button, Card, Divider, Empty, Spin, Badge } from "antd";
import { FaShoppingCart, FaTrash, FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                setLoading(true);
                const response = await getCart();
                setCart(response.data);
            } catch (error) {
                console.error("Error fetching cart:", error);
                toast.error("Không thể tải giỏ hàng. Vui lòng thử lại sau!");
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    // Xử lý xóa sản phẩm khỏi giỏ hàng
    const handleRemoveItem = async (productId) => {
        try {
            const response = await removeItemFromCart(productId);
            if (response.status === 200) {
                toast.success(response.data.message);
                setCart((prevCart) => ({
                    ...prevCart,
                    items: prevCart.items.filter(item => item.product._id !== productId),
                }));
            } else {
                toast.error("Xóa sản phẩm thất bại. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            toast.error("Đã xảy ra lỗi khi xóa sản phẩm!");
        }
    };

    // Xử lý thanh toán qua VNPAY
    const handleVNPayCheckout = async () => {
        try {
            if (!cart || cart.items.length === 0) {
                toast.warn("Giỏ hàng của bạn đang trống!");
                return;
            }
            toast.info("Đang chuyển đến cổng thanh toán VNPAY...");
            const paymentUrl = await checkoutWithVNPay();
            window.location.href = paymentUrl;
        } catch (error) {
            console.error("Lỗi thanh toán VNPAY:", error);
            toast.error("Không thể kết nối với cổng thanh toán VNPAY!");
        }
    };

    // Xử lý thanh toán khi nhận hàng (COD)
    const handleCODCheckout = async () => {
        try {
            if (!cart || cart.items.length === 0) {
                toast.warn("Giỏ hàng của bạn đang trống!");
                return;
            }
            const response = await checkoutWithCOD();
            if (response.status === 201) {
                toast.success("Đơn hàng của bạn đã được đặt thành công! Hãy chuẩn bị nhận hàng.");
                setTimeout(() => navigate("/orders"), 2000);
            } else {
                toast.error("Đặt hàng thất bại. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi thanh toán COD:", error);
            toast.error("Đã xảy ra lỗi khi đặt hàng!");
        }
    };

    // Tính tổng giá trị giỏ hàng
    const calculateTotal = () => {
        if (!cart || !cart.items || cart.items.length === 0) return 0;
        return cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    };

    const renderCartContent = () => {
        if (loading) {
            return Array(3).fill(0).map((_, index) => (
                <div key={index} className="mb-4">
                    <Skeleton height={100} />
                </div>
            ));
        }

        if (!cart || cart.items.length === 0) {
            return (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Giỏ hàng của bạn đang trống"
                />
            );
        }

        return (
            <>
                {cart.items.map((item) => (
                    <motion.div
                        key={item.product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="w-24 h-24 overflow-hidden rounded-lg">
                                    <img
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="text-xl font-semibold">{item.product.name}</h4>
                                    <Badge count={item.quantity} color="blue" className="mr-2" />
                                    <span className="text-gray-500">x</span>
                                    <span className="ml-2 text-green-600 font-medium">
                                        {item.product.price.toLocaleString()} VND
                                    </span>
                                </div>
                                <div>
                                    <Button
                                        danger
                                        icon={<FaTrash />}
                                        onClick={() => handleRemoveItem(item.product._id)}
                                    >
                                        Xóa
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}

                <Divider />

                <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-semibold">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-green-600">
                        {calculateTotal().toLocaleString()} VND
                    </span>
                </div>
            </>
        );
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="flex items-center justify-center mb-8">
                <FaShoppingCart className="text-3xl text-blue-600 mr-3" />
                <h1 className="text-3xl font-bold text-center">Giỏ hàng của bạn</h1>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                {renderCartContent()}

                {!loading && cart && cart.items.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <Button
                            type="primary"
                            size="large"
                            block
                            icon={<FaCreditCard className="mr-2" />}
                            onClick={handleVNPayCheckout}
                            className="bg-blue-500 h-14 text-lg"
                        >
                            Thanh toán bằng VNPAY
                        </Button>
                        <Button
                            size="large"
                            block
                            icon={<FaMoneyBillWave className="mr-2" />}
                            onClick={handleCODCheckout}
                            className="bg-green-500 text-white h-14 text-lg"
                        >
                            Thanh toán khi nhận hàng
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
