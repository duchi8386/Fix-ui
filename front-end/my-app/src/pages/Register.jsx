import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/AuthService.js";
import {
  FaEnvelope,
  FaHome,
  FaLock,
  FaPhone,
  FaUser,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Register = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(userData);
      navigate("/login");
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  const inputVariants = {
    focused: {
      scale: 1.02,
      boxShadow: "0 0 8px rgba(0, 123, 255, 0.4)",
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0 4px 10px rgba(40, 167, 69, 0.3)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98 },
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)",
        padding: "20px",
      }}
    >
      <motion.div
        className="card shadow"
        style={{
          width: "450px",
          borderRadius: "15px",
          overflow: "hidden",
          border: "none",
        }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div
          className="card-header text-center p-4"
          style={{
            background: "linear-gradient(45deg, #ff7eb3, #7868e6)",
            borderBottom: "none",
          }}
        >
          <h2 className="mb-0" style={{ color: "white", fontWeight: "700" }}>
            Đăng Ký Tài Khoản
          </h2>
          <p className="mb-0 text-white">
            Tham gia cùng Beauty Care ngay hôm nay
          </p>
        </div>

        <motion.div
          className="card-body p-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {error && (
            <motion.div
              className="alert alert-danger"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleRegister}>
            <motion.div
              className="mb-3 input-group"
              whileFocus="focused"
              variants={inputVariants}
            >
              <span
                className="input-group-text"
                style={{ background: "#f8f9fa" }}
              >
                <FaUser className="text-primary" />
              </span>
              <input
                type="text"
                className="form-control py-2"
                name="fullName"
                placeholder="Họ và tên"
                onChange={handleChange}
                required
              />
            </motion.div>

            <motion.div
              className="mb-3 input-group"
              whileFocus="focused"
              variants={inputVariants}
            >
              <span
                className="input-group-text"
                style={{ background: "#f8f9fa" }}
              >
                <FaEnvelope className="text-primary" />
              </span>
              <input
                type="email"
                className="form-control py-2"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />
            </motion.div>

            <motion.div
              className="mb-3 input-group"
              whileFocus="focused"
              variants={inputVariants}
            >
              <span
                className="input-group-text"
                style={{ background: "#f8f9fa" }}
              >
                <FaLock className="text-primary" />
              </span>
              <input
                type="password"
                className="form-control py-2"
                name="password"
                placeholder="Mật khẩu"
                onChange={handleChange}
                required
              />
            </motion.div>

            <motion.div
              className="mb-3 input-group"
              whileFocus="focused"
              variants={inputVariants}
            >
              <span
                className="input-group-text"
                style={{ background: "#f8f9fa" }}
              >
                <FaPhone className="text-primary" />
              </span>
              <input
                type="text"
                className="form-control py-2"
                name="phoneNumber"
                placeholder="Số điện thoại"
                onChange={handleChange}
                required
              />
            </motion.div>

            <motion.div
              className="mb-4 input-group"
              whileFocus="focused"
              variants={inputVariants}
            >
              <span
                className="input-group-text"
                style={{ background: "#f8f9fa" }}
              >
                <FaHome className="text-primary" />
              </span>
              <input
                type="text"
                className="form-control py-2"
                name="address"
                placeholder="Địa chỉ"
                onChange={handleChange}
                required
              />
            </motion.div>

            <motion.button
              type="submit"
              className="btn btn-success w-100 py-2 mb-3 d-flex align-items-center justify-content-center"
              style={{
                background: "linear-gradient(45deg, #28a745, #20c997)",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
              }}
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              disabled={isLoading}
            >
              {isLoading ? (
                <div
                  className="spinner-border spinner-border-sm text-light me-2"
                  role="status"
                >
                  <span className="visually-hidden">Đang xử lý...</span>
                </div>
              ) : (
                <>
                  Đăng Ký
                  <FaArrowRight className="ms-2" />
                </>
              )}
            </motion.button>

            <motion.div
              className="text-center mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="mb-0">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="text-decoration-none fw-bold"
                  style={{ color: "#7868e6" }}
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
