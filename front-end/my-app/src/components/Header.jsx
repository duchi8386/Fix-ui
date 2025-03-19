import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaBars,
  FaSignOutAlt,
  FaTachometerAlt,
  FaBox,
  FaUsers,
  FaPeopleArrows,
  FaRoute,
} from "react-icons/fa";
import { FaFirstOrder, FaPencil } from "react-icons/fa6";
import { motion } from "framer-motion";
import "../style/header.css";
import { useAuth } from "../context/AuthContext.jsx";

export const Header = () => {
  const { role, user, logoutUser, loading } = useAuth();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  // Animation variants
  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const logoVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const searchBarVariants = {
    initial: { width: "100%" },
    focus: { width: "110%", boxShadow: "0 0 8px rgba(0, 123, 255, 0.3)" },
  };

  return (
    <motion.nav
      className="navbar navbar-expand-lg navbar-light bg-white"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}
    >
      <div className="container">
        {/* Logo with animation */}
        <motion.div
          variants={logoVariants}
          initial="initial"
          whileHover="hover"
        >
          <Link className="navbar-brand" to="/home">
            <h2
              style={{
                background: "linear-gradient(45deg, #ff7eb3, #7868e6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "700",
              }}
            >
              BeautyCare
            </h2>
          </Link>
        </motion.div>

        {/* Nút mở menu trên mobile */}
        <motion.button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaBars />
        </motion.button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Nếu là ADMIN, hiển thị menu quản trị */}
          {role === "ADMIN" ? (
            <motion.ul
              className="navbar-nav mx-auto"
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.1 }}
            >
              {[
                {
                  to: "/admin/brands",
                  icon: <FaTachometerAlt />,
                  text: "Quản lí thương hiệu",
                },
                {
                  to: "/admin/products",
                  icon: <FaBox />,
                  text: "Quản lý sản phẩm",
                },
                {
                  to: "/admin/skincare-routine",
                  icon: <FaRoute />,
                  text: "Quản lý lộ trình skincare",
                },
                {
                  to: "/admin/orders",
                  icon: <FaFirstOrder />,
                  text: "Quản lý đơn hàng",
                },
                {
                  to: "/admin/reviews",
                  icon: <FaPencil />,
                  text: "Quản lý đánh giá feedback",
                },
                {
                  to: "/admin/users",
                  icon: <FaUser />,
                  text: "Quản lí người dùng",
                },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="nav-item"
                  variants={navItemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link
                    className="nav-link d-flex align-items-center"
                    to={item.to}
                  >
                    <span className="me-2">{item.icon}</span> {item.text}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <>
              <motion.ul
                className="navbar-nav mx-auto"
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.1 }}
              >
                {[
                  { to: "/products", text: "Sản phẩm" },
                  { to: "/skincare-result", text: "Lộ trình chăm sóc da" },
                  { to: "/orders", text: "Đơn hàng của tôi" },
                  { to: "/contact", text: "FAQ" },
                  { to: "/contact", text: "About Us" },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="nav-item"
                    variants={navItemVariants}
                    whileHover={{
                      scale: 1.05,
                      color: "#ff7eb3",
                      transition: { duration: 0.2 },
                    }}
                  >
                    <Link className="nav-link" to={item.to}>
                      {item.text}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
              {/* Thanh tìm kiếm */}
              <motion.form
                className="d-flex search-bar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.input
                  className="form-control me-2"
                  type="search"
                  placeholder="Tìm sản phẩm..."
                  variants={searchBarVariants}
                  initial="initial"
                  whileFocus="focus"
                />
                <motion.button
                  className="btn btn-primary"
                  type="submit"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <FaSearch />
                </motion.button>
              </motion.form>
            </>
          )}

          {/* Giỏ hàng và Đăng nhập */}
          <motion.div
            className="d-flex align-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {role !== "ADMIN" && (
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <Link to="/cart" className="btn btn-outline-dark me-3">
                  <FaShoppingCart />
                </Link>
              </motion.div>
            )}
            {loading ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                Đang tải...
              </motion.p>
            ) : user ? (
              <motion.div
                className="user-info d-flex align-items-center"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <span>Xin chào, {user.fullName}</span>
                <motion.button
                  onClick={handleLogout}
                  className="btn btn-outline-danger ms-2"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <FaSignOutAlt /> Đăng xuất
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <Link to="/login" className="btn btn-primary">
                  <FaUser className="me-2" /> Đăng nhập
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};
