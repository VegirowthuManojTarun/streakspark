const DiaryEntry = require("../models/diaryEntryModel");
const { getAuth } = require("@clerk/express");
const { validationResult } = require("express-validator");

// Utilities:
function normalizeDateStr(dateStr) {
  // Ensure YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr))
    throw new Error("dateStr must be YYYY-MM-DD");
  return dateStr;
}

// POST /api/diary/entries
exports.createEntry = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { dateStr, content, lines, tags, attachments } = req.body;

    const normalizedDateStr = normalizeDateStr(dateStr);

    // Optionally, do not allow downgrading an existing entry: return conflict
    const exists = await DiaryEntry.findOne({
      user: userId,
      dateStr: normalizedDateStr,
    });
    if (exists)
      return res
        .status(409)
        .json({ message: "Entry for this date already exists." });

    // lines: array of { text, timestamp } (timestamp optional)
    const entry = await DiaryEntry.create({
      user: userId,
      dateStr: normalizedDateStr,
      content,
      lines: lines || [], // optional for 1st version
      tags: tags || [],
      attachments: attachments || [],
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/diary/entries
// Optional filters: ?dateStr=yyyy-mm-dd&keyword=...
exports.getEntries = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const filter = { user: userId };
    if (req.query.dateStr) filter.dateStr = normalizeDateStr(req.query.dateStr);

    // Fulltext search in content
    if (req.query.keyword) {
      filter.content = { $regex: req.query.keyword, $options: "i" };
    }

    // Sorted descending by date
    const entries = await DiaryEntry.find(filter).sort({ dateStr: -1 }).lean();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/diary/entries/:id
exports.getEntryById = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const entry = await DiaryEntry.findOne({
      _id: req.params.id,
      user: userId,
    });
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/diary/entries/:id
exports.updateEntry = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { content, lines, tags, attachments } = req.body;

    const entry = await DiaryEntry.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      {
        ...(content !== undefined && { content }),
        ...(lines !== undefined && { lines }),
        ...(tags !== undefined && { tags }),
        ...(attachments !== undefined && { attachments }),
        updatedAt: new Date(),
      },
      { new: true }
    );
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/diary/entries/:id
exports.deleteEntry = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const entry = await DiaryEntry.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    res.json({ message: "Entry deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/diary/migrate
// Accept array of localStorage entries (bulk migration)
exports.bulkMigrateEntries = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { entries } = req.body;
    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ message: "No diary entries provided." });
    }

    const results = [];
    for (const raw of entries) {
      try {
        // Map client shape to backend shape
        // expected: { dateStr, content, [lines], ... }
        const toInsert = {
          user: userId,
          dateStr: normalizeDateStr(raw.dateStr),
          content: raw.content,
          lines: raw.lines || [],
          tags: Array.isArray(raw.tags) ? raw.tags : [],
          attachments: Array.isArray(raw.attachments) ? raw.attachments : [],
        };
        // Upsert: if exists, skip or update (pick policy)
        const existing = await DiaryEntry.findOne({
          user: userId,
          dateStr: toInsert.dateStr,
        });
        if (existing) {
          // Merge or skip: Here we skip for safety
          results.push({
            dateStr: toInsert.dateStr,
            status: "skipped: exists",
          });
          continue;
        }
        await DiaryEntry.create(toInsert);
        results.push({ dateStr: toInsert.dateStr, status: "imported" });
      } catch (e) {
        results.push({ dateStr: raw.dateStr, error: e.message });
      }
    }
    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
