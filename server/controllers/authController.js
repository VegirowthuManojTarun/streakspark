const { getAuth, clerkClient } = require("@clerk/express");

// GET /api/auth/me
const getCurrentUser = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    // Fetches full Clerk user object
    const user = await clerkClient.users.getUser(userId);

    res.json({
      id: user.id,
      name: user.fullName || user.username,
      email: user.emailAddresses?.[0]?.emailAddress,
      avatar: user.imageUrl,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch user", error: err.message });
  }
};

// GET /api/auth/logout (optional, mostly for client compatibility)
const logout = (req, res) => {
  // Clerk recommends handling logout on the frontend
  res.json({ message: "Logged out" });
};

module.exports = {
  getCurrentUser,
  logout,
};
