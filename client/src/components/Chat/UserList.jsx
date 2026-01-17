import { motion } from "framer-motion";
import { UserPlus, CheckCircle, Clock } from "lucide-react";

export default function UserList({
  users,
  selectUser,
  sendFriendRequest,
}) {

  // ================= FILTER GROUPS =================

  const friends = users.filter((u) => u.isFriend);
  const addFriends = users.filter((u) => !u.isFriend);

  return (
    <div style={{ padding: "14px" }}>

      {/* ================= FRIENDS ================= */}

      <SectionTitle title="Friends" />

      {friends.length === 0 && (
        <EmptyText text="No friends yet" />
      )}

      {friends.map((u) => (
        <UserCard
          key={u._id}
          user={u}
          onClick={() => selectUser(u)}
          showChatIcon
        />
      ))}

      {/* ================= DIVIDER ================= */}

      <Divider />

      {/* ================= ADD FRIENDS ================= */}

      <SectionTitle title="Add Friends" />

      {addFriends.length === 0 && (
        <EmptyText text="No users available" />
      )}

      {addFriends.map((u) => (
        <UserCard
          key={u._id}
          user={u}
          sendFriendRequest={sendFriendRequest}
        />
      ))}

    </div>
  );
}

/* ===========================
     USER CARD
=========================== */

function UserCard({ user, onClick, sendFriendRequest, showChatIcon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        padding: "12px",
        marginBottom: "10px",
        borderRadius: "14px",
        background: "rgba(15,23,42,0.9)",
        border: "1px solid rgba(148,163,184,0.12)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: showChatIcon ? "pointer" : "default",
      }}
    >

      {/* USER INFO */}
      <div>
        <p style={{ fontWeight: "600", color: "#fff" }}>
          {user.username}
        </p>

        <span
          style={{
            fontSize: "12px",
            color: user.isFriend ? "#22C55E" : "#94A3B8",
          }}
        >
          {/* {user.isFriend
            ? "Friend"
            : user.requestSent
            ? "Pending"
            : "Not Friend"} */}
        </span>
      </div>

      {/* ACTION ICONS */}
      <div>
        {!user.isFriend && !user.requestSent && (
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              sendFriendRequest(user._id);
            }}
            style={iconBtnStyle}
          >
            <UserPlus size={18} />
          </motion.button>
        )}

        {user.requestSent && (
          <Clock size={18} color="#FACC15" />
        )}

        {user.isFriend && (
          <CheckCircle size={18} color="#22C55E" />
        )}
      </div>
    </motion.div>
  );
}

/* ===========================
      UI HELPERS
=========================== */

function SectionTitle({ title }) {
  return (
    <h4
      style={{
        marginBottom: "10px",
        marginTop: "10px",
        color: "#CBD5E1",
        letterSpacing: "0.6px",
        fontSize: "13px",
        textTransform: "uppercase",
      }}
    >
      {title}
    </h4>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: "1px",
        width: "100%",
        margin: "14px 0",
        background:
          "linear-gradient(to right, transparent, rgba(124,124,255,0.4), transparent)",
      }}
    />
  );
}

function EmptyText({ text }) {
  return (
    <p
      style={{
        fontSize: "12px",
        color: "#64748B",
        marginBottom: "10px",
      }}
    >
      {text}
    </p>
  );
}

/* ===========================
      ICON STYLE
=========================== */

const iconBtnStyle = {
  background: "rgba(124,124,255,0.15)",
  border: "none",
  padding: "8px",
  borderRadius: "10px",
  cursor: "pointer",
  color: "#7C7CFF",
};
