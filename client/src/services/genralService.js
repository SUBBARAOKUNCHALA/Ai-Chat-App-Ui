import API from "./api";

export const login = (data) => API.post("/api/auth/login", data);
export const register = (data) => API.post("/api/auth/register", data);
export const fetchUsers = (token) =>
  API.get("/api/auth/users", { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);
export const sendMessageAPI = (receiverId, content, token) =>
  API.post("/api/chat/send", { receiverId, content }, { headers: { Authorization: `Bearer ${token}` } });
export const aiChatAPI = (message, token) =>
  API.post("/api/ai/chat", { message }, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);


export const sendFriendRequestApi = async (receiverId, token) => {
  const res = await API.post(
    "/api/friends/send",
    { receiverId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const fetchFriendRequestsApi = async (token) => {
  const res = await API.get(
    "/api/friends/requests",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return res.data;
};

export const acceptFriendRequestApi = async (requestId, token) => {

  const res = await API.put(
    "/api/friends/accept",
    { requestId },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
};