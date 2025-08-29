import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import StarRating from "../../components/Product/StarRating";
import { HiArrowRight, HiArrowLeft } from "react-icons/hi";
import { TbListDetails } from "react-icons/tb";
import { useParams } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Table,
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
import "../Product/index.css";
import ModalProduct from "../../components/Product/ModalProduct";
const { Option } = Select;

const ProductDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState();
  const [rating, setRating] = useState();
  const sizeDefault = ["S", "M", "L", "XL", "2XL", "3XL"];
  const [form] = Form.useForm();
  const [category, setCategory] = useState();
  const [imageUrl, setImageUrl] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchRating = async () => {
    try {
      const req = await fetch(
        `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/rating/${id}`
      );
      const res = await req.json();
      if (res.succes) {
        const count = res.rating[0].totalRecords;
        const total = +res.rating[0].totalStars;
        setRating({
          count: count,
          point: count !== 0 ? (total / count).toFixed(2) : 0,
        });
      } else console.log("không lấy được rating");
    } catch (error) {
      console.log("Error get rating", error);
    }
  };
  const fetchProduct = async () => {
    try {
      const req1 = await fetch(
        `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/product/${id}`
      );
      const res1 = await req1.json();
      const req2 = await fetch(
        `https://ecommerce-coolmate-server-production.up.railway.app/api/customer/product/${id}/detail`
      );
      const res2 = await req2.json();
      if (res1.succes && res2.succes) {
        const checkSize = !res2.product.every((i) => i.size.trim() === "");
        setData({
          ...res1.product,
          VariantProducts: res2.product,
          isSize: checkSize,
        });
        setImageUrl(JSON.parse(res1.product.image));
      } else {
        console.error("ProductDetail: failed");
      }
    } catch {
      console.error("Promise productdetail rejected");
    }
  };
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
    fetchProduct();
    fetchRating();
    fetchCategory();
  }, []);

  //Image
  function ButtonNext(props) {
    const { onClick } = props;
    return (
      <HiArrowRight
        onClick={onClick}
        className="absolute right-7 top-[55%] text-[30px] text-black "
      />
    );
  }
  function ButtonPrev(props) {
    const { onClick } = props;
    return (
      <HiArrowLeft
        onClick={onClick}
        className="absolute right-7 top-[45%] z-10 text-[30px] text-gray-300 "
      />
    );
  }
  const settings = {
    customPaging: function (i) {
      return (
        <a>
          <img src={`${JSON.parse(data.image)[i]}`} alt="" />
        </a>
      );
    },
    appendDots: (dots) => (
      <div>
        <ul className="absolute left-[-50px] top-0 flex max-w-[40px] flex-col gap-2">
          {" "}
          {dots}{" "}
        </ul>
      </div>
    ),
    dots: true,
    dotsClass: "slick-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <ButtonNext />,
    prevArrow: <ButtonPrev />,
  };

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
      discount: values.discount,
      price: values.price,
      nameProduct: charUpperCase(values.nameProduct),
      image: imageUrl,
    };
    try {
      const req = await fetch(
        `https://ecommerce-coolmate-server-production.up.railway.app/api/admin/product/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );

      const res = await req.json();
      if (res.succes === true) {
        toast.success("Cập nhật sản phẩm thành công");
      } else toast.error("Tên sản phẩm đã tồn tại");
    } catch (error) {
      console.error("Error update product:", error.message);
      throw error;
    }
    onReset();
  };
  const onFinishFailed = (errorInfo) => {};
  const onReset = () => {
    form.resetFields();
    setImageUrl(JSON.parse(data.image));
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
    <div className="bg-white rounded-xl shadow-2xl m-4 p-4">
      <div>
        {data && (
          <>
            <div className="float-right">
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              >
                Chỉnh sửa
              </button>
            </div>
            <div className="flex gap-3 items-center justify-center mb-10">
              <TbListDetails className="w-7 h-7" />
              <div className="text-3xl text-gray-900 dark:text-white font-bold">
                CHI TIẾT SẢN PHẨM
              </div>
            </div>

            <div className="relative mx-auto flex pl-14 my-4">
              <div className="w-[35%] top-5 sticky">
                <Slider {...settings} className="w-full">
                  {JSON.parse(data.image).map((item) => {
                    return (
                      <div key={item} className="w-full">
                        <img
                          className="h-full w-full object-cover"
                          src={`${item}`}
                          alt=""
                        />
                      </div>
                    );
                  })}
                </Slider>
              </div>
              <div className="w-[65%] px-8">
                <div className="text-xl font-bold">{data.product_name}</div>
                <div className="my-8 flex items-center gap-2">
                  {rating && (
                    <>
                      {rating.count ? (
                        <>
                          <div className="font-bold">{rating.point}</div>
                          <StarRating
                            className="text-xl"
                            css="text-blue-800 w-3 h-3"
                            rating={rating.point}
                          />
                          <div>({rating.count})</div>
                        </>
                      ) : (
                        <div className="italic mr-5">Chưa có đánh giá</div>
                      )}
                    </>
                  )}
                  <div>| Đã bán (web): {data.quantitySell}</div>
                </div>
                <div className="mb-5 flex gap-2 font-bold text-xl">
                  <div>
                    {(data.price - data.price * data.discount * 0.01).toFixed()}
                    .000đ
                  </div>
                  <div className="text-gray-400">
                    <del>{data.price}.000đ</del>
                  </div>
                  <div className="text-lg text-red-600">-{data.discount}%</div>
                </div>

                <div className="my-4">
                  <div className="font-bold underline mb-4 text-lg">
                    Số lượng trong kho:
                  </div>
                  <Table
                    pagination={false}
                    columns={
                      data?.isSize
                        ? [
                            {
                              title: "Màu/Size",
                              dataIndex: "color",
                              rowScope: "row",
                              key: "color",
                            },
                            ...sizeDefault.map((item) => ({
                              title: item,
                              dataIndex: item,
                              key: item,
                            })),
                          ]
                        : [
                            {
                              title: "Màu",
                              dataIndex: "color",
                              rowScope: "row",
                              key: "color",
                            },
                            {
                              title: "Số lượng",
                              dataIndex: "quantity",
                              key: "quantity",
                            },
                          ]
                    }
                    dataSource={
                      data &&
                      (data?.isSize
                        ? [
                            ...new Set(
                              data.VariantProducts.map((item) => item.color)
                            ),
                          ].map((item, index) => ({
                            key: index,
                            color: item,
                            ...sizeDefault.reduce((acc, i) => {
                              const variant = data.VariantProducts.filter(
                                (a) => a.color === item && a.size === i
                              );
                              acc[i] = variant.length
                                ? variant[0].quantity
                                : "-";
                              return acc;
                            }, {}),
                          }))
                        : data.VariantProducts.map((item, index) => ({
                            key: index,
                            color: item.color,
                            quantity: item.quantity,
                          })))
                    }
                  />
                </div>

                <div className="border-t">
                  <div className="py-4 font-bold">Đặc điểm nổi bật</div>
                  <div>
                    {data.descriptionProducts
                      .split(/\\\\/)
                      .map((item, index) => (
                        <div key={index} className="my-2 flex gap-3 italic">
                          <b>+</b>
                          {item}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* update */}
      {data && (
        // <Modal
        //     title={
        //         <div className="text-center text-2xl font-bold mb-8">
        //             CẬP NHẬT SẢN PHẨM
        //         </div>
        //     }
        //     open={open}
        //     onCancel={() => setOpen(false)}
        //     style={{ top: 10 }}
        //     footer={null} // Không hiển thị footer mặc định của modal
        //     width={1000}
        // >
        //     <Form
        //         labelAlign="left"
        //         form={form}
        //         labelCol={{
        //             span: 7,
        //         }}
        //         // size="small"
        //         name="update-product"
        //         initialValues={{
        //             CategoryId: data.CategoryId,
        //             brand: data.brand,
        //             descriptionProducts: data.descriptionProducts.replace(/\\\\/g, "\n"),
        //             discount: data.discount,
        //             price: data.price,
        //             nameProduct: data.nameProduct,
        //         }}
        //         onFinish={onFinish}
        //         onFinishFailed={onFinishFailed}
        //     >
        //         <Row gutter={[16,0]}>
        //             <Col span={12}>
        //             <Form.Item
        //             style={{marginBottom: 10}}
        //                 name="nameProduct"
        //                 label={
        //                     <span className="text-slate-600 text-base">
        //                         Tên sản phẩm
        //                     </span>
        //                 }
        //                 rules={[{ required: true }]}
        //             >
        //                 <Input />
        //             </Form.Item>
        //             </Col>
        //             <Col span={12}>
        //             <Form.Item
        //             style={{marginBottom: 10}}
        //                 name="brand"
        //                 label={
        //                     <span className="text-slate-600 text-base">
        //                         Loại
        //                     </span>
        //                 }
        //                 rules={[{ required: true }]}
        //             >
        //                 <Input />
        //             </Form.Item>
        //             </Col>

        //         </Row>

        //         <Row gutter={[16,0]}>
        //             <Col span={12}>
        //                 <Form.Item
        //                 style={{marginBottom: 10}}
        //                     name="descriptionProducts"
        //                     label={
        //                         <span className="text-slate-600 text-base">
        //                             Mô tả
        //                         </span>
        //                     }
        //                     rules={[{ required: true }]}
        //                 >
        //                     <Input.TextArea rows={6} />
        //                 </Form.Item>
        //             </Col>
        //             <Col span={12}>
        //             {category && (
        //                     <Form.Item
        //                     style={{marginBottom: 10}}
        //                         name="CategoryId"
        //                         label={
        //                             <span className="text-slate-600 text-base">
        //                                 Loại sản phẩm
        //                             </span>
        //                         }
        //                         rules={[{ required: true }]}
        //                     >
        //                         <Select placeholder="Chọn loại sản phẩm">
        //                             {category.map((item, index) => {
        //                                 return (
        //                                     <Option key={index} value={item.id}>
        //                                         {item.categoryName}
        //                                     </Option>
        //                                 );
        //                             })}
        //                         </Select>
        //                     </Form.Item>
        //                 )}
        //                 <Form.Item
        //                     label={
        //                         <span className="text-slate-600 text-base">
        //                             Giá
        //                         </span>
        //                     }
        //                     style={{marginBottom: 10}}
        //                     name="price"
        //                     rules={[{ required: true }]}
        //                 >
        //                     <InputNumber
        //                         min={1}
        //                         max={1000}
        //                         style={{
        //                             width: "100%",
        //                         }}
        //                         suffix=".000 VNĐ"
        //                     />
        //                 </Form.Item>
        //                 <Form.Item
        //                     label={
        //                         <span className="text-slate-600 text-base">
        //                             Giảm giá
        //                         </span>
        //                     }
        //                     style={{marginBottom: 10}}
        //                     name="discount"
        //                 >
        //                     <InputNumber
        //                         min={0}
        //                         max={100}
        //                         style={{
        //                             width: "100%",
        //                         }}
        //                         suffix="%"
        //                     />
        //                 </Form.Item>
        //             </Col>
        //         </Row>

        //         <Row gutter={[0,0]}>
        //         <Col flex="auto">
        //         <Form.Item
        //             label={
        //                 <span className="text-slate-600 text-base">
        //                     Ảnh
        //                 </span>
        //             }
        //             style={{margin: 0}}
        //             >
        //             </Form.Item>
        //             </Col>
        //             <Upload
        //                     beforeUpload={handleBeforeUpload}
        //                     showUploadList={false} // Ẩn danh sách tệp đã chọn
        //                 >
        //                     <Button
        //                         icon={<UploadOutlined />}
        //                         loading={isLoading}
        //                     >
        //                         Choose File
        //                     </Button>
        //                 </Upload>
        //                 </Row>

        //         {imageUrl && (
        //             <div>
        //                 <div className="flex gap-4 my-2">
        //                     {imageUrl.map((item) => {
        //
        //                         return (
        //                             <div
        //                                 key={item}
        //                                 className="w-[150px] h-[200px] relative"
        //                             >
        //                                 <img
        //                                     src={item}
        //                                     alt="Uploaded"
        //                                     className="w-full h-full object-cover rounded-md"
        //                                 />
        //                                 <div
        //                                     onClick={() =>
        //                                         DeleteImg(item)
        //                                     }
        //                                     className="absolute top-0 right-1.5 cursor-pointer"
        //                                 >
        //                                     <CloseOutlined />
        //                                 </div>
        //                             </div>
        //                         );
        //                     })}
        //                 </div>
        //             </div>
        //         )}

        //         <Form.Item className="mb-0 flex justify-end">
        //             <Button
        //                 type="primary"
        //                 htmlType="submit"
        //                 loading={isLoading}
        //                 className="mr-4 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        //             >
        //                 Cập nhật
        //             </Button>
        //             <Button
        //             onClick={()=>setOpen(false)}
        //             className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
        //             >
        //                 Cancel
        //             </Button>
        //         </Form.Item>
        //     </Form>
        // </Modal>
        <ModalProduct type="update" data={data} open={open} setOpen={setOpen} />
      )}
    </div>
  );
};

export default ProductDetail;
