import React, { useEffect, useState } from "react";
import TableComponent from "../../components/Table/Table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";
import ModalCategory from "./ModalCategory";
const ListCategory = () => {
  const [data, setData] = useState([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [dataRow, setDataRow] = useState(null);
  const columns = [
    { key: "id", label: "Mã Loại" },
    { key: "categoryName", label: "Tên Loại" },
    {
      key: "categoryImage",
      label: "Hình Ảnh",
      render: (row) => (
        <img
          src={row.categoryImage}
          alt={row.categoryName}
          className="w-16 h-16 object-cover"
        />
      ),
    },
    {
      key: "button",
      label: "Chỉnh sửa",
      render: (row) => (
        <button
          onClick={() => {
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

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://ecommerce-coolmate-server-production.up.railway.app/api/admin/category",
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setData(response.data.category);
      }
    } catch (error) {
      console.error("Lỗi khi fetch:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handlePageChange = () => {};

  const handleAdd = () => {
    setOpenCreate(true);
  };
  const handleDelete = async (event, row) => {
    event.stopPropagation();
    try {
      const response = await axios.delete(
        `https://ecommerce-coolmate-server-production.up.railway.app/api/admin/category/${row.id}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.succes) {
        fetchCategories();
        toast.success("Xóa loại sản phẩm thành công", {
          autoClose: 1000,
        });
      } else {
        console.error(
          "Xóa loại sản phẩm không thành công:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi xóa loại sản phẩm:", error);
    }
  };
  return (
    <>
      <div className="w-2/3 mx-auto">
        <TableComponent
          title="Danh sách loại sản phẩm"
          columns={columns}
          data={data}
          contentButton="Thêm loại sản phẩm"
          onPageChange={handlePageChange}
          handleAdd={handleAdd}
        />
      </div>
      <ModalCategory
        type="create"
        open={openCreate}
        setOpen={setOpenCreate}
        fetchCategory={fetchCategories}
      />
      <ModalCategory
        type="update"
        open={openUpdate}
        setOpen={setOpenUpdate}
        fetchCategory={fetchCategories}
        data={dataRow}
      />
    </>
  );
};

export default ListCategory;
