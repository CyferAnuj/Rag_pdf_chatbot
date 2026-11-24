import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { uploadPDF, clearPDF } from "../api/authApi";

function UploadBox({ activePDF, setActivePDF }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please Select a PDF");
      return;
    }

    try {
      setUploading(true);
      toast.loading("Processing PDF & building knowledge base...", {
        id: "upload"
      });

      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadPDF(formData);

      setActivePDF(file.name);
      localStorage.setItem("activePDF", file.name);

      toast.success(
        res.data?.message || "PDF Uploaded! AI is now in PDF Mode.",
        { id: "upload" }
      );
    } catch (error) {
      console.error(error);
      toast.error("Upload Failed", { id: "upload" });
    } finally {
      setUploading(false);
    }
  };

  const handleClearPDF = async () => {
    try {
      setClearing(true);
      toast.loading("Switching to General Chatbot...", { id: "clear" });

      await clearPDF();

      setActivePDF(null);
      setFile(null);
      localStorage.removeItem("activePDF");

      toast.success("Switched to General Chatbot Mode!", { id: "clear" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to clear PDF", { id: "clear" });
    } finally {
      setClearing(false);
    }
  };

  return (
    <motion.div
      className="upload-box"
      initial={{
        opacity: 0,
        y: 40
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
    >
      <div className="upload-left">
        <div className={`upload-badge ${activePDF ? "badge-pdf" : "badge-chat"}`}>
          {activePDF ? "📄 PDF DOCUMENT MODE ACTIVE" : "💬 GENERAL CHATBOT MODE"}
        </div>

        <h2>
          {activePDF
            ? "Chatting With PDF"
            : "Upload PDF or Chat Freely"}
        </h2>

        <p>
          {activePDF
            ? `Answering questions strictly from "${activePDF}". If you want normal conversation again, click Remove PDF below.`
            : "Currently acting as a simple, normal AI chatbot. Upload a PDF below whenever you want answers strictly from a document!"}
        </p>
      </div>

      <div className="upload-right">
        <div className="upload-card">
          <div className="upload-icon">
            {activePDF ? "📑" : "📄"}
          </div>

          <h3>
            {activePDF ? "Active Document" : "Upload PDF"}
          </h3>

          <label className="custom-file-upload">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />
            {file ? "Change Selected PDF" : "Choose PDF"}
          </label>

          {file && (
            <div className="file-preview">
              <div className="file-label">Selected File</div>
              <div className="file-name">{file.name}</div>
            </div>
          )}

          {activePDF && (
            <div className="uploaded-file-box">
              <div className="uploaded-file-row">
                <div>
                  <div className="uploaded-label">Active PDF (RAG Mode)</div>
                  <div className="uploaded-name">{activePDF}</div>
                </div>
                <button
                  className="clear-pdf-btn"
                  onClick={handleClearPDF}
                  disabled={clearing}
                  title="Remove PDF and switch back to normal chatbot"
                >
                  ✕ Remove PDF
                </button>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "12px", width: "100%" }}>
            <button
              className="upload-btn"
              onClick={handleUpload}
              disabled={uploading || !file}
              style={{ flex: 1 }}
            >
              {uploading ? "Processing..." : activePDF ? "Replace PDF" : "Upload & Analyze PDF"}
            </button>
            {activePDF && (
              <button
                className="clear-pdf-btn"
                style={{ padding: "0 16px", borderRadius: "12px" }}
                onClick={handleClearPDF}
                disabled={clearing}
              >
                Reset to Chat
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default UploadBox;
