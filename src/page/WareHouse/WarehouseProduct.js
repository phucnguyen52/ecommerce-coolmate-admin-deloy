import React, { useEffect, useState } from "react";
import Table from "../../components/Table/Table";
import axios from "axios";

const WarehouseProduct = () => {
    const [data, setData] = useState([]);
   
    
    const columns = [
        { key: "product_id", label: "Mã Sản phẩm" },
        { key: "product_name", label: "Tên sản phẩm" },
        { key: "total_stock", label: "Số lượng tồn" },
        { key: "cost_price", label: "Vốn tồn kho" },
        { key: "total_value", label: "Giá trị tồn" },
    ];

    const fetchStores = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/admin/stores?type=all",
                {
                    withCredentials: true,
                }
            );
            if (response.status === 200) {
                setData(response.data.store);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    return (
        <div>
            <Table title="Kho hàng" columns={columns} data={data}></Table>
        </div>
    );
};

export default WarehouseProduct;
