import { Typography, Button } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="car-background">
        <div className="floating-car">🚗</div>
        <div className="floating-car">🏎️</div>
        <div className="floating-car">🚙</div>
      </div>

      <div className="home-content">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hero-section"
        >
          <Title level={1} className="home-title">
            Discover Your Perfect Ride
          </Title>
          <Paragraph className="home-subtitle">
            Explore the best car deals in Pakistan with our trusted community
          </Paragraph>

          <div className="cta-buttons">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                type="primary" 
                size="large"
                onClick={() => navigate("/cars")}
                className="cta-button"
              >
                Browse Cars
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
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

        <div className="features-section">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="features-grid"
          >
            {[
              {
                icon: "🔍",
                title: "Verified Listings",
                description: "All cars are thoroughly inspected before listing"
              },
              {
                icon: "💰",
                title: "Best Prices",
                description: "Get the most competitive deals in the market"
              },
              {
                icon: "🛡️",
                title: "Secure Transactions",
                description: "Safe and reliable buying experience"
              }
            ].map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;