import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatProvider } from "../context/ChatContext";
import UserList from "../components/Chat/UserList";
import { fetchUsers } from "../services/genralService";
import { motion } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";
import { decryptData } from "../services/encryption";
import { Bell } from "lucide-react";
import { sendFriendRequestApi, fetchFriendRequestsApi,acceptFriendRequestApi } from "../services/genralService";

export default function ChatPage() {
  const { authUser } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);
  const [friendReqCount, setFriendReqCount] = useState(0);

  const handleSendFriendRequest = async (receiverId) => {
    try {
      await sendFriendRequestApi(receiverId, authUser.token);

      // Update UI instantly
      setUsers((prev) =>
        prev.map((u) =>
          u._id === receiverId
            ? { ...u, requestSent: true }
            : u
        )
      );

    } catch (err) {
      console.error("Friend request error:", err);
    }
  };

  useEffect(() => {

    const loadFriendRequests = async () => {
      try {
        const data = await fetchFriendRequestsApi(authUser.token);

        setFriendReqCount(data.length);

      } catch (err) {
        console.error("Friend req count error", err);
      }
    };

    loadFriendRequests();

  }, [authUser]);
useEffect(() => {

  if (!showRequests) return;

  const loadRequests = async () => {
    try {
      const data = await fetchFriendRequestsApi(authUser.token);

      setFriendRequests(data);

    } catch (err) {
      console.error("Load popup requests error", err);
    }
  };

  loadRequests();

}, [showRequests]);

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
            sendFriendRequest={handleSendFriendRequest}
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
{/* ================= Friend Request Icon ================= */}

<div
  style={{
    position: "fixed",
    top: "20px",
    right: "30px",
    zIndex: 9999,
  }}
>

  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => setShowRequests(!showRequests)}
    style={{
      position: "relative",
      cursor: "pointer",
      background: "rgba(15,23,42,0.9)",
      padding: "12px",
      borderRadius: "14px",
      border: "1px solid rgba(124,124,255,0.3)"
    }}
  >
    <Bell color="#7C7CFF" />

    {/* COUNT BADGE */}
    {friendReqCount > 0 && (
      <span
        style={{
          position: "absolute",
          top: "-6px",
          right: "-6px",
          background: "#EF4444",
          color: "#fff",
          borderRadius: "50%",
          padding: "3px 7px",
          fontSize: "11px",
          fontWeight: "600",
        }}
      >
        {friendReqCount}
      </span>
    )}
  </motion.div>

  {showRequests && (
    <FriendRequestPopup
      requests={friendRequests}
      setRequests={setFriendRequests}
      setCount={setFriendReqCount}
      closePopup={() => setShowRequests(false)}
      token={authUser.token}
    />
  )}

</div>


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
        marginTop: '521px',
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
function FriendRequestPopup({
  requests,
  setRequests,
  setCount,
  closePopup,
  token
}) {

  const handleAccept = async (id) => {
    try {
      await acceptFriendRequestApi(id, token);

      // Remove accepted from UI
      const updated = requests.filter(r => r._id !== id);

      setRequests(updated);
      setCount(updated.length);

    } catch (err) {
      console.error("Accept error", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        marginTop: "12px",
        width: "260px",
        background: "rgba(15,23,42,0.95)",
        borderRadius: "14px",
        padding: "12px",
        border: "1px solid rgba(124,124,255,0.3)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px"
        }}
      >
        <p style={{ color: "#fff", fontSize: "14px" }}>
          Friend Requests
        </p>

        <button onClick={closePopup} style={closeBtnStyle}>
          ✕
        </button>
      </div>

      {requests.length === 0 && (
        <p style={{ color: "#94A3B8", fontSize: "12px" }}>
          No new requests
        </p>
      )}

      {requests.map(req => (
        <div
          key={req._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
            padding: "6px 8px",
            background: "rgba(2,6,23,0.8)",
            borderRadius: "10px"
          }}
        >
          <span style={{ color: "#fff", fontSize: "13px" }}>
            {req.sender.username}
          </span>

          <button
            onClick={() => handleAccept(req._id)}
            style={acceptBtnStyle}
          >
            Accept
          </button>
        </div>
      ))}

    </motion.div>
  );
}
const acceptBtnStyle = {
  background: "linear-gradient(135deg,#7C7CFF,#22D3EE)",
  border: "none",
  borderRadius: "8px",
  padding: "4px 10px",
  color: "#fff",
  cursor: "pointer",
  fontSize: "12px"
};

const closeBtnStyle = {
  background: "transparent",
  border: "none",
  color: "#94A3B8",
  cursor: "pointer",
  fontSize: "14px"
};
