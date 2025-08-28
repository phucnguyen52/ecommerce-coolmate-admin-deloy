import React, { useEffect, useState } from "react";
import Table from "../../components/Table/Table";
import axios from "axios";
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";
const Category = () => {
    const [expandedRow, setExpandedRow] = useState([]);
    const [data, setData] = useState([]);

    const columns = [
        { key: "categoryname", label: "Tên danh mục" },
        { key: "total_quantity", label: "Tổng số lượng" },
        { key: "total_revenue", label: "Tổng doanh thu" },
    ];

    const today = new Date().toISOString().split("T")[0];
    const startOfYear = new Date(new Date().getFullYear(), 0, 1)
        .toISOString()
        .split("T")[0];
    const [startDate, setStartDate] = useState(startOfYear);
    const [endDate, setEndDate] = useState(today);

    // Hàm fetch dữ liệu từ API
    const fetchData = async (startDate, endDate) => {
        if (startDate && endDate) {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/admin/report/category?start='${startDate}'&end='${endDate}'`,
                    {
                        withCredentials: true,
                    }
                );

                const transformedData = response.data.report.map((item) => ({
                    ...item,
                    total_revenue: Number(item.total_revenue),
                    total_quantity: Number(item.total_quantity),
                }));
                setData(transformedData);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        }
    };

    useEffect(() => {
        fetchData(startDate, endDate);
    }, [startDate, endDate]);

    const handleRowClick = (index) => {
        if (expandedRow.includes(index)) {
            setExpandedRow(
                expandedRow.filter((rowIndex) => rowIndex !== index)
            );
        } else {
            setExpandedRow([...expandedRow, index]);
        }
    };

    const handlePageChange = () => {
        setExpandedRow([]);
    };

    const handleDateChange = (newStartDate, newEndDate) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    const handleIsFilters = () => {
        setExpandedRow([]);
    };
    const renderExpandedRow = (row) => {};
    return (
        <div className="flex">
            <div className="bg-white rounded-xl shadow-2xl max-h-screen m-4 mr-0 w-1/3">
                {data.length > 0 && (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Tooltip />
                            <Pie
                                data={data}
                                dataKey="total_revenue"
                                nameKey="categoryname"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                                className="focus:outline-none"
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
                <div className="mx-auto w-fit font-semibold text-base uppercase py-5">
                    BIỂU ĐỒ DOANH THU THEO DANH MỤC
                </div>
            </div>
            <div className="w-2/3">
                <Table
                    title="Báo cáo danh mục"
                    labelFilter="Lọc"
                    handleFetch={fetchData}
                    columns={columns}
                    data={data}
                    renderExpandedRow={renderExpandedRow}
                    expandedRow={expandedRow}
                    onRowClick={handleRowClick}
                    onPageChange={handlePageChange}
                    handleIsFilters={handleIsFilters}
                    startDate={startDate}
                    endDate={endDate}
                    onDateChange={handleDateChange}
                ></Table>
            </div>
        </div>
    );
};

export default Category;
