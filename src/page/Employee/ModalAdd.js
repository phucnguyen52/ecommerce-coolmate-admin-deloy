import { useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { PiEyeSlash } from "react-icons/pi";
const ModalAdd = ({ onClose, onAddEmployee }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const provider = [
    { id: "employee", fullname: "Nhân viên" },
    { id: "manager", fullname: "Quản lý" },
  ];
  const handleChangeRole = (event) => {
    setRole(event.target.value);
  };
  const handleSubmit = () => {
    const newEmployee = { fullName, email, password, role };
    onAddEmployee(newEmployee);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-6 rounded-lg shadow-lg w-1/3"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="background-transparent absolute right-[22px] top-[18px] text-sm font-bold uppercase text-black outline-none transition-all duration-150 ease-linear focus:outline-none"
          type="button"
          onClick={onClose}
        >
          <FaWindowClose className="h-8 w-8" />
        </button>
        <h2 className="text-xl font-bold mb-4">Thêm nhân viên mới</h2>
        <input
          type="text"
          placeholder="Họ và tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow mb-3"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
        />
        <div className="relative">
          <input
            type={isShowPassword === true ? "text" : "password"}
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-3 w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
          />
          <PiEyeSlash
            className="absolute right-4 top-2 h-6 w-6 cursor-pointer text-gray-400"
            onClick={() => setIsShowPassword(!isShowPassword)}
          />
        </div>
        <div className="flex items-center gap-5">
          <select
            onChange={handleChangeRole}
            className="mb-3 w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
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
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Thêm
          </button>
          <button
            onClick={onClose}
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAdd;
