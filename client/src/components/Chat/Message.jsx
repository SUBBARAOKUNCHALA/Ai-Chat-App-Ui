export default function Message({ message, authUser }) {

  const isMe =
    message.sender?._id === authUser._id ||
    message.senderId === authUser._id;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isMe ? "flex-end" : "flex-start",
        marginBottom: "10px"
      }}
    >
      <div
        style={{
          background: isMe ? "#2563EB" : "#1E293B",
          padding: "10px 14px",
          borderRadius: "14px",
          maxWidth: "70%",
          color: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
        }}
      >
        {message.content}

        {/* TIME */}
        {message.createdAt && (
          <div
            style={{
              fontSize: "10px",
              marginTop: "4px",
              textAlign: "right",
              opacity: 0.7
            }}
          >
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </div>
        )}
      </div>
    </div>
  );
}

