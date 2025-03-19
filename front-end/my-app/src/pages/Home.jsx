import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuizResult } from "../services/ResultService";
import { Button, Typography, Card, Space, Divider } from "antd";
import { motion } from "framer-motion";
import {
    FaQuestionCircle,
    FaClipboardList,
    FaSpa,
    FaRegSmile,
    FaLeaf,
    FaShieldAlt
} from "react-icons/fa";

const { Title, Paragraph } = Typography;

const Home = () => {
    const navigate = useNavigate();
    const [hasSkinType, setHasSkinType] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserSkinType = async () => {
            try {
                setLoading(true);
                const response = await getQuizResult();
                if (response.data.data.skinType) {
                    setHasSkinType(true);
                }
            } catch (error) {
                console.error("Error fetching quiz result:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserSkinType();
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Hero Section */}
            <motion.div
                className="py-20 px-6 md:px-12 max-w-7xl mx-auto text-center"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div variants={itemVariants}>
                    <FaSpa className="text-5xl md:text-6xl text-blue-500 mx-auto mb-4" />
                    <Title level={1} className="text-4xl md:text-5xl font-bold mb-4">
                        Chào mừng đến với <span className="text-blue-600">BeautyCare</span>
                    </Title>
                    <Paragraph className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Khám phá lộ trình chăm sóc da phù hợp với làn da của bạn với các sản phẩm chất lượng cao
                    </Paragraph>
                </motion.div>

                {/* Call to Action Button */}
                <motion.div
                    variants={itemVariants}
                    className="mb-16"
                >
                    {hasSkinType ? (
                        <Button
                            type="primary"
                            size="large"
                            icon={<FaClipboardList className="mr-2" />}
                            onClick={() => navigate("/skincare-result")}
                            className="bg-blue-600 hover:bg-blue-700 h-12 px-8 text-lg rounded-lg shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1"
                        >
                            Xem lộ trình chăm sóc da của bạn
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            size="large"
                            icon={<FaQuestionCircle className="mr-2" />}
                            onClick={() => navigate("/quiz")}
                            className="bg-blue-600 hover:bg-blue-700 h-12 px-8 text-lg rounded-lg shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1"
                        >
                            Bắt đầu trắc nghiệm để nhận lộ trình
                        </Button>
                    )}
                </motion.div>

                {/* Features Section */}
                <Divider>
                    <span className="text-lg text-gray-600">Tại sao chọn chúng tôi</span>
                </Divider>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                    <motion.div variants={itemVariants}>
                        <Card
                            hoverable
                            className="text-center h-full shadow-md hover:shadow-lg transition-shadow"
                            cover={<FaRegSmile className="text-5xl text-blue-500 mt-6" />}
                        >
                            <Title level={4}>Phân tích da cá nhân hóa</Title>
                            <Paragraph className="text-gray-600">
                                Trắc nghiệm phân tích đặc điểm da giúp đề xuất sản phẩm phù hợp nhất cho bạn
                            </Paragraph>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card
                            hoverable
                            className="text-center h-full shadow-md hover:shadow-lg transition-shadow"
                            cover={<FaLeaf className="text-5xl text-green-500 mt-6" />}
                        >
                            <Title level={4}>Thành phần tự nhiên</Title>
                            <Paragraph className="text-gray-600">
                                Các sản phẩm của chúng tôi được chiết xuất từ thành phần tự nhiên, an toàn cho mọi loại da
                            </Paragraph>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card
                            hoverable
                            className="text-center h-full shadow-md hover:shadow-lg transition-shadow"
                            cover={<FaShieldAlt className="text-5xl text-purple-500 mt-6" />}
                        >
                            <Title level={4}>Bảo đảm chất lượng</Title>
                            <Paragraph className="text-gray-600">
                                Tất cả sản phẩm đều được kiểm nghiệm và chứng nhận về độ an toàn và hiệu quả
                            </Paragraph>
                        </Card>
                    </motion.div>
                </div>

                {/* Image Banner */}
                <motion.div
                    className="mt-16 relative rounded-xl overflow-hidden shadow-xl"
                    variants={itemVariants}
                >
                    <img
                        src="https://images.unsplash.com/photo-1596178060810-72f53ce9a65c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                        alt="Skincare Products"
                        className="w-full h-64 md:h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-transparent flex items-center">
                        <div className="p-8 max-w-md">
                            <Title level={2} className="text-white mb-4">
                                Bắt đầu hành trình chăm sóc da của bạn ngay hôm nay
                            </Title>
                            <Button
                                ghost
                                size="large"
                                onClick={() => navigate("/products")}
                                className="border-2 hover:border-blue-300 hover:text-blue-100 transition-colors"
                            >
                                Khám phá sản phẩm
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Testimonial Section */}
                <motion.div
                    className="mt-16 py-8 rounded-lg bg-blue-50 px-6"
                    variants={itemVariants}
                >
                    <Title level={3} className="mb-8">
                        Khách hàng nói gì về chúng tôi
                    </Title>
                    <Card className="max-w-2xl mx-auto shadow-md">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full overflow-hidden mb-3">
                                <img
                                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
                                    alt="Customer"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <Title level={5}>Nguyễn Thị Minh</Title>
                            <p className="text-blue-500 text-sm mb-3">Da dầu mụn</p>
                            <Paragraph italic className="text-center text-gray-600">
                                "Sau khi làm bài trắc nghiệm và sử dụng các sản phẩm được đề xuất, làn da của tôi đã cải thiện đáng kể. Tình trạng mụn giảm hẳn và da không còn bóng dầu như trước!"
                            </Paragraph>
                        </div>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Home;
