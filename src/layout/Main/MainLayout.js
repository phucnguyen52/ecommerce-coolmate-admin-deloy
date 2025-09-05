import React, { useState } from "react";
import Header from "../../components/Shared/Header";
import Footer from "../../components/Shared/Footer";
import { APP_ROUTER } from "../../utils/Constants";
import Cookies from "js-cookie";
import { Link, Outlet } from "react-router-dom";
import {
  FundViewOutlined,
  AppstoreOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  SolutionOutlined,
  LogoutOutlined,
  ProductOutlined,
  ImportOutlined,
  PercentageOutlined,
  SisternodeOutlined,
  ContainerOutlined,
  InboxOutlined,
  DiffOutlined,
  DeploymentUnitOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import ToggleThemeButton from "../../components/ToggleTheme/ToggleThemeButton";
import Logo from "../../components/Logo/Logo";

const { Content, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
function MainLayout() {
  const token = localStorage.getItem("token");
  const [darkTheme, setDarkTheme] = useState(false);
  const toggleTheme = () => {
    setDarkTheme((darkTheme) => !darkTheme);
  };
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const items = [
    getItem("Quản lý", "sub1", <AppstoreOutlined />, [
      getItem(
        <Link to={APP_ROUTER.REPORTS}>Tổng quan</Link>,
        "2",
        <FundViewOutlined />
      ),
      getItem(
        <Link to={APP_ROUTER.LISTORDER}>Đơn hàng</Link>,
        "3",
        <ShoppingCartOutlined />
      ),
      getItem(
        <Link to={APP_ROUTER.LISTPRODUCT}>Sản phẩm</Link>,
        "4",
        <ProductOutlined />
      ),
      getItem(
        <Link to={APP_ROUTER.LIST_STORES}>Danh sách nhập kho</Link>,
        "5",
        <ImportOutlined />
      ),
      getItem(
        <Link to={APP_ROUTER.STORE_RECEIPT}>Nhập hàng</Link>,
        "21",
        <DiffOutlined />
      ),

      getItem(
        <Link to={APP_ROUTER.VOUCHER}>Khuyến mãi</Link>,
        "7",
        <PercentageOutlined />
      ),
      getItem(
        <Link to={APP_ROUTER.LIST_CATEGORY}>Loại sản phẩm</Link>,
        "22",
        <DeploymentUnitOutlined />
      ),
      getItem(
        <Link to={APP_ROUTER.LIST_EMPLOYEE}>Nhân viên</Link>,
        "23",
        <TeamOutlined />
      ),
    ]),
    getItem("Khách hàng", "sub2", <SolutionOutlined />, [
      getItem(
        <Link to={APP_ROUTER.USER}>Khách hàng</Link>,
        "8",
        <UserOutlined />
      ),
      getItem(
        <Link to={APP_ROUTER.LIST_PROVIDER}>Nhà cung cấp</Link>,
        "9",
        <SisternodeOutlined />
      ),
    ]),

    getItem("Báo cáo", "sub4", <ContainerOutlined />, [
      getItem(
        <Link to={APP_ROUTER.REPORT_CATEGORY}>Hàng hóa</Link>,
        "16",
        <InboxOutlined />
      ),
    ]),
  ];
  if (token) {
    items.push(
      getItem(
        <Link to={APP_ROUTER.LOGOUT}>Đăng xuất</Link>,
        "20",
        <LogoutOutlined />
      )
    );
  } else {
    items.push(
      getItem(
        <Link to={APP_ROUTER.LOGIN}>Đăng nhập</Link>,
        "25",
        <LoginOutlined />
      )
    );
  }
  return (
    <>
      <div className="mx-auto w-full" style={{ maxWidth: "100vw" }}>
        <Layout
          style={{
            minHeight: "100vh",
            position: "relative",
          }}
          theme={darkTheme ? "dark" : "light"}
        >
          <Sider
            width={250}
            collapsible
            collapsed={collapsed}
            className="shadow-md overflow-y-auto max-h-screen [&::-webkit-scrollbar]:w-2
                                [&::-webkit-scrollbar-track]:bg-gray-100
                                [&::-webkit-scrollbar-thumb]:bg-gray-300
                                dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                                dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
            onCollapse={(value) => setCollapsed(value)}
            theme={darkTheme ? "dark" : "light"}
          >
            <Logo></Logo>
            <Menu
              defaultSelectedKeys={["1"]}
              mode="inline"
              items={items}
              theme={darkTheme ? "dark" : "light"}
              className="pt-5"
            />
            <ToggleThemeButton
              darkTheme={darkTheme}
              toggleTheme={toggleTheme}
            ></ToggleThemeButton>
          </Sider>

          <Layout
            className="overflow-y-auto max-h-screen [&::-webkit-scrollbar]:w-2
                                [&::-webkit-scrollbar-track]:bg-gray-100
                                [&::-webkit-scrollbar-thumb]:bg-gray-300
                                dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                                dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
          >
            <Header />
            <Content className="bg-gray-100 ">
              <Outlet />
              {/* <div>main layout</div> */}
            </Content>
          </Layout>
        </Layout>
      </div>
    </>
  );
}

export default MainLayout;
