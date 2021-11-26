import { useState, useEffect } from "react";
import io from "socket.io-client";
import { useRouter } from "next/router";

const ENDPOINT = "http://localhost:5000";
let socket;

export default function Chat() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setUsername(urlParams.get("username"));
    setRoom(urlParams.get("room"));

    const data = {
      username: urlParams.get("username"),
      room: urlParams.get("room"),
    };

    socket = io(ENDPOINT);
    socket.emit("join", data, (error) => {
      if (error) {
        alert(error);
        router.push("/");
      }
    });
  }, [ENDPOINT]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((state) => [...state, message]);
    });

    socket.on("roomData", (userdata) => {
      setUsers(userdata.users);
    });
  }, []);

  return (
    <div className="flex w-full min-h-screen max-h-screen">
      <div className="bg-background flex flex-col w-9/12 relative p-4">
        <div className="h-5/6 overflow-auto no-scrollbar">
          {/* message items */}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`w-full flex ${
                username === msg.user && "justify-end"
              } mt-2`}
            >
              <div
                className={`${
                  username === msg.user ? "bg-box" : "bg-gray-700"
                } px-4 py-2 flex flex-col rounded-lg`}
              >
                <span className="text-gray-300 text-sm">{msg.user}</span>
                <span>{msg.text}</span>
              </div>
            </div>
          ))}
        </div>
        {/* input message */}
        <div className="bg-box h-1/6 absolute bottom-0 left-0 min-w-full p-4">
          <input
            className="w-10/12 px-4 py-2"
            type="text"
            placeholder="your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="border border-background py-2 px-3 ml-2 font-bold rounded-md text-gray-800"
          >
            Send
          </button>
        </div>
      </div>
      <div className="bg-gray-700 flex flex-col w-3/12 h-screen">
        <div className="bg-blue-600 text-white font-bold text-center py-4">
          {room} members
        </div>
        <ul className="mt-2 px-5 h-auto overflow-auto no-scrollbar">
          {users.length &&
            users.map((user) => (
              <li
                key={user.id}
                className="text-gray-50 my-3 text-lg cursor-default"
              >
                {user?.username}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
