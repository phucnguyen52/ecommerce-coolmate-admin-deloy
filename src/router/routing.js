import { createBrowserRouter, redirect } from "react-router-dom";
import { APP_ROUTER } from "../utils/Constants";
import MainLayout from "../layout/Main/MainLayout";
import AuthLayout from "../layout/Auth/AuthLayout";
import HomePage from "../page/Home/HomePage";

import ProductPage from "../page/Product/ProductPage";
import Login from "../page/Auth/Login/Login";
import Register from "../page/Auth/Register/Register";
import AdminChat from "../page/Customer/AdminChat";
import LogOut from "../page/Auth/LogOut/LogOut";
import ListUser from "../page/User/ListUser";
import Voucher from "../page/Voucher/Voucher";
import CreateVoucher from "../page/Voucher/CreateVoucher";
import ListProduct from "../page/Product/ListProduct";
import ListOrder from "../page/Order/ListOrder";
import ProductDetail from "../page/Product/ProductDetail";
import ListProvider from "../page/Provider/ListProvider";
import ListStore from "../page/Store/ListStore";
import StoreReceipt from "../page/Store/StoreReceipt";
import ListCategory from "../page/Category/ListCategory";
import ReportCategory from "../page/Report/Category";
import WarehouseProduct from "../page/WareHouse/WarehouseProduct";
import ListEmployee from "../page/Employee/ListEmployee";
import Report from "../components/Admin/Report";
const router = createBrowserRouter([
    {
        path: "/",
        loader: () => {
            if (!localStorage.getItem("user")) {
                throw redirect(APP_ROUTER.LOGIN);
            }
            return null;
        },
    },
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: APP_ROUTER.HOME,
                element: <HomePage />,
                index: true,
            },
            {
                path: APP_ROUTER.PRODUCT,
                element: <ProductPage />,
            },
            {
                path: APP_ROUTER.CHAT,
                element: <AdminChat />,
            },
            {
                path: APP_ROUTER.USER,
                element: <ListUser />,
            },
            {
                path: APP_ROUTER.VOUCHER,
                element: <Voucher />,
            },
            {
                path: APP_ROUTER.CREATEVOUCHER,
                element: <CreateVoucher />,
            },
            {
                path: APP_ROUTER.LISTPRODUCT,
                element: <ListProduct />,
            },
            {
                path: APP_ROUTER.LISTORDER,
                element: <ListOrder />,
            },
            {
                path: APP_ROUTER.PRODUCTDETAIL,
                element: <ProductDetail />,
            },
            {
                path: APP_ROUTER.LIST_PROVIDER,
                element: <ListProvider />,
            },

            {
                path: APP_ROUTER.LIST_STORES,
                element: <ListStore />,
            },
            {
                path: APP_ROUTER.STORE_RECEIPT,
                element: <StoreReceipt />,
            },
            {
                path: APP_ROUTER.LIST_CATEGORY,
                element: <ListCategory />,
            },
            {
                path: APP_ROUTER.REPORT_CATEGORY,
                element: <ReportCategory />,
            },
            {
                path: APP_ROUTER.WAREHOUSE_PRODUCT,
                element: <WarehouseProduct />,
            },
            {
                path: APP_ROUTER.LIST_EMPLOYEE,
                element: <ListEmployee />,
            },
            {
                path: APP_ROUTER.REPORTS,
                element: <Report />,
            },
        ],
    },

    {
        path: APP_ROUTER.AUTH,
        element: <AuthLayout />,
        children: [
            {
                path: APP_ROUTER.LOGIN,
                element: <Login />,
                index: true,
            },
            {
                path: APP_ROUTER.REGISTER,
                element: <Register />,
            },
            {
                path: APP_ROUTER.LOGOUT,
                element: <LogOut />,
            },
        ],
    },
]);

export default router;
