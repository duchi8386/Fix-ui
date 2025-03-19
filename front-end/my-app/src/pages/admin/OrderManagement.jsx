import { useEffect, useState } from "react";
import { getOrderListByAdmin, changeStatusOrder } from "../../services/OrderService.js";
import { FaSyncAlt } from "react-icons/fa";

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const statuses = ["Pending", "Processing", "Shipped", "Completed", "Cancelled"];

    useEffect(() => {
        loadOrders();
    }, [statusFilter, page]);

    const loadOrders = async () => {
        try {
            const response = await getOrderListByAdmin(statusFilter, page, 5);
            setOrders(response.data.data);
            setTotalPages(response.data.pagination.totalPages);
        } catch (error) {
            console.error("Lỗi khi tải đơn hàng", error);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await changeStatusOrder(orderId, newStatus);
            loadOrders(); // Refresh danh sách
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái", error);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold text-center mb-6">Quản Lý Đơn Hàng</h1>

            {/* Bộ lọc trạng thái */}
            <div className="mb-4 flex justify-between">
                <select
                    className="border p-2 rounded"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Tất cả trạng thái</option>
                    {statuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                <button onClick={loadOrders} className="p-2 bg-blue-600 text-white rounded">
                    <FaSyncAlt /> Làm mới
                </button>
            </div>

            {/* Bảng hiển thị đơn hàng */}
            <table className="w-full border">
                <thead>
                <tr className="bg-gray-200">
                    <th className="border p-2">Mã Đơn</th>
                    <th className="border p-2">Khách Hàng</th>
                    <th className="border p-2">Sản phẩm</th>
                    <th className="border p-2">Tổng Tiền</th>
                    <th className="border p-2">Trạng Thái</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order._id} className="border">
                        <td className="border p-2">{order._id}</td>
                        <td className="border p-2">{order.user?.fullName || "N/A"}</td>
                        <td className="border p-2">
                            <ul>
                                {order.products.map((item, index) => (
                                    <li key={index}>
                                        {item.product?.name} - {item.quantity} x {item.product?.price.toLocaleString()} VND
                                    </li>
                                ))}
                            </ul>
                        </td>
                        <td className="border p-2">{order.totalAmount.toLocaleString()} VND</td>
                        <td className="border p-2">
                            <select
                                className="border p-1 rounded"
                                value={order.status}
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Phân trang */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                    className="p-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
                >
                    &larr; Trước
                </button>
                <span className="p-2">{page} / {totalPages}</span>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    className="p-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
                >
                    Sau &rarr;
                </button>
            </div>
        </div>
    );
}
