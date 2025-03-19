import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Table, 
  Select, 
  Card, 
  Typography, 
  Layout, 
  Breadcrumb, 
  Space, 
  Tag,
  message 
} from "antd";
import { 
  UserOutlined, 
  SyncOutlined,
  CheckCircleOutlined,
  StopOutlined 
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title } = Typography;
const { Option } = Select;
const { Content } = Layout;

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");

    const columns = [
        {
            title: '#',
            key: 'index',
            width: 60,
            align: 'center',
            render: (text, record, index) => (page - 1) * limit + index + 1
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            align: 'center',
            render: (email) => (
                <Typography.Text copyable>{email}</Typography.Text>
            )
        },
        {
            title: 'Họ và Tên',
            dataIndex: 'fullName',
            key: 'fullName',
            align: 'center',
            render: (name) => (
                <Tag color="blue" icon={<UserOutlined />}>
                    {name}
                </Tag>
            )
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status, record) => (
                <Select
                    value={status}
                    onChange={(value) => handleStatusChange(record._id, value)}
                    style={{ width: 120 }}
                >
                    <Option value="ACTIVE">
                        <Tag icon={<CheckCircleOutlined />} color="success">
                            ACTIVE
                        </Tag>
                    </Option>
                    <Option value="INACTIVE">
                        <Tag icon={<StopOutlined />} color="error">
                            INACTIVE
                        </Tag>
                    </Option>
                </Select>
            )
        },
        {
            title: 'Số Điện Thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            align: 'center',
            render: (phone) => (
                <Tag color="cyan">
                    {phone || 'N/A'}
                </Tag>
            )
        }
    ];

    useEffect(() => {
        fetchUsers();
    }, [page, statusFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:9999/users?page=${page}&limit=${limit}&status=${statusFilter}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            );
            setUsers(response.data.data);
            setTotalPages(response.data.pagination.totalPages);
        } catch (error) {
            message.error("Lỗi khi tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId, status) => {
        try {
            await axios.put(
                `http://localhost:9999/users/${userId}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            );
            message.success("Cập nhật trạng thái thành công");
            fetchUsers();
        } catch (error) {
            message.error("Lỗi khi cập nhật trạng thái");
        }
    };

    return (
        <Layout style={{ padding: '24px', minHeight: '100vh', background: '#f0f2f5' }}>
            <Content>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card>
                        <Breadcrumb style={{ marginBottom: 16 }}>
                            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                            <Breadcrumb.Item>User Management</Breadcrumb.Item>
                        </Breadcrumb>

                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Title level={2}>
                                    <UserOutlined /> Quản Lý Người Dùng
                                </Title>
                                <Space>
                                    <Select
                                        value={statusFilter}
                                        onChange={setStatusFilter}
                                        style={{ width: 150 }}
                                        placeholder="Lọc trạng thái"
                                    >
                                        <Option value="">Tất cả</Option>
                                        <Option value="ACTIVE">
                                            <Tag color="success">ACTIVE</Tag>
                                        </Option>
                                        <Option value="INACTIVE">
                                            <Tag color="error">INACTIVE</Tag>
                                        </Option>
                                    </Select>
                                </Space>
                            </div>

                            <Table
                                columns={columns}
                                dataSource={users}
                                rowKey="_id"
                                loading={loading}
                                pagination={{
                                    current: page,
                                    total: totalPages * limit,
                                    pageSize: limit,
                                    onChange: setPage,
                                    showSizeChanger: false
                                }}
                                bordered
                                scroll={{ x: 800 }}
                            />
                        </Space>
                    </Card>
                </motion.div>
            </Content>
        </Layout>
    );
};

export default UserManagement;