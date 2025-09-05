import React, { useEffect, useState } from "react";
import { PiEyeSlash } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
function Login() {
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const handleSubmit = async (e) => {
    setEmailError("");
    setPasswordError("");
    setErrors("");
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post(
          "https://ecommerce-coolmate-server-production.up.railway.app/api/customer/login",
          {
            email: email,
            password: password,
          }
        );

        if (
          response &&
          response.data &&
          (response.data.role === "manager" ||
            response.data.role === "employee")
        ) {
          localStorage.setItem("token", response.data.token);
          toast.success("Đăng nhập thành công");
          navigate("/report-category");
        } else {
          console.error("Đăng nhập không thành công");
          toast.error("Bạn không phải là nhân viên hay quản lý");
        }
      } catch (error) {
        setErrors(error.response.data.message);
        toast.error(error.response.data.message);
      }
    }
  };

  const validate = () => {
    let resultEmail = true;
    let resultPassword = true;
    if (email === null || email === "") {
      resultEmail = false;
      toast.warning("Vui lòng nhập email của bạn");
      setEmailError("Vui lòng nhập email của bạn!");
    } else if (
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
        email
      )
    ) {
      setEmailError("");
      resultEmail = true;
    } else {
      resultEmail = false;
      setEmailError(" Email không hợp lệ!");
      toast.warning("Email không hợp lệ!");
    }
    if (!password.trim()) {
      resultPassword = false;
      setPasswordError("Vui lòng nhập mật khẩu của bạn!");
      toast.warning("Vui lòng nhập mật khẩu của bạn!");
    } else {
      setPasswordError("");
      resultPassword = true;
    }
    // } else if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
    //     setPasswordError('')
    //     resultPassword = true
    // } else {
    //     resultPassword = false
    //     toast.warning(
    //         'Mật khẩu không hợp lệ! Tối thiểu tám ký tự, ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt.',
    //     )
    //     setPasswordError(
    //         'Mật khẩu không hợp lệ! Tối thiểu tám ký tự, ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt.',
    //     )
    // }
    return resultEmail && resultPassword;
  };
  return (
    <div class="font-[sans-serif] text-[#333]">
      <div class="min-h-screen flex fle-col items-center justify-center py-6 px-4">
        <div class="grid md:grid-cols-2 items-center gap-4 max-w-7xl w-full">
          <div class="border border-gray-300 rounded-md p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="mb-4 text-4xl font-bold text-gray-900 dark:text-white text-center">
                Đăng nhập
              </div>
              <div className="flex flex-col">
                <input
                  type="text"
                  placeholder="Email của bạn"
                  name="email"
                  className={`${
                    !emailError
                      ? "focus:border focus:border-solid focus:border-blue-800 focus:outline-none"
                      : "border border-solid border-red-500 outline-none"
                  } rounded-full border border-solid border-gray-400 px-4 py-3 text-sm`}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                {emailError && (
                  <div className="ml-4 pt-1 text-sm text-rose-500">
                    {emailError}
                  </div>
                )}
                <div className="relative">
                  <input
                    type={isShowPassword === true ? "text" : "password"}
                    placeholder="Mật khẩu"
                    name="password"
                    className={`${
                      !passwordError
                        ? "focus:border focus:border-solid focus:border-blue-800 focus:outline-none"
                        : "border border-solid border-red-500 outline-none"
                    } mt-4 w-full rounded-full border border-solid border-gray-400 px-4 py-3 text-sm`}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  {passwordError && (
                    <div className="ml-4 pt-1 text-sm text-rose-500">
                      {passwordError}
                    </div>
                  )}
                  <PiEyeSlash
                    className="absolute right-4 top-7 h-6 w-6 cursor-pointer text-gray-400"
                    onClick={() => setIsShowPassword(!isShowPassword)}
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 rounded-full bg-black px-4 py-3 text-sm text-white hover:bg-neutral-300 hover:text-black hover:transition-all"
                >
                  Đăng nhập
                </button>
                {errors && (
                  <div className="ml-4 pt-1 text-sm text-rose-500">
                    {errors}
                  </div>
                )}
              </div>
              <div className="flex justify-between pt-2">
                {/* <Link
                            to="/auth/register"
                            className="cursor-pointer text-sm font-medium text-blue-700 hover:text-black"
                        >
                            Đăng ký tài khoản mới
                        </Link> */}
                <div className="cursor-pointer text-sm font-medium text-blue-700 hover:text-black">
                  Quên mật khẩu
                </div>
              </div>
            </form>
          </div>
          <div class="lg:h-[400px] md:h-[300px] max-md:mt-10">
            <img
              src="https://readymadeui.com/login-image.webp"
              class="w-full h-full object-cover"
              alt="Dining Experience"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
