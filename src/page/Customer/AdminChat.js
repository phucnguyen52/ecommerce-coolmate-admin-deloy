import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { IoSend } from "react-icons/io5";
import axios from "axios";

const socket = io("http://localhost:8080", {
    withCredentials: true,
});
const AdminChat = () => {
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState({});
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    const loadRooms = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/customer/messenger",
                {
                    withCredentials: true,
                }
            );
            if (response.data.succes) {
                setRooms(response.data.message);
            } else {
                console.error(
                    "Lỗi khi lấy danh sách người dùng:",
                    response.data.message
                );
            }
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };
    const loadMessages = async (currentRoom) => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/customer/messenger/${currentRoom.id}?senderId=4`,
                {
                    withCredentials: true,
                }
            );
            if (response.data.succes) {
                setMessages(response.data.message);
            } else {
                console.error("Không tìm thấy dữ liệu tin nhắn.");
            }
        } catch (error) {
            console.error("Lỗi khi gọi API lấy tin nhắn:", error);
        }
    };
    useEffect(() => {
        if (currentRoom) {
            socket.emit("joinRoom", currentRoom);
            socket.on("loadMessages", (loadedMessages) => {
                setMessages(loadedMessages);
            });
            socket.on("message", (newMessage) => {
                setMessages((prev) => [...prev, newMessage]);
            });
            loadMessages(currentRoom);

            return () => {
                socket.off("loadMessages");
                socket.off("message");
            };
        }
    }, [currentRoom]);
    const sendMessage = async () => {
        if (message.trim()) {
            const newMessage = {
                messengerContent: message,
                senderId: 4,
            };

            try {
                const response = await axios.post(
                    `http://localhost:8080/api/customer/messenger/${currentRoom.id}`,
                    newMessage,
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.status === 200) {
                    loadMessages(currentRoom);
                    socket.emit("sendMessage", newMessage);
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        newMessage,
                    ]);
                    setMessage("");
                } else {
                    console.error(
                        "Error sending message:",
                        response.data.message
                    );
                }
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };
    useEffect(() => {
        loadRooms();
    }, [currentRoom]);
    const lastMessageRef = useRef(null);
    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
    const formatMessageTime = (messageTime) => {
        const now = new Date();
        const messageDate = new Date(messageTime);
        const diffTime = now - messageDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        const options = {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
        };

        if (diffDays < 7) {
            return messageDate.toLocaleTimeString("vi-VN", options);
        } else {
            return (
                messageDate.toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }) +
                ", " +
                messageDate.toLocaleTimeString("vi-VN", options)
            );
        }
    };
    return (
        <div className="flex justify-end">
            <div className="flex flex-row h-screen w-[100%]">
                {/* Danh sách các phòng chat */}
                <div className="w-[30%] border-r-gray-100 border p-3 rounded-2xl m-2 shadow-md">
                    <h3 className="text-3xl font-bold pb-3 text-center">
                        Đoạn chat
                    </h3>
                    <div className="list-none p-0">
                        {rooms.map((room) => (
                            <div
                                key={room.id}
                                className={`flex items-center cursor-pointer p-2 rounded-md ${
                                    room.id === currentRoom
                                        ? "bg-gray-200"
                                        : "bg-transparent"
                                }`}
                                onClick={() => {
                                    setCurrentRoom(room);
                                }}
                            >
                                <img
                                    src={room.picture}
                                    alt={room.fullName}
                                    className="w-10 h-10 rounded-full mr-2"
                                />
                                <div className="text-xl">
                                    {room.fullName}
                                    <div className="text-sm text-gray-500">
                                        {new Date(
                                            room.lastMessageTime
                                        ).toLocaleString("vi-VN")}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="border-r-gray-100 border rounded-2xl my-2 shadow-md w-[70%] scrollbar scrollbar-thumb-blue-300 scrollbar-track-white">
                    <h3 className="shadow-md px-5 pt-5">
                        {currentRoom ? (
                            <>
                                <div className="flex pb-2">
                                    <img
                                        src={currentRoom.picture}
                                        alt="ảnh người dùng"
                                        className="w-10 h-10 rounded-full mr-2"
                                    />
                                    <div className="text-xl ">
                                        {currentRoom.fullName}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-xl pb-4 font-bold">
                                    Chọn phòng chat
                                </div>
                            </>
                        )}
                    </h3>
                    <div
                        className={`${
                            messages.length < 10 ? "pt-2" : ""
                        } flex flex-col h-[88vh] `}
                    >
                        <div className=" pl-5 flex-1 overflow-y-scroll scrollbar scrollbar-thumb-blue-300 scrollbar-track-white mb-5">
                            {messages.map((msg, index) => {
                                const isUserMessage = msg.senderId !== 4;
                                const isLastUserMessage =
                                    isUserMessage &&
                                    (index === messages.length - 1 ||
                                        messages[index + 1].senderId === 4);

                                return (
                                    <div
                                        key={index}
                                        ref={
                                            index === messages.length - 1
                                                ? lastMessageRef
                                                : null
                                        }
                                        className={`flex mr-2  ${
                                            msg.senderId === 4
                                                ? "justify-end"
                                                : "justify-start items-end"
                                        }`}
                                    >
                                        {isUserMessage && isLastUserMessage && (
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={currentRoom.picture}
                                                    alt={currentRoom.fullName}
                                                    className="w-9 h-9 rounded-full mr-1"
                                                />
                                            </div>
                                        )}
                                        <div className="relative">
                                            <div
                                                className={`relative p-2 group rounded-2xl inline-block max-w-md break-words text-left ${
                                                    msg.senderId === 4
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-gray-200 text-black"
                                                } ${
                                                    index > 0 &&
                                                    messages[index - 1]
                                                        .senderId !==
                                                        msg.senderId
                                                        ? "mt-3"
                                                        : "mt-[2px]"
                                                }`}
                                                style={{
                                                    marginLeft:
                                                        isUserMessage &&
                                                        isLastUserMessage
                                                            ? "0"
                                                            : "40px",
                                                }}
                                            >
                                                {msg.messengerContent}
                                                <div
                                                    className={`${
                                                        msg.senderId === 4
                                                            ? "right-full"
                                                            : "left-full"
                                                    } p-3 bg-stone-600 text-white rounded-xl mix-w-[200px] overflow-x-auto absolute top-[0%] back text-xs hidden z-50 group-hover:block whitespace-nowrap`}
                                                >
                                                    {formatMessageTime(
                                                        msg.messengerTime
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Form gửi tin nhắn */}
                        {currentRoom && (
                            <div className="flex px-5 items-center">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Nhập tin nhắn..."
                                    className="h-auto min-h-10 max-h-36 flex-1 focus:outline-none resize-none overflow-hidden bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    rows={1}
                                    onInput={(e) => {
                                        e.target.style.height = "auto"; // Reset the height
                                        e.target.style.height = `${e.target.scrollHeight}px`; // Set the new height based on content
                                        if (e.target.scrollHeight > 144) {
                                            e.target.style.height = "144px"; // Chiều cao tối đa
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                />
                                <button onClick={sendMessage} className="pl-2">
                                    <IoSend className="text-blue-500 hover:text-blue-700 w-6 h-6" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminChat;
