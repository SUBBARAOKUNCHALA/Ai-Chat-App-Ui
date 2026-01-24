import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import Message from "./Message";
import { aiChatAPI, sendMessageAPI } from "../../services/genralService";
import { motion } from "framer-motion";
import { Send, X } from "lucide-react";
import { useRef, useEffect } from "react";


export default function ChatWindow({ authUser, receiver }) {

  const { messages, addLocalMessage } = useContext(ChatContext);
  const bottomRef = useRef(null);

  const [input, setInput] = useState("");
  const [aiPreview, setAiPreview] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  // ======================
  // MAIN SEND BUTTON CLICK
  // ======================

useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

  const handleSendClick = async () => {

    if (!input.trim()) return;

    // If chatting with AI directly → normal flow
    if (receiver.username.toLowerCase() === "ai") {
      handleDirectAI();
      return;
    }

    try {
      setLoading(true);

      // Call AI first
      const res = await aiChatAPI(input, authUser.token);

      setAiPreview(res.data.reply);
      setShowPopup(true);

    } catch (err) {
      console.error("AI error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // DIRECT AI CHAT MODE
  // ======================

  const handleDirectAI = async () => {

    try {
      setLoading(true);

      const res = await aiChatAPI(input, authUser.token);

      addLocalMessage({
        senderId: receiver._id,
        receiverId: authUser._id,
        content: res.data.reply
      });

      setInput("");

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // ACCEPT AI PROMPT
  // ======================

  const takePromptToInput = () => {
    setInput(aiPreview);
    setShowPopup(false);
    setAiPreview("");
  };

  // ======================
  // FINAL SEND TO FRIEND
  // ======================

  const sendFinalMessage = async () => {

    if (!input.trim()) return;

    try {

      await sendMessageAPI(
        receiver._id,
        input,
        authUser.token
      );

      addLocalMessage({
        senderId: authUser._id,
        receiverId: receiver._id,
        content: input
      });

      setInput("");

    } catch (err) {
      console.error("Send failed:", err.response?.data || err);
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>

      {/* ================= CHAT MESSAGES ================= */}

      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>

       {messages.map((msg, i) => (
  <Message key={msg._id || i} message={msg} authUser={authUser} />
))}

  <div ref={bottomRef} />
      </div>

      {/* ================= INPUT BAR ================= */}

      <div
        style={{
          padding: "14px",
          borderTop: "1px solid rgba(148,163,184,0.12)",
          display: "flex",
          gap: "10px"
        }}
      >

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px"
          }}
        />

        <motion.button
          onClick={sendFinalMessage}
          whileHover={{ scale: 1.05 }}
          style={sendBtn}
        >
          <Send size={18} />
        </motion.button>

        <motion.button
          onClick={handleSendClick}
          whileHover={{ scale: 1.05 }}
          style={aiBtn}
        >
          AI
        </motion.button>

      </div>

      {/* ================= AI POPUP ================= */}

      {showPopup && (
        <div style={overlayStyle}>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={popupStyle}
          >

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4>AI Suggested Message</h4>

              <X
                size={18}
                style={{ cursor: "pointer" }}
                onClick={() => setShowPopup(false)}
              />
            </div>

            <div style={aiTextBox}>
              {aiPreview}
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>

              <button
                onClick={() => setShowPopup(false)}
                style={cancelBtn}
              >
                Cancel
              </button>

              <button
                onClick={takePromptToInput}
                style={acceptBtn}
              >
                Take Prompt Into Chat
              </button>

            </div>

          </motion.div>

        </div>
      )}

    </div>
  );
}

// ================= STYLES =================

const sendBtn = {
  background: "#2563EB",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer"
};

const aiBtn = {
  background: "#7C7CFF",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer"
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999
};

const popupStyle = {
  width: "380px",
  background: "#0F172A",
  borderRadius: "14px",
  padding: "16px",
  color: "#fff"
};

const aiTextBox = {
  background: "#020617",
  padding: "12px",
  borderRadius: "10px",
  fontSize: "14px",
  maxHeight: "180px",
  overflowY: "auto",
  marginTop: "10px"
};

const cancelBtn = {
  flex: 1,
  background: "#334155",
  border: "none",
  padding: "8px",
  borderRadius: "8px",
  color: "#fff",
  cursor: "pointer"
};

const acceptBtn = {
  flex: 1,
  background: "linear-gradient(135deg,#7C7CFF,#22D3EE)",
  border: "none",
  padding: "8px",
  borderRadius: "8px",
  color: "#fff",
  cursor: "pointer"
};
