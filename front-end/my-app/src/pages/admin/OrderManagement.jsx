import { useEffect, useState } from "react";
import {
  getOrderListByAdmin,
  changeStatusOrder,
} from "../../services/OrderService.js";
import {
  Table,
  Select,
  Button,
  Typography,
  Card,
  Tag,
  Space,
  Layout,
  Breadcrumb,
  message,
} from "antd";
import { SyncOutlined, ShoppingOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title } = Typography;
const { Option } = Select;
const { Content } = Layout;

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const statuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Completed",
    "Cancelled",
  ];

  const getStatusColor = (status) => {
    const colors = {
      Pending: "gold",
      Processing: "blue",
      Shipped: "cyan",
      Completed: "green",
      Cancelled: "red",
    };
    return colors[status] || "default";
  };

  const columns = [
    {
      title: "Mã Đơn",
      dataIndex: "_id",
      key: "_id",
      width: 100,
      align: "center",
    },
    {
      title: "Khách Hàng",
      dataIndex: "user",
      key: "user",
      align: "center",
      render: (user) => user?.fullName || "N/A",
    },
    {
      title: "Sản phẩm",
      dataIndex: "products",
      key: "products",
      render: (products) => (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {products.map((item, index) => (
            <li key={index} style={{ marginBottom: 8 }}>
              <Tag color="blue">{item.product?.name}</Tag>
              <span>
                {item.quantity} x {item.product?.price.toLocaleString()} VND
              </span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Tổng Tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "center",
      render: (totalAmount) => `${totalAmount.toLocaleString()} VND`,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, record) => (
        <Select
          value={status}
          onChange={(newStatus) => handleStatusChange(record._id, newStatus)}
          style={{ width: 120 }}
        >
          {statuses.map((status) => (
            <Option key={status} value={status}>
              <Tag color={getStatusColor(status)}>{status}</Tag>
            </Option>
          ))}
        </Select>
      ),
    },
  ];

  useEffect(() => {
    loadOrders();
  }, [statusFilter, page]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrderListByAdmin(statusFilter, page, 5);
      setOrders(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng", error);
      message.error("Lỗi khi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await changeStatusOrder(orderId, newStatus);
      loadOrders(); // Refresh danh sách
      message.success("Cập nhật trạng thái thành công");
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái", error);
      message.error("Lỗi cập nhật trạng thái");
    }
  };

  return (
    <Layout style={{ padding: "0 24px 24px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Trang Chủ</Breadcrumb.Item>
        <Breadcrumb.Item>Quản Lý Đơn Hàng</Breadcrumb.Item>
      </Breadcrumb>
      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        <Card>
          <Title level={2} style={{ textAlign: "center" }}>
            Quản Lý Đơn Hàng
          </Title>

          {/* Bộ lọc trạng thái */}
          <Space style={{ marginBottom: 16 }}>
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              style={{ width: 200 }}
            >
              <Option value="">Tất cả trạng thái</Option>
              {statuses.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
            <Button onClick={loadOrders} icon={<SyncOutlined />}>
              Làm mới
            </Button>
          </Space>

          {/* Bảng hiển thị đơn hàng */}
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="_id"
            pagination={{
              current: page,
              total: totalPages * 5,
              onChange: (page) => setPage(page),
            }}
            loading={loading}
          />
        </Card>
      </Content>
    </Layout>
  );
}
