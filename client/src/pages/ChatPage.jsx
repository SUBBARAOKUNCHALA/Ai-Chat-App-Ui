import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatProvider } from "../context/ChatContext";
import UserList from "../components/Chat/UserList";
import { fetchUsers } from "../services/chatService";
import { motion } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";
import { decryptData } from "../services/encryption";

export default function ChatPage() {
  const { authUser } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      const data = await fetchUsers(authUser.token);

      const decryptedUsers = data.map(user => ({
        ...user,
        username: decryptData(user.username),
        email: decryptData(user.email)
      }));

      setUsers(decryptedUsers.filter(u => u._id !== authUser._id));
    };

    getUsers();
  }, [authUser]);

  return (
    <ChatProvider authUser={authUser}>
      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top, #0B1226 0%, #050816 70%)",
          display: "flex",
          padding: "16px",
        }}
      >

        {/* ================= Sidebar ================= */}

        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          style={{
            width: "300px",
            borderRadius: "20px",
            background: "rgba(15,23,42,0.92)",
            border: "1px solid rgba(148,163,184,0.12)",
            boxShadow: "0 15px 45px rgba(124,124,255,0.18)",
            backdropFilter: "blur(14px)",
            overflow: "hidden",
            color: "#FFFFFF"
          }}
        >
          <UserList
            users={users}
            selectUser={setSelectedUser}
            selectedUser={selectedUser}
          />
        </motion.div>

        {/* ================= Chat Area ================= */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            flex: 1,
            marginLeft: "16px",
            borderRadius: "20px",
            background: "rgba(15,23,42,0.92)",
            border: "1px solid rgba(148,163,184,0.12)",
            boxShadow: "0 15px 45px rgba(34,211,238,0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            color: "#FFFFFF"
          }}
        >
          {selectedUser ? (
            <>
              <ChatInput />
            </>
          ) : (
            <EmptyChat />
          )}
        </motion.div>

      </div>
    </ChatProvider>
  );
}

/* ===========================
   Empty Chat Placeholder
=========================== */

function EmptyChat() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#FFFFFF",
      }}
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <MessageCircle size={70} color="#7C7CFF" />
      </motion.div>

      <h3
        style={{
          marginTop: "18px",
          fontWeight: "600",
          letterSpacing: "0.3px"
        }}
      >
        Select a conversation
      </h3>

      <p
        style={{
          fontSize: "14px",
          marginTop: "6px",
          color: "#CBD5E1",
        }}
      >
        End-to-end encrypted messages 🔐
      </p>
    </div>
  );
}

/* ===========================
   Chat Input Component
=========================== */

function ChatInput() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    console.log("Sending message:", message);
    setMessage("");
  };

  return (
    <div
      style={{
        padding: "14px",
        marginTop:'521px',
        borderTop: "1px solid rgba(148,163,184,0.12)",
        background: "rgba(2,6,23,0.9)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >

      {/* Input Box */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        style={{
          flex: 1,
          background: "rgba(15,23,42,0.9)",
          border: "1px solid rgba(124,124,255,0.25)",
          borderRadius: "14px",
          padding: "12px 16px",
          color: "#FFFFFF",
          outline: "none",
          fontSize: "14px",
          boxShadow: "inset 0 0 10px rgba(124,124,255,0.15)",
        }}
      />

      {/* Send Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSend}
        style={{
          background:
            "linear-gradient(135deg, #7C7CFF, #22D3EE)",
          border: "none",
          borderRadius: "14px",
          padding: "12px 16px",
          color: "#FFFFFF",
          cursor: "pointer",
          boxShadow: "0 8px 25px rgba(124,124,255,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Send size={18} />
      </motion.button>

    </div>
  );
}
