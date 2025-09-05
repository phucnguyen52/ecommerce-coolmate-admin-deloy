import React, { useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import TableComponent from "../../components/Table/Table";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ModalProduct from "../../components/Product/ModalProduct";

const ListProduct = () => {
  const token = localStorage.getItem("token");
  const [openCreate, setOpenCreate] = useState(false);
  const columns = [
    { key: "id", label: "Mã SP" },
    { key: "nameProduct", label: "Tên sản phẩm" },
    { key: "quantitySell", label: "Đã bán" },
    { key: "remainingQuantity", label: "Còn lại" },
    { key: "price", label: "Giá bán" },
    { key: "discount", label: "Giảm giá" },
    { key: "categoryName", label: "Loại sản phẩm", isFilterable: true },
    { key: "image", label: "Hình", isImage: true },

    {
      key: "button",
      label: "Chỉnh sửa",
      render: (row) => {
        return (
          <Link to={`/product/${row.id}`}>
            <button className="mx-auto flex p-2 hover:bg-gray-200 hover:rounded-full">
              <FiEdit className="w-5 h-5" />
            </button>
          </Link>
        );
      },
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
  const [data, setData] = useState([]);
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://ecommerce-coolmate-server-production.up.railway.app/api/customer/product?sort=price&page=1&type=DESC&max=1000000&min=0",
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        setData(response.data.product);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRowClick = (index) => {};
  const handleIsFilters = () => {};
  const handlePageChange = () => {};

  const handleDelete = async (event, row) => {
    event.stopPropagation();

    if (!token) {
      toast.error("Bạn cần đăng nhập để thực hiện chức năng này!", {
        autoClose: 1500,
      });
      return; // dừng không cho gọi API
    }
    try {
      const response = await axios.delete(
        `https://ecommerce-coolmate-server-production.up.railway.app/api/admin/product/${row.id}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        fetchProducts();
        toast.success("Xóa sản phẩm thành công", {
          autoClose: 1000,
        });
      } else {
        console.error("Có lỗi xảy ra khi xóa sản phẩm:", response.data);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi gọi API xóa sản phẩm:", error);
    }
  };
  const handleAdd = () => {
    setOpenCreate(true);
  };
  return (
    <>
      <TableComponent
        columns={columns}
        data={data}
        title="Sản phẩm"
        contentButton="Thêm sản phẩm"
        onPageChange={handlePageChange}
        onRowClick={handleRowClick}
        handleIsFilters={handleIsFilters}
        handleAdd={handleAdd}
      />
      <ModalProduct type="create" open={openCreate} setOpen={setOpenCreate} />
    </>
  );
};

export default ListProduct;
