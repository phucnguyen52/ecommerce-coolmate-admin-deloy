import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateVoucher = () => {
  const navigate = useNavigate();
  const [unit, setUnit] = useState("percent");
  const [isUser, setIsUser] = useState(false);
  const [isCategory, setIsCategory] = useState(false);
  const [categories, setCategories] = useState();
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const fetchCategory = async () => {
    try {
      const req = await fetch(`http://localhost:8080/api/admin/category`);
      const res = await req.json();
      if (res.succes) {
        setCategories(res.category);
      }
    } catch (error) {
      console.log("Error fetch category", error);
    }
  };
  const fetchUser = async (search) => {
    try {
      const req = await fetch(
        `http://localhost:8080/api/admin/user/search?search=${search}`
      );
      const res = await req.json();
      if (res.success) {
        setUsers(res.user);
      }
    } catch (error) {
      console.log("Error fetch category", error);
    }
  };
  useEffect(() => {
    fetchCategory();
  }, []);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    const search = e.target.value;
    if (search.trim()) fetchUser(search);
  };
  const handleIsUser = (e) => {
    setIsUser(!e.target.checked);
  };
  const handleIsCategoyry = (e) => {
    setIsCategory(!e.target.checked);
  };
  const handleUnit = (e) => {
    setUnit(e.target.value);
  };
  const handleSelectUser = (u) => {
    setUsers([]);
    setSearchValue("");
    const filteredUsers =
      user.length > 0 ? user.filter((user) => user.id === u.id) : [];
    if (filteredUsers.length === 0)
      setUser([...user, { id: u.id, fullName: u.fullName }]);
  };
  const handledeleteUser = (id) => {
    setUser(user.filter((user) => user.id !== id));
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    const values = e.target.elements;
    const status = e.nativeEvent.submitter.name;
    const category = isCategory
      ? [...values.category]
          .filter((i) => i.checked === true)
          .map((i) => i.value)
      : [];
    if (isUser && user.length === 0) {
      toast.warning("Vui lòng chọn khách hàng");
      return;
    }
    if (isCategory && category.length === 0) {
      toast.warning("Vui lòng chọn lại sản phẩm");
      return;
    }
    const voucher = {
      discountCode: values.code.value,
      nameVoucher: values.name.value,
      startDate: values.dayStart.value,
      endDate: values.dayEnd.value,
      quantityDiscount: parseInt(values.count.value, 10),
      discountUnit: [...values.unit].find((i) => i.checked === true).value,
      discountValue: values.value.value,
      maximumPrice: values.max ? values.max.value : values.value.value,
      condition: values.condition.value,
      ...(isCategory && {
        category: category,
      }),
      ...(isUser && {
        user: user.map((i) => i.id),
      }),
      status: status,
    };
    try {
      const response = await axios.post(
        "http://localhost:8080/api/admin/voucher",
        voucher,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Tạo voucher thành công", {
          autoClose: 1000,
        });
        navigate("/voucher");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("Không thể kết nối đến server!");
    }
  };
  const today = new Date().toISOString().split("T")[0];
  return (
    <>
      <form onSubmit={handleCreate}>
        <div className="flex justify-between items-center py-4 pl-3 bg-gray-100/80 border-b-[1px] relative">
          <div className="text-2xl font-bold text-cyan-600 ">
            Tạo mã giảm giá
          </div>
          <div className="absolute top-4 right-4 flex gap-5">
            <button
              type="submit"
              name="draft"
              onSubmit={handleCreate}
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              LƯU BẢN NHÁP
            </button>
            <button
              type="submit"
              name="active"
              onSubmit={handleCreate}
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              LƯU VÀ KÍCH HOẠT
            </button>
          </div>
        </div>

        <div className="flex p-5 gap-3">
          <div className="w-[35%] shadow-md mr-2 rounded-lg bg-white p-6 flex flex-col gap-4">
            <div className="text-base font-bold">Thông tin khuyến mãi</div>
            <div>
              <div className="flex gap-4">
                <div class="relative w-[70%]">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autocomplete="off"
                    class="rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-100 dark:bg-gray-700 border-0 border-b-[1px] border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-b-2 peer"
                    placeholder="Nhập tên chương trình KM"
                    required
                  />
                  <label
                    htmlFor="name"
                    class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-5 bg-gray-100 pr-16 z-10 origin-[0] start-2.5 peer-focus:pr-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                  >
                    Tên chương trình KM
                  </label>
                </div>
                <div class="relative w-[30%]">
                  <input
                    type="text"
                    name="code"
                    id="code"
                    autocomplete="off"
                    class="rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-100 dark:bg-gray-700 border-0 border-b-[1px] border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-b-2 peer"
                    placeholder="Nhập mã KM"
                    required
                  />
                  <label
                    htmlFor="code"
                    class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-5 bg-gray-100 pr-12 z-10 origin-[0] start-2.5 peer-focus:pr-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                  >
                    Mã KM
                  </label>
                </div>
              </div>
            </div>

            <div class="relative w-[40%]">
              <input
                type="date"
                name="dayStart"
                id="dayStart"
                class="rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-100 dark:bg-gray-700 border-0 border-b-[1px] border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-b-2 peer"
                required
                min={today}
              />
              <label
                htmlFor="dayStart"
                class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-5 bg-gray-100 px-2 z-10 origin-[0] start-2.5 peer-focus:px-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Từ ngày
              </label>
            </div>

            <div class="relative w-[40%]">
              <input
                type="date"
                name="dayEnd"
                id="dayEnd"
                class="rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-100 dark:bg-gray-700 border-0 border-b-[1px] border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-b-2 peer"
                required
                min={today}
              />
              <label
                htmlFor="dayEnd"
                class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-5 bg-gray-100 px-2 z-10 origin-[0] start-2.5 peer-focus:px-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Đến ngày
              </label>
            </div>
            <div className="relative ">
              <input
                type="number"
                min={1}
                name="count"
                id="count"
                defaultValue={1}
                autoComplete="off"
                className="no-arrows text-right rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-100 dark:bg-gray-700 border-0 border-b-[1px] border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-b-2 peer"
                placeholder="Nhập số lượng"
                required
              />
              <label
                htmlFor="count"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-5 bg-gray-100 pr-12 z-10 origin-[0] start-2.5 peer-focus:pr-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
              >
                Số lượng
              </label>
            </div>

            <div className="flex items-center gap-3 py-4 justify-between">
              <div className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Đối tượng khách hàng áp dụng
              </div>
              <div className="flex items-center">
                <input
                  id="isUser"
                  name="isUser"
                  type="checkbox"
                  value="true"
                  defaultChecked={true}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  onChange={handleIsUser}
                />
                <label
                  htmlFor="isUser"
                  className="ms-2 text-sm text-gray-900 dark:text-gray-300"
                >
                  Tất cả
                </label>
              </div>
            </div>
            {isUser && (
              <div className="py-4">
                <div className="ms-2 text-sm italic text-gray-900 dark:text-gray-300">
                  Chọn khách hàng áp dụng KM này
                </div>

                <div class="mt-5 bg-white shadow-md flex px-4 py-3 border-b border-gray-500 focus-within:border-blue-500 overflow-hidden max-w-md mx-auto font-[sans-serif]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 192.904 192.904"
                    width="18px"
                    class="fill-gray-600 mr-3"
                  >
                    <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
                  </svg>
                  <input
                    type="email"
                    value={searchValue}
                    placeholder="Nhập tên/gmail khách hàng để tìm kiếm..."
                    class="w-full outline-none text-sm"
                    onChange={handleSearch}
                  />
                </div>
                {users?.length > 0 && (
                  <div className="max-h-64 overflow-y-auto border border-gray-300 rounded mb-4">
                    {users.map((user) => (
                      <div
                        key={user}
                        onClick={() => handleSelectUser(user)}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                      >
                        <div>{user.fullName}</div>
                        <small>{user.email}</small>
                      </div>
                    ))}
                  </div>
                )}
                {user?.length > 0 && (
                  <table className="min-w-full table-auto   bg-white">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold border-b">
                          STT
                        </th>
                        <th className="px-4 py-2 text-left font-semibold border-b">
                          Họ tên
                        </th>
                        <th
                          className="px-4 py-2 text-center border-b hover:cursor-pointer"
                          onClick={() => setUser([])}
                        >
                          Xoá tất cả
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.map((u, index) => (
                        <tr key={user.id} className="border-b">
                          <td className="px-4 py-2 text-center">{index + 1}</td>
                          <td className="px-4 py-2">{u.fullName}</td>
                          <td className="px-4 py-2 text-center">
                            <button
                              onClick={() => handledeleteUser(u.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              &#10005; {/* Dấu X */}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
          <div className="w-[65%] shadow-md mr-2 rounded-lg bg-white p-6 flex flex-col gap-4 h-min">
            <div className="text-base font-bold">Điều kiện được khuyến mãi</div>

            <div className="flex justify-around py-3 gap-3">
              <div className="relative min-w-[20%]">
                <input
                  type="number"
                  min="0"
                  defaultValue={0}
                  name="condition"
                  id="condition"
                  autoComplete="off"
                  className=" no-arrows text-right rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-100 dark:bg-gray-700 border-0 border-b-[1px] border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-b-2 peer"
                  placeholder=".000VNĐ"
                  required
                />
                <label
                  htmlFor="condition"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-5 bg-gray-100 pr-12 z-10 origin-[0] start-2.5 peer-focus:pr-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                >
                  Số lượng tối thiểu
                </label>
              </div>
              <div className="relative min-w-[20%">
                <input
                  type="number"
                  defaultValue={0}
                  min="0"
                  name="value"
                  id="value"
                  autoComplete="off"
                  className="no-arrows text-right rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-100 dark:bg-gray-700 border-0 border-b-[1px] border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-b-2 peer"
                  placeholder="Giảm giá"
                  required
                />
                <label
                  htmlFor="value"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-5 bg-gray-100 pr-12 z-10 origin-[0] start-2.5 peer-focus:pr-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                >
                  Giảm giá
                </label>
              </div>
              {unit === "percent" && (
                <div className="relative min-w-[20%">
                  <input
                    type="number"
                    defaultValue={0}
                    min="1"
                    name="max"
                    id="max"
                    autoComplete="off"
                    className="no-arrows text-right rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-100 dark:bg-gray-700 border-0 border-b-[1px] border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-b-2 peer"
                    placeholder="Tối đa"
                    required
                  />
                  <label
                    htmlFor="max"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-5 bg-gray-100 pr-12 z-10 origin-[0] start-2.5 peer-focus:pr-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                  >
                    Tối đa
                  </label>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <input
                    id="unitPercent"
                    type="radio"
                    name="unit"
                    value="percent"
                    defaultChecked={true}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onChange={handleUnit}
                  />
                  <label
                    htmlFor="unitPercent"
                    className="ms-2 text-sm text-gray-900 dark:text-gray-300"
                  >
                    %
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="unitFixedPrice"
                    type="radio"
                    name="unit"
                    value="fixedPrice"
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onChange={handleUnit}
                  />
                  <label
                    htmlFor="unitFixedPrice"
                    className="ms-2 text-sm text-gray-900 dark:text-gray-300"
                  >
                    VNĐ
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-base font-bold">
                Sản phẩm được khuyến mãi
              </div>
              <div className="flex items-center">
                <input
                  id="isCategory"
                  name="isCategory"
                  type="checkbox"
                  defaultChecked={true}
                  value="true"
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  onChange={handleIsCategoyry}
                />
                <label
                  htmlFor="isCategory"
                  className="ms-2 text-sm text-black dark:text-gray-300"
                >
                  Tất cả
                </label>
              </div>
            </div>
            {isCategory && (
              <div className="flex">
                <div className="mr-10">Chọn loại hàng khuyến mãi</div>
                {categories && (
                  <div class="mb-5">
                    {categories.map((i) => (
                      <div key={i} className="flex items-center mb-2">
                        <input
                          id="category"
                          name="category"
                          type="checkbox"
                          value={i.id}
                          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="category"
                          className="ms-2 text-sm text-black dark:text-gray-300"
                        >
                          {i.categoryName}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateVoucher;
