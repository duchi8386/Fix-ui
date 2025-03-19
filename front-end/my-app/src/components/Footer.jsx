import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope } from "react-icons/fa";
import "../style/footer.css";

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">
                    <h3>BeautyCare</h3>
                    <p>Chăm sóc làn da bạn với những sản phẩm tốt nhất</p>
                </div>

                <div className="footer-grid">
                    <div className="footer-section">
                        <h4>Về Chúng Tôi</h4>
                        <ul>
                            <li><a href="#">Giới thiệu</a></li>
                            <li><a href="#">Cửa hàng</a></li>
                            <li><a href="#">Tuyển dụng</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Hỗ Trợ</h4>
                        <ul>
                            <li><a href="#">Chính sách đổi trả</a></li>
                            <li><a href="#">Giao hàng & Thanh toán</a></li>
                            <li><a href="#">Chính sách bảo mật</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Kết Nối</h4>
                        <div className="social-icons">
                            <a href="#"><FaFacebook /></a>
                            <a href="#"><FaInstagram /></a>
                            <a href="#"><FaTwitter /></a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4>Nhận Ưu Đãi</h4>
                        <div className="newsletter">
                            <input type="email" placeholder="Nhập email của bạn" />
                            <button><FaEnvelope /></button>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2024 BeautyCare. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
