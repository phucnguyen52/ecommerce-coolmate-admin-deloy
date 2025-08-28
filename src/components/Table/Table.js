import React, { useState, useEffect } from "react";
import { MdAddBox } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";
import "./customStyles.css";
const Table = ({
  columns,
  data,
  expandedRow,
  onRowClick,
  title,
  onPageChange,
  renderExpandedRow,
  handleIsFilters,
  contentButton,
  handleAdd,
  handleFetch,
  startDate,
  endDate,
  onDateChange,
  labelFilter,
  admin,
  onRoleChange,
}) => {
  const [filters, setFilters] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset về trang đầu khi thay đổi pageSize
  };

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };
  const filteredData =
    Array.isArray(data) && data.length > 0
      ? data.filter((row) =>
          Object.keys(filters).every(
            (key) => !filters[key] || row[key].toString().includes(filters[key])
          )
        )
      : [];

  const getUniqueValues = (key) => {
    return [...new Set(data.map((item) => item[key]))];
  };

  const handleCheckAll = () => {
    if (isCheckAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((_, index) => index));
    }
    setIsCheckAll(!isCheckAll);
  };

  const handleCheckRow = (index) => {
    const updatedSelectedRows = selectedRows.includes(index)
      ? selectedRows.filter((i) => i !== index)
      : [...selectedRows, index];
    setSelectedRows(updatedSelectedRows);
  };
  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd/MM/yy HH:mm");
  };
  useEffect(() => {
    if (selectedRows.length === filteredData.length) {
      setIsCheckAll(true);
    } else {
      setIsCheckAll(false);
    }
  }, [selectedRows, filteredData]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const totalItems = filteredData.length;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const handleIconClick = (id) => {
    document.getElementById(id).showPicker();
  };

  const handleStartDateChange = (event) => {
    const newStartDate = event.target.value;
    onDateChange(newStartDate, endDate);
  };

  const handleEndDateChange = (event) => {
    const newEndDate = event.target.value;
    onDateChange(startDate, newEndDate);
  };
  const today = new Date().toISOString().split("T")[0];
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const defaultStartDate = sevenDaysAgo.toISOString().split("T")[0];
  const provider = [
    { id: "employee", fullname: "Nhân viên" },
    { id: "manager", fullname: "Quản lý" },
  ];
  const [selectedRole, setSelectedRole] = useState("");

  const handleChangeRole = (event) => {
    setSelectedRole(event.target.value);
    onRoleChange(event.target.value);
  };
  const currencyKeys = [
    "price",
    "total_amount",
    "discount",
    "totalPrice",
    "total_revenue",
  ];
  return (
    <div className="bg-white rounded-xl shadow-2xl max-h-screen m-4">
      <div className="flex justify-between items-center py-4 pl-3 bg-gray-100/80 border-b-[1px]">
        <div className="text-2xl font-bold text-cyan-600 ">{title}</div>
        <div className="flex justify-center">
          {labelFilter && (
            <div className="flex gap-4 mr-5">
              <div className="relative">
                <input
                  type="date"
                  defaultValue={defaultStartDate}
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-48 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-300 appearance-none"
                  placeholder="Ngày bắt đầu"
                  id="startDate"
                  max={today}
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={() => handleIconClick("startDate")}
                >
                  <FaRegCalendarAlt className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  defaultValue={today}
                  onChange={handleEndDateChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-48 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-300 appearance-none"
                  placeholder="Ngày kết thúc"
                  max={today}
                  id="endDate"
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={() => handleIconClick("endDate")}
                >
                  <FaRegCalendarAlt className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          )}
          {admin && (
            <div className="flex items-center gap-5 mr-3 ">
              <div className="s-2 text-base font-medium text-gray-900 dark:text-gray-300"></div>

              <select
                onChange={handleChangeRole}
                className="focus:outline-none max-w-80 py-3 px-4 pe-9 block w-full bg-gray-300 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:focus:ring-neutral-600"
              >
                <option value="" className="bg-white">
                  Chọn vị trí
                </option>
                {provider.map((provider) => (
                  <option
                    key={provider.id}
                    value={provider.id}
                    className="bg-white"
                  >
                    {provider.fullname}
                  </option>
                ))}
              </select>
            </div>
          )}
          {contentButton && (
            <button
              onClick={handleAdd}
              className="cursor-pointer flex gap-2 items-center text-nowrap rounded-md bg-gradient-to-tr mr-3 from-slate-800 to-slate-700 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              <div>
                <MdAddBox className="w-5 h-5" />
              </div>
              <div className="text-sm">{contentButton}</div>
            </button>
          )}
        </div>
      </div>
      <div
        className="h-[80vh] overflow-y-auto relative [&::-webkit-scrollbar]:w-2
                                [&::-webkit-scrollbar-track]:bg-gray-100
                                [&::-webkit-scrollbar-thumb]:bg-gray-300
                                dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                                dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        <table className="min-w-full table-auto rounded-b-xl">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="text-left pl-2 border-b">
                <div className="inline-flex items-center">
                  <label
                    className="relative flex cursor-pointer items-center rounded-full p-3"
                    htmlFor="ripple-all"
                    data-ripple-dark="true"
                  >
                    <input
                      id="ripple-all"
                      type="checkbox"
                      checked={isCheckAll}
                      onChange={handleCheckAll}
                      className="peer relative h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 shadow hover:shadow-md transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-slate-400 before:opacity-0 before:transition-opacity checked:border-slate-800 checked:bg-slate-800 checked:before:bg-slate-400 hover:before:opacity-10"
                    />
                    <span className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="1"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  </label>
                </div>
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${
                    column.key === "id" ||
                    column.key === "button" ||
                    column.key === "hinh" ||
                    column.key === "total_quantity"
                      ? "text-center"
                      : "text-left px-4 py-5"
                  } border-b`}
                >
                  <div
                    className={`${
                      column.isFilterable ? "text-xs text-cyan-500" : ""
                    }`}
                  >
                    <div>{column.label}</div>
                  </div>
                  {column.isFilterable && (
                    <select
                      className="outline-none"
                      value={filters[column.key] || ""}
                      onChange={(e) => {
                        handleFilterChange(column.key, e.target.value);
                        handleIsFilters();
                      }}
                    >
                      <option value="">Tất cả</option>
                      {getUniqueValues(column.key).map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <React.Fragment key={index}>
                <tr
                  onClick={() => onRowClick && onRowClick(index)}
                  className="cursor-pointer border-b overflow-y-auto p-2"
                >
                  <td className="pl-2">
                    <div className="inline-flex items-center">
                      <label
                        className="relative flex cursor-pointer items-center rounded-full p-3"
                        htmlFor={`ripple-${index}`}
                        data-ripple-dark="true"
                      >
                        <input
                          id={`ripple-${index}`}
                          type="checkbox"
                          className="peer relative h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 shadow hover:shadow-md transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-slate-400 before:opacity-0 before:transition-opacity checked:border-slate-800 checked:bg-slate-800 checked:before:bg-slate-400 hover:before:opacity-10"
                          checked={selectedRows.includes(index)}
                          onChange={() => handleCheckRow(index)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="1"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </span>
                      </label>
                    </div>
                  </td>

                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`${
                        column.key === "id" ||
                        column.key === "quantitySell" ||
                        column.key === "price" ||
                        column.key === "discount" ||
                        column.key === "button" ||
                        column.key === "total_quantity"
                          ? "px-4 py-2 text-center"
                          : "px-4 py-2"
                      }`}
                    >
                      {column.isImage ? (
                        <img
                          src={
                            row[column.key]
                              ? JSON.parse(row[column.key])[0]
                              : "default-image.jpg"
                          }
                          alt={column.label}
                          className="w-20 h-20 object-cover"
                          onClick={(event) => {
                            event.stopPropagation();
                          }}
                        />
                      ) : column.key === "store_date" ||
                        column.key === "orderDate" ? (
                        (() => {
                          const date = new Date(row[column.key]);
                          return format(date, "dd/MM/yy HH:mm");
                        })()
                      ) : currencyKeys.includes(column.key) ? (
                        // format tiền VNĐ
                        new Intl.NumberFormat("vi-VN").format(row[column.key]) +
                        ".000₫"
                      ) : column.render ? (
                        column.render(row)
                      ) : (
                        row[column.key]
                      )}
                    </td>
                  ))}
                </tr>

                {expandedRow && expandedRow.includes(index) && (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="px-4 py-2 bg-gray-100 shadow-inner"
                    >
                      <div>
                        <div>{renderExpandedRow(row)}</div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center bg-gray-100/80 rounded-b-xl p-3">
        <div className="flex gap-2 items-center">
          <label className="text-nowrap">Số dòng:</label>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="h-auto border border-gray-300 text-gray-600 text-sm rounded-lg block w-full py-1 px-3 focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
        <div className="text-right">
          Hiển thị từ {startItem} - {endItem} trên tổng {totalItems}
        </div>
        <div className="font-bold text-gray-300 text-sm ">
          <button
            className="mr-2 px-2 py-1 rounded cursor-pointer"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            {"|<"}
          </button>
          <button
            className="mr-2 px-2 py-1 rounded cursor-pointer"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            {"<"}
          </button>
          <span className="text-black font-normal">
            {currentPage} / {totalPages}
          </span>
          <button
            className="ml-2 px-2 py-1 rounded cursor-pointer"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            {">"}
          </button>
          <button
            className="ml-2 px-2 py-1 rounded cursor-pointer"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {">|"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
