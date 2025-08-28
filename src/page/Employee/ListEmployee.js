import React, { useEffect, useState } from "react";
import TableComponent from "../../components/Table/Table";
import { AiFillPrinter } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdLockReset } from "react-icons/md";
import { toast } from "react-toastify";
import ModalAdd from "./ModalAdd";
const ListEmployee = () => {
  const [expandedRow, setExpandedRow] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/admin/user?sort=${selectedRole}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setData(response.data.user.user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRole]);

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
        `http://localhost:8080/api/customer/${row.id}`,
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
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleAddEmployee = async (newEmployee) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/admin/user",
        newEmployee,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Thêm nhân viên thành công", { autoClose: 1000 });
        fetchUsers();
        handleModalClose();
      }
    } catch (error) {
      console.error("Lỗi khi thêm nhân viên:", error);
    }
  };

  return (
    <>
      <TableComponent
        title="Danh sách nhân viên"
        contentButton="Thêm nhân viên"
        columns={columns}
        data={data}
        admin="admin"
        handleAdd={handleAdd}
        expandedRow={expandedRow}
        onRowClick={handleRowClick}
        onPageChange={handlePageChange}
        renderExpandedRow={renderExpandedRow}
        handleIsFilters={handleIsFilters}
        onRoleChange={handleRoleChange}
      />
      {isModalOpen && (
        <ModalAdd
          onClose={handleModalClose}
          onAddEmployee={handleAddEmployee}
        ></ModalAdd>
      )}
    </>
  );
};

export default ListEmployee;
