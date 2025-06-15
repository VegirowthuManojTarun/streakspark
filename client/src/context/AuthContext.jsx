import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { fetchCurrentUser } from "../apis";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const { data } = await fetchCurrentUser();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove("jwt_token");
    setUser(null);
    toast.info("Logged out");
  };

  useEffect(() => {
    if (Cookies.get("jwt_token")) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
