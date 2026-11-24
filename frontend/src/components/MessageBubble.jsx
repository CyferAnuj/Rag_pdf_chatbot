function MessageBubble({
  text,
  sender,
  sources = [],
  mode
}) {
  return (
    <div className={`message ${sender}`}>
      <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {text}
      </p>

      {sender === "ai" && sources && sources.length > 0 && (
        <div className="message-sources">
          <div className="sources-title">
            📚 PDF Sources ({sources.length} citations)
          </div>
          {sources.map((src, i) => (
            <div key={i} className="source-item">
              <span className="source-page">Page {src.page}:</span>{" "}
              <span className="source-snippet">
                {src.content ? `"${src.content.trim()}..."` : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
