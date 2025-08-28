import React, { useEffect, useState } from "react";
import TableComponent from "../../components/Table/Table";
import { AiFillPrinter } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdLockReset } from "react-icons/md";
import { toast } from "react-toastify";
const ListUser = () => {
  const [expandedRow, setExpandedRow] = useState([]);

  const columns = [
    { key: "id", label: "Mã TK" },
    { key: "fullName", label: "Họ và tên" },
    { key: "email", label: "Email" },
    {
      key: "button",
      label: "Đặt lại mật khẩu",
      render: (row) => (
        <button
          onClick={(event) => handleResetPassword(event, row)}
          className="z-10 text-center mx-auto p-2 hover:bg-slate-200 hover:rounded-md"
        >
          <MdLockReset className="h-6 w-6" />
        </button>
      ),
    },
  ];

  const [data, setData] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/admin/user?sort=customer",
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setData(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleResetPassword = async (event, row) => {
    event.stopPropagation();
    try {
      const newPassword = "123456";

      const response = await axios.put(
        `http://localhost:8080/api/admin/user/${row.id}`,
        { password: newPassword },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Đặt lại mật khẩu thành công", {
          autoClose: 1000,
        });
      } else {
        console.log("Không thể đặt lại mật khẩu cho người dùng:", row.fullName);
      }
    } catch (error) {
      console.error("Lỗi khi đặt lại mật khẩu:", error);
    }
  };

  const handlePageChange = () => {
    setExpandedRow([]);
  };

  const renderExpandedRow = (row) => {
    return (
      <div className="transition-all duration-300">
        <h3 className="font-bold mb-2">Chi tiết người dùng</h3>
        <p>Email: {row.email}</p>
      </div>
    );
  };

  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/add-user");
  };

  return (
    <>
      <TableComponent
        title="Danh sách tài khoản"
        columns={columns}
        data={data.user}
        expandedRow={expandedRow}
        onRowClick={handleRowClick}
        onPageChange={handlePageChange}
        renderExpandedRow={renderExpandedRow}
        handleIsFilters={handleIsFilters}
      />
    </>
  );
};

export default ListUser;
