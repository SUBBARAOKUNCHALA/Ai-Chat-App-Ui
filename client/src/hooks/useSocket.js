import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:5000";

export const useSocket = (userId) => {
  const socket = useRef();

  useEffect(() => {
    if (!userId) return;
    socket.current = io(SERVER_URL);
    socket.current.emit("join", userId);

    return () => socket.current.disconnect();
  }, [userId]);

  return socket.current;
};
