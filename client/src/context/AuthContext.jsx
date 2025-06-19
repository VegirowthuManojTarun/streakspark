// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [localUser, setLocalUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn && user) {
      setLocalUser({
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName || user.username,
        avatar: user.imageUrl,
        id: user.id,
      });
    } else {
      setLocalUser(null);
    }
    setLoading(false);
  }, [isSignedIn, user]);

  const logout = () => {
    window.Clerk?.signOut();
    setLocalUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: localUser,
        setUser: setLocalUser,
        loading,
        logout,
        getToken, // <-- add this so TaskContext can use it
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// import React, { createContext, useState, useEffect } from "react";
// import Cookies from "js-cookie";
// import { fetchCurrentUser } from "../apis";
// import { toast } from "react-toastify";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const loadUser = async () => {
//     try {
//       const { data } = await fetchCurrentUser();
//       setUser(data);
//     } catch {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     Cookies.remove("jwt_token");
//     setUser(null);
//     toast.info("Logged out");
//   };

//   useEffect(() => {
//     if (Cookies.get("jwt_token")) {
//       loadUser();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser, loading, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
