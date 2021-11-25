import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const joinHandler = (e) => {
    e.preventDefault();

    if (username) {
      router.push(`/chat?username=${username}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-background ">
      <div className="bg-box flex flex-col items-center justify-center py-6 px-12 text-text rounded-sm font-bold">
        <h1 className="my-2 mb-6 text-3xl ">Welcome to the chat! </h1>
        <input
          className="text-lg bg-transparent w-full border-b border-black px-2 placeholder-gray-600 focus:outline-none"
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Link href="/chat">
          <button
            onClick={joinHandler}
            className="my-6 py-2 text-lg font-bold  border border-gray-600 w-full"
          >
            Join
          </button>
        </Link>
      </div>
    </div>
  );
}
