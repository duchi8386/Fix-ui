import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/AuthService.js";
import { jwtDecode } from "jwt-decode";
import { FaEnvelope, FaLock, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { motion } from "framer-motion";

const Login = () => {
  const { loginUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userData = await login(email, password);
      const token = userData.token;
      await loginUser(token);
      const decodedToken = jwtDecode(userData.token);
      const userRole = decodedToken.role;

      if (userRole === "ADMIN") {
        navigate("/admin/products");
      } else {
        navigate("/home");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} xl={5}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-100"
          >
            <motion.div className="text-center mb-4" variants={itemVariants}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2,
                }}
                style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #FF7EB3, #FF518C)",
                  borderRadius: "50%",
                  padding: "1.5rem",
                  boxShadow: "0 10px 25px rgba(255, 105, 180, 0.4)",
                }}
              >
                <FaUserCircle size={70} color="white" />
              </motion.div>
              <motion.h2
                className="mt-4 fw-bold"    
                style={{ color: "#FF518C" }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Đăng Nhập
              </motion.h2>
            </motion.div>

            <motion.div
              variants={itemVariants}
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "2rem",
                boxShadow:
                  "0 15px 35px rgba(255, 105, 180, 0.2), 0 5px 15px rgba(0, 0, 0, 0.05)",
              }}
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert
                    variant="danger"
                    className="mb-4 text-center"
                    style={{
                      borderRadius: "10px",
                      border: "none",
                    }}
                  >
                    {error}
                  </Alert>
                </motion.div>
              )}

              <Form onSubmit={handleLogin}>
                <motion.div className="mb-4" variants={itemVariants}>
                  <Form.Label className="fw-bold" style={{ color: "#FF518C" }}>
                    Email
                  </Form.Label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    style={{ position: "relative" }}
                  >
                    <div className="position-relative">
                      <div
                        style={{
                          position: "absolute",
                          left: "15px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#FF6699",
                          zIndex: 5,
                        }}
                      >
                        <FaEnvelope />
                      </div>
                      <Form.Control
                        type="email"
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                          padding: "0.8rem 0.8rem 0.8rem 2.5rem",
                          borderRadius: "12px",
                          border: "2px solid transparent",
                          background: "rgba(255, 255, 255, 0.8)",
                          boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.05)",
                          transition: "all 0.3s ease",
                        }}
                        className="focus-ring focus-ring-pink"
                      />
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div className="mb-4" variants={itemVariants}>
                  <Form.Label className="fw-bold" style={{ color: "#FF518C" }}>
                    Mật khẩu
                  </Form.Label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    style={{ position: "relative" }}
                  >
                    <div className="position-relative">
                      <div
                        style={{
                          position: "absolute",
                          left: "15px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#FF6699",
                          zIndex: 5,
                        }}
                      >
                        <FaLock />
                      </div>
                      <Form.Control
                        type="password"
                        placeholder="Nhập mật khẩu của bạn"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                          padding: "0.8rem 0.8rem 0.8rem 2.5rem",
                          borderRadius: "12px",
                          border: "2px solid transparent",
                          background: "rgba(255, 255, 255, 0.8)",
                          boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.05)",
                          transition: "all 0.3s ease",
                        }}
                        className="focus-ring focus-ring-pink"
                      />
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div variants={itemVariants} className="mb-3">
                  <motion.button
                    type="submit"
                    className="btn w-100 py-3 mb-3 fw-bold text-white"
                    style={{
                      background: "linear-gradient(45deg, #FF518C, #FF85A1)",
                      border: "none",
                      borderRadius: "12px",
                      fontSize: "1.1rem",
                      boxShadow: "0 4px 15px rgba(255, 82, 140, 0.4)",
                    }}
                    disabled={isLoading}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 6px 20px rgba(255, 82, 140, 0.6)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {isLoading ? (
                      <motion.span
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        Đang xử lý...
                      </motion.span>
                    ) : (
                      "Đăng Nhập"
                    )}
                  </motion.button>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="d-flex justify-content-between mt-4"
                >
                  <motion.a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "#FF6699" }}
                    whileHover={{
                      scale: 1.05,
                      color: "#FF518C",
                      textDecoration: "underline",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Quên mật khẩu?
                  </motion.a>
                  <motion.a
                    href="/register"
                    className="text-decoration-none"
                    style={{ color: "#FF6699" }}
                    whileHover={{
                      scale: 1.05,
                      color: "#FF518C",
                      textDecoration: "underline",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Đăng ký
                  </motion.a>
                </motion.div>
              </Form>
            </motion.div>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
