import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdAddBox } from "react-icons/md";
import { FaWindowClose } from "react-icons/fa";
import { toast } from "react-toastify";

const StoreReceipt = () => {
  const [data, setData] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [provider, setProvider] = useState([]);
  const fetchProviders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/admin/provider",
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setProvider(response.data.provider);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleSelect = (event) => {
    const providerId = event.target.value;
    const providers = provider.find((p) => p.id === parseInt(providerId));
    setSelectedProvider(providers);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productVariants, setProductVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(true);
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");

  const handleSearch = async (key) => {
    setSelectedVariant(null);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/customer/search?search=${key}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        setSearchResults(response.data.product);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectProduct = async (product) => {
    setSelectedProduct(product);
    setShowSearchResults(false);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/customer/product/${product.id}/detail`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        setProductVariants(response.data.product);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [selectedVariantValue, setSelectedVariantValue] = useState("");
  const [dataTable, setDataTable] = useState([]);
  const handleAddProduct = () => {
    if (selectedVariant && stock && price) {
      const newProduct = {
        productDetailID: selectedVariant.id,

        stock: parseInt(stock),
        price: parseFloat(price),
      };
      const productTable = {
        nameProduct: selectedProduct.nameProduct,
        productDetailID: selectedVariant.productDetailID,
        color: selectedVariant.color,
        size: selectedVariant.size,

        stock: parseInt(stock),
        price: parseFloat(price),
      };
      setDataTable([...dataTable, productTable]);
      setData([...data, newProduct]);
      setSearchQuery("");
      setSelectedProduct(null);
      setSearchResults([]);
      setSelectedVariant(null);
      setStock("");
      setPrice("");
      setSelectedVariantValue("");
    }
  };

  const handleStoreProduct = async () => {
    if (!selectedProvider || data.length === 0) {
      toast.warning(
        "Vui lòng thêm đầy đủ nhà cung cấp và thêm sản phẩm nhập kho"
      );
      return;
    }

    const requestBody = {
      ProviderId: selectedProvider.id,
      data: data,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/admin/store",
        requestBody,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Nhập kho thành công", {
          autoClose: 1000,
        });
        setSearchQuery("");
        setSearchResults([]);
        setSelectedProduct(null);
        setSelectedVariant(null);
        setSelectedProvider(null);
        setData([]);
        setDataTable([]);
      } else {
        alert("Có lỗi xảy ra. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Không thể kết nối đến server!");
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-2xl min-h-screen m-4">
      <div className="flex justify-between items-center py-4 pl-3 bg-gray-100/80 border-b-[1px]">
        <div className="text-2xl font-bold text-cyan-600 ">
          Tạo phiếu nhập kho
        </div>
      </div>
      <div className="mt-8 ml-4">
        <div className="">
          <div className="flex items-center gap-5">
            <div className="s-2 text-base font-medium text-gray-900 dark:text-gray-300">
              Nhà cung cấp
            </div>

            <select
              onChange={handleSelect}
              className=" focus:outline-none max-w-80  py-3 px-4 pe-9 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:focus:ring-neutral-600"
            >
              <option value="">Chọn nhà cung cấp</option>
              {provider.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.fullname}
                </option>
              ))}
            </select>
          </div>
          {selectedProvider && (
            <div className="mt-5">
              <table
                border="1"
                cellPadding="4"
                className="border-collapse w-1/2"
              >
                <thead>
                  <tr className="s-2 text-base font-medium text-gray-900 dark:text-gray-300">
                    <th>Thông tin chi tiết nhà cung cấp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Tên</strong>
                    </td>
                    <td>{selectedProvider.fullname}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Địa chỉ</strong>
                    </td>
                    <td>{selectedProvider.address}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Số điện thoại</strong>
                    </td>
                    <td>{selectedProvider.numberPhone}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        {isModalVisible && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
            onClick={() => setIsModalVisible(false)}
          >
            <div
              className="relative bg-white p-6 rounded shadow-lg w-1/2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="background-transparent absolute right-[22px] top-[18px] text-sm font-bold uppercase text-black outline-none transition-all duration-150 ease-linear focus:outline-none"
                type="button"
                onClick={() => {
                  setIsModalVisible(false);
                  setShowSearchResults(true);
                }}
              >
                <FaWindowClose className="h-8 w-8" />
              </button>

              <h2 className="text-xl mb-4">Tìm kiếm sản phẩm</h2>
              <input
                type="text"
                placeholder="Nhập tên sản phẩm..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <div className="my-2">
                {selectedProduct ? (
                  <div className="text-lg font-semibold">
                    Sản phẩm đã chọn: {selectedProduct.nameProduct}
                  </div>
                ) : (
                  <div className="text-lg font-semibold">
                    Chưa chọn sản phẩm nào
                  </div>
                )}
              </div>
              {showSearchResults && searchResults.length > 0 && (
                <div className="max-h-64 overflow-y-auto border border-gray-300 rounded mb-4">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {product.nameProduct}
                    </div>
                  ))}
                </div>
              )}

              {productVariants.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-base mb-2 italic">
                    Chọn biến thể (Màu sắc - Size)
                  </h3>
                  <select
                    className="w-full p-2 border border-gray-300 rounded"
                    value={selectedVariantValue}
                    onChange={(e) => {
                      const [selectedColor, selectedSize] =
                        e.target.value.split("-");
                      const selected = productVariants.find(
                        (variant) =>
                          variant.color === selectedColor &&
                          variant.size === selectedSize
                      );

                      setSelectedVariant(selected);
                      setSelectedVariantValue(e.target.value);
                    }}
                  >
                    <option value="">Chọn một biến thể</option>
                    {productVariants.map((variant, index) => (
                      <option
                        key={index}
                        value={`${variant.color}-${variant.size}`}
                      >
                        {variant.color} - {variant.size}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedVariant && (
                <div className="mb-4">
                  <input
                    type="number"
                    placeholder="Số lượng nhập"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                  />
                  <input
                    type="number"
                    placeholder="Giá"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleAddProduct}
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  disabled={!selectedVariant || !stock || !price}
                >
                  Thêm sản phẩm
                </button>
                <button
                  onClick={() => {
                    setIsModalVisible(false);
                    setShowSearchResults(true);
                  }}
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col items-start">
          <button
            onClick={() => setIsModalVisible(true)}
            className="max-w-60 cursor-pointer flex gap-2 items-center text-nowrap text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            <div>
              <MdAddBox className="w-5 h-5" />
            </div>
            <div className="text-sm">Thêm sản phẩm nhập kho</div>
          </button>
          <table className="border-collapse border border-gray-400 w-full mt-4">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Tên sản phẩm</th>
                <th className="border border-gray-300 p-2">Màu sắc</th>
                <th className="border border-gray-300 p-2">Size</th>

                <th className="border border-gray-300 p-2">Số lượng</th>
                <th className="border border-gray-300 p-2">Giá</th>
              </tr>
            </thead>
            <tbody>
              {dataTable.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">
                    {item.nameProduct}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {item.color}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {item.size}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {item.stock}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {item.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-center mt-4">
        <button
          onClick={handleStoreProduct}
          className=" min-w-52 cursor-pointer text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-base px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        >
          Nhập kho
        </button>
      </div>
    </div>
  );
};

export default StoreReceipt;
