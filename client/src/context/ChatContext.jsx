import { createContext, useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import { fetchMessagesAPI } from "../services/genralService";

export const ChatContext = createContext();

export const ChatProvider = ({ children, authUser }) => {

  const socket = useSocket(authUser?._id);
 

  const [messages, setMessages] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState(null);

  // ======================
  // SOCKET LISTENER
  // ======================

  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");

  }, [socket]);

  // ======================
  // LOAD CHAT HISTORY
  // ======================

  const loadChat = async (friendId, token) => {
  try {
    const res = await fetchMessagesAPI(friendId, token);

    const sorted = res.data.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    setMessages(sorted);

  } catch (err) {
    console.error("Load chat error", err);
  }
};


  // ======================
  // ADD LOCAL MESSAGE
  // ======================

const addLocalMessage = (msg) => {
  setMessages(prev => [...prev, msg]);
};

  return (
    <ChatContext.Provider
      value={{
        messages,
        loadChat,
        addLocalMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
