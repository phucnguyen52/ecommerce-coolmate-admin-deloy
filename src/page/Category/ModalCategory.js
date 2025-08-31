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

const ModalCategory = (props) => {
  const { type, data, open, setOpen, fetchCategory } = props;
  const title = type === "update" ? "Cập nhật" : "Thêm";
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setImageUrl(data ? data.categoryImage : "");
    if (props.data) {
      form.setFieldsValue({
        categoryName: props.data.categoryName,
      });
    }
  }, [props]);
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
    if (!imageUrl) {
      toast.warning("Vui lòng chọn ảnh", { autoClose: 1000 });
      return 0;
    }
    const category = {
      categoryName: charUpperCase(values.categoryName),
      categoryImage: imageUrl,
    };
    try {
      const req = await fetch(
        `https://ecommerce-coolmate-server-production.up.railway.app/api/admin/category${
          type === "update" ? `/${data.id}` : ""
        }`,
        {
          method: type === "update" ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(category),
        }
      );
      const res = await req.json();
      if (res.succes === true) {
        await fetchCategory();
        setOpen(false);
        if (type === "create") onReset();
        toast.success(title + " loại sản phẩm thành công");
      } else toast.error("Tên loại sản phẩm đã tồn tại");
    } catch (error) {
      console.error("Error adding/update category:", error.message);
      throw error;
    }
  };
  const onReset = () => {
    form.resetFields();
    setImageUrl(data ? data.categoryImage : "");
  };
  const DeleteImg = () => {
    setImageUrl();
  };
  const handleBeforeUpload = async (file) => {
    const formData = new FormData();
    formData.append("images", file);
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://ecommerce-coolmate-server-production.up.railway.app/upload",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data) setIsLoading(false);
      setImageUrl(data[0]);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
    return false;
  };
  return (
    <div className="mx-auto my-4 max-w-[700px]">
      <Modal
        title={
          <div className="text-center text-2xl font-bold mb-8">
            {title.toUpperCase()} LOẠI SẢN PHẨM
          </div>
        }
        open={open}
        onCancel={() => setOpen(false)}
        style={{ top: 50 }}
        footer={null}
        width={700}
      >
        <Form
          labelAlign="left"
          form={form}
          labelCol={{
            span: 10,
          }}
          name={type}
          initialValues={
            data
              ? {
                  categoryName: data.categoryName,
                }
              : {}
          }
          onFinish={onFinish}
        >
          <Form.Item
            name="categoryName"
            label={
              <span className="text-slate-600 text-base">
                Tên loại sản phẩm
              </span>
            }
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={<span className="text-slate-600 text-base">Ảnh</span>}
          >
            {imageUrl && (
              <div className="w-[150px] h-[200px] relative">
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="w-full h-full object-cover rounded-md"
                />
                <div
                  className="absolute top-0 right-1.5 cursor-pointer"
                  onClick={() => DeleteImg()}
                >
                  <CloseOutlined />
                </div>
              </div>
            )}
            <Upload
              className="mt-10"
              beforeUpload={handleBeforeUpload}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />} loading={isLoading}>
                Choose File
              </Button>
            </Upload>
          </Form.Item>

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
              onClick={onReset}
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

export default ModalCategory;
