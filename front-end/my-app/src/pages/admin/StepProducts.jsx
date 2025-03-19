import React, { useEffect, useState } from "react";
import { addProductToStep } from "../../services/SkincareRoutineService.js";
import { Card, Select, Button, Typography, Steps, message, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import axios from "axios";

const { Title, Text } = Typography;
const { Option } = Select;

const API_BASE_URL = "http://localhost:9999";

const StepProducts = ({ routine, step, updateRoutine }) => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [messageApi, contextHolder] = message.useMessage();

    const categoryMap = {
        1: "cleanser",
        2: "toner",
        3: "serum",
        4: "moisturizer",
        5: "sunscreen",
    };
    const category = categoryMap[step.stepNumber];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/products?category=${category}`, {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
                setProducts(response.data.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            }
        };
        fetchProducts();
    }, [category]);

    const handleAddProduct = async () => {
        if (!selectedProduct) {
            messageApi.warning("Vui lòng chọn sản phẩm!");
            return;
        }
        try {
            await addProductToStep(routine._id, step.stepNumber, selectedProduct);
            messageApi.success("Thêm sản phẩm thành công!");

            const updatedStep = { ...step, product: products.find(p => p.id === selectedProduct) };
            updateRoutine(routine._id, updatedStep);
            setSelectedProduct("");
        } catch (error) {
            messageApi.error("Lỗi khi thêm sản phẩm!");
            console.error("Lỗi khi thêm sản phẩm:", error);
        }
    };

    const stepStatus = step.product ? "finish" : "wait";
    const stepIcon = step.product ? "✓" : step.stepNumber;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {contextHolder}
            <Card 
                size="small" 
                style={{ marginBottom: 16 }}
                bordered={false}
                className="step-card"
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Tag color="blue" style={{ fontSize: 16, padding: '4px 12px' }}>
                        Step {step.stepNumber}
                    </Tag>
                    <Title level={5} style={{ margin: 0 }}>
                        {step.description}
                    </Title>
                </div>

                <div style={{ marginTop: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Chọn sản phẩm"
                        value={selectedProduct}
                        onChange={setSelectedProduct}
                        disabled={!!step.product}
                    >
                        {products.map(product => (
                            <Option key={product.id} value={product.id}>
                                {product.name}
                            </Option>
                        ))}
                    </Select>
                    
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddProduct}
                        disabled={!!step.product}
                    >
                        Thêm
                    </Button>
                </div>

                {step.product && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Tag 
                            color="success" 
                            style={{ 
                                marginTop: 16,
                                padding: '8px 16px',
                                fontSize: 14
                            }}
                        >
                            Sản phẩm đã chọn: {step.product.name}
                        </Tag>
                    </motion.div>
                )}
            </Card>
        </motion.div>
    );
};

export default StepProducts;
