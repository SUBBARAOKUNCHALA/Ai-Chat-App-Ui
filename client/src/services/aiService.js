import API from "./api";

export const aiChatAPI = (message, token) =>
  API.post("/api/ai/chat", { message }, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);
