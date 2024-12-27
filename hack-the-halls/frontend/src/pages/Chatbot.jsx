import React, { useState, useEffect, useContext, useRef } from "react";
import "remixicon/fonts/remixicon.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { PostApiCall } from "../utils/apiCall.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { getItem } from "../utils/storage.js";

const Chatbot = () => {
  const [query, setQuery] = useState("");
  const [chats, setChats] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const { user, selectedLecture } = useContext(UserContext);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchChats = async () => {
      try {
        const response = await PostApiCall("http://localhost:8000/api/chats/", {
          lectureId: selectedLecture?._id,
        });
        setChats(response.data.chat[0].messages);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, []);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleDelete = () => {
    // make a post api call to delete the chat
    const deleteChat = async () => {
      try {
        await PostApiCall("http://localhost:8000/api/chats/delete", {
          lectureId: selectedLecture?._id,
        });
        setChats([]);
      } catch (error) {
        console.error("Error deleting chat:", error);
      }
    };
    deleteChat();
  };

  const handleAsk = async () => {
    if (!query.trim() || isStreaming) return;

    try {
      setIsStreaming(true);
      const userMessage = { type: "user", message: query };
      const aiMessage = { type: "ai", message: "" };

      setChats((prev) => [...prev, userMessage, aiMessage]);
      setQuery("");
      const token = await getItem("token");
      // Set up SSE connection
      const eventSource = new EventSource(
        `http://localhost:8000/api/chatbot/ask?prompt=${encodeURIComponent(
          query
        )}&lectureId=${selectedLecture?._id}&token=${token}`
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setChats((prev) => {
          const newChats = [...prev];
          const lastMessage = newChats[newChats.length - 1];
          lastMessage.message += data.chunk;
          return newChats;
        });
      };

      eventSource.onerror = (error) => {
        console.error("SSE Error:", error);
        eventSource.close();
        setIsStreaming(false);
      };

      eventSource.addEventListener("done", () => {
        eventSource.close();
        setIsStreaming(false);
      });
    } catch (error) {
      console.error("Error sending query:", error);
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <div className="w-[400px] h-[600px] bg-gradient-to-b from-[#1e1e2f] via-[#302b63] to-[#24243e] shadow-lg flex flex-col overflow-hidden rounded-md">
        {/* Header */}
        <div className="p-4 bg-[#302b63] text-white relative">
          <div className="flex items-center space-x-2">
            <i
              className="ri-arrow-left-line text-xl text-gray-400 cursor-pointer hover:text-yellow-400 transition ease-in-out"
              onClick={() => navigate(-1)}
            ></i>
            <h2 className="text-md font-semibold m-0">Chatbot</h2>
          </div>
          <button
            onClick={handleDelete}
            className="absolute top-2 right-4 bg-yellow-400 text-[#000000] rounded-md hover:bg-yellow-500 transition my-2 px-4 py-0"
            style={{
              fontSize: "12px",
              width: "60px",
              height: "25px",
              lineHeight: "25px",
            }}
          >
            Delete
          </button>
        </div>

        {/* File Name Section */}
        <div className="relative p-4">
          <div className="text-xl font-bold text-center text-yellow-400 bg-[#24243e] p-3 rounded-xl border border-yellow-400">
            {selectedLecture?.name || "BST Graph Lecture 22"}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {chats?.map((chat, index) => (
              <div
                key={index}
                className={`flex ${
                  chat.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    chat.type === "user"
                      ? "bg-yellow-400 text-black ml-auto"
                      : "bg-[#302b63] text-white mr-auto"
                  }`}
                >
                  {chat.type === "ai" ? (
                    <MarkdownEditor.Markdown
                      source={chat.message || " "}
                      style={{ background: "transparent", color: "inherit" }}
                    />
                  ) : (
                    chat.message
                  )}
                </div>
              </div>
            ))}
            {isStreaming && (
              <div className="flex justify-start">
                <div className="max-w-[80%] px-6 py-1 rounded-lg bg-[#302b63] text-white mr-auto">
                  Generating response...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Query Input */}
        <div className="p-4 bg-[#1e1e2f]">
          <div className="flex space-x-2">
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your query..."
              disabled={isStreaming}
              className="flex-1 p-2 bg-[#302b63] border border-yellow-400 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
            />
            <button
              onClick={handleAsk}
              disabled={isStreaming}
              className="bg-yellow-400 text-[#302b63] rounded-md hover:bg-yellow-500 transition px-4 disabled:opacity-50"
            >
              {isStreaming ? "..." : "Ask"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
