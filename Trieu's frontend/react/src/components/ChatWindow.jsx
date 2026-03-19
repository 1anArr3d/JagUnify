import { useEffect, useRef, useState } from "react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import formatTime from "../utils/formatTime";

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      text: "Hey Jaguar! How can I help you?",
      time: formatTime(new Date()),
    },
  ]);

  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const logRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages, isWaiting]);

  const sendMessage = async () => {
    const content = input.replace(/\s+/g, " ").trim();
    if (!content || isWaiting) return;

    const now = new Date();
    const humanMessage = {
      id: Date.now(),
      role: "human",
      text: content,
      time: formatTime(now),
    };

    setMessages((prev) => [...prev, humanMessage]);
    setInput("");
    setIsWaiting(true);

    await new Promise((r) => setTimeout(r, 1000));

    const botMessage = {
      id: Date.now() + 1,
      role: "bot",
      text: `Received: ${content}`,
      time: formatTime(new Date()),
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsWaiting(false);

    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/img/campus.jpg')" }}
    >
      <div className="mx-auto flex h-screen max-w-6xl flex-col px-4 py-6">
        <div className="flex min-h-0 flex-1 flex-col">
          <MessageList
            messages={messages}
            isWaiting={isWaiting}
            logRef={logRef}
          />
          <ChatInput
            inputRef={inputRef}
            input={input}
            setInput={setInput}
            isWaiting={isWaiting}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
}
