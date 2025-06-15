import React, { useContext } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../apis";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const onSuccess = async (codeResponse) => {
    try {
      const res = await googleAuth(codeResponse.code);
      const { user, token } = res.data;
      Cookies.set("jwt_token", token, { expires: 7 });
      setUser(user);
      toast.success("Welcome, " + user.displayName);
      navigate("/app");
    } catch {
      toast.error("Google login failed");
    }
  };

  const onError = () => toast.error("Google login error");

  const login = useGoogleLogin({
    onSuccess,
    onError,
    flow: "auth-code",
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <button
        onClick={() => login()}
        className="btn-primary border-solid border-gray-300"
      >
        Sign in with Google
      </button>
    </div>
  );
}
