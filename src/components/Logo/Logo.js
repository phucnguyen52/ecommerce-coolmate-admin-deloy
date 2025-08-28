import React from "react";
import { FireOutlined } from "@ant-design/icons";
const Logo = () => {
    return (
        <div className="flex items-center justify-center text-white p-2">
            <div className="w-10 h-10 flex items-center justify-center text-2xl rounded-[50%] bg-[#111d2c]">
                <FireOutlined />
            </div>
        </div>
    );
};

export default Logo;
