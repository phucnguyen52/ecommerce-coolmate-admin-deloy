import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Voucher = () => {
  const [data, setData] = useState();
  const [status, setStatus] = useState();
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const fetchVoucher = async () => {
    try {
      const req = await fetch(
        `https://ecommerce-coolmate-server-production.up.railway.app/api/admin/voucher${
          status ? `?status=${status}` : ""
        }`,
        {
          credentials: "include",
        }
      );
      const res = await req.json();
      if (res.success) {
        setData(res.voucher);
      } else console.log(res.message);
    } catch (error) {
      console.log("Error get list use", error);
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    fetchVoucher();
  }, []);
  const token = localStorage.getItem("token");
  const handleRowClick = (voucher) => {
    setSelectedVoucher(voucher); // Cập nhật voucher đã chọn
  };
  const handleUpdateStatus = async () => {
    const newStatus =
      selectedVoucher.status === "active"
        ? "stop"
        : selectedVoucher.status === "stop"
        ? "active"
        : null;
    if (newStatus) {
      try {
        const response = await axios.put(
          `https://ecommerce-coolmate-server-production.up.railway.app/api/admin/voucher/${selectedVoucher.id}/status`,
          { status: newStatus },
          { withCredentials: true }
        );

        if (response.status === 200) {
          setSelectedVoucher({ ...selectedVoucher, status: newStatus });
          fetchVoucher();
        }
      } catch (error) {
        console.error("Có lỗi xảy ra khi cập nhật voucher:", error);
      }
    }
  };
  return (
    <>
      <div className="flex justify-between items-center py-4 pl-3 bg-gray-100/80 border-b-[1px] relative">
        <div className="text-2xl font-bold text-cyan-600 ">Mã giảm giá</div>
        <div className="absolute top-4 right-4 flex gap-5">
          <button
            onClick={() => {
              if (!token) {
                toast.error("Bạn cần đăng nhập để xác nhận đơn hàng!", {
                  autoClose: 1500,
                });
                return; // dừng không cho gọi API
              }
              navigate("/create-voucher");
            }}
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          >
            Thêm mới
          </button>
        </div>
      </div>
      <div className="flex m-4 ">
        <div className="w-2/3 shadow-md mr-2 rounded-lg bg-white">
          <table className="w-full text-sm text-left mx-auto mt-8">
            <thead className="text-sm text-gray-700 dark:text-gray-400">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-800"
                >
                  Tên chương trình
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-800"
                >
                  Mã
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-800"
                >
                  Trạng thái
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-800"
                >
                  Số KM còn lại
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-800"
                >
                  Thời gian
                </th>
              </tr>
            </thead>
            <tbody>
              {data ? (
                data.map((data, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-200 over:bg-blue-100 cursor-pointer"
                    onClick={() => handleRowClick(data)}
                  >
                    <td className="px-6 py-2 bg-gray-50 dark:bg-gray-800">
                      <div className="text-blue-900 text-sm">
                        {data.nameVoucher}
                      </div>
                    </td>
                    <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                      {data.discountCode}
                    </td>
                    <td className="px-6 py-2 ">
                      <div
                        className={`${
                          data.status === "active"
                            ? "bg-green-400"
                            : data.status === "stop"
                            ? "bg-gray-400"
                            : "bg-blue-300"
                        } p-1 text-center rounded-2xl`}
                      >
                        {data.status === "active"
                          ? "Hoạt động"
                          : data.status === "stop"
                          ? "Ngừng"
                          : "Bản nháp"}
                      </div>
                    </td>
                    <td className="px-6 py-2 text-center">
                      {data.quantityDiscount - data.usedCount}
                    </td>
                    <td className="px-6 py-2">
                      <div className="text-xs italic text-center">
                        {format(new Date(data.startDate), "dd/MM/yyyy")} -{" "}
                        {format(new Date(data.endDate), "dd/MM/yyyy")}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    {/* <Spin size="large" /> */}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {selectedVoucher && (
          <div className="w-1/3 shadow-md rounded-lg text-lg bg-white p-4">
            <div className="flex gap-1 my-4">
              <div className="font-bold">Tên CTKM: </div>
              <div className="font-bold text-blue-900 italic">
                {selectedVoucher.nameVoucher}
              </div>
            </div>
            <div className="flex gap-1 my-4 flex-col">
              <div className="font-bold">Khuyến mãi</div>
              <div className="italic text-base">
                Giảm {selectedVoucher.discountValue}{" "}
                {selectedVoucher.discountUnit === "percent" ? "%" : ".000VNĐ"}{" "}
                khi mua từ {selectedVoucher.condition} sản phẩm.
              </div>
            </div>
            <div className="flex gap-1 my-4 flex-col">
              <div className="font-bold">Sản phẩm áp dụng</div>
              <div className="italic text-base">
                {selectedVoucher.isAllProduct ? (
                  "Cho tất cả sản phẩm"
                ) : (
                  <>
                    <div>Các sản phẩm thuộc loại: </div>
                    <div className="font-semibold not-italic">
                      {selectedVoucher.Categories.map((i, index) => (
                        <span key={i.id}>
                          {i.categoryName}
                          {index < selectedVoucher.Categories.length - 1
                            ? ", "
                            : ""}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-1 my-4 flex-col">
              <div className="font-bold">Đối tượng áp dụng</div>
              <div className="italic text-base">
                {selectedVoucher.isAllUser ? (
                  "Cho tất cả khách hàng"
                ) : (
                  <>
                    <div>Các khách hàng có MaKH là:</div>
                    <div className="font-semibold not-italic">
                      {selectedVoucher.Users.map((i, index) => (
                        <span key={i.id}>
                          {i.id}
                          {index < selectedVoucher.Users.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-1 my-4 flex-col">
              <div className="font-bold">Thời gian áp dụng</div>
              <div className="italic text-base">
                {format(new Date(selectedVoucher.startDate), "dd/MM/yyyy")} -{" "}
                {format(new Date(selectedVoucher.endDate), "dd/MM/yyyy")}
              </div>
            </div>
            <div className="flex gap-1 my-4 flex-col">
              <div className="font-bold">Số lượt đã sử dụng</div>
              <div className="italic text-base">
                {selectedVoucher.usedCount}
              </div>
            </div>
            <button
              onClick={handleUpdateStatus}
              className=" py-2.5 px-5 me-2 mb-2 mt-4 ml-auto flex justify-end text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 "
            >
              {selectedVoucher.status === "active"
                ? "Dừng khuyến mãi"
                : selectedVoucher.status === "stop"
                ? "Kích hoạt"
                : "Bản nháp"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Voucher;
