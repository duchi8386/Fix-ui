import React, { useEffect, useState } from "react";
import { getSkincareRoutines } from "../../services/SkincareRoutineService.js";
import { 
    Card, 
    Select, 
    Typography, 
    Layout, 
    Space, 
    Empty, 
    Divider,
    Tag,
    Breadcrumb
} from "antd";
import { SkinOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import StepProducts from "./StepProducts";

const { Title, Text } = Typography;
const { Content } = Layout;
const { Option } = Select;

const SkincareRoutineManagement = () => {
    const [routines, setRoutines] = useState([]);
    const [selectedSkinType, setSelectedSkinType] = useState(""); // Loại da được chọn

    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                const data = await getSkincareRoutines();
                setRoutines(data.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách routines:", error);
            }
        };
        fetchRoutines();
    }, []);

    // Cập nhật routine khi thêm sản phẩm
    const updateRoutine = (routineId, updatedStep) => {
        setRoutines(prevRoutines =>
            prevRoutines.map(routine =>
                routine._id === routineId
                    ? { ...routine, steps: routine.steps.map(step => step.stepNumber === updatedStep.stepNumber ? updatedStep : step) }
                    : routine
            )
        );
    };

    // Danh sách loại da
    const skinTypes = ["dry", "oily", "combination", "normal", "sensitive"];

    // Lọc routines theo loại da
    const filteredRoutines = selectedSkinType
        ? routines.filter(routine => routine.skinType?.type.toLowerCase() === selectedSkinType)
        : routines;

    return (
        <Layout style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
            <Content>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card>
                        <Breadcrumb style={{ marginBottom: 16 }}>
                            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                            <Breadcrumb.Item>Skincare Routines</Breadcrumb.Item>
                        </Breadcrumb>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <Title level={2}>Skincare Routines</Title>
                            <Select
                                style={{ width: 200 }}
                                placeholder="Chọn loại da"
                                value={selectedSkinType}
                                onChange={setSelectedSkinType}
                                suffixIcon={<SkinOutlined />}
                            >
                                <Option value="">Tất cả</Option>
                                {skinTypes.map((type) => (
                                    <Option key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            {filteredRoutines.length === 0 ? (
                                <Empty description="Không có routine nào phù hợp" />
                            ) : (
                                filteredRoutines.map(routine => (
                                    <motion.div
                                        key={routine._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card 
                                            title={
                                                <Space>
                                                    <Title level={4} style={{ margin: 0 }}>
                                                        {routine.name}
                                                    </Title>
                                                    <Tag color="cyan">
                                                        {routine.skinType?.type || "Không xác định"}
                                                    </Tag>
                                                </Space>
                                            }
                                            style={{ marginBottom: 16 }}
                                        >
                                            {routine.steps.map(step => (
                                                <StepProducts 
                                                    key={step.stepNumber}
                                                    routine={routine}
                                                    step={step}
                                                    updateRoutine={updateRoutine}
                                                />
                                            ))}
                                        </Card>
                                    </motion.div>
                                ))
                            )}
                        </Space>
                    </Card>
                </motion.div>
            </Content>
        </Layout>
    );
};

export default SkincareRoutineManagement;
