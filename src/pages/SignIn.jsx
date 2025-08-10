import React from "react";
import { Form, Input, Button, Typography, Checkbox } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import "../styles/signin.css";

const { Title } = Typography;

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const { email, password } = values;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      dispatch(setUser({ uid: user.uid, email: user.email }));

      await Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        text: `You've successfully signed in as ${user.email}`,
        showConfirmButton: false,
        timer: 1500,
        background: '#f8fafc',
      });

      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-left-content">
          <motion.h2
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome to Car Hub
          </motion.h2>
          <motion.p
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Your gateway to the best car deals and automotive community
          </motion.p>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button 
              onClick={() => navigate("/signup")}
              className="auth-redirect-btn"
            >
              Don't have an account? Sign Up
            </button>
          </motion.div>
        </div>
        <div className="floating-cars">
          <div className="car-icon">🚗</div>
          <div className="car-icon">🏎️</div>
          <div className="car-icon">🚙</div>
        </div>
      </motion.div>

      <motion.div 
        className="auth-right"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="auth-form-box"
          whileHover={{ scale: 1.01 }}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="form-header">
              <h3>Sign In to Your Account</h3>
              <p>Enter your credentials to continue</p>
            </div>

            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { 
                    required: true, 
                    message: 'Please input your email!' 
                  },
                  {
                    type: 'email',
                    message: 'Please enter a valid email!',
                  }
                ]}
              >
                <Input 
                  className="modern-input" 
                  prefix={<span className="input-icon">✉️</span>}
                  placeholder="your@email.com"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password 
                  className="modern-input" 
                  prefix={<span className="input-icon">🔒</span>}
                  placeholder="••••••••"
                />
              </Form.Item>

              <Form.Item>
                <div className="auth-options">
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="remember-checkbox"
                  >
                    Remember me
                  </Checkbox>
                  <Button 
                    type="link" 
                    className="forgot-password"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot password?
                  </Button>
                </div>
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  className="auth-button"
                  loading={isLoading}
                  block
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </Form.Item>

              <div className="auth-footer">
                Don't have an account?{' '}
                <span onClick={() => navigate("/signup")}>
                  Create one now
                </span>
              </div>
            </Form>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignIn;