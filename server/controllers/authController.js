const { oath2client } = require("../utils/googleConfig");
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const googleLogin = async (req, res) => {
  try {
    const { code } = req.query;

    console.log("✅ Received authorization code:", code);
    console.log("🔍 OAuth Redirect URI:", oath2client.redirectUri);

    if (!code) {
      console.warn("⚠️ No code received in query.");
      return res.status(400).json({ message: "Missing Google auth code" });
    }

    let googleRes;
    try {
      googleRes = await oath2client.getToken(code);
      console.log("✅ Google tokens received:", googleRes.tokens);
    } catch (tokenError) {
      console.error(
        "❌ Error during token exchange:",
        tokenError.response?.data || tokenError.message
      );
      return res
        .status(400)
        .json({ message: "Token exchange failed", error: tokenError.message });
    }

    oath2client.setCredentials(googleRes.tokens);

    let userRes;
    try {
      userRes = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
      );
      console.log("✅ Google user info received:", userRes.data);
    } catch (userInfoError) {
      console.error(
        "❌ Failed to fetch user info:",
        userInfoError.response?.data || userInfoError.message
      );
      return res.status(400).json({
        message: "Failed to get user info",
        error: userInfoError.message,
      });
    }

    const { email, name, picture } = userRes.data;

    let user;
    try {
      user = await UserModel.findOne({ email });
      if (!user) {
        user = await UserModel.create({
          name,
          email,
          image: picture,
        });
        console.log("🆕 New user created:", user);
      } else {
        console.log("✅ Existing user found:", user);
      }
    } catch (dbError) {
      console.error("❌ Database error:", dbError.message);
      return res
        .status(500)
        .json({ message: "User DB operation failed", error: dbError.message });
    }

    const { _id } = user;

    let token;
    try {
      if (!process.env.JWT_SECRET) {
        console.warn("⚠️ JWT_SECRET is not set!");
      }
      token = jwt.sign(
        { _id, email },
        process.env.JWT_SECRET || "fallback_secret",
        {
          expiresIn: process.env.JWT_EXPIRY || "1d",
        }
      );
      console.log("✅ JWT generated successfully");
    } catch (jwtError) {
      console.error("❌ JWT signing failed:", jwtError.message);
      return res
        .status(500)
        .json({ message: "JWT generation failed", error: jwtError.message });
    }

    return res.status(200).json({
      message: "Success",
      token,
      user,
    });
  } catch (error) {
    console.error("❌ Unexpected server error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const logout = (req, res) => {
  res.json({ message: "Logged out" });
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("-__v");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("❌ Error fetching current user:", err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  googleLogin,
  logout,
  getCurrentUser,
};
