import React, { useState, useEffect } from "react";
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../../services/brandService";
import {
  Button,
  Table,
  Form,
  Input,
  Modal,
  Card,
  Alert,
  Row,
  Col,
  Typography,
} from "antd";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

export const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBrandId, setCurrentBrandId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    const data = await getBrands();
    setBrands(data.data);
  };

  const handleAddOrUpdateBrand = async () => {
    if (!name || !description) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (isEditing) {
      await updateBrand(currentBrandId, { name, description });
      setIsEditing(false);
      setCurrentBrandId(null);
    } else {
      await createBrand({ name, description });
    }

    setName("");
    setDescription("");
    setShowModal(false);
    loadBrands();
  };

  const handleEdit = (brand) => {
    setName(brand.name);
    setDescription(brand.description);
    setCurrentBrandId(brand._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) {
      try {
        await deleteBrand(id);
        loadBrands();
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Lỗi khi xóa thương hiệu."
        );
      }
    }
  };

  // Animation variants
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên Thương Hiệu",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
      align: "center",
    },
    {
      title: "Hành Động",
      key: "action",
      align: "center",
      render: (text, record) => (
        <>
          <Button
            type="primary"
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          >
            Sửa
          </Button>
          <Button
            type="danger"
            onClick={() => handleDelete(record._id)}
            disabled={record.productCount > 0}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ marginTop: 50, padding: "0 24px" }}>
      {/* Page Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Title level={2} style={{ color: "#1890ff" }}>
              Quản Lý Thương Hiệu
            </Title>
            <Text type="secondary">
              Thêm, chỉnh sửa và quản lý danh sách thương hiệu của bạn.
            </Text>
          </motion.div>
        </Col>
        <Col>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="primary"
              onClick={() => {
                setIsEditing(false);
                setName("");
                setDescription("");
                setShowModal(true);
              }}
              style={{ fontWeight: "bold" }}
            >
              + Thêm Thương Hiệu
            </Button>
          </motion.div>
        </Col>
      </Row>

      {/* Error Message */}
      {errorMessage && (
        <Row style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Alert
              message={errorMessage}
              type="error"
              closable
              onClose={() => setErrorMessage("")}
            />
          </Col>
        </Row>
      )}

      {/* Brand List Table */}
      <Card>
        <motion.div initial="hidden" animate="visible" variants={rowVariants}>
          <Table
            columns={columns}
            dataSource={brands}
            rowKey="_id"
            pagination={false}
            bordered
            style={{ borderRadius: "8px", overflow: "hidden" }}
          />
        </motion.div>
      </Card>

      {/* Add/Edit Brand Modal */}
      <Modal
        title={isEditing ? "Cập Nhật Thương Hiệu" : "Thêm Thương Hiệu"}
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowModal(false)}>
            Hủy
          </Button>,
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            key="submit"
          >
            <Button type="primary" onClick={handleAddOrUpdateBrand}>
              {isEditing ? "Cập Nhật" : "Thêm"}
            </Button>
          </motion.div>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Tên Thương Hiệu" required>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên thương hiệu"
            />
          </Form.Item>
          <Form.Item label="Mô Tả" required>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả thương hiệu"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
