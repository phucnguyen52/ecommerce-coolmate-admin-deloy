import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const ProductReviews = (props) => {
  const [data, setData] = useState();
  const { id, onHandleRating } = props;
  const point = data
    ? data.count !== 0
      ? (data.totalStartPoint / data.count).toFixed(2)
      : 0
    : "";

  useEffect(() => {
    fetch(
      `https://ecommerce-coolmate-server-production.up.railway.app/api/products/${id}/ratings`,
      {
        credentials: "include",
      }
    )
      .then((req) => req.json())
      .then((res) => {
        const count = res.rating.count;
        const total = res.rating.totalStartPoint;
        onHandleRating({
          count: count,
          point: count !== 0 ? (total / count).toFixed(2) : 0,
        });
        setData(res.rating);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  return (
    <>
      {data && (
        <div>
          <div className="flex px-4 gap-10">
            <div className="basis-1/4 p-8 bg-[#f1f1f1] rounded-3xl text-center h-fit">
              <div className="font-bold text-lg">ĐÁNH GIÁ SẢN PHẨM</div>
              {data.count && (
                <>
                  <div className="font-extrabold text-5xl my-4">
                    {data.point}
                  </div>
                  <div className="flex justify-around my-2">
                    <StarRating
                      className="text-4xl"
                      css="text-yellow-400 w-10 h-10"
                      rating={point}
                    />
                  </div>
                </>
              )}
              <div className="italic">{data.count} đánh giá</div>
            </div>
            <div className="basis-3/4 py-1">
              {data.ratings && (
                <div className="grid grid-cols-2 gap-y2">
                  {data.ratings.map((item, index) => (
                    <div
                      key={index}
                      className="border-b py-4 pr-4 pl-2 text-sm"
                    >
                      <div className="flex gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full">
                          <img
                            className="w-full h-full rounded-full object-cover "
                            src={item.Picture}
                            alt=""
                          />
                        </div>
                        <div className="font-bold my-2">{item.UserName}</div>
                      </div>
                      <StarRating
                        className="text-lg"
                        css="text-blue-700 w-4 h-4"
                        rating={item.startPoint}
                      />
                      <div className="italic text-gray-400 text-xs">
                        {item.Color}/ {item.Size}
                      </div>
                      <div className="my-4">{item.comment}</div>
                      <img
                        src={item.Picture}
                        alt=""
                        className="h-10 w-10 object-cover"
                      />
                      <div className="text-gray-400 italic text-xs">
                        {formatDate(item.dateRating)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ProductReviews;
