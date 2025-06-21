import { SignIn, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useEffect, useContext } from "react";

export default function LoginPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setUser({
        email: user.primaryEmailAddress.emailAddress,
        name: user.fullName || user.username,
        avatar: user.imageUrl,
        id: user.id,
      });
      navigate("/dashboard");
    }
  }, [isLoaded, isSignedIn, user, setUser, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn routing="hash" forceRedirectUrl="/dashboard" />
    </div>
  );
}
// // client/src/components/LoginPage.jsx
// import { SignIn, useUser } from "@clerk/clerk-react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { useEffect, useContext } from "react";

// export default function LoginPage() {
//   const { isSignedIn, user } = useUser(); // Clerk's user
//   const { setUser } = useContext(AuthContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (isSignedIn && user) {
//       // Set your local context user the way your app expects
//       setUser({
//         email: user.primaryEmailAddress.emailAddress,
//         name: user.fullName || user.username,
//         avatar: user.imageUrl,
//         id: user.id,
//       });
//       navigate("/dashboard");
//     }
//   }, [isSignedIn, user, setUser, navigate]);

//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <SignIn routing="hash" forceRedirectUrl="/dashboard" />
//     </div>
//   );
// }
