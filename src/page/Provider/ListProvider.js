import React, { useEffect, useRef, useState } from "react";
import TableComponent from "../../components/Table/Table";
import { AiFillPrinter } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { FaWindowClose } from "react-icons/fa";
import ModalAdd from "./ModalAdd";
import axios from "axios";
import { toast } from "react-toastify";
const ListProvider = () => {
  const [expandedRow, setExpandedRow] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [data, setData] = useState([]);
  const [dataRow, setDataRow] = useState(null);
  const fetchProviders = async () => {
    try {
      const response = await axios.get(
        "https://ecommerce-coolmate-server-production.up.railway.app/api/admin/provider",
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        if (JSON.stringify(data) !== JSON.stringify(response.data.provider)) {
          setData(response.data.provider);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchProviders();
  }, [data]);

  const columns = [
    { key: "id", label: "ID" },
    { key: "fullname", label: "Tên nhà cung cấp" },
    { key: "numberPhone", label: "Số điện thoại" },
    { key: "address", label: "Địa chỉ" },
    {
      key: "button",
      label: "Chỉnh sửa",
      render: (row) => (
        <button
          onClick={(event) => {
            event.stopPropagation();

            setDataRow(row);
            setOpenUpdate(true);
          }}
          className="mx-auto flex p-2 hover:bg-gray-200 hover:rounded-full"
        >
          <FiEdit className="w-5 h-5" />
        </button>
      ),
    },
    {
      key: "button",
      label: "Xóa",
      render: (row) => (
        <button
          onClick={(event) => handleDelete(event, row)}
          className="mx-auto flex p-2 hover:bg-gray-200 hover:rounded-full"
        >
          <MdDeleteForever className="w-5 h-5" />
        </button>
      ),
    },
  ];
  const handleUpdate = (event, row) => {
    event.stopPropagation();
  };
  const handleDelete = async (event, row) => {
    event.stopPropagation();
    try {
      const response = await axios.delete(
        `https://ecommerce-coolmate-server-production.up.railway.app/api/admin/provider/${row.id}`
      );
      if (response.data.succes) {
        fetchProviders();
        toast.success("Xóa nhà cung cấp thành công", {
          autoClose: 1000,
        });
      } else {
        console.error(
          "Xóa nhà cung cấp không thành công:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi xóa nhà cung cấp:", error);
    }
  };
  const handleRowClick = (index) => {
    if (expandedRow.includes(index)) {
      setExpandedRow(expandedRow.filter((rowIndex) => rowIndex !== index));
    } else {
      setExpandedRow([...expandedRow, index]);
    }
  };

  const handlePageChange = () => {
    setExpandedRow([]);
  };

  const renderExpandedRow = (row) => {
    return (
      <div
        className={`transition-all duration-300 ${
          expandedRow === null ? "animate-fade-out" : "animate-fade-in-down"
        } p-4`}
      >
        <h3 className="font-bold mb-2">Chi tiết nhà cung cấp</h3>
        <div>
          <p>
            <strong>Tên:</strong> {row.fullname}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {row.numberPhone}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {row.address}
          </p>
        </div>
      </div>
    );
  };
  const handleModalAdd = () => {
    setOpenAdd(!openAdd);
  };
  const handleModalUpdate = (event) => {
    setOpenUpdate(!openUpdate);
  };

  return (
    <>
      <TableComponent
        title="Nhà Cung Cấp"
        contentButton="Thêm nhà cung cấp"
        columns={columns}
        data={data}
        expandedRow={expandedRow}
        onRowClick={handleRowClick}
        onPageChange={handlePageChange}
        renderExpandedRow={renderExpandedRow}
        handleAdd={handleModalAdd}
      />
      {openAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={handleModalAdd}
          ></div>
          <div className="relative mx-auto my-6 w-[60%]">
            <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
              <ModalAdd
                title="Thêm nhà cung cấp"
                labelButton="Thêm"
                handleCloseModalAddAddress={handleModalAdd}
                handleLoadData={fetchProviders}
              />
            </div>
          </div>
        </div>
      )}
      {openUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={handleModalUpdate}
          ></div>
          <div className="relative mx-auto my-6 w-[60%]">
            <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
              <ModalAdd
                title="Cập nhật nhà cung cấp"
                labelButton="Cập nhật"
                handleCloseModalUpdateAddress={handleModalUpdate}
                dataRow={dataRow}
                handleLoadData={fetchProviders}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListProvider;
