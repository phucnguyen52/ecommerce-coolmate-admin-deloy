import React, { useEffect, useState } from "react";
import TableComponent from "../../components/Table/Table";
import axios from "axios";

const Report = () => {
    const [openCreate, setOpenCreate] = useState(false);
    const [productData, setProductData] = useState([]);
    const [customerData, setCustomerData] = useState([]);

    // Cấu hình các cột cho bảng sản phẩm
    const productColumns = [
        { key: "id", label: "Mã SP" },
        { key: "nameProduct", label: "Tên sản phẩm" },
        { key: "quantity", label: "Số lượng" },
        {
            key: "image",
            label: "Hình",
            render: (row) => (
                <img
                    src={JSON.parse(row.image)[0]}
                    alt={row.nameProduct}
                    className="w-12 h-12 object-contain"
                />
            ),
        },
    ];

    // Cấu hình các cột cho bảng khách hàng
    const customerColumns = [
        { key: "fullName", label: "Tên khách hàng" },
        {
            key: "picture",
            label: "Hình ảnh",
            render: (row) => (
                <img
                    src={row.picture}
                    alt={row.fullName}
                    
                    className="w-12 h-12 object-contain"
                />
            ),
        },
        { key: "total", label: "Số lần mua" },
        { key: "totalPrice", label: "Tổng chi tiêu" },
    ];

    // Hàm lấy dữ liệu sản phẩm
    const fetchProductData = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/admin/report/product",
                {
                    withCredentials: true,
                }
            );

            if (response.status === 200 && response.data.succes) {
                setProductData(response.data.report);
            } else {
                console.error(
                    "Lỗi khi lấy dữ liệu sản phẩm:",
                    response.data.message
                );
            }
        } catch (error) {
            console.error("Lỗi khi gọi API sản phẩm:", error);
        }
    };

    // Hàm lấy dữ liệu khách hàng
    const fetchCustomerData = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/admin/report/customer",
                {
                    withCredentials: true,
                }
            );

            if (response.status === 200 && response.data.succes) {
                setCustomerData(response.data.report);
            } else {
                console.error(
                    "Lỗi khi lấy dữ liệu khách hàng:",
                    response.data.message
                );
            }
        } catch (error) {
            console.error("Lỗi khi gọi API khách hàng:", error);
        }
    };

    // Gọi các hàm lấy dữ liệu khi component được render
    useEffect(() => {
        fetchProductData();
        fetchCustomerData();
    }, []);

    return (
        <div className="flex w-full items-center justify-center">
            <TableComponent
                columns={productColumns}
                data={productData}
                title="Sản phẩm bán chạy"
                className="w-1/2"
            />

            <TableComponent
                columns={customerColumns}
                data={customerData}
                title="Khách hàng VIP"
                className="w-1/2"
            />
        </div>
    );
};

export default Report;
