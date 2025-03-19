import { useEffect, useState } from "react";
import {
  getProductList,
  changeStatusProduct,
} from "../../services/ProductService.js";
import { getSkinTypeList } from "../../services/SkinTypeService.js";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Select,
  Typography,
  Space,
  Alert,
  Pagination,
} from "antd";
import { motion } from "framer-motion";

const { Title } = Typography;
const { Option } = Select;

export const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [selectedSkinType, setSelectedSkinType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const limit = 5; // Số sản phẩm mỗi trang

  useEffect(() => {
    fetchProducts();
  }, [selectedSkinType, selectedCategory, currentPage]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const [productsRes, skinTypesRes] = await Promise.all([
        getProductList({
          skinType: selectedSkinType,
          category: selectedCategory,
          page: currentPage,
          limit,
        }),
        getSkinTypeList(),
      ]);
      setProducts(productsRes.data);
      setTotalPages(productsRes.pagination.totalPages);
      setSkinTypes(skinTypesRes.data);
    } catch (error) {
      setError(error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const handleView = (productId) => {
    navigate(`/admin/products/${productId}/view`);
  };

  const handleEdit = (productId) => {
    navigate(`/admin/products/${productId}/edit`);
  };

  const handleToggleStatus = async (productId) => {
    try {
      await changeStatusProduct(productId);
      fetchProducts(); // Cập nhật danh sách sản phẩm sau khi thay đổi trạng thái
    } catch (error) {
      console.error("Failed to update product status:", error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      align: "center",
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      align: "center",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (text) => `${formatCurrency(text)} VND`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text) => (
        <span className={text === "active" ? "text-success" : "text-danger"}>
          {text}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => handleView(record.id)}>View</Button>
          <Button type="primary" onClick={() => handleEdit(record.id)}>
            Edit
          </Button>
          <Button
            type={record.status === "active" ? "danger" : "success"}
            onClick={() => handleToggleStatus(record.id)}
          >
            {record.status === "active" ? "Deactivate" : "Activate"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title level={2} style={{ color: "#1890ff" }}>
          Product Management
        </Title>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Alert
            message="Error"
            description={error.message}
            type="error"
            showIcon
            closable
            style={{ marginBottom: "24px" }}
          />
        </motion.div>
      )}

      {/* Filters */}
      <div style={{ marginBottom: "24px" }}>
        <Space size="large">
          <Select
            value={selectedSkinType}
            onChange={(value) => setSelectedSkinType(value)}
            placeholder="All Skin Types"
            style={{ width: 200 }}
          >
            <Option value="">All Skin Types</Option>
            {skinTypes.map((skin) => (
              <Option key={skin._id} value={skin._id}>
                {skin.type}
              </Option>
            ))}
          </Select>

          <Select
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value)}
            placeholder="All Categories"
            style={{ width: 200 }}
          >
            <Option value="">All Categories</Option>
            <Option value="cleanser">Cleanser</Option>
            <Option value="serum">Serum</Option>
            <Option value="moisturizer">Moisturizer</Option>
            <Option value="toner">Toner</Option>
            <Option value="sunscreen">Sunscreen</Option>
          </Select>

          <Button
            type="primary"
            onClick={() => navigate("/admin/products/new")}
          >
            Add Product
          </Button>
        </Space>
      </div>

      {/* Product Table */}
      <motion.div initial="hidden" animate="visible">
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          pagination={false}
          bordered
        />
      </motion.div>

      {/* Pagination */}
      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <Pagination
          current={currentPage}
          total={totalPages * limit}
          pageSize={limit}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};
