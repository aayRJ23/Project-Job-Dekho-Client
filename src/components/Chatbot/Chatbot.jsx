import React, { useState, useEffect } from "react";
import "./Chatbot.css";
import { AiOutlineRobot, AiOutlineClose, AiOutlineUser } from "react-icons/ai";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Hello, how can I help you?", sender: "bot" },
      ]);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");

      // Send user input to the Flask server and get the response
      try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ "User Input": input }),
        });

        const data = await response.json();
        const botMessage = {
          text: data.Prediction || "Sorry, I couldn't understand that.",
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        const errorMessage = {
          text: "There was an error processing your request. Please try again later.",
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {!isOpen && (
        <button className="chatbot-toggle-button" onClick={() => setIsOpen(true)}>
          <AiOutlineRobot size={30} />
        </button>
      )}
      <div className={`chatbot-container ${isOpen ? "chatbot-open" : "chatbot-closed"}`}>
        {isOpen && (
          <>
            <div className="chatbot-header">
              <AiOutlineRobot size={20} />
              AskMeAnything Bot
              <span className="chatbot-online-dot"></span>
              <AiOutlineClose className="chatbot-close-button" onClick={handleClose} />
            </div>
            <div className="chatbot-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`chatbot-message-container chatbot-${msg.sender}`}>
                  {msg.sender === "bot" && <AiOutlineRobot className="chatbot-icon" />}
                  <div className={`chatbot-message chatbot-${msg.sender}`}>
                    <div className="chatbot-text">{msg.text}</div>
                  </div>
                  {msg.sender === "user" && <AiOutlineUser className="chatbot-icon" />}
                </div>
              ))}
            </div>
            <div className="chatbot-input-container">
              <input
                type="text"
                className="chatbot-input"
                value={input}
                placeholder="Enter your message here"
                onChange={(e) => setInput(e.target.value)}
              />
              <button className="chatbot-send" onClick={handleSend}>
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Chatbot;
