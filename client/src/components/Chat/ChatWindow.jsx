import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import Message from "./Message";
import { sendMessageAPI } from "../../services/chatService";
import { aiChatAPI } from "../../services/aiService";

export default function ChatWindow({ authUser, receiver }) {
  const { messages, sendMessage } = useContext(ChatContext);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    sendMessage(receiver._id, input);
    await sendMessageAPI(receiver._id, input, authUser.token);

    if (receiver.username.toLowerCase() === "ai") {
      const aiReply = await aiChatAPI(input, authUser.token);
      sendMessage(receiver._id, aiReply.reply);
    }

    setInput("");
  };

  return (
    <>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 10 }}>
        <div style={{ flex: 1, overflowY: "auto", marginBottom: 10 }}>
          {messages.filter(m =>
            (m.senderId === authUser._id && m.receiverId === receiver._id) ||
            (m.senderId === receiver._id && m.receiverId === authUser._id)
          ).map((m, i) => <Message key={i} message={m} authUser={authUser} />)}
        </div>

        <div style={{ display: "flex" }}>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." style={{ flex: 1, padding: 10, borderRadius: 5 }} />
          <button onClick={handleSend} style={{ marginLeft: 5, padding: 10 }}>Send</button>
        </div>
      </div>
      
    </>

  );
}
