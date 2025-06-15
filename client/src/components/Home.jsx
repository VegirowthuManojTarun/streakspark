import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
function Home() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user-info"));
    setUserInfo(userData);
  }, []);

  const handleLogout = () => {
    Cookies.remove("jwt_token");
    localStorage.removeItem("user-info");
    navigate("/login");
  };
  return (
    <div>
      <h1>Hi {userInfo?.name}</h1>
      <p>Email: {userInfo?.email}</p>
      <img src={userInfo?.image} alt={userInfo?.name} />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
