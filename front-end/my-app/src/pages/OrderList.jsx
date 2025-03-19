import React, { useEffect, useState } from "react";
import { cancelOrder, getOrderListByUser } from "../services/OrderService.js";
import { Card, Badge, Empty, Button, Modal, Divider, Tag } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";
import { FaShoppingBag, FaMoneyBill, FaCalendarAlt, FaBoxOpen, FaExclamationTriangle } from "react-icons/fa";

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await getOrderListByUser();
                setOrders(response.data);
            } catch (err) {
                setError("Lỗi khi lấy danh sách đơn hàng");
                toast.error("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau!");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        try {
            Modal.confirm({
                title: 'Xác nhận hủy đơn hàng',
                content: 'Bạn có chắc muốn hủy đơn hàng này không?',
                okText: 'Đồng ý',
                okType: 'danger',
                cancelText: 'Hủy bỏ',
                onOk: async () => {
                    await cancelOrder(orderId);
                    toast.success("Đã hủy đơn hàng thành công!");
                    setOrders(orders.map((order) =>
                        order._id === orderId ? { ...order, status: "Cancelled" } : order
                    ));
                }
            });
        } catch (error) {
            toast.error("Không thể hủy đơn hàng, vui lòng thử lại sau!");
            console.log(error);
        }
    };

    // Format date from ISO string to readable format
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    // Get status color based on order status
    const getStatusColor = (status) => {
        switch (status) {
            case "Pending":
                return "processing";
            case "Processing":
                return "warning";
            case "Shipped":
                return "success";
            case "Delivered":
                return "success";
            case "Cancelled":
                return "error";
            default:
                return "default";
        }
    };

    // Translate status to Vietnamese
    const translateStatus = (status) => {
        const statusMap = {
            "Pending": "Chờ xử lý",
            "Processing": "Đang xử lý",
            "Shipped": "Đang giao hàng",
            "Delivered": "Đã giao hàng",
            "Cancelled": "Đã hủy"
        };
        return statusMap[status] || status;
    };

    const renderOrdersList = () => {
        if (loading) {
            return Array(3).fill(0).map((_, index) => (
                <div key={index} className="mb-6">
                    <Skeleton height={200} />
                </div>
            ));
        }

        if (error) {
            return (
                <div className="text-center py-8">
                    <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
                    <p className="text-red-500 text-xl">{error}</p>
                </div>
            );
        }

        if (orders.length === 0) {
            return (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Bạn chưa có đơn hàng nào"
                    className="my-8"
                />
            );
        }

        return orders.map((order) => (
            <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
            >
                <Card
                    className="shadow-md hover:shadow-lg transition-shadow"
                    title={
                        <div className="flex justify-between items-center">
                            <span className="flex items-center">
                                <FaShoppingBag className="mr-2 text-blue-600" />
                                <span>Đơn hàng #{order._id.slice(-8)}</span>
                            </span>
                            <Badge status={getStatusColor(order.status)} text={translateStatus(order.status)} />
                        </div>
                    }
                >
                    <div className="flex items-center mb-4">
                        <FaCalendarAlt className="text-gray-500 mr-2" />
                        <span className="text-gray-600">
                            Ngày đặt: {formatDate(order.createdAt)}
                        </span>
                    </div>

                    <div className="flex items-center mb-4">
                        <FaMoneyBill className="text-green-600 mr-2" />
                        <span className="text-lg font-semibold text-green-600">
                            Tổng tiền: {order.totalAmount.toLocaleString()} VND
                        </span>
                        <Tag color={order.isPaid ? "green" : "orange"} className="ml-4">
                            {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                        </Tag>
                    </div>

                    <Divider orientation="left">Chi tiết sản phẩm</Divider>

                    <div className="space-y-4">
                        {order.products.map(({ product, quantity }) => (
                            <div key={product._id} className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50">
                                <div className="w-20 h-20 overflow-hidden rounded-md flex-shrink-0">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold">{product.name}</p>
                                    <div className="flex items-center gap-4 mt-1">
                                        <Badge count={quantity} color="blue" />
                                        <span className="text-green-600 font-medium">
                                            {product.price.toLocaleString()} VND
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {!order.isPaid && order.status !== "Cancelled" && (
                        <div className="mt-6 text-right">
                            <Button
                                danger
                                type="primary"
                                icon={<FaExclamationTriangle className="mr-1" />}
                                onClick={() => handleCancelOrder(order._id)}
                            >
                                Hủy đơn hàng
                            </Button>
                        </div>
                    )}
                </Card>
            </motion.div>
        ));
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="flex items-center justify-center mb-8">
                <FaBoxOpen className="text-3xl text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold">Đơn hàng của bạn</h2>
            </div>

            {renderOrdersList()}
        </div>
    );
};

export default UserOrders;
