import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("authUser")));

  const loginUser = (user) => {
    localStorage.setItem("authUser", JSON.stringify(user));
    setAuthUser(user);
  };

  const logoutUser = () => {
    localStorage.removeItem("authUser");
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ authUser, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
