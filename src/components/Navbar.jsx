import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { auth } from "../firebase/firebase";
import Swal from "sweetalert2";
import {
  Layout,
  Menu,
  Button,
  Drawer,
  Grid,
  Row,
  Col,
  Typography,
  Space,
} from "antd";
import {
  MenuOutlined,
  LogoutOutlined,
  LoginOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  UserAddOutlined,
  CarOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import "./Navbar.css";

const { Header } = Layout;
const { Title } = Typography;
const { useBreakpoint } = Grid;

const Navbar = () => {
  const screens = useBreakpoint();
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
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

  const handleNav = (path) => {
    setDrawerVisible(false);
    navigate(path);
  };

  const menuItems = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: <span onClick={() => handleNav("/")}>Home</span>,
    },
    {
      key: "about",
      icon: <InfoCircleOutlined />,
      label: <span onClick={() => handleNav("/about")}>About</span>,
    },
  ];

  if (user) {
    menuItems.push(
      {
        key: "sell",
        icon: <CarOutlined />,
        label: <span onClick={() => handleNav("/sell")}>Sell</span>,
      },
      {
        key: "dashboard",
        icon: <DashboardOutlined />,
        label: <span onClick={() => handleNav("/dashboard")}>Dashboard</span>,
      }
    );
  }

  const selectedKey = location.pathname === "/" ? "home" : location.pathname.replace("/", "");

  return (
    <>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          width: "100%",
          padding: "0 16px",
          backgroundColor: "#001529",
          overflowX: "hidden",
        }}
      >
        <Row align="middle" justify="space-between" wrap style={{ flexWrap: "nowrap" }}>
          <Col style={{ whiteSpace: "nowrap" }}>
            <Title level={3} style={{ color: "white", margin: 0 }}>
              <Link to="/" style={{ color: "white" }}>Car Hub</Link>
            </Title>
          </Col>
          

          {screens.md ? (
            <>
              <Col flex="auto">
                <Menu
                  mode="horizontal"
                  theme="dark"
                  selectedKeys={[selectedKey]}
                  style={{
                    justifyContent: "center",
                    borderBottom: "none",
                    background: "transparent",
                  }}
                  items={menuItems}
                />
              </Col>

              <Col style={{ whiteSpace: "nowrap", marginRight: "20px" }}>
                <Space>
                  {user ? (
                    <Button icon={<LogoutOutlined />} onClick={handleLogout} type="primary">
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Button icon={<LoginOutlined />} onClick={() => navigate("/signin")}>
                        Sign In
                      </Button>
                      <Button icon={<UserAddOutlined />} type="primary" onClick={() => navigate("/signup")}>
                        Sign Up
                      </Button>
                    </>
                  )}
                </Space>
              </Col>
            </>
          ) : (
            <Col style={{ whiteSpace: "nowrap" }}>
              <Button
                type="text"
                icon={<MenuOutlined style={{ fontSize: "20px" }} />}
                onClick={() => setDrawerVisible(true)}
                style={{ color: "white", marginRight: "20px" }}
              />
            </Col>
          )}
        </Row>
      </Header>

      <Drawer
        title="Car Hub Navigation"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={240}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          mode="vertical"
          selectedKeys={[selectedKey]}
          items={menuItems}
        />
        <div style={{ marginTop: 16, padding: "0 16px" }}>
          {user ? (
            <Button icon={<LogoutOutlined />} onClick={handleLogout} type="primary" block>
              Logout
            </Button>
          ) : (
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                icon={<LoginOutlined />}
                onClick={() => handleNav("/signin")}
                block
              >
                Sign In
              </Button>
              <Button
                icon={<UserAddOutlined />}
                type="primary"
                onClick={() => handleNav("/signup")}
                block
              >
                Sign Up
              </Button>
            </Space>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;
