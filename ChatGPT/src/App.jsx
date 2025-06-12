import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Dropdown from "./assets/dropdown.png";
import EditIcon from "./assets/edit.png";
import AttachIcon from "./assets/attach.png";
import WebIcon from "./assets/web.png";
import ReasonIcon from "./assets/bulb.png";
import VoiceIcon from "./assets/voice.png";

export default function App() {
  const [text, setText] = useState(""); // User input
  const [conversation, setConversation] = useState([]); // Chat history (user + assistant)
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null); // To scroll to the bottom

  // Update text when user types
  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  // Resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // Reset height before calculation
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on scrollHeight

    // If the content exceeds the height for 8 lines, enable the scrollbar
    const maxHeight = parseInt(getComputedStyle(textarea).lineHeight) * 8;
    if (textarea.scrollHeight > maxHeight) {
      textarea.style.overflowY = "auto"; // Enable vertical scrollbar
      textarea.style.height = `${maxHeight}px`; // Set the height to max-height
    } else {
      textarea.style.overflowY = "hidden"; // Disable scrollbar when not needed
    }
  }, [text]);

  // Function to handle sending data to the API
  const sendToAPI = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error("Server returned an error");
      }

      const data = await response.json();

      setConversation((prev) => [
        ...prev,
        { sender: "user", message: text },
        { sender: "assistant", message: data.reply },
      ]);
      setText("");
    } catch (error) {
      console.error("Error:", error);
      setConversation((prev) => [
        ...prev,
        { sender: "user", message: text },
        {
          sender: "assistant",
          message: "⚠️ No response...",
          error: true,
        },
      ]);
      setText("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    if (text.trim()) {
      sendToAPI(); // Call the API when text is not empty
    }
  };

  // Scroll to the bottom of the chat when a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  return (
    <div className={`Container ${conversation.length === 0 ? "no-chat" : ""}`}>
      <div className="Panel">
        <span className="Upgrade_Info">
          <img src={EditIcon} alt="edit" />
          <span className="Upgrade_Info_modal">
            <span>ChatGPT</span>
          </span>
          <img src={Dropdown} alt="DropdownImg" className="dropdownImg" />
        </span>
        <span className="account">
          <span className="log-in">Log in</span>
          <span className="sign-up">Sign up</span>
        </span>
      </div>
      <div
        className={`prompt_panel ${
          conversation.length === 0 ? "no-chat" : "chat"
        }`}
      >
        <p className="title_content">
          {conversation.length === 0 ? "What can I help with?" : ""}
        </p>
        <div className={`${conversation.length === 0 ? "" : "chat-box"}`}>
          <div className="chat-history">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.sender} ${
                  msg.error ? "error" : ""
                }`}
              >
                <p
                  className={
                    msg.sender === "user" ? "user_chat" : "assistant_chat"
                  }
                >
                  {msg.message}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} className={conversation.length === 0 ? "" : "gap"} />
          </div>
        </div>
        <div className="input_panel">
          <form onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              rows={1}
              className="prompt"
              placeholder="Ask anything"
              value={text}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </form>
          <div className="links">
            <span className="attach">
              <img src={AttachIcon} alt="Attach" />
              <p>Attach</p>
            </span>
            <span className="search">
              <img src={WebIcon} alt="WebSearch" />
              <p>Search</p>
            </span>
            <span className="reason">
              <img src={ReasonIcon} alt="Reason" />
              <p>Reason</p>
            </span>
            <span className="voice">
              <img src={VoiceIcon} alt="voice" className="voiceImg" />
              <p>Voice</p>
            </span>
          </div>
        </div>
      </div>
      <div className="policy_notice">
        <p>
          {conversation.length === 0 ? (
            <span>
              By messaging ChatGPT, you agree to our{" "}
              <span style={{ textDecoration: "underline" }}>Terms</span> and
              have read our{" "}
              <span style={{ textDecoration: "underline" }}>
                Privacy Policy
              </span>
              . See{" "}
              <span style={{ textDecoration: "underline" }}>
                Cookie Preferences
              </span>
              .
            </span>
          ) : (
            <span>
              ChatGPT can make mistakes. Check important info. See{" "}
              <span style={{ textDecoration: "underline" }}>
                Cookie Preferences
              </span>
              .
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
