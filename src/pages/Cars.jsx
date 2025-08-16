import { useEffect, useState } from "react";
import { Card, Row, Col, Spin, Modal, Pagination, Button, Input, Form, Divider } from "antd";
import { EyeOutlined, PhoneOutlined } from "@ant-design/icons";
import { supabase } from "../supabase/supabase";
import { db } from "../firebase/firebase";
import { collection, getDocs, addDoc, orderBy, query } from "firebase/firestore";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState({ visible: false, car: null });
  const [contactNumber, setContactNumber] = useState("");
  const [negotiationLoading, setNegotiationLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8); // cars per page

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const q = query(collection(db, "cars"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const carsData = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const car = docSnap.data();

            let imageUrl = "";
            if (car.filePath) {
              const { data: signedData, error } = await supabase
                .storage
                .from("car-images")
                .createSignedUrl(car.filePath, 3600);
              if (!error) imageUrl = signedData.signedUrl;
            }

            return { id: docSnap.id, ...car, imageUrl };
          })
        );

        setCars(carsData);
      } catch (err) {
        console.error("Error fetching cars:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Pagination logic
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCars = cars.slice(startIndex, endIndex);

  const handleContactOwner = () => {
    if (viewModal.car && viewModal.car.contactNumber) {
      setContactNumber(viewModal.car.contactNumber);
    } else {
      setContactNumber("Not available");
    }
  };

  const handleSendNegotiation = async (values) => {
    if (!viewModal.car) return;

    setNegotiationLoading(true);
    try {
      await addDoc(collection(db, "negotiations"), {
        carId: viewModal.car.id,
        proposedPrice: values.proposedPrice,
        createdAt: new Date(),
      });

      form.resetFields();
      alert("Proposed price sent to owner!");
    } catch (err) {
      console.error("Error sending negotiation:", err);
      alert("Failed to send proposal.");
    } finally {
      setNegotiationLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spin size="large" tip="Loading cars..." />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Cars on Sale</h1>

      <Row gutter={[16, 16]}>
        {paginatedCars.length > 0 ? (
          paginatedCars.map((car) => (
            <Col xs={24} sm={12} md={8} lg={6} key={car.id}>
              <Card
                hoverable
                cover={<img alt={car.title} src={car.imageUrl} className="car-image" />}
                actions={[
                  <EyeOutlined key="view" onClick={() => {
                    setViewModal({ visible: true, car });
                    setContactNumber("");
                  }} />,
                ]}
              >
                <Card.Meta
                  title={car.title}
                  description={
                    <>
                      <p><strong>Price:</strong> {car.price} PKR</p>
                      <p><strong>City:</strong> {car.city}</p>
                    </>
                  }
                />
              </Card>
            </Col>
          ))
        ) : (
          <p className="no-data">No cars available.</p>
        )}
      </Row>

      {cars.length > pageSize && (
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={cars.length}
          onChange={(page) => setCurrentPage(page)}
          style={{ textAlign: "center", marginTop: 20 }}
        />
      )}

      <Modal
        title={viewModal.car?.title}
        open={viewModal.visible}
        footer={null}
        onCancel={() => {
          setViewModal({ visible: false, car: null });
          setContactNumber("");
        }}
      >
        {viewModal.car && (
          <>
            <img
              src={viewModal.car.imageUrl}
              alt={viewModal.car.title}
              style={{ width: "100%", marginBottom: "15px" }}
            />
            <p><strong>Price:</strong> {viewModal.car.price} PKR</p>
            <p><strong>Transmission:</strong> {viewModal.car.transmission}</p>
            <p><strong>Condition:</strong> {viewModal.car.condition}</p>
            <p><strong>Engine Capacity:</strong> {viewModal.car.engineCapacity} cc</p>
            <p><strong>Color:</strong> {viewModal.car.color}</p>
            <p><strong>City:</strong> {viewModal.car.city}</p>
            <p><strong>Description:</strong> {viewModal.car.description}</p>

            <Button
              type="primary"
              icon={<PhoneOutlined />}
              block
              style={{ marginTop: 15 }}
              onClick={handleContactOwner}
            >
              Contact Owner
            </Button>

            {contactNumber && (
              <p style={{ marginTop: 10, fontWeight: "bold" }}>
                Owner Contact: {contactNumber}
              </p>
            )}

            <Divider />

            <Form form={form} onFinish={handleSendNegotiation} layout="vertical">
              <Form.Item
                name="proposedPrice"
                label="Propose a Price"
                rules={[{ required: true, message: "Please enter your proposed price" }]}
              >
                <Input type="number" placeholder="Enter amount in PKR" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={negotiationLoading}
                >
                  Send Proposal
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
}
