import { useState, useEffect, useRef } from "react";
import aiApi from "../../api/aiApi";

function ChatBot() {

  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Xin chào 👋 Tôi là AI Book Assistant. Hãy hỏi tôi về sách nhé!"
    }
  ]);

  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {

    const history =
      localStorage.getItem(
        "chatHistory"
      );

    if (history) {

      setMessages(
        JSON.parse(history)
      );

    }

  }, []);

  useEffect(() => {

    localStorage.setItem(
      "chatHistory",
      JSON.stringify(messages)
    );

  }, [messages]);

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [messages, loading]);

  const handleSend = async () => {

    console.log("SEND CLICK");

    if (!message.trim()) return;

    const userMessage = {
        sender: "user",
        text: message
    };

    const currentMessage = message;

    setMessages(prev => [
        ...prev,
        userMessage
    ]);

    setMessage("");

    try {

        console.log("CALL API");

        setLoading(true);

        const history = [
        ...messages,
        userMessage
        ].map(msg => ({
        role:
            msg.sender === "user"
            ? "User"
            : "Assistant",

        content: msg.text
        }));

        const res =
        await aiApi.chat(
            currentMessage,
            history
        );

        console.log(
        "API RESPONSE",
        res
        );

        setMessages(prev => [
        ...prev,
        {
            sender: "ai",

            // Backend đang trả String
            text: res.data
        }
        ]);

    } catch (error) {

        console.log(
        "AI ERROR",
        error
        );

        setMessages(prev => [
        ...prev,
        {
            sender: "ai",
            text:
            "AI hiện không khả dụng."
        }
        ]);

    } finally {

        setLoading(false);

    }

    };

  return (

    <div className="chatbot-container">

      <button
        className="chat-btn"
        onClick={() =>
          setOpen(!open)
        }
      >
        {open ? "✕" : "💬"}
      </button>

      {
        open && (

          <div className="chat-box">

            <div className="chat-header">

              <span>
                📚 AI Book Assistant
              </span>

              <button
                className="close-btn"
                onClick={() =>
                  setOpen(false)
                }
              >
                ✕
              </button>

            </div>

            <div className="chat-body">

              {
                messages.map(
                  (msg, index) => (

                    <div
                      key={index}
                      className={
                        msg.sender === "user"
                          ? "user-msg"
                          : "ai-msg"
                      }
                    >
                      {msg.text}
                    </div>

                  )
                )
              }

              {
                loading && (

                  <div className="ai-msg">
                    <div className="loading-text">

                        AI đang tìm kiếm sách...

                    </div>

                    <div className="typing">

                      <span></span>
                      <span></span>
                      <span></span>

                    </div>

                  </div>

                )
              }

              <div
                ref={messagesEndRef}
              />

            </div>

            <div className="chat-footer">

              <input
                type="text"
                placeholder="Nhập câu hỏi..."
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {

                  if (
                    e.key === "Enter"
                  ) {

                    handleSend();

                  }

                }}
              />

              <button
                onClick={handleSend}
              >
                ➤
              </button>

            </div>

          </div>

        )
      }

    </div>

  );

}

export default ChatBot;