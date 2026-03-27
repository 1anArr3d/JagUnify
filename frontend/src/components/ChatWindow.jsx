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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement === inputRef.current) return;

      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key.length === 1) {
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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

    const history = messages.map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [...prev, humanMessage]);
    setInput("");
    setIsWaiting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: content, history }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: data.answer,
          sources: data.sources ?? [],
          time: formatTime(new Date()),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: "Sorry, I'm having trouble connecting. Please try again.",
          sources: [],
          time: formatTime(new Date()),
        },
      ]);
    } finally {
      setIsWaiting(false);
      if (inputRef.current) inputRef.current.focus();
    }
  };

  return (
    <div
      className="h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/img/campus.jpg')" }}
    >
      <div className="mx-auto flex h-full max-w-6xl flex-col px-4 py-6 mt-9">
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
