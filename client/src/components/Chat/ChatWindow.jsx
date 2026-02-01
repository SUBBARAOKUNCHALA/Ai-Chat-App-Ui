import { useContext, useState, useRef, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import Message from "./Message";
import { aiChatAPI, sendMessageAPI } from "../../services/genralService";
import { motion } from "framer-motion";
import { Send, X, ArrowLeft } from "lucide-react";

export default function ChatWindow({ authUser, receiver, goBack }) {

  const { messages, addLocalMessage } = useContext(ChatContext);

  const bottomRef = useRef(null);

  const [input, setInput] = useState("");
  const [aiPreview, setAiPreview] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const isMobile = window.innerWidth < 768;

  // ======================
  // AUTO SCROLL
  // ======================

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ======================
  // SEND BUTTON CLICK
  // ======================

  const handleSendClick = async () => {

    if (!input.trim()) return;

    // AI Direct Chat Mode
    if (receiver.username.toLowerCase() === "ai") {
      handleDirectAI();
      return;
    }

    try {
      setLoading(true);

      const res = await aiChatAPI(input, authUser.token);

      setAiPreview(res.data.reply);
      setShowPopup(true);

    } catch (err) {
      console.error("AI Error:", err);
      setAiPreview(err.response.data.message);
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // DIRECT AI CHAT
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
      console.error("Send Failed:", err.response?.data || err);
    }
  };

  // ======================
  // BODY SCROLL LOCK (AI POPUP)
  // ======================

  useEffect(() => {

    if (showPopup) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };

  }, [showPopup]);

  return (
    <div style={container}>

      {/* ================= HEADER ================= */}

      <div style={header}>

        {isMobile && (
          <ArrowLeft
            size={22}
            onClick={goBack}
            style={{ cursor: "pointer" }}
          />
        )}

        <div>
          <div style={username}>
            {receiver.username}
          </div>
          <div style={status}>
            Online
          </div>
        </div>

      </div>

      {/* ================= CHAT MESSAGES ================= */}

      <div style={chatBody}>

        {messages.map((msg, i) => (
          <Message
            key={msg._id || i}
            message={msg}
            authUser={authUser}
          />
        ))}

        <div ref={bottomRef} />

      </div>

      {/* ================= INPUT BAR ================= */}

      <div style={inputBar}>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={inputStyle}
        />

        <motion.button
          onClick={sendFinalMessage}
          whileHover={{ scale: 1.05 }}
          style={sendBtn}
          disabled={loading}
        >
          <Send size={18} />
        </motion.button>

        <motion.button
          onClick={handleSendClick}
          whileHover={{ scale: 1.05 }}
          style={aiBtn}
          disabled={loading}
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

            <div style={popupHeader}>
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

            <div style={popupBtns}>

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
                Use Message
              </button>

            </div>

          </motion.div>

        </div>

      )}

    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  background: "#020617"
};

const header = {
  height: "64px",
  background: "#020617",
  borderBottom: "1px solid rgba(148,163,184,0.12)",
  padding: "0 16px",
  display: "flex",
  alignItems: "center",
  gap: "12px"
};

const username = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#fff"
};

const status = {
  fontSize: "12px",
  color: "#22C55E"
};

const chatBody = {
  flex: 1,
  overflowY: "auto",
  padding: "16px"
};

const inputBar = {
  padding: "12px",
  borderTop: "1px solid rgba(148,163,184,0.12)",
  display: "flex",
  gap: "10px",
  background: "#020617",
  position: "sticky",
  bottom: 0
};

const inputStyle = {
  flex: 1,
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  outline: "none",
  fontSize: "16px"
};

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
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999
};

const popupStyle = {
  width: "380px",
  maxWidth: "90%",
  background: "#0F172A",
  borderRadius: "14px",
  padding: "16px",
  color: "#fff"
};

const popupHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
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

const popupBtns = {
  display: "flex",
  gap: "10px",
  marginTop: "12px"
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
