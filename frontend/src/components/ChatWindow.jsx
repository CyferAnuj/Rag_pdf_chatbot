import {
  useState,
  useEffect,
  useRef
} from "react";

import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  askQuestion,
  clearPDF
} from "../api/authApi";

import MessageBubble from "./MessageBubble";

function ChatWindow({ activePDF, setActivePDF }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  const handleClearPDF = async () => {
    try {
      toast.loading("Switching to General Chatbot...", { id: "chat-clear" });
      await clearPDF();
      setActivePDF(null);
      localStorage.removeItem("activePDF");
      toast.success("Switched to General Chatbot Mode!", { id: "chat-clear" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear PDF", { id: "chat-clear" });
    }
  };

  const sendQuestion = async () => {
    if (!question.trim()) return;

    const currentQuestion = question.trim();
    setQuestion("");

    const updatedMessages = [
      ...messages,
      {
        text: currentQuestion,
        sender: "user"
      }
    ];

    setMessages(updatedMessages);

    try {
      setLoading(true);

      const res = await askQuestion(currentQuestion, updatedMessages);

      console.log("AI RESPONSE:", res.data);

      setMessages((prev) => [
        ...prev,
        {
          text:
            typeof res.data?.answer === "string"
              ? res.data.answer
              : "Invalid AI response",
          sender: "ai",
          sources: res.data?.sources || [],
          mode: res.data?.mode || (activePDF ? "pdf" : "general")
        }
      ]);
    } catch (error) {
      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          text: "Failed to get AI response. Please check your connection and API key.",
          sender: "ai",
          sources: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="chat-window"
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
    >
      <div className="chat-top">
        <div>
          <h2>AI Assistant</h2>
          <p>
            {activePDF ? (
              <span>
                Answering strictly from{" "}
                <strong style={{ color: "#60a5fa" }}>{activePDF}</strong>
              </span>
            ) : (
              "General Chatbot mode — ask questions, discuss code, or chat freely"
            )}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {activePDF ? (
            <div className="mode-badge pdf-mode">
              <span>📄 PDF Mode</span>
              <button
                className="clear-pdf-link"
                onClick={handleClearPDF}
                title="Switch back to General Chatbot"
              >
                ✕ Switch to Chat
              </button>
            </div>
          ) : (
            <div className="mode-badge chat-mode">
              💬 General Chat
            </div>
          )}

          <div className="online-status">
            ● Online
          </div>
        </div>
      </div>

      <div className="messages">
        {messages.length === 0 && (
          <div className="empty-chat">
            <div className="empty-icon">
              {activePDF ? "📄" : "🤖"}
            </div>

            <h3>
              {activePDF
                ? "Document Q&A Ready"
                : "Your AI Assistant is Ready"}
            </h3>

            <p>
              {activePDF
                ? `Ask anything about "${activePDF}". Answers will be strictly retrieved from this PDF.`
                : "Ask me anything! Normal chatting, coding help, explanations, or upload a PDF above to ask from documents."}
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            text={msg.text}
            sender={msg.sender}
            sources={msg.sources}
            mode={msg.mode}
          />
        ))}

        {loading && (
          <div className="loading-box">
            {activePDF
              ? "Searching document & thinking..."
              : "AI is thinking..."}
          </div>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder={
            activePDF
              ? `Ask anything from "${activePDF}"...`
              : "Ask me anything (general chat)..."
          }
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendQuestion();
            }
          }}
        />

        <button
          onClick={sendQuestion}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </motion.div>
  );
}

export default ChatWindow;
