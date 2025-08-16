import { useState } from "react";
import { Form, Input, Button, Checkbox, Typography } from "antd";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import { motion } from "framer-motion";
import "../styles/signup.css";
import {PAKISTAN_CNIC_PATTERN, PASSWORD_PATTERN} from "../regex/regex.js"


const SignUp = () => {
  const [form] = Form.useForm();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    const { email, password, fullName, phone, city, cnic } = values;

    if (!isValidEmail(email)) return Swal.fire("Invalid Email", "Enter valid email", "error");
    if (!isValidName(fullName)) return Swal.fire("Invalid Name", "At least 3 characters", "error");
    if (!isValidPhone(phone)) return Swal.fire("Invalid Phone", "Use 03XXXXXXXXX format", "error");
    if (!isValidCity(city)) return Swal.fire("Invalid City", "Enter valid city name", "error");
    if (!isValidCNIC(cnic)) return Swal.fire("Invalid CNIC", "Invalid format", "error");
    if (!agreeTerms) return Swal.fire("Warning", "You must agree to terms", "warning");

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email,
        fullName,
        phone,
        city,
        cnic,
        createdAt: new Date(),
      });

      dispatch(setUser({ uid: user.uid, email, fullName }));
      await Swal.fire({
        title: "Success!",
        text: "Account created successfully!",
        icon: "success",
        confirmButtonColor: "#3b82f6",
      });
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <motion.div 
        className="signup-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="signup-left-content">
          <motion.h2
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Join Our Car Community
          </motion.h2>
          <motion.p
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Discover the best deals and connect with car enthusiasts nationwide.
          </motion.p>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button 
              onClick={() => navigate("/signin")}
              className="signin-redirect-btn"
            >
              Already a member? Sign In
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
        className="signup-right"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="signup-form-box"
          whileHover={{ scale: 1.01 }}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="form-header">
              <h3>Create Your Account</h3>
              <p>Start your journey with us today</p>
            </div>

            <Form layout="vertical" form={form} onFinish={handleSubmit}>
              <Form.Item label="Full Name" name="fullName" required>
                <Input 
                  className="modern-input" 
                  prefix={<span className="input-icon">👤</span>}
                  placeholder="Ahmed"
                />
              </Form.Item>

              <Form.Item label="Email" name="email" required>
                <Input 
                  className="modern-input" 
                  prefix={<span className="input-icon">✉️</span>}
                  placeholder="example@email.com"
                />
              </Form.Item>

              <Form.Item label="Phone Number" name="phone" required>
                <Input 
                  className="modern-input" 
                  prefix={<span className="input-icon">📱</span>}
                  placeholder="03001234567"
                />
              </Form.Item>

              <Form.Item label="City" name="city" required>
                <Input 
                  className="modern-input" 
                  prefix={<span className="input-icon">🏙️</span>}
                  placeholder="Karachi"
                />
              </Form.Item>

              <Form.Item label="CNIC" name="cnic" rules={[
                {
                  required: true,
                  message: "CNIC is required",
                },
                {
                  pattern: PAKISTAN_CNIC_PATTERN,
                  message: "Please enter valid cnic",
                },
              ]}>
                <Input 
                  className="modern-input" 
                  prefix={<span className="input-icon">🆔</span>}
                  placeholder="42201-1234567-8"
                />
              </Form.Item>

              <Form.Item label="Password" name="password" rules={[
                {
                  required: true,
                  message: "Password is required",
                },
                {
                  pattern: PASSWORD_PATTERN,
                  message:
                    "Password must be 8+ chars, include uppercase, lowercase, number & special char.",
                },
              ]}>
                <Input.Password 
                  className="modern-input" 
                  prefix={<span className="input-icon">🔒</span>}
                  placeholder="••••••••"
                />
              </Form.Item>

              <Form.Item>
                <Checkbox
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="terms-checkbox"
                >
                  I agree to the <a href="/terms" className="terms-link">terms and conditions</a>. 5% commission will be charged.
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <Button 
                  htmlType="submit" 
                  className="signup-button"
                  loading={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </Form.Item>

              <div className="auth-redirect">
                Already have an account?{" "}
                <span onClick={() => navigate("/signin")}>
                  Sign In
                </span>
              </div>
            </Form>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignUp;