import React from "react";
import { Button } from "antd";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
const ToggleThemeButton = ({ darkTheme, toggleTheme }) => {
    return (
        <div>
            <Button onClick={toggleTheme}>
                {darkTheme ? <HiOutlineSun /> : <HiOutlineMoon />}
            </Button>
        </div>
    );
};

export default ToggleThemeButton;
