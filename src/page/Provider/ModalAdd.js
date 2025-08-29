import React, { useEffect, useState } from "react";
import {
  apiGetPublicProvinces,
  apiGetPublicDistrict,
  apiGetPublicWard,
} from "../../services/ApiAddress";

import { FaWindowClose } from "react-icons/fa";
import Select from "./Select";
import InputReadOnly from "./InputReadOnly";
import axios from "axios";
import { toast } from "react-toastify";

const ModalAdd = ({
  title,
  labelButton,
  handleCloseModalAddAddress,
  handleCloseModalUpdateAddress,
  handleUpdateAddress,
  handleLoadData,
  dataRow,
}) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [reset, setReset] = useState(false);
  const [loading, setLoading] = useState(false);

  const [supplierInfo, setSupplierInfo] = useState({
    name: "",
    phone: "",
    address: "",
    numberAddress: "",
  });
  useEffect(() => {
    const loadDataRow = async () => {
      setLoading(true);
      if (dataRow && provinces.length > 0) {
        setSupplierInfo({
          name: dataRow.fullname,
          phone: dataRow.numberPhone,
          address: dataRow.address,
          numberAddress: dataRow?.address?.split(", ")[0] || "",
        });
        const parts = dataRow.address.split(", ");

        const wardName = parts[1] || "";
        const districtName = parts[2] || "";
        const provinceName = parts[3] || "";
        let provinceList = provinces;
        if (!provinceList || provinceList.length === 0) {
          const res = await apiGetPublicProvinces();
          if (res.status === 200) {
            provinceList = res.data;
            setProvinces(provinceList);
          } else {
            console.error("Failed to fetch provinces");
            return;
          }
        }
        const foundProvince = provinceList.find((p) => p.name === provinceName);
        if (!foundProvince) return;
        setProvince(foundProvince.code);

        const districtRes = await apiGetPublicDistrict(foundProvince.code);
        if (districtRes.status !== 200) return;
        const districtList = districtRes.data.districts || [];

        const foundDistrict = districtList.find((d) => d.name === districtName);
        if (!foundDistrict) return;
        setDistrict(foundDistrict.code);

        const wardRes = await apiGetPublicWard(foundDistrict.code);
        if (wardRes.status !== 200) return;
        const wardList = wardRes.data.wards || [];

        const foundWard = wardList.find((w) => w.name === wardName);
        if (!foundWard) return;
        setWard(foundWard.code);
        setLoading(false);
      }
    };

    loadDataRow();
  }, [dataRow, provinces]);

  useEffect(() => {
    const fetchPublicProvince = async () => {
      const response = await apiGetPublicProvinces();
      if (response.status === 200) {
        setProvinces(response?.data);
      }
    };
    fetchPublicProvince();
  }, []);
  useEffect(() => {
    setDistrict(null);
    const fetchPublicDistrict = async () => {
      const response = await apiGetPublicDistrict(province);
      if (response.status === 200) {
        setDistricts(response.data?.districts);
      }
    };
    province && fetchPublicDistrict();
    !province ? setReset(true) : setReset(false);
    !province && setDistricts([]);
  }, [province]);
  useEffect(() => {
    setWard(null);
    const fetchPublicWard = async () => {
      const response = await apiGetPublicWard(district);
      if (response.status === 200) {
        setWards(response.data?.wards);
      }
    };
    district && fetchPublicWard();
    !district ? setReset(true) : setReset(false);
    !district && setWards([]);
  }, [district]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupplierInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const formatAddress = () => {
    return `${
      supplierInfo.numberAddress ? `${supplierInfo.numberAddress}, ` : ""
    }${ward ? `${wards?.find((item) => item.code == ward)?.name},` : ""} ${
      district
        ? `${districts?.find((item) => item.code == district)?.name},`
        : ""
    } ${
      province ? provinces?.find((item) => item.code == province)?.name : ""
    }`;
  };
  useEffect(() => {
    const address = formatAddress();
    setSupplierInfo((prev) => ({
      ...prev,
      address: address,
    }));
  }, [supplierInfo.numberAddress, ward, district, province]);
  const handleAddProvider = async (supplierInfo) => {
    try {
      const response = await axios.post(
        "https://ecommerce-coolmate-server-production.up.railway.app/api/admin/provider",
        {
          address: supplierInfo.address,
          numberPhone: supplierInfo.phone,
          fullname: supplierInfo.name,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        handleLoadData();
        toast.success("Thêm nhà cung cấp thành công", {
          autoClose: 1000,
        });
        handleCloseModalAddAddress();
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const message = error.response.data?.message;
        if (message === "Nhà cung cấp đã tồn tại") {
          toast.error("Nhà cung cấp đã tồn tại", {
            autoClose: 1000,
          });
        } else {
          toast.error("Có lỗi xảy ra khi thêm nhà cung cấp", {
            autoClose: 1000,
          });
        }
      } else {
        console.error("Có lỗi xảy ra khi thêm nhà cung cấp:", error);
        toast.error("Lỗi không xác định", {
          autoClose: 1000,
        });
      }
    }
  };

  const handleUpdateProvider = async (supplierInfo, dataRow) => {
    if (supplierInfo.address || supplierInfo.phone || supplierInfo.name) {
      const dataToUpdate = {};
      if (supplierInfo.address) dataToUpdate.address = supplierInfo.address;
      if (supplierInfo.phone) dataToUpdate.numberPhone = supplierInfo.phone;
      if (supplierInfo.name) dataToUpdate.fullname = supplierInfo.name;
      try {
        const response = await axios.put(
          `https://ecommerce-coolmate-server-production.up.railway.app/api/admin/provider/${dataRow.id}`,
          dataToUpdate,
          { withCredentials: true }
        );

        if (response.status === 200) {
          handleLoadData();
          handleCloseModalUpdateAddress();
          toast.success("Cập nhật nhà cung cấp thành công", {
            autoClose: 1000,
          });
        }
      } catch (error) {
        console.error("Có lỗi xảy ra khi cập nhật nhà cung cấp:", error);
      }
    } else {
      toast.error("Vui lòng điền ít nhất một trường để cập nhật", {
        autoClose: 1000,
      });
    }
  };

  return (
    <div>
      <button
        className="background-transparent absolute right-[22px] top-[18px] text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
        type="button"
        onClick={() => {
          if (title === "Thêm nhà cung cấp") {
            handleCloseModalAddAddress();
          } else if (title === "Cập nhật nhà cung cấp") {
            handleCloseModalUpdateAddress();
          }
        }}
      >
        <FaWindowClose className="h-8 w-8" />
      </button>
      <div className="flex items-start justify-between rounded-t border-b border-solid p-5">
        <h3 className="text-3xl font-semibold text-cyan-600">{title}</h3>
      </div>
      {loading && title === "Cập nhật nhà cung cấp" ? (
        <div role="status" className="flex items-center justify-center p-40">
          <svg
            aria-hidden="true"
            className="h-8 w-8 animate-spin fill-black text-gray-200 dark:text-gray-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      ) : (
        <div>
          <div className="flex flex-col px-16 py-4">
            <div className="mb-4">
              <label className="font-medium" htmlFor="name">
                Tên nhà cung cấp
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={supplierInfo.name}
                placeholder="Tên nhà cung cấp"
                className="mt-2 w-full rounded-md border border-gray-300 p-2 outline-none"
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="font-medium" htmlFor="phone">
                Số điện thoại
              </label>
              <input
                type="number"
                name="phone"
                id="phone"
                value={supplierInfo.phone}
                placeholder="Số điện thoại"
                className="mt-2 w-full rounded-md border border-gray-300 p-2 outline-none"
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Select
                    type="province"
                    value={province}
                    setValue={setProvince}
                    options={provinces}
                    label="Tỉnh/Thành phố"
                  />
                  <Select
                    reset={reset}
                    type="district"
                    value={district}
                    setValue={setDistrict}
                    options={districts}
                    label="Quận/Huyện"
                  />
                  <Select
                    reset={reset}
                    type="ward"
                    value={ward}
                    setValue={setWard}
                    options={wards}
                    label="Phường/Xã"
                  />
                </div>
                <label className="font-medium" htmlFor="numberAddress">
                  Số nhà/Thôn/Xóm
                </label>
                <input
                  type="text"
                  name="numberAddress"
                  id="numberAddress"
                  value={supplierInfo.numberAddress}
                  placeholder="Số nhà/Thôn/Xóm"
                  className="w-full rounded-md border border-gray-300 p-2 outline-none"
                  onChange={handleInputChange}
                />
                <InputReadOnly
                  label="Địa chỉ cụ thể"
                  value={`${
                    supplierInfo.numberAddress
                      ? `${supplierInfo.numberAddress}, `
                      : ""
                  }${
                    ward
                      ? `${wards?.find((item) => item.code == ward)?.name},`
                      : ""
                  } ${
                    district
                      ? `${
                          districts?.find((item) => item.code == district)?.name
                        },`
                      : ""
                  } ${
                    province
                      ? provinces?.find((item) => item.code == province)?.name
                      : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="border-blueGray-200 flex items-center justify-end rounded-b border-t border-solid p-6">
        <button
          className="mb-1 mr-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
          type="button"
          onClick={() => {
            if (labelButton === "Thêm") {
              handleAddProvider(supplierInfo);
            } else if (labelButton === "Cập nhật") {
              handleUpdateProvider(supplierInfo, dataRow);
            }
          }}
        >
          {labelButton}
        </button>
      </div>
    </div>
  );
};

export default ModalAdd;
