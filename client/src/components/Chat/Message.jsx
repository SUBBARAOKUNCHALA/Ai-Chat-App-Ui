export default function Message({ message, authUser }) {
  const isSender = message.senderId === authUser._id;
  return (
    <div style={{ display: "flex", justifyContent: isSender ? "flex-end" : "flex-start", margin: 5 }}>
      <div style={{ padding: 10, borderRadius: 10, maxWidth: "60%", background: isSender ? "#007bff" : "#f1f1f1", color: isSender ? "#fff" : "#000" }}>
        {message.content}
      </div>
    </div>
  );
}
