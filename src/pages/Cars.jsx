import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Spin,
  Modal,
  Pagination,
  Divider,
  message,
  Tag,
  Rate,
  Button,
  Empty,
  Avatar,
  Skeleton,
  Progress
} from "antd";
import {
  EyeOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  CalendarOutlined,
  DashboardOutlined,
  SafetyCertificateOutlined
} from "@ant-design/icons";
import { supabase } from "../supabase/supabase";
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import "../styles/Cars.css";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState({ visible: false, car: null });

  const [owner, setOwner] = useState(null);
  const [ownerLoading, setOwnerLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const q = query(collection(db, "cars"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const carsData = await Promise.all(
          snapshot.docs.map(async (d) => {
            const car = d.data();

            let imageUrl = "";
            if (car.filePath) {
              const { data, error } = await supabase.storage
                .from("car-images") 
                .createSignedUrl(car.filePath, 3600);
              if (!error && data?.signedUrl) imageUrl = data.signedUrl;
            }

            return { id: d.id, ...car, imageUrl };
          })
        );

        setCars(carsData);
      } catch (err) {
        console.error("Error fetching cars:", err);
        message.error("Failed to load cars.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCars = cars.slice(startIndex, startIndex + pageSize);

  const openCarModal = async (car) => {
    setViewModal({ visible: true, car });
    setOwner(null);
    setOwnerLoading(true);

    try {
      if (car.uid) {
        const userRef = doc(db, "users", car.uid);
        const userSnap = await getDoc(userRef);
        setOwner(userSnap.exists() ? userSnap.data() : null);
      } else {
        setOwner(null);
      }
    } catch (e) {
      console.error("Owner fetch failed:", e);
      setOwner(null);
    } finally {
      setOwnerLoading(false);
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case "excellent":
        return "green";
      case "good":
        return "blue";
      case "fair":
        return "orange";
      case "damaged":
        return "red";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
       <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" tip="Loading cars..." />
      </div>
    );
  }

  return (
    <div className="cars-container">
      <div className="cars-header">
        <h1 className="cars-main-title">Premium Cars Collection</h1>
        <p className="cars-subtitle">Discover exceptional vehicles from trusted sellers</p>
      </div>

      <div className="cars-content">
        <Row gutter={[24, 24]}>
          {paginatedCars.length > 0 ? (
            paginatedCars.map((car) => (
              <Col xs={24} sm={12} md={8} lg={6} key={car.id}>
                <Card
                  className="car-card"
                  hoverable
                  cover={
                    <div className="car-image-container">
                      <img
                        alt={car.title || car.brand || "Car"}
                        src={car.imageUrl || "/car-placeholder.jpg"}
                        className="car-image"
                      />
                      <div className="car-overlay">
                        <Button 
                          type="primary" 
                          shape="round" 
                          icon={<EyeOutlined />}
                          onClick={() => openCarModal(car)}
                        >
                          View Details
                        </Button>
                      </div>
                      {car.condition && (
                        <Tag color={getConditionColor(car.condition)} className="car-condition-tag">
                          {car.condition}
                        </Tag>
                      )}
                    </div>
                  }
                >
                  <div className="car-card-content">
                    <h3 className="car-title">{car.title || car.brand || "Car"}</h3>
                    <div className="car-price">{formatPrice(car.price || 0)} PKR</div>
                    <div className="car-details">
                      <div className="car-detail-item">
                        <CalendarOutlined /> {car.year || "N/A"}
                      </div>
                      <div className="car-detail-item">
                        <DashboardOutlined /> {car.mileage ? `${car.mileage} km` : "N/A"}
                      </div>
                    </div>
                    <div className="car-location">
                      <EnvironmentOutlined /> {car.city || "Unknown"}
                    </div>
                  </div>
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No cars available at the moment"
              >
                <Button type="primary">Check Back Later</Button>
              </Empty>
            </Col>
          )}
        </Row>

        {cars.length > pageSize && (
          <div className="cars-pagination">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={cars.length}
              onChange={(p) => setCurrentPage(p)}
              showSizeChanger={false}
              showQuickJumper
            />
          </div>
        )}
      </div>

      <Modal
        className="car-details-modal"
        title={
          <div className="modal-title">
            <CarOutlined />
            <span>{viewModal.car?.title || viewModal.car?.brand || "Car Details"}</span>
          </div>
        }
        open={viewModal.visible}
        footer={null}
        onCancel={() => {
          setViewModal({ visible: false, car: null });
          setOwner(null);
        }}
        width={800}
      >
        {viewModal.car && (
          <div className="car-modal-content">
            <div className="car-modal-image-section">
              <img
                src={viewModal.car.imageUrl || "/car-placeholder.jpg"}
                alt={viewModal.car.title || "Car"}
                className="car-modal-image"
              />
              <div className="car-modal-badge">
                <Tag color={getConditionColor(viewModal.car.condition)}>
                  {viewModal.car.condition}
                </Tag>
                <div className="car-modal-price">
                  <DollarOutlined /> {formatPrice(viewModal.car.price)} PKR
                </div>
              </div>
            </div>

            <Divider className="modal-divider" />

            <div className="car-specs-grid">
              <div className="spec-item">
                <div className="spec-icon"><CalendarOutlined /></div>
                <div className="spec-content">
                  <div className="spec-label">Year</div>
                  <div className="spec-value">{viewModal.car.year || "N/A"}</div>
                </div>
              </div>
              
              <div className="spec-item">
                <div className="spec-icon"><DashboardOutlined /></div>
                <div className="spec-content">
                  <div className="spec-label">Mileage</div>
                  <div className="spec-value">{viewModal.car.mileage ? `${viewModal.car.mileage} km` : "N/A"}</div>
                </div>
              </div>
              
              <div className="spec-item">
                <div className="spec-icon"><SafetyCertificateOutlined /></div>
                <div className="spec-content">
                  <div className="spec-label">Transmission</div>
                  <div className="spec-value">{viewModal.car.transmission || "N/A"}</div>
                </div>
              </div>
              
              <div className="spec-item">
                <div className="spec-icon"><CarOutlined /></div>
                <div className="spec-content">
                  <div className="spec-label">Engine Capacity</div>
                  <div className="spec-value">{viewModal.car.engineCapacity ? `${viewModal.car.engineCapacity} cc` : "N/A"}</div>
                </div>
              </div>
              
              <div className="spec-item">
                <div className="spec-icon"><EnvironmentOutlined /></div>
                <div className="spec-content">
                  <div className="spec-label">City</div>
                  <div className="spec-value">{viewModal.car.city || "N/A"}</div>
                </div>
              </div>
              
              <div className="spec-item">
                <div className="spec-icon">🎨</div>
                <div className="spec-content">
                  <div className="spec-label">Color</div>
                  <div className="spec-value">{viewModal.car.color || "N/A"}</div>
                </div>
              </div>
            </div>

            {viewModal.car.description && (
              <>
                <Divider className="modal-divider" />
                <div className="car-description">
                  <h4>Description</h4>
                  <p>{viewModal.car.description}</p>
                </div>
              </>
            )}

            <Divider className="modal-divider" />

            <div className="owner-section">
              <h4>
                <UserOutlined /> Owner Information
              </h4>
              
              {ownerLoading ? (
                <div className="owner-loading">
                  <Skeleton avatar active paragraph={{ rows: 2 }} />
                </div>
              ) : (
                <div className="owner-details">
                  <div className="owner-avatar">
                    <Avatar size={64} icon={<UserOutlined />} src={owner?.photoURL} />
                    <div className="owner-info">
                      <div className="owner-name">{owner?.fullName || "Not available"}</div>
                      <div className="owner-verification">Verified Seller</div>
                    </div>
                  </div>
                  
                  <div className="owner-contact">
                    {owner?.phone && (
                      <div className="contact-item">
                        <PhoneOutlined />
                        <span>{owner.phone}</span>
                      </div>
                    )}
                    
                    {owner?.email && (
                      <div className="contact-item">
                        <MailOutlined />
                        <span>{owner.email}</span>
                      </div>
                    )}
                    
                    {(!owner?.phone && !owner?.email) && (
                      <div className="no-contact">Contact information not available</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}