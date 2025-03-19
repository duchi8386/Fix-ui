import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { Input, Button, Divider } from "antd";
import { toast, ToastContainer } from "react-toastify";

export const Footer = () => {
    const handleSubscribe = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        if (email) {
            toast.success("Cảm ơn bạn đã đăng ký nhận tin!");
            e.target.reset();
        } else {
            toast.error("Vui lòng nhập email của bạn");
        }
    };

    return (
        <footer className="bg-gradient-to-b from-gray-50 to-gray-100 pt-12 pb-6">
            <ToastContainer position="bottom-right" autoClose={3000} />

            <div className="container mx-auto px-6">
                {/* Logo and tagline */}
                <div className="text-center mb-10">
                    <motion.h2
                        className="text-3xl font-bold text-blue-600"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        BeautyCare
                    </motion.h2>
                    <p className="text-gray-600 mt-2">Chăm sóc làn da bạn với những sản phẩm tốt nhất</p>
                </div>

                <Divider />

                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About Us Section */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 border-b-2 border-blue-400 inline-block pb-1">
                            Về Chúng Tôi
                        </h4>
                        <ul className="space-y-2">
                            <motion.li
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">Giới thiệu</a>
                            </motion.li>
                            <motion.li
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">Cửa hàng</a>
                            </motion.li>
                            <motion.li
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">Tuyển dụng</a>
                            </motion.li>
                        </ul>
                    </div>

                    {/* Support Section */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 border-b-2 border-blue-400 inline-block pb-1">
                            Hỗ Trợ
                        </h4>
                        <ul className="space-y-2">
                            <motion.li
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">Chính sách đổi trả</a>
                            </motion.li>
                            <motion.li
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">Giao hàng & Thanh toán</a>
                            </motion.li>
                            <motion.li
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">Chính sách bảo mật</a>
                            </motion.li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 border-b-2 border-blue-400 inline-block pb-1">
                            Liên Hệ
                        </h4>
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <FaMapMarkerAlt className="text-blue-500 mr-2" />
                                <span className="text-gray-600">8 Nguyễn Văn Tráng, Quận 1, TP.HCM</span>
                            </li>
                            <li className="flex items-center">
                                <FaPhoneAlt className="text-blue-500 mr-2" />
                                <span className="text-gray-600">0123 456 789</span>
                            </li>
                            <li className="flex items-center">
                                <FaEnvelope className="text-blue-500 mr-2" />
                                <span className="text-gray-600">contact@beautycare.vn</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter Section */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 border-b-2 border-blue-400 inline-block pb-1">
                            Nhận Ưu Đãi
                        </h4>
                        <p className="text-gray-600 mb-3">Đăng ký nhận thông tin ưu đãi mới nhất từ chúng tôi</p>
                        <form onSubmit={handleSubscribe} className="mt-2">
                            <div className="flex">
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="Email của bạn"
                                    className="rounded-l-md border-r-0"
                                />
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="bg-blue-500 rounded-r-md"
                                    icon={<FaEnvelope />}
                                >
                                    Đăng ký
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Social Links */}
                <div className="mt-10 text-center">
                    <h4 className="text-lg font-semibold mb-4 text-gray-800">Kết Nối Với Chúng Tôi</h4>
                    <div className="flex justify-center space-x-6 mb-6">
                        <motion.a
                            href="#"
                            whileHover={{ y: -5, scale: 1.1 }}
                            className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                        >
                            <FaFacebook className="text-xl" />
                        </motion.a>
                        <motion.a
                            href="#"
                            whileHover={{ y: -5, scale: 1.1 }}
                            className="w-10 h-10 flex items-center justify-center bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors"
                        >
                            <FaInstagram className="text-xl" />
                        </motion.a>
                        <motion.a
                            href="#"
                            whileHover={{ y: -5, scale: 1.1 }}
                            className="w-10 h-10 flex items-center justify-center bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
                        >
                            <FaTwitter className="text-xl" />
                        </motion.a>
                    </div>
                </div>

                <Divider />

                {/* Copyright Section */}
                <div className="text-center text-gray-600 text-sm">
                    <p>&copy; 2024 BeautyCare. All rights reserved.</p>
                    <p className="mt-2 flex items-center justify-center">
                        Made with <FaHeart className="mx-1 text-red-500" /> in Vietnam
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
