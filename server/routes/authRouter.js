const router = require("express").Router();
const { requireAuth, getAuth, clerkClient } = require("@clerk/express");

// Clerk: optional logout route (handled by frontend normally)
router.get("/logout", (req, res) => res.json({ message: "Logged out" }));

// Get current user (via Clerk user record)
router.get("/me", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  try {
    // If you want frontend shape consistent:
    const user = await clerkClient.users.getUser(userId);
    res.json({
      id: user.id,
      name: user.fullName || user.username,
      email: user.emailAddresses?.[0]?.emailAddress,
      avatar: user.imageUrl,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(404).json({ message: "User not found" });
  }
});

module.exports = router;
