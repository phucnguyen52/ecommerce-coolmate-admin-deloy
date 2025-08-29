import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Upload,
  Modal,
} from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
const { Option } = Select;
const ModalProduct = (props) => {
  const { type, data, open, setOpen } = props;
  const title = type === "update" ? "Cập nhật" : "Thêm";
  const [form] = Form.useForm();
  const [category, setCategory] = useState();
  const [imageUrl, setImageUrl] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategory = async () => {
    try {
      const req = await fetch(
        `https://ecommerce-coolmate-server-production.up.railway.app/api/admin/category`
      );
      const res = await req.json();
      if (res.succes) setCategory(res.category);
      else console.log("fetchCategory succes: false");
    } catch (error) {
      console.log("fail fetchCategory");
    }
  };
  useEffect(() => {
    fetchCategory();
    if (data) setImageUrl(JSON.parse(data.image));
  }, []);

  const charUpperCase = (sentence) => {
    sentence = sentence.toLowerCase();
    let words = sentence.split(" ");
    let capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    let capitalizedSentence = capitalizedWords.join(" ");
    return capitalizedSentence;
  };
  const onFinish = async (values) => {
    if (!imageUrl.length || imageUrl.length < 2) {
      toast.warning("Vui lòng chọn tối thiểu 2 ảnh", {
        autoClose: 1000,
      });

      return 0;
    }
    const product = {
      CategoryId: values.CategoryId,
      brand: values.brand,
      descriptionProducts: values.descriptionProducts
        .split("\n")
        .join("\u005C\u005C"),
      discount: values.discount ? values.discount : 0,
      price: values.price,
      ...(type === "create" && {
        quantitySell: 0,
      }),
      nameProduct: charUpperCase(values.nameProduct),
      image: JSON.stringify(imageUrl),
    };
    try {
      const req = await fetch(
        `https://ecommerce-coolmate-server-production.up.railway.app/api/admin/product${
          type === "update" ? `/${data.id}` : ""
        }`,
        {
          method: type === "update" ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );

      const res = await req.json();
      if (res.succes === true) {
        onReset();
        toast.success(title + " sản phẩm thành công");
      } else toast.error("Tên sản phẩm đã tồn tại");
    } catch (error) {
      console.error("Error adding/update product:", error.message);
      throw error;
    }
  };
  const onReset = () => {
    form.resetFields();
    setImageUrl(data ? JSON.parse(data.image) : []);
  };
  const DeleteImg = (img) => {
    const image = imageUrl.filter((item) => item !== img);
    setImageUrl(image);
  };
  const handleBeforeUpload = async (file) => {
    const formData = new FormData();
    formData.append("images", file);

    // Gửi yêu cầu POST đến API
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://ecommerce-coolmate-server-production.up.railway.app/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data) setIsLoading(false);
      setImageUrl([...imageUrl, data[0]]);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
    return false;
  };

  return (
    <div className="mx-auto my-4 max-w-[1000px]">
      <Modal
        title={
          <div className="text-center text-2xl font-bold mb-8">
            {title.toUpperCase()} SẢN PHẨM
          </div>
        }
        open={open}
        onCancel={() => setOpen(false)}
        style={{ top: 10 }}
        footer={null} // Không hiển thị footer mặc định của modal
        width={1000}
      >
        <Form
          labelAlign="left"
          form={form}
          labelCol={{
            span: 7,
          }}
          name={type}
          initialValues={
            data
              ? {
                  CategoryId: data.CategoryId,
                  brand: data.brand,
                  descriptionProducts: data.descriptionProducts.replace(
                    /\\\\/g,
                    "\n"
                  ),
                  discount: data.discount,
                  price: data.price,
                  nameProduct: data.product_name,
                }
              : {}
          }
          onFinish={onFinish}
        >
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                style={{ marginBottom: 10 }}
                name="nameProduct"
                label={
                  <span className="text-slate-600 text-base">Tên sản phẩm</span>
                }
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                style={{ marginBottom: 10 }}
                name="brand"
                label={<span className="text-slate-600 text-base">Loại</span>}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                style={{ marginBottom: 10 }}
                name="descriptionProducts"
                label={<span className="text-slate-600 text-base">Mô tả</span>}
                rules={[{ required: true }]}
              >
                <Input.TextArea rows={6} />
              </Form.Item>
            </Col>
            <Col span={12}>
              {category && (
                <Form.Item
                  style={{ marginBottom: 10 }}
                  name="CategoryId"
                  label={
                    <span className="text-slate-600 text-base">
                      Loại sản phẩm
                    </span>
                  }
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Chọn loại sản phẩm">
                    {category.map((item, index) => {
                      return (
                        <Option key={index} value={item.id}>
                          {item.categoryName}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              )}
              <Form.Item
                label={<span className="text-slate-600 text-base">Giá</span>}
                style={{ marginBottom: 10 }}
                name="price"
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={1}
                  max={1000}
                  style={{
                    width: "100%",
                  }}
                  suffix=".000 VNĐ"
                />
              </Form.Item>
              <Form.Item
                label={
                  <span className="text-slate-600 text-base">Giảm giá</span>
                }
                style={{ marginBottom: 10 }}
                name="discount"
              >
                <InputNumber
                  min={0}
                  max={100}
                  style={{
                    width: "100%",
                  }}
                  defaultValue={0}
                  suffix="%"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[0, 0]}>
            <Col flex="auto">
              <Form.Item
                label={<span className="text-slate-600 text-base">Ảnh</span>}
                style={{ margin: 0 }}
              ></Form.Item>
            </Col>
            <Upload
              beforeUpload={handleBeforeUpload}
              showUploadList={false} // Ẩn danh sách tệp đã chọn
            >
              <Button icon={<UploadOutlined />} loading={isLoading}>
                Choose File
              </Button>
            </Upload>
          </Row>

          {imageUrl && (
            <div>
              <div className="flex gap-4 my-2">
                {imageUrl.map((item) => {
                  return (
                    <div key={item} className="w-[150px] h-[200px] relative">
                      <img
                        src={item}
                        alt="Uploaded"
                        className="w-full h-full object-cover rounded-md"
                      />
                      <div
                        onClick={() => DeleteImg(item)}
                        className="absolute top-0 right-1.5 cursor-pointer"
                      >
                        <CloseOutlined />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <Form.Item className="mb-0 flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="mr-4 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              {title.toUpperCase()}
            </Button>
            <Button
              onClick={() => {
                onReset();
                setOpen(false);
              }}
              className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
            >
              HUỶ
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ModalProduct;
