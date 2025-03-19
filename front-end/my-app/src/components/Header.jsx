import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaBars,
  FaSignOutAlt,
  FaTachometerAlt,
  FaBox,
  FaUsers,
  FaRoute,
  FaAngleDown,
  FaQuestionCircle,
  FaInfoCircle,
  FaUserCircle,
  FaCog,
  FaTimes,
} from "react-icons/fa";
import { FaFirstOrder, FaPencil } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import "../style/header.css";
import { useAuth } from "../context/AuthContext.jsx";

export const Header = () => {
  const { role, user, logoutUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleLogout = async () => {
    await logoutUser();
    setIsUserMenuOpen(false);
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

  const dropdownVariants = {
    hidden: { opacity: 0, y: -5, height: 0 },
    visible: { opacity: 1, y: 0, height: "auto", transition: { duration: 0.3 } },
  };

  const isLinkActive = (path) => location.pathname === path;

  return (
    <motion.nav
      className={`sticky top-0 z-50 w-full bg-white py-3 transition-all duration-300 ${scrolled ? 'shadow-md py-2 border-b border-gray-100/50' : ''
        }`}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo with animation */}
          <motion.div
            variants={logoVariants}
            initial="initial"
            whileHover="hover"
            className="flex items-center"
          >
            <Link className="text-xl font-bold" to="/home">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent tracking-tight">
                BeautyCare
              </h2>
            </Link>
          </motion.div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            {role !== "ADMIN" && (
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                className="relative mr-3"
              >
                <Link to="/cart" className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-50 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all">
                  <FaShoppingCart className="text-sm" />
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] text-white font-bold bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-sm">0</span>
                </Link>
              </motion.div>
            )}
            <motion.button
              className="bg-gray-50 hover:bg-purple-50 text-gray-700 hover:text-purple-600 rounded-lg p-2 focus:outline-none transition-all"
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </motion.button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:flex-1 lg:items-center justify-between">
            <div className="flex items-center lg:ml-8">
              {/* Admin Navigation */}
              {role === "ADMIN" ? (
                <motion.ul
                  className="flex items-center space-x-1"
                  initial="hidden"
                  animate="visible"
                  transition={{ staggerChildren: 0.1 }}
                >
                  {[
                    {
                      to: "/admin/brands",
                      icon: <FaTachometerAlt />,
                      text: "Thương hiệu",
                    },
                    {
                      to: "/admin/products",
                      icon: <FaBox />,
                      text: "Sản phẩm",
                    },
                    {
                      to: "/admin/skincare-routine",
                      icon: <FaRoute />,
                      text: "Lộ trình skincare",
                    },
                    {
                      to: "/admin/orders",
                      icon: <FaFirstOrder />,
                      text: "Đơn hàng",
                    },
                    {
                      to: "/admin/reviews",
                      icon: <FaPencil />,
                      text: "Đánh giá",
                    },
                    {
                      to: "/admin/users",
                      icon: <FaUser />,
                      text: "Người dùng",
                    },
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      variants={navItemVariants}
                    >
                      <Link
                        className={`flex items-center px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all ${isLinkActive(item.to) ? 'bg-purple-50 text-purple-600 font-semibold' : ''
                          }`}
                        to={item.to}
                      >
                        <span className="text-purple-500 opacity-85 mr-2">{item.icon}</span>
                        <span>{item.text}</span>
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <motion.ul
                  className="flex items-center space-x-2"
                  initial="hidden"
                  animate="visible"
                  transition={{ staggerChildren: 0.1 }}
                >
                  {[
                    { to: "/products", text: "Sản phẩm", icon: <FaBox /> },
                    { to: "/skincare-result", text: "Lộ trình skincare", icon: <FaRoute /> },
                    { to: "/orders", text: "Đơn hàng", icon: <FaFirstOrder /> },
                    { to: "/faq", text: "FAQ", icon: <FaQuestionCircle /> },
                    { to: "/about", text: "About Us", icon: <FaInfoCircle /> },
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      variants={navItemVariants}
                    >
                      <Link
                        className={`flex items-center px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 relative transition-all ${isLinkActive(item.to) ? 'active-link bg-purple-50 text-purple-600 font-semibold' : ''
                          }`}
                        to={item.to}
                      >
                        <span className="text-purple-500 opacity-85 mr-2">{item.icon}</span>
                        <span>{item.text}</span>
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </div>

            {/* Right Side: Search, Cart, User */}
            <div className="flex items-center">
              {/* Search bar - only for non-admin */}
              {role !== "ADMIN" && (
                <motion.form
                  className="relative mr-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >

                </motion.form>
              )}

              {/* Cart Icon - only for non-admin */}
              {role !== "ADMIN" && (
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  className="relative mr-3"
                >
                  <Link to="/cart" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-700 hover:bg-purple-50 hover:text-purple-600 hover:-translate-y-1 shadow-sm transition-all">
                    <FaShoppingCart />
                    {/* <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs text-white font-bold bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-sm">0</span> */}
                  </Link>
                </motion.div>
              )}

              {/* User Menu */}
              {loading ? (
                <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-2"></div>
              ) : user ? (
                <div className="relative">
                  <motion.div
                    className="flex items-center px-3 py-1.5 rounded-full bg-gray-50 hover:bg-purple-50 cursor-pointer shadow-sm transition-all"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="text-purple-600 mr-2">
                      <FaUserCircle size={22} />
                    </div>
                    <span className="font-medium text-gray-700 truncate max-w-[120px]">{user.fullName}</span>
                    <FaAngleDown className={`ml-1 text-purple-600 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </motion.div>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg overflow-hidden z-50 border border-gray-100"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 flex items-center">
                          <div className="text-purple-600 mr-3">
                            <FaUserCircle size={40} />
                          </div>
                          <div>
                            <h6 className="font-semibold text-gray-700">{user.fullName}</h6>
                            <small className="text-gray-500 text-xs">{user.email || 'user@example.com'}</small>
                          </div>
                        </div>

                        <div className="py-1">
                          <Link to="/orders" className="flex items-center px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 hover:translate-x-1 transition-all" onClick={() => setIsUserMenuOpen(false)}>
                            <FaFirstOrder className="mr-2 text-purple-400" /> Đơn hàng
                          </Link>
                          <hr className="my-1 border-gray-100" />
                          <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-red-600 hover:bg-red-50 hover:translate-x-1 transition-all">
                            <FaSignOutAlt className="mr-2" /> Đăng xuất
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Link to="/register" className="px-4 py-2 font-medium border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-all">
                      Đăng ký
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Link to="/login" className="px-4 py-2 font-medium bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all">
                      <FaUser className="inline mr-1 text-xs" /> Đăng nhập
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="fixed inset-0 z-50 lg:hidden bg-gray-800/20 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <motion.div
                  className="absolute top-[61px] right-0 w-full max-w-sm h-screen bg-white shadow-xl overflow-y-auto mobile-menu"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "tween", duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-5">
                    {/* Search bar for mobile */}
                    {role !== "ADMIN" && (
                      <div className="mb-6">
                        <div className="relative">
                          <input
                            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-4 pr-10 text-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-500 focus:bg-white transition-all"
                            type="search"
                            placeholder="Tìm sản phẩm..."
                            aria-label="Search"
                          />
                          <button
                            className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-purple-600"
                            type="submit"
                          >
                            <FaSearch />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Mobile Navigation Links */}
                    {role === "ADMIN" ? (
                      <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-2 px-2">Quản lý</h3>
                        <ul className="space-y-1">
                          {[
                            {
                              to: "/admin/brands",
                              icon: <FaTachometerAlt />,
                              text: "Thương hiệu",
                            },
                            {
                              to: "/admin/products",
                              icon: <FaBox />,
                              text: "Sản phẩm",
                            },
                            {
                              to: "/admin/skincare-routine",
                              icon: <FaRoute />,
                              text: "Lộ trình skincare",
                            },
                            {
                              to: "/admin/orders",
                              icon: <FaFirstOrder />,
                              text: "Đơn hàng",
                            },
                            {
                              to: "/admin/reviews",
                              icon: <FaPencil />,
                              text: "Đánh giá",
                            },
                            {
                              to: "/admin/users",
                              icon: <FaUser />,
                              text: "Người dùng",
                            },
                          ].map((item, index) => (
                            <li key={index}>
                              <Link
                                className={`flex items-center px-3 py-3 rounded-lg font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all ${isLinkActive(item.to) ? 'bg-purple-50 text-purple-600 font-semibold' : ''
                                  }`}
                                to={item.to}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <span className="text-purple-500 opacity-85 mr-3 text-lg">{item.icon}</span>
                                <span>{item.text}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-2 px-2">Menu</h3>
                        <ul className="space-y-1">
                          {[
                            { to: "/products", text: "Sản phẩm", icon: <FaBox /> },
                            { to: "/skincare-result", text: "Lộ trình skincare", icon: <FaRoute /> },
                            { to: "/orders", text: "Đơn hàng", icon: <FaFirstOrder /> },
                            { to: "/faq", text: "FAQ", icon: <FaQuestionCircle /> },
                            { to: "/about", text: "About Us", icon: <FaInfoCircle /> },
                          ].map((item, index) => (
                            <li key={index}>
                              <Link
                                className={`flex items-center px-3 py-3 rounded-lg font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all ${isLinkActive(item.to) ? 'bg-purple-50 text-purple-600 font-semibold' : ''
                                  }`}
                                to={item.to}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <span className="text-purple-500 opacity-85 mr-3 text-lg">{item.icon}</span>
                                <span>{item.text}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Mobile User Actions */}
                    <div className="mt-6 border-t border-gray-100 pt-6">
                      {user ? (
                        <div>
                          <div className="flex items-center mb-4 px-2">
                            <div className="text-purple-600 mr-3">
                              <FaUserCircle size={36} />
                            </div>
                            <div>
                              <h6 className="font-semibold text-gray-700">{user.fullName}</h6>
                              <small className="text-gray-500 text-xs">{user.email || 'user@example.com'}</small>
                            </div>
                          </div>
                          <ul className="space-y-1">
                            <li>
                              <button
                                onClick={() => {
                                  handleLogout();
                                  setIsMobileMenuOpen(false);
                                }}
                                className="w-full text-left flex items-center px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <FaSignOutAlt className="mr-3" /> Đăng xuất
                              </button>
                            </li>
                          </ul>
                        </div>
                      ) : (
                        <div className="space-y-2 px-2">
                          <Link
                            to="/register"
                            className="block w-full py-3 text-center font-medium border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-all"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Đăng ký
                          </Link>
                          <Link
                            to="/login"
                            className="block w-full py-3 text-center font-medium bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <FaUser className="inline mr-1" /> Đăng nhập
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
};
