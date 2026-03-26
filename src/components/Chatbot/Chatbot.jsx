import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import { AiOutlineRobot, AiOutlineClose, AiOutlineSend } from "react-icons/ai";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            text: "👋 Hello! I'm the Job Dekho assistant. How can I help you today?",
            sender: "bot",
          },
        ]);
      }, 350);
    }
  }, [isOpen]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { text: trimmed, sender: "user" }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "User Input": trimmed }),
      });
      const data = await response.json();
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            text:
              data.Prediction ||
              "Sorry, I couldn't understand that. Try rephrasing!",
            sender: "bot",
          },
        ]);
      }, 600);
    } catch {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            text: "Error connecting to server. Please try again later.",
            sender: "bot",
          },
        ]);
      }, 600);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          className="chatbot-toggle-button"
          onClick={() => setIsOpen(true)}
        >
          <AiOutlineRobot size={26} />
          <span className="chatbot-toggle-label">Ask Me</span>
        </button>
      )}

      <div
        className={`chatbot-container ${
          isOpen ? "chatbot-open" : "chatbot-closed"
        }`}
      >
        {isOpen && (
          <>
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-left">
                <div className="chatbot-avatar">
                  <AiOutlineRobot size={18} />
                </div>
                <div>
                  <div className="chatbot-header-title">
                    Job Dekho Assistant
                  </div>
                  <div className="chatbot-header-status">
                    <span className="chatbot-online-dot" />
                    Online
                  </div>
                </div>
              </div>
              <AiOutlineClose
                className="chatbot-close-button"
                onClick={() => setIsOpen(false)}
              />
            </div>

            {/* Messages */}
            <div className="chatbot-messages">
              {messages.map((msg, index) =>
                msg.sender === "bot" ? (
                  <div key={index} className="chatbot-bot-row">
                    <div className="chatbot-bot-icon">
                      <AiOutlineRobot size={14} />
                    </div>
                    <div className="chatbot-bubble-bot">{msg.text}</div>
                  </div>
                ) : (
                  <div key={index} className="chatbot-user-row">
                    <div className="chatbot-bubble-user">{msg.text}</div>
                  </div>
                )
              )}

              {/* Typing indicator */}
              {isTyping && (
                <div className="chatbot-bot-row">
                  <div className="chatbot-bot-icon">
                    <AiOutlineRobot size={14} />
                  </div>
                  <div className="chatbot-bubble-bot chatbot-typing">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chatbot-input-area">
              <input
                type="text"
                className="chatbot-input"
                value={input}
                placeholder="Type your message…"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className={`chatbot-send-btn${
                  input.trim() ? " send-active" : ""
                }`}
                onClick={handleSend}
                disabled={!input.trim()}
              >
                <AiOutlineSend />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Chatbot;