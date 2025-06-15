const { oath2client } = require("../utils/googleConfig");
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// Preserve your exact googleLogin implementation:
const googleLogin = async (req, res) => {
  try {
    const { code } = req.query;
    const googleRes = await oath2client.getToken(code);
    oath2client.setCredentials(googleRes.tokens);
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    const { email, name, picture } = userRes.data;
    let user = await UserModel.findOne({ email });
    if (!user) {
      user = await UserModel.create({
        name,
        email,
        image: picture,
      });
    }
    const { _id } = user;
    const token = jwt.sign({ _id, email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    return res.status(200).json({
      message: "Success",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const logout = (req, res) => {
  // Client can simply drop the JWT
  res.json({ message: "Logged out" });
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("-__v");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  googleLogin,
  logout,
  getCurrentUser,
};
