/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "node_modules/antd/dist/antd.css"],
    theme: {
        extend: {
            keyframes: {
                "fade-in": {
                    "0%": {
                        opacity: 0,
                    },
                    "100%": {
                        opacity: 1,
                    },
                },
                "fade-out": {
                    "0%": {
                        opacity: 1,
                    },
                    "100%": {
                        opacity: 0,
                    },
                },
                "fade-in-down": {
                    "0%": {
                        opacity: 0,
                        transform: "translate3d(0, -100%, 0)",
                    },
                    "100%": {
                        opacity: 1,
                        transform: "translate3d(0, 0, 0)",
                    },
                },
                "fade-out-up": {
                    "0%": {
                        opacity: 1,
                    },
                    "100%": {
                        opacity: 0,
                        transform: "translate3d(0, -100%, 0)",
                    },
                },
            },
            animation: {
                "fade-in": "fade-in 0.3s ease-in-out",
                "fade-out": "fade-out 0.3s ease-in-out",
                "fade-in-down": "fade-in-down 0.3s ease-in-out",
                "fade-out-up": "fade-out-up 0.3s ease-in-out",
            },
        },
    },
    plugins: [],
};
