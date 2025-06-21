import React, { createContext, useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isSignedIn, user, isLoaded } = useUser(); // <-- add isLoaded
  const { getToken } = useAuth();
  const [localUser, setLocalUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setLocalUser({
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName || user.username,
        avatar: user.imageUrl,
        id: user.id,
      });
    } else if (isLoaded && !isSignedIn) {
      setLocalUser(null);
    }
    if (isLoaded) setLoading(false);
  }, [isLoaded, isSignedIn, user]);

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
        getToken,
        isLoaded, // <-- Add to context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// // client/src/context/AuthContext.jsx
// import React, { createContext, useState, useEffect } from "react";
// import { useUser, useAuth } from "@clerk/clerk-react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const { isSignedIn, user } = useUser();
//   const { getToken } = useAuth();
//   const [localUser, setLocalUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (isSignedIn && user) {
//       setLocalUser({
//         email: user.primaryEmailAddress?.emailAddress,
//         name: user.fullName || user.username,
//         avatar: user.imageUrl,
//         id: user.id,
//       });
//     } else {
//       setLocalUser(null);
//     }
//     setLoading(false);
//   }, [isSignedIn, user]);

//   const logout = () => {
//     window.Clerk?.signOut();
//     setLocalUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user: localUser,
//         setUser: setLocalUser,
//         loading,
//         logout,
//         getToken, // <-- add this so TaskContext can use it
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
