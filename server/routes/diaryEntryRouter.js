const router = require("express").Router();
const { body } = require("express-validator");
const diaryCtrl = require("../controllers/diaryEntryController");
const { requireAuth } = require("@clerk/express");

// All routes are Clerk-protected
router.use(requireAuth());

// POST /api/diary/entries
router.post(
  "/entries",
  [
    body("dateStr").matches(/^\d{4}-\d{2}-\d{2}$/),
    body("content").isString().isLength({ max: 5000 }), // Limit length for DoS protection
    body("lines").optional().isArray(),
    body("tags").optional().isArray(),
    body("attachments").optional().isArray(),
  ],
  diaryCtrl.createEntry
);

// GET /api/diary/entries
router.get("/entries", diaryCtrl.getEntries);
// GET /api/diary/entries/:id
router.get("/entries/:id", diaryCtrl.getEntryById);

// PUT /api/diary/entries/:id
router.put(
  "/entries/:id",
  [
    body("content").optional().isString().isLength({ max: 5000 }),
    body("lines").optional().isArray(),
    body("tags").optional().isArray(),
    body("attachments").optional().isArray(),
  ],
  diaryCtrl.updateEntry
);

// DELETE /api/diary/entries/:id
router.delete("/entries/:id", diaryCtrl.deleteEntry);

// Data Migration: bulk migrate endpoint
router.post(
  "/migrate",
  [
    body("entries").isArray().isLength({ min: 1, max: 500 }),
    // You may want to further validate each entry
  ],
  diaryCtrl.bulkMigrateEntries
);

module.exports = router;
