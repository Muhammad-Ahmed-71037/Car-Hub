import { Typography, Button } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Home.css";

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Preload images for smoother experience
    const preloadImages = () => {
      const imageUrls = [
        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70'
      ];
      
      imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    };
    
    preloadImages();
  }, []);

  return (
    <div className="home-container">
      {/* Enhanced background with particles and gradient */}
      <div className="enhanced-background">
        <div className="particles">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i} 
              className="particle" 
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                width: `${Math.random() * 10 + 2}px`,
                height: `${Math.random() * 10 + 2}px`,
              }}
            ></div>
          ))}
        </div>
        
        {/* Animated gradient overlay */}
        <div className="gradient-overlay"></div>
        
        {/* Floating cars with enhanced animation */}
        <div className="floating-car">🚗</div>
        <div className="floating-car">🏎️</div>
        <div className="floating-car">🚙</div>
        <div className="floating-car">🛻</div>
        <div className="floating-car">🚓</div>
      </div>

      <div className="home-content">
        {/* Hero section with enhanced animations */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hero-section"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Title level={1} className="home-title">
              Discover Your Perfect Ride
            </Title>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Paragraph className="home-subtitle">
              Explore the best car deals in Pakistan with our trusted community of enthusiasts and experts
            </Paragraph>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="cta-buttons"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                type="primary" 
                size="large"
                onClick={() => navigate("/cars")}
                className="cta-button primary-btn"
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
                className="cta-button secondary-btn"
              >
                Sell Your Car
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Stats section */}
        <motion.div 
          className="stats-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="stat-item">
            <h3>10,000+</h3>
            <p>Verified Cars</p>
          </div>
          <div className="stat-item">
            <h3>5,000+</h3>
            <p>Happy Customers</p>
          </div>
          <div className="stat-item">
            <h3>100+</h3>
            <p>Cities Nationwide</p>
          </div>
        </motion.div>

        {/* Features section with enhanced cards */}
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
                description: "All cars are thoroughly inspected by our experts before listing to ensure quality and reliability."
              },
              {
                icon: "💰",
                title: "Best Prices",
                description: "Get the most competitive deals in the market with our price match guarantee."
              },
              {
                icon: "🛡️",
                title: "Secure Transactions",
                description: "Enjoy safe and reliable buying experience with our escrow payment protection."
              },
              {
                icon: "📞",
                title: "24/7 Support",
                description: "Our dedicated team is available round the clock to assist you with any queries."
              },
              {
                icon: "🚀",
                title: "Quick Process",
                description: "From listing to purchase, our streamlined process saves you time and effort."
              },
              {
                icon: "⭐",
                title: "Premium Experience",
                description: "Enjoy a premium car buying journey with our white-glove service."
              }
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Testimonial section */}
        {/* <motion.div 
          className="testimonial-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        > */}
          {/* <Title level={2} className="section-title">What Our Customers Say</Title> */}
          {/* <div className="testimonial-container">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"I found my dream car at an amazing price. The verification process gave me confidence in my purchase!"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">A</div>
                  <div className="author-details">
                    <h4>Ahmed Khan</h4>
                    <p>Lahore</p>
                  </div>
                </div>
              </div> */}
            {/* </div> */}
            {/* <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Selling my car was incredibly easy. I got multiple offers within hours of listing!"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">S</div>
                  <div className="author-details">
                    <h4>Sara Ahmed</h4>
                    <p>Karachi</p>
                  </div>
                </div>
              </div> */}
            {/* </div> */}
          {/* </div> */}
        {/* </motion.div> */}
      </div>
    </div>
  );
};

export default Home;