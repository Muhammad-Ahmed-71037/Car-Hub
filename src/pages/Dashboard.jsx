import { useEffect, useState } from "react";
import {Layout, Menu, Card, Button, Row, Col, Spin, Modal,Typography, Divider, Statistic, Avatar, Badge, Dropdown} from "antd";
import {DashboardOutlined, ShoppingCartOutlined, CarOutlined,AlertOutlined, CalendarOutlined, PlusOutlined,EyeOutlined, EditOutlined, DeleteOutlined,BellOutlined, UserOutlined, LogoutOutlined,MenuUnfoldOutlined, MenuFoldOutlined} from "@ant-design/icons";
import { supabase } from "../supabase/supabase";
import { db } from "../firebase/firebase";
import {collection, query, where, deleteDoc, doc, onSnapshot,orderBy, limit} from "firebase/firestore";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/Dashboard.css";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState({ visible: false, car: null });
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        theme="light"
        breakpoint="lg"
      >
        <div className="logo" style={{ padding: collapsed ? '16px 8px' : '16px 24px' }}>
          {collapsed ? (
            <Avatar size="large" icon={<CarOutlined />} />
          ) : (
            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
              <CarOutlined /> CarWay
            </Title>
          )}
        </div>

        <Menu theme="light" mode="inline" defaultSelectedKeys={['dashboard']}>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="sell" icon={<PlusOutlined />}>
            <Link to="/sell">Sell Your Car</Link>
          </Menu.Item>
          <Menu.Item key="listings" icon={<ShoppingCartOutlined />}>
            My Listings
          </Menu.Item>
          <Menu.Item key="reports" icon={<AlertOutlined />}>
            Reports
          </Menu.Item>
          <Menu.Item key="calendar" icon={<CalendarOutlined />}>
            Calendar
          </Menu.Item>
        </Menu>

        {!collapsed && (
          <div style={{ padding: '16px', marginTop: 'auto' }}>
            <Divider style={{ margin: '16px 0' }} />
            <Title level={5} style={{ marginBottom: 8 }}>Enterprise Team</Title>
            <Text type="secondary" style={{ marginBottom: 16 }}>
              A new way to buy and sell cars.
            </Text>
            <Link to="/sell">
              <Button type="primary" icon={<PlusOutlined />} block>
                Sell your Car
              </Button>
            </Link>
          </div>
        )}
      </Sider>

      <Layout>
        <Header style={{
          padding: 0,
          background: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ width: 64, height: 64 }}
          />

          <div style={{ paddingRight: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
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
            >
              <Badge count={notifications.length} size="small">
                <Avatar
                  src={user?.photoURL}
                  icon={<UserOutlined />}
                  style={{ cursor: 'pointer' }}
                />
              </Badge>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{
            padding: 24,
            minHeight: 'calc(100vh - 112px)',
            background: '#fff',
            borderRadius: 8
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24
            }}>
              <Title level={3} style={{ margin: 0 }}>My Car Listings</Title>
              <Link to="/sell">
                <Button type="primary" icon={<PlusOutlined />}>
                  Add New Car
                </Button>
              </Link>
            </div>

            {cars.length === 0 ? (
              <Card style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{
                  width: 200,
                  height: 200,
                  margin: '0 auto 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '50%'
                }}>
                  <CarOutlined style={{ fontSize: 80, color: '#1890ff' }} />
                </div>
                <Title level={4}>No cars listed yet</Title>
                <Text type="secondary" style={{ marginBottom: 24 }}>
                  You haven't listed any cars for sale yet
                </Text>
                <Link to="/sell">
                  <Button type="primary" size="large" icon={<PlusOutlined />}>
                    Sell Your First Car
                  </Button>
                </Link>
              </Card>
            ) : (
              <Row gutter={[16, 16]}>
                {cars.map((car) => (
                  <Col key={car.id} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      cover={
                        <div style={{ height: 160, overflow: 'hidden' }}>
                          <img
                            alt={car.title}
                            src={car.imageUrl}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
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
                          <div style={{ marginTop: 8 }}>
                            <Statistic
                              title="Price"
                              value={car.price}
                              prefix="PKR"
                              valueStyle={{ fontSize: 18 }}
                            />
                            <Text type="secondary">{car.city}</Text>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
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
              width={800}
            >
              {viewModal.car && (
                <div style={{ marginTop: 16 }}>
                  <div style={{
                    height: 300,
                    marginBottom: 24,
                    borderRadius: 8,
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
                    <Col span={12}>
                      <Statistic title="Price" value={viewModal.car.price} prefix="PKR" />
                    </Col>
                    <Col span={12}>
                      <Statistic title="Location" value={viewModal.car.city} />
                    </Col>
                    <Col span={12}>
                      <Statistic title="Transmission" value={viewModal.car.transmission} />
                    </Col>
                    <Col span={12}>
                      <Statistic title="Condition" value={viewModal.car.condition} />
                    </Col>
                    <Col span={12}>
                      <Statistic title="Engine" value={viewModal.car.engineCapacity} suffix="cc" />
                    </Col>
                    <Col span={12}>
                      <Statistic title="Color" value={viewModal.car.color} />
                    </Col>
                    <Col span={24}>
                      <Divider orientation="left">Description</Divider>
                      <Text>{viewModal.car.description || 'No description provided'}</Text>
                    </Col>
                  </Row>
                </div>
              )}
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}