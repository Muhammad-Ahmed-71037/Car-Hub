import { useEffect, useState } from "react";
import {
  Layout, Menu, Card, Button, Row, Col, Spin, Modal, 
  Typography, Divider, Statistic, Avatar, Badge, Dropdown, 
  Grid, Drawer 
} from "antd";
import { 
  DashboardOutlined, ShoppingCartOutlined, CarOutlined, 
  AlertOutlined, CalendarOutlined, PlusOutlined,
  EyeOutlined, EditOutlined, DeleteOutlined,
  BellOutlined, UserOutlined, LogoutOutlined, 
  MenuUnfoldOutlined, MenuFoldOutlined 
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabase/supabase";
import { db } from "../firebase/firebase";
import { collection, query, where, deleteDoc, doc, onSnapshot, orderBy, limit } from "firebase/firestore";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/Dashboard.css";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState({ visible: false, car: null });
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false); 
  const navigate = useNavigate();
  const screens = useBreakpoint();

  useEffect(() => {
    if (screens.xs || screens.sm) {
      setCollapsed(true);
    }
  }, [screens]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const q = query(collection(db, "cars"), where("uid", "==", user?.uid));

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
          const carsData = await Promise.all(
            querySnapshot.docs.map(async (docSnap) => {
              const data = docSnap.data();

              const { data: signedData } = await supabase
                .storage
                .from("car-images")
                .createSignedUrl(data.filePath, 60 * 60);

              return {
                id: docSnap.id,
                ...data,
                imageUrl: signedData?.signedUrl || ""
              };
            })
          );

          setCars(carsData);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching cars:", error);
        setLoading(false);
      }
    };

    const fetchNotifications = async () => {
      if (!user?.uid) return;

      try {
        const q = query(
          collection(db, "notifications"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(5)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchCars();
    fetchNotifications();
  }, [user?.uid]);

  const handleDelete = async (carId, filePath) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete your car listing.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { error: storageError } = await supabase
            .storage
            .from("car-images")
            .remove([filePath]);

          if (storageError) throw storageError;

          await deleteDoc(doc(db, "cars", carId));

          Swal.fire("Deleted!", "Your car listing has been removed.", "success");
        } catch (error) {
          console.error(error);
          Swal.fire("Error!", "Failed to delete the listing.", "error");
        }
      }
    });
  };

  const handleLogout = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        auth.signOut();
        dispatch(logoutUser());
        navigate("/");
        Swal.fire("Logged Out", "You have been logged out.", "success");
      }
    });
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spin size="large" tip="Loading your listings..." />
      </div>
    );
  }

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: 'sell',
      icon: <PlusOutlined />,
      label: <Link to="/sell" onClick={() => setMobileDrawerVisible(false)}>Sell Your Car</Link>
    },
    {
      key: 'listings',
      icon: <ShoppingCartOutlined />,
      label: 'My Listings'
    },
    {
      key: 'reports',
      icon: <AlertOutlined />,
      label: 'Reports'
    },
    {
      key: 'calendar',
      icon: <CalendarOutlined />,
      label: 'Calendar'
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!screens.xs && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={250}
          theme="light"
          breakpoint="lg"
          collapsedWidth={80}
          trigger={null}
          className="dashboard-sider"
        >
          <div className="logo" style={{ padding: collapsed ? '16px 8px' : '16px 24px' }}>
            {collapsed ? (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Avatar size="large" icon={<CarOutlined />} />
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                  <CarOutlined /> Car Hub
                </Title>
              </motion.div>
            )}
          </div>

          <Menu theme="light" mode="inline" defaultSelectedKeys={['dashboard']} items={menuItems} />

          {!collapsed && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ padding: '16px', marginTop: 'auto' }}
            >
              <Divider style={{ margin: '16px 0' }} />
              <Title level={5} style={{ marginBottom: 8 }}>Enterprise Team</Title>
              <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                A new way to buy and sell cars.
              </Text>
              <Link to="/sell">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="primary" icon={<PlusOutlined />} block>
                    Sell your Car
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          )}
        </Sider>
      )}

      <Layout>
        <Header style={{
          padding: '0 16px',
          background: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
          height: '64px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {screens.xs && (
              <Button
                type="text"
                icon={<MenuUnfoldOutlined />}
                onClick={() => setMobileDrawerVisible(true)}
                style={{ marginRight: '16px' }}
              />
            )}
            {!screens.xs && (
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ marginRight: '16px' }}
              />
            )}
            <Title level={4} style={{ margin: 0, display: screens.xs ? 'none' : 'block' }}>My Dashboard</Title>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="profile" icon={<UserOutlined />}>
                    My Profile
                  </Menu.Item>
                  <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                    Logout
                  </Menu.Item>
                </Menu>
              }
              placement="bottomRight"
              trigger={['click']}
            >
              <Badge count={notifications.length} size="small">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Avatar
                    src={user?.photoURL}
                    icon={<UserOutlined />}
                    style={{ cursor: 'pointer' }}
                  />
                </motion.div>
              </Badge>
            </Dropdown>
          </div>
        </Header>

        {/* Mobile sidebar drawer */}
        {screens.xs && (
          <Drawer
            placement="left"
            onClose={() => setMobileDrawerVisible(false)}
            open={mobileDrawerVisible}
            bodyStyle={{ padding: 0 }}
            width={250}
            closable={false}
          >
            <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={4} style={{ margin: 0, color: '#1890ff', display: 'flex', alignItems: 'center' }}>
                <CarOutlined style={{ marginRight: '8px' }} /> Car Hub
              </Title>
              <Button 
                type="text" 
                icon={<MenuFoldOutlined />} 
                onClick={() => setMobileDrawerVisible(false)}
              />
            </div>
            <Menu 
              theme="light" 
              mode="inline" 
              defaultSelectedKeys={['dashboard']} 
              items={menuItems}
              onClick={() => setMobileDrawerVisible(false)}
            />
            <Divider style={{ margin: '16px 0' }} />
            <div style={{ padding: '16px' }}>
              <Title level={5} style={{ marginBottom: 8 }}>Enterprise Team</Title>
              <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                A new way to buy and sell cars.
              </Text>
              <Link to="/sell" onClick={() => setMobileDrawerVisible(false)}>
                <Button type="primary" icon={<PlusOutlined />} block>
                  Sell your Car
                </Button>
              </Link>
            </div>
          </Drawer>
        )}

        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              padding: '24px',
              background: '#fff',
              borderRadius: '8px',
              minHeight: 'calc(100vh - 112px)'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <Title level={3} style={{ margin: 0 }}>My Car Listings</Title>
              <Link to="/sell">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="primary" icon={<PlusOutlined />} size={screens.xs ? "small" : "default"}>
                    Add New Car
                  </Button>
                </motion.div>
              </Link>
            </div>

            {cars.length === 0 ? (
              <Card style={{ textAlign: 'center', padding: '40px 0' }}>
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    width: '200px',
                    height: '200px',
                    margin: '0 auto 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '50%'
                  }}
                >
                  <CarOutlined style={{ fontSize: '80px', color: '#1890ff' }} />
                </motion.div>
                <Title level={4}>No cars listed yet</Title>
                <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
                  You haven't listed any cars for sale yet
                </Text>
                <Link to="/sell">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button type="primary" size="large" icon={<PlusOutlined />}>
                      Sell Your First Car
                    </Button>
                  </motion.div>
                </Link>
              </Card>
            ) : (
              <Row gutter={[16, 16]}>
                <AnimatePresence>
                  {cars.map((car, index) => (
                    <Col key={car.id} xs={24} sm={12} md={8} lg={6}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <Card
                          hoverable
                          className="car-card"
                          cover={
                            <div style={{ height: '160px', overflow: 'hidden' }}>
                              <img
                                alt={car.title}
                                src={car.imageUrl}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  transition: 'transform 0.3s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                              />
                            </div>
                          }
                          actions={[
                            <EyeOutlined
                              key="view"
                              onClick={() => setViewModal({ visible: true, car })}
                            />,
                            <EditOutlined
                              key="edit"
                              onClick={() => navigate(`/edit-car/${car.id}`)}
                            />,
                            <DeleteOutlined
                              key="delete"
                              onClick={() => handleDelete(car.id, car.filePath)}
                            />
                          ]}
                        >
                          <Card.Meta
                            title={car.title}
                            description={
                              <div style={{ marginTop: '8px' }}>
                                <Statistic
                                  title="Price"
                                  value={car.price}
                                  prefix="PKR"
                                  valueStyle={{ fontSize: '18px' }}
                                />
                                <Text type="secondary">{car.city}</Text>
                              </div>
                            }
                          />
                        </Card>
                      </motion.div>
                    </Col>
                  ))}
                </AnimatePresence>
              </Row>
            )}

            <Modal
              title={viewModal.car?.title}
              open={viewModal.visible}
              onCancel={() => setViewModal({ visible: false, car: null })}
              footer={[
                <Button
                  key="edit"
                  type="primary"
                  onClick={() => {
                    setViewModal({ visible: false, car: null });
                    navigate(`/edit-car/${viewModal.car?.id}`);
                  }}
                >
                  Edit Listing
                </Button>,
                <Button
                  key="close"
                  onClick={() => setViewModal({ visible: false, car: null })}
                >
                  Close
                </Button>
              ]}
              width={screens.xs ? "100%" : "90%"}
              style={{ top: screens.xs ? 0 : 20 }}
              wrapClassName="car-modal-wrapper"
              bodyStyle={{ padding: '16px', maxHeight: '70vh', overflowY: 'auto' }}
              className="car-detail-modal"
            >
              {viewModal.car && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ marginTop: '16px' }}
                >
                  <div style={{
                    height: screens.xs ? '150px' : '200px',
                    marginBottom: '24px',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={viewModal.car.imageUrl}
                      alt={viewModal.car.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Statistic title="Price" value={viewModal.car.price} prefix="PKR" />
                    </Col>
                    <Col xs={24} sm={12}>
                      <Statistic title="Location" value={viewModal.car.city} />
                    </Col>
                    <Col xs={24} sm={12}>
                      <Statistic title="Transmission" value={viewModal.car.transmission} />
                    </Col>
                    <Col xs={24} sm={12}>
                      <Statistic title="Condition" value={viewModal.car.condition} />
                    </Col>
                    <Col xs={24} sm={12}>
                      <Statistic title="Engine" value={viewModal.car.engineCapacity} suffix="cc" />
                    </Col>
                    <Col xs={24} sm={12}>
                      <Statistic title="Color" value={viewModal.car.color} />
                    </Col>
                    <Col span={24}>
                      <Divider orientation="left">Description</Divider>
                      <Text>{viewModal.car.description || 'No description provided'}</Text>
                    </Col>
                  </Row>
                </motion.div>
              )}
            </Modal>
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
}