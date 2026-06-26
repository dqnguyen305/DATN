import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
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

  // Đọc lịch sử chat từ localStorage
  useEffect(() => {
    const history = localStorage.getItem("chatHistory");
    if (history) {
      setMessages(JSON.parse(history));
    }
  }, []);

  // Lưu lịch sử chat khi có tin nhắn mới
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  // Cuộn tự động xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMessage = {
      sender: "user",
      text: message
    };

    const currentMessage = message;
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    try {
      setLoading(true);

      // Chuẩn hóa history gửi lên backend
      const history = [...messages, userMessage].map((msg) => ({
        role: msg.sender === "user" ? "User" : "Assistant",
        content: msg.text
      }));

      const res = await aiApi.chat(currentMessage, history);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: res.data // Nhận chuỗi chuỗi Markdown/Text từ Backend
        }
      ]);
    } catch (error) {
      console.log("AI ERROR", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "⚠️ *AI hiện không khả dụng. Vui lòng thử lại sau!*"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Nút bấm mở Chat */}
      <button className="chat-btn" onClick={() => setOpen(!open)}>
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="chat-box shadow-lg border-0 rounded-4">
          {/* Header */}
          <div className="chat-header d-flex justify-content-between align-items-center">
            <span className="fw-semibold">📚 AI Book Assistant</span>
            <button className="close-btn border-0 bg-transparent text-white" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          {/* Nội dung đoạn chat */}
          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender === "user" ? "user-msg" : "ai-msg"}>
                {msg.sender === "user" ? (
                  // Tin nhắn của user giữ nguyên text thuần túy
                  msg.text
                ) : (
                  // Định dạng Markdown mượt mà cho câu trả lời của AI
                  <div className="markdown-content">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))}

            {/* Trạng thái AI đang suy nghĩ / tìm kiếm */}
            {loading && (
              <div className="ai-msg">
                <div className="loading-text text-muted small mb-1">
                  AI đang suy nghĩ câu trả lời...
                </div>
                <div className="typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer nhập dữ liệu */}
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Nhập câu hỏi của bạn tại đây..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading || !message.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBot;