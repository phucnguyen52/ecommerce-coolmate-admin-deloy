import { useState, useEffect } from "react";
import { Spin } from "antd";
import { FaHouseUser } from "react-icons/fa";

const Customer = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const usersPerPage = 10; // Số người dùng mỗi trang

  const fetchUser = async () => {
    setLoading(true);
    try {
      const req = await fetch(`http://localhost:4000/users`);
      const res = await req.json();
      setUsers(res.data);
    } catch (error) {
      console.log("Error getting user list", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handlePageChange = (num) => {
    setPage(num);
  };

  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(users.length / usersPerPage);
    return [...Array(totalPages)].map((_, index) => (
      <button
        key={index}
        className={`border py-1 px-4 hover:border-blue-400 hover:text-blue-500 ${
          page === index + 1 ? "border-blue-400 text-blue-500" : ""
        }`}
        onClick={() => handlePageChange(index + 1)}
      >
        {index + 1}
      </button>
    ));
  };

  // Tính toán dữ liệu cho trang hiện tại
  const startIndex = (page - 1) * usersPerPage;
  const currentPageUsers = users.slice(startIndex, startIndex + usersPerPage);

  return (
    <>
      <div className="font-bold text-3xl mx-auto p-10 text-center flex justify-center items-center">
        <FaHouseUser /> <div className="pl-3">QUẢN LÍ NGƯỜI DÙNG</div>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg pb-10">
        {loading ? (
          <div className="text-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <table className="w-10/12 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mx-auto mt-8">
              <thead className="text-sm text-gray-700 uppercase dark:text-gray-400">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-800"
                  >
                    Ảnh
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-800"
                  >
                    Tên người dùng
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-800"
                  >
                    Điện thoại
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-800"
                  >
                    Lần cuối mua hàng
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-800"
                  >
                    Tổng tiền
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-800"
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPageUsers.map((user, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="px-6 py-2 bg-gray-50 dark:bg-gray-800">
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                    </td>
                    <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                      {user.name}
                    </td>
                    <td className="px-6 py-2">{user.phone}</td>
                    <td className="px-6 py-2">{user.lastPurchase}</td>
                    <td className="px-6 py-2">
                      {user.totalSpent.toLocaleString()} VND
                    </td>
                    <td className="px-6 py-2">
                      <button
                        type="button"
                        className="py-2 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      >
                        Đặt lại mật khẩu
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex gap-2 mt-20 items-center justify-center">
              {renderPaginationButtons()}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Customer;
