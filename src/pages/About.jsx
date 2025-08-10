import { Typography, Row, Col, Card, Button } from "antd";
import { motion } from "framer-motion";
import { 
  CarOutlined, 
  RocketOutlined, 
  SafetyOutlined,
  TeamOutlined,
  DollarOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../styles/About.css";

const { Title, Paragraph } = Typography;

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <CarOutlined className="feature-icon" />,
      title: "All-in-One Platform",
      desc: "Comprehensive marketplace for buying and selling vehicles with advanced search filters.",
      color: "#00e0ff"
    },
    {
      icon: <RocketOutlined className="feature-icon" />,
      title: "Lightning Fast",
      desc: "Built with React, Firebase, and Supabase for optimal performance and real-time updates.",
      color: "#00b4db"
    },
    {
      icon: <SafetyOutlined className="feature-icon" />,
      title: "Secure Transactions",
      desc: "End-to-end encrypted communications and verified listings for your peace of mind.",
      color: "#0096c7"
    },
    {
      icon: <TeamOutlined className="feature-icon" />,
      title: "Community Trust",
      desc: "Join thousands of satisfied users in our growing automotive community.",
      color: "#0077b6"
    },
    {
      icon: <DollarOutlined className="feature-icon" />,
      title: "Best Prices",
      desc: "Competitive pricing and negotiation tools to ensure you get the best deal.",
      color: "#023e8a"
    },
    {
      icon: <CheckCircleOutlined className="feature-icon" />,
      title: "Verified Listings",
      desc: "Every vehicle undergoes a thorough inspection process before listing.",
      color: "#03045e"
    }
  ];

  return (
    <div className="about-container">
      <div className="about-hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="hero-content"
        >
          <Title level={1} className="about-title">Revolutionizing Car Trade</Title>
          <Paragraph className="about-subtext">
            Car Hub is transforming the way Pakistan buys and sells vehicles. Our platform combines cutting-edge 
            technology with deep automotive expertise to deliver an unmatched marketplace experience.
          </Paragraph>
          <div className="hero-buttons">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                type="primary" 
                size="large"
                onClick={() => navigate("/cars")}
                className="cta-button"
              >
                Browse Listings
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                type="default" 
                size="large"
                onClick={() => navigate("/sell")}
                className="cta-button secondary"
              >
                Sell Your Car
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="features-section">
        <Title level={2} className="section-title">Why Choose Car Hub?</Title>
        <Paragraph className="section-subtitle">
          We're redefining automotive commerce with these key features
        </Paragraph>
        
        <Row gutter={[24, 24]} justify="center">
          {features.map((feature, index) => (
            <Col xs={24} sm={12} md={8} lg={8} xl={8} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card 
                  bordered={false} 
                  className="feature-card"
                  style={{ borderTop: `4px solid ${feature.color}` }}
                >
                  <div className="feature-icon-container" style={{ color: feature.color }}>
                    {feature.icon}
                  </div>
                  <Title level={3} className="feature-title">{feature.title}</Title>
                  <Paragraph className="feature-desc">{feature.desc}</Paragraph>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>

      <div className="stats-section">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="stats-container"
        >
          {[
            { number: "10,000+", label: "Active Users" },
            { number: "5,000+", label: "Successful Deals" },
            { number: "200+", label: "Verified Dealers" },
            { number: "24/7", label: "Customer Support" }
          ].map((stat, index) => (
            <div key={index} className="stat-item">
              <Title level={1} className="stat-number">{stat.number}</Title>
              <Paragraph className="stat-label">{stat.label}</Paragraph>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default About;