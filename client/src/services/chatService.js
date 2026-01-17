import API from "./api";

export const fetchUsers = (token) =>
  API.get("/api/auth/users", { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);

export const sendMessageAPI = (receiverId, content, token) =>
  API.post("/api/chat/send", { receiverId, content }, { headers: { Authorization: `Bearer ${token}` } });
