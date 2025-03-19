import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Table, 
  Input, 
  Card, 
  Typography, 
  Rate, 
  Tag, 
  Layout, 
  Breadcrumb,
  Space 
} from "antd";
import { 
  SearchOutlined, 
  CommentOutlined 
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title } = Typography;
const { Content } = Layout;

export default function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [search, page]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:9999/reviews/all-reviews?search=${search}&page=${page}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReviews(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải đánh giá", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Người Đánh Giá",
      dataIndex: ["user", "fullName"],
      key: "user",
      align: "center",
      render: (text) => <Tag color="blue">{text || "N/A"}</Tag>
    },
    {
      title: "Sản Phẩm",
      dataIndex: ["product", "name"],
      key: "product",
      align: "center",
      render: (text) => <Tag color="cyan">{text || "N/A"}</Tag>
    },
    {
      title: "Số Sao",
      dataIndex: "rating",
      key: "rating",
      align: "center",
      render: (rating) => <Rate disabled defaultValue={rating} />
    },
    {
      title: "Nhận Xét",
      dataIndex: "comment",
      key: "comment",
      align: "center",
      render: (text) => (
        <div style={{ maxWidth: 300, margin: '0 auto' }}>
          {text || "Không có nhận xét"}
        </div>
      )
    },
    {
      title: "Ngày",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (date) => (
        <Tag color="purple">
          {new Date(date).toLocaleDateString()}
        </Tag>
      )
    }
  ];

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
              <Breadcrumb.Item>Reviews</Breadcrumb.Item>
            </Breadcrumb>

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2}>
                  <CommentOutlined /> Danh Sách Đánh Giá
                </Title>
              </div>

              <Input
                placeholder="Tìm kiếm theo tên người dùng hoặc sản phẩm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                prefix={<SearchOutlined />}
                style={{ marginBottom: 16 }}
              />

              <Table
                columns={columns}
                dataSource={reviews}
                rowKey="_id"
                loading={loading}
                pagination={{
                  current: page,
                  total: totalPages * 5,
                  pageSize: 5,
                  onChange: (page) => setPage(page),
                  showSizeChanger: false
                }}
                bordered
                scroll={{ x: 1000 }}
              />
            </Space>
          </Card>
        </motion.div>
      </Content>
    </Layout>
  );
}
