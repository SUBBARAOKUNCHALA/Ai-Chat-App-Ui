import { createContext, useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";

export const ChatContext = createContext();

export const ChatProvider = ({ children, authUser }) => {
  const socket = useSocket(authUser?._id);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", (msg) => setMessages(prev => [...prev, msg]));
    return () => socket.off("receiveMessage");
  }, [socket]);

  const sendMessage = (receiverId, content) => {
    if (!socket) return;
    const msg = { senderId: authUser._id, receiverId, content };
    socket.emit("sendMessage", msg);
    setMessages(prev => [...prev, msg]);
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
