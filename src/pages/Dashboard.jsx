import { useEffect, useState } from "react";
import { Card, Row, Col, Spin, Modal, Tag, Space, Button } from "antd";
import { EditOutlined, EyeOutlined, DeleteOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabase/supabase";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { uid } = useSelector((state) => state.auth.user || {});
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState({ visible: false, car: null });
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    const fetchCars = async () => {
      if (!uid) return;

      try {
        const q = query(collection(db, "cars"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        const carsData = await Promise.all(
          querySnapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();

            // Generate signed URL for private Supabase bucket
            const { data: signedData, error } = await supabase
              .storage
              .from("car-images")
              .createSignedUrl(data.filePath, 3600);

            if (error) {
              console.error("Error generating signed URL:", error);
              return null;
            }

            return {
              id: docSnap.id,
              ...data,
              imageUrl: signedData.signedUrl
            };
          })
        );

        setCars(carsData.filter(Boolean));
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [uid]);

  const handleDelete = async (carId, filePath) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete your car listing and its image.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // 1. Delete from Supabase Storage
          const { error: storageError } = await supabase
            .storage
            .from("car-images")
            .remove([filePath]); // Must be exact path, e.g., `${uid}/filename.jpg`

          if (storageError) {
            console.error("Error deleting from Supabase:", storageError);
          }

          console.log([filePath]);
          
          // 2. Delete from Firestore
          await deleteDoc(doc(db, "cars", carId));

          // 3. Update state
          setCars((prev) => prev.filter((car) => car.id !== carId));

          Swal.fire("Deleted!", "Your car listing has been deleted.", "success");
        } catch (error) {
          console.error(error);
          Swal.fire("Error!", "Failed to delete the listing.", "error");
        }
      }
    });
  };


  const toggleFavorite = (carId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(carId)) {
        newFavorites.delete(carId);
      } else {
        newFavorites.add(carId);
      }
      return newFavorites;
    });
  };

  if (loading) {
    return (
      <motion.div
        className="dashboard-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Spin size="large" />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Car Listings</h1>
        <div className="stats">
          <Tag color="blue">Total: {cars.length}</Tag>
          <Tag color="green">Favorites: {favorites.size}</Tag>
        </div>
      </div>

      <AnimatePresence>
        {cars.length > 0 ? (
          <Row gutter={[24, 24]}>
            {cars.map((car) => (
              <Col xs={24} sm={12} md={8} lg={6} key={car.id}>
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Card
                    hoverable
                    cover={
                      <div className="car-image-container">
                        <img
                          alt={car.title}
                          src={car.imageUrl}
                          className="car-image"
                        />
                        <button
                          className="favorite-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(car.id);
                          }}
                        >
                          {favorites.has(car.id) ? (
                            <HeartFilled style={{ color: '#ff4d4f' }} />
                          ) : (
                            <HeartOutlined />
                          )}
                        </button>
                      </div>
                    }
                    actions={[
                      <EyeOutlined
                        key="view"
                        onClick={() => setViewModal({ visible: true, car })}
                      />,
                      <EditOutlined
                        key="edit"
                        onClick={() => console.log("Edit", car.id)}
                      />,
                      <DeleteOutlined
                        key="delete"
                        onClick={() => handleDelete(car.id)}
                      />
                    ]}
                  >
                    <Card.Meta
                      title={car.title}
                      description={
                        <>
                          <Space direction="vertical" size="small">
                            <Tag color="gold">PKR: {car.price}</Tag>
                            <Tag color="geekblue">{car.city}</Tag>
                            <Tag color="volcano">{car.transmission}</Tag>
                          </Space>
                        </>
                      }
                    />
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        ) : (
          <motion.div
            className="no-data-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="no-data-content">
              <h2>No car listings found</h2>
              <p>Start by adding your first car listing</p>
              <Button type="primary">Add New Car</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <Modal
        title={viewModal.car?.title}
        open={viewModal.visible}
        footer={null}
        onCancel={() => setViewModal({ visible: false, car: null })}
        width={800}
      >
        {viewModal.car && (
          <div className="car-details-modal">
            <motion.img
              src={viewModal.car.imageUrl}
              alt={viewModal.car.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            />
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Price:</span>
                <span className="detail-value">PKR{viewModal.car.price}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Transmission:</span>
                <span className="detail-value">{viewModal.car.transmission}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Condition:</span>
                <span className="detail-value">{viewModal.car.condition}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Engine:</span>
                <span className="detail-value">{viewModal.car.engineCapacity} cc</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Color:</span>
                <span className="detail-value">{viewModal.car.color}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">City:</span>
                <span className="detail-value">{viewModal.car.city}</span>
              </div>
            </div>
            <div className="modal-footer">
              <Button
                type="primary"
                onClick={() => console.log("Contact seller")}
              >
                Contact Seller
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}