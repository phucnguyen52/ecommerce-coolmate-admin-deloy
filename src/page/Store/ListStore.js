import React, { useEffect, useState } from "react";
import TableComponent from "../../components/Table/Table";
import { AiFillPrinter } from "react-icons/ai";
import { MdAddCircleOutline } from "react-icons/md";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
// import phieuNhapData from "./data"; // Dữ liệu phiếu nhập
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ListStore = () => {
  const [expandedRow, setExpandedRow] = useState([]);

  const columns = [
    { key: "store_id", label: "Mã phiếu" },
    { key: "store_date", label: "Ngày nhập" },
    { key: "employee", label: "Nhân viên nhập hàng" },
    { key: "provider", label: "Nhà cung cấp", isFilterable: true },

    { key: "total_price", label: "Tổng tiền" },
  ];
  const today = new Date().toISOString().split("T")[0];
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const defaultStartDate = sevenDaysAgo.toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(defaultStartDate); // Ngày bắt đầu
  const [endDate, setEndDate] = useState(today);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  const fetchStores = async (startDate, endDate) => {
    if (startDate && endDate) {
      try {
        const response = await axios.get(
          `https://ecommerce-coolmate-server-production.up.railway.app/api/admin/store?start='${startDate}'&end='${endDate}'`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setData(response.data.store);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    fetchStores(startDate, endDate);
  }, [startDate, endDate]);
  const handleDateChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };
  const handleRowClick = (index) => {
    if (expandedRow.includes(index)) {
      setExpandedRow(expandedRow.filter((rowIndex) => rowIndex !== index));
    } else {
      setExpandedRow([...expandedRow, index]);
    }
  };

  const handleIsFilters = () => {
    setExpandedRow([]);
  };

  const handlePageChange = () => {
    setExpandedRow([]);
  };

  const renderExpandedRow = (row) => {
    return (
      <div
        className={`transition-all duration-300 ml-20 ${
          expandedRow === null ? "animate-fade-out" : "animate-fade-in-down"
        }`}
      >
        <h3 className="font-bold mb-2">Chi tiết phiếu nhập</h3>
        <div className="flex gap-5 items-center">
          <div className="overflow-x-auto">
            <table className="min-w-[700px] border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Tên hàng hoá</th>
                  <th className="py-2 px-4 border-b">Màu sắc</th>
                  <th className="py-2 px-4 border-b">Size</th>
                  <th className="py-2 px-4 border-b">Số lượng</th>
                  <th className="py-2 px-4 border-b">Giá nhập</th>
                  <th className="py-2 px-4 border-b">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {row.products.map((product, productIndex) =>
                  product.details.map((detail, detailIndex) => {
                    // Chỉ hiển thị tên sản phẩm nếu đây là dòng đầu tiên của sản phẩm đó
                    const showProductName = detailIndex === 0;

                    return (
                      <tr key={`${product.product_id}-${detailIndex}`}>
                        {showProductName && (
                          <td
                            className="py-2 px-4 border-b"
                            rowSpan={product.details.length}
                          >
                            {product.product_name}
                          </td>
                        )}
                        <td className="py-2 px-4 border-b text-center">
                          {detail.color}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          {detail.size ? (
                            detail.size
                          ) : (
                            <div className="italic">(Không có size)</div>
                          )}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          {detail.stock}
                        </td>
                        <td className="py-2 px-4 border-b text-right">
                          {Math.round(detail.price).toLocaleString("vi-VN")}₫
                        </td>
                        <td className="py-2 px-4 border-b text-right">
                          {Math.round(detail.total_price).toLocaleString(
                            "vi-VN"
                          )}
                          ₫
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="w-[25%] p-2">
            <div className="flex gap-2 items-center">
              <div>
                <MdAddCircleOutline className="w-6 h-6" />
              </div>
              <div>Tổng số lượng: {row.total_stock} </div>
            </div>
            <div className="flex gap-2 items-center my-3">
              <div>
                <MdFormatListBulletedAdd className="w-6 h-6" />
              </div>
              <div>
                Tổng tiền: {Math.round(row.total_price).toLocaleString("vi-VN")}
                ₫
              </div>
            </div>
            {/* <div className="flex gap-2 items-center">
                            <div>
                                <GiConfirmed className="w-6 h-6" />
                            </div>
                            <div className="flex gap-1">
                                Trạng thái:{" "}
                                <div className="text-blue-700">
                                    {row.trangThai}
                                </div>
                            </div>
                        </div>
                        {row.trangThai === "Đang chờ xác nhận" ? (
                            <div className="mt-3 flex justify-center">
                                <button
                                    type="button"
                                    className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                >
                                    Xác nhận
                                </button>
                            </div>
                        ) : null} */}
          </div>
        </div>
      </div>
    );
  };
  const navigate = useNavigate();
  const handleAdd = () => {
    navigate("/store-receipt");
  };
  return (
    <>
      <TableComponent
        title="Danh sách nhập kho"
        contentButton="Thêm phiếu nhập"
        handleAdd={handleAdd}
        columns={columns}
        labelFilter="Lọc"
        handleFetch={fetchStores}
        data={data}
        expandedRow={expandedRow}
        onRowClick={handleRowClick}
        onPageChange={handlePageChange}
        renderExpandedRow={renderExpandedRow}
        handleIsFilters={handleIsFilters}
        startDate={startDate}
        endDate={endDate}
        onDateChange={handleDateChange}
      />
    </>
  );
};

export default ListStore;
