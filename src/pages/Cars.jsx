import { Card, Row, Col, Typography } from "antd";
import { CarOutlined } from "@ant-design/icons";

const { Title } = Typography;

const sampleCars = [
  {
    name: "Toyota Corolla",
    desc: "2018 model - well maintained",
  },
  {
    name: "Honda Civic",
    desc: "2020 model - low mileage",
  },
  {
    name: "Suzuki Alto",
    desc: "2019 model - great fuel average",
  },
];

const Cars = () => {
  return (
    <div style={{ padding: "40px" }}>
      <Title level={2} style={{ textAlign: "center" }}>Available Cars</Title>
      <Row gutter={[24, 24]}>
        {sampleCars.map((car, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              title={<><CarOutlined /> {car.name}</>}
              bordered={false}
              hoverable
            >
              <p>{car.desc}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Cars;
