import React, { useEffect, useState } from "react";
import TableComponent from "../../components/Table/Table";
import { AiFillPrinter } from "react-icons/ai";
import { MdAddCircleOutline } from "react-icons/md";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-toastify";
const ListOrder = () => {
  const [expandedRow, setExpandedRow] = useState([]);

  const columns = [
    { key: "order_id", label: "Mã đơn hàng" },
    { key: "orderDate", label: "Ngày bán" },
    { key: "customer_name", label: "Khách hàng" },
    { key: "statusOrder", label: "Trạng thái", isFilterable: true },
    { key: "total_amount", label: "Tổng tiền" },
    {
      key: "button",
      label: "In",
      render: (row) => (
        <button
          onClick={() => handlePrint(row)}
          className="z-10 text-center mx-auto"
        >
          <AiFillPrinter className=" h-4 w-4" />
        </button>
      ),
    },
  ];
  const today = new Date().toISOString().split("T")[0];
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const defaultStartDate = sevenDaysAgo.toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(today);
  const [data, setData] = useState([]);

  const fetchData = async (startDate, endDate) => {
    if (startDate && endDate) {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/admin/order?start='${startDate}'&end='${endDate}'`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setData(response.data.order);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    fetchData(startDate, endDate);
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
  const handlePrint = (row) => {};
  const handlePageChange = () => {
    setExpandedRow([]);
  };
  const handelUpdate = async (row) => {
    let statusOrderId;

    switch (row.statusOrder) {
      case "Đang chờ xác nhận":
        statusOrderId = "Đang chờ vận chuyển";
        break;
      case "Đang chờ vận chuyển":
        statusOrderId = "Đang giao hàng";
        break;
      case "Đang giao hàng":
        statusOrderId = "Đã giao hàng";
        break;
      default:
        console.log("Trạng thái đơn hàng không hợp lệ.");
        return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/customer/order/${row.order_id}`,
        {
          statusOrder: statusOrderId,
        }
      );

      if (response.status === 200) {
        fetchData(startDate, endDate);
        toast.success("Cập nhật thành công", {
          autoClose: 1000,
        });
      } else {
        console.log(
          "Yêu cầu không thành công, mã trạng thái:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  const renderExpandedRow = (row) => {
    return (
      <div
        className={`transition-all duration-300 ml-20 ${
          expandedRow === null ? "animate-fade-out" : "animate-fade-in-down"
        }`}
      >
        <h3 className="font-bold mb-2">Chi tiết đơn hàng</h3>
        <div className="flex gap-5 items-center">
          <div className="overflow-x-auto">
            <table className="min-w-[700px] border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Tên sản phẩm</th>
                  <th className="py-2 px-4 border-b">Màu sắc</th>
                  <th className="py-2 px-4 border-b">Size</th>
                  <th className="py-2 px-4 border-b">Số lượng</th>
                  <th className="py-2 px-4 border-b">Giá sản phẩm</th>
                  <th className="py-2 px-4 border-b">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {row.product.map((product, productIndex) =>
                  product.details.map((detail, detailIndex) => {
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
                          {detail.quantity}
                        </td>
                        <td className="py-2 px-4 border-b text-right">
                          {Math.round(detail.price).toLocaleString("vi-VN")}
                          .000
                        </td>
                        <td className="py-2 px-4 border-b text-right">
                          {Math.round(detail.total_price).toLocaleString(
                            "vi-VN"
                          )}
                          .000
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
              <div>Tổng số lượng: {row.total_quantity} </div>
            </div>
            <div className="flex gap-2 items-center my-3">
              <div>
                <MdFormatListBulletedAdd className="w-6 h-6" />
              </div>
              <div>
                Tổng tiền:{" "}
                {Math.round(row.total_amount).toLocaleString("vi-VN")}
                .000
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div>
                <GiConfirmed className="w-6 h-6" />
              </div>
              <div className="flex gap-1">
                Trạng thái:{" "}
                <div className="text-blue-700">{row.statusOrder}</div>
              </div>
            </div>
            {row.statusOrder === "Đang chờ xác nhận" ||
            row.statusOrder === "Đang chờ vận chuyển" ||
            row.statusOrder === "Đang giao hàng" ? (
              <div className="mt-3 flex justify-center">
                <button
                  onClick={() => handelUpdate(row)}
                  type="button"
                  className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  Xác nhận
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <TableComponent
        title="Đơn hàng"
        labelFilter="Lọc"
        handleFetch={fetchData}
        columns={columns}
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

export default ListOrder;
