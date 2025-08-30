import { Layout, Row, Col, Typography, Divider, Space, Button, Tooltip } from 'antd';
import { 
  FacebookOutlined, 
  TwitterOutlined, 
  InstagramOutlined, 
  LinkedinOutlined,
  YoutubeOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  GithubOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Footer.css';

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer = () => {
  return (
    <AntFooter className="main-footer">
      <div className="footer-content">
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <Title level={4} className="footer-title">Car Hub</Title>
              <Text className="footer-description">
                Your trusted platform for buying and selling premium vehicles. 
                We connect car enthusiasts with their dream cars.
              </Text>
              <div className="social-links">
                <Space size="middle">
                  <Tooltip title="Facebook">
                    <a href="#" aria-label="Facebook"><FacebookOutlined /></a>
                  </Tooltip>
                  <Tooltip title="Twitter">
                    <a href="#" aria-label="Twitter"><TwitterOutlined /></a>
                  </Tooltip>
                  <Tooltip title="Instagram">
                    <a href="#" aria-label="Instagram"><InstagramOutlined /></a>
                  </Tooltip>
                  <Tooltip title="LinkedIn">
                    <a href="#" aria-label="LinkedIn"><LinkedinOutlined /></a>
                  </Tooltip>
                  <Tooltip title="YouTube">
                    <a href="#" aria-label="YouTube"><YoutubeOutlined /></a>
                  </Tooltip>
                  <Tooltip title="GitHub Profile">
                    <a 
                      href="https://github.com/Muhammad-Ahmed-71037" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      className="github-link"
                    >
                      <GithubOutlined />
                    </a>
                  </Tooltip>
                </Space>
              </div>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <Title level={5} className="footer-subtitle">Quick Links</Title>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/cars">Browse Cars</Link></li>
                <li><Link to="/sell">Sell Your Car</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <Title level={5} className="footer-subtitle">Support</Title>
              <ul className="footer-links">
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/feedback">Feedback</Link></li>
              </ul>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <Title level={5} className="footer-subtitle">Contact Info</Title>
              <div className="contact-info">
                <div className="contact-item">
                  <PhoneOutlined />
                  <Text>0323-2660270</Text>
                </div>
                <div className="contact-item">
                  <MailOutlined />
                  <Text>ahmed319144@gmail.com</Text>
                </div>
                <div className="contact-item">
                  <EnvironmentOutlined />
                  <Text>Karachi, Pakistan</Text>
                </div>
              </div>
              <div className="newsletter">
                <Text strong>Subscribe to our newsletter</Text>
                <div className="newsletter-form">
                  <input type="email" placeholder="Your email address" />
                  <Button type="primary">Subscribe</Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        
        <Divider className="footer-divider" />
        
        <div className="footer-bottom">
          <Row align="middle" justify="space-between">
            <Col xs={24} md={12}>
              <Text className="copyright">
                © {new Date().getFullYear()} Car Hub. Made with <HeartOutlined /> by Muhammad Ahmed
              </Text>
            </Col>
            <Col xs={24} md={12}>
              <div className="footer-bottom-right">
                <div className="payment-methods">
                  <Text>We accept:</Text>
                  <Space size="small">
                    <div className="payment-icon visa">Visa</div>
                    <div className="payment-icon mastercard">MC</div>
                    <div className="payment-icon paypal">PayPal</div>
                    <div className="payment-icon apple-pay">Apple Pay</div>
                  </Space>
                </div>
                <div className="github-profile">
                  <a 
                    href="https://github.com/Muhammad-Ahmed-71037" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="github-profile-link"
                  >
                    <GithubOutlined /> GitHub Profile
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;