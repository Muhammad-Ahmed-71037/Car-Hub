import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <Title>404 - Page Not Found</Title>
      <Paragraph>The page you're looking for does not exist.</Paragraph>
      <Button type="primary" onClick={() => navigate("/")}>
        Go to Home
      </Button>
    </div>
  );
};

export default NotFound;