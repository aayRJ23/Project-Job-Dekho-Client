import React, { useState, useEffect } from "react";
import "./Chatbot.css";
import { AiOutlineRobot, AiOutlineClose, AiOutlineUser } from "react-icons/ai";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      setMessages([...messages, { text: "Hello, how can I help you?", sender: "bot" }]);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
    }
  };

  return (
    <>
      {!isOpen && (
        <button className="chatbot-toggle-button" onClick={() => setIsOpen(true)}>
          <AiOutlineRobot size={30} />
        </button>
      )}
      {isOpen && (
        <div className={`chatbot-container ${isOpen ? 'chatbot-open' : ''}`}>
          <div className="chatbot-header">
            <AiOutlineRobot size={20} />
            AskMeAnything Bot
            <span className="chatbot-online-dot"></span>
            <AiOutlineClose className="chatbot-close-button" onClick={() => setIsOpen(false)} />
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chatbot-message chatbot-${msg.sender}`}>
                {msg.sender === 'bot' && <AiOutlineRobot className="chatbot-icon" />}
                <div className="chatbot-text">{msg.text}</div>
                {msg.sender === 'user' && <AiOutlineUser className="chatbot-icon" />}
              </div>
            ))}
          </div>
          <div className="chatbot-input-container">
            <input
              type="text"
              className="chatbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="chatbot-send" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
