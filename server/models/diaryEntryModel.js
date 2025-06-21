const mongoose = require("mongoose");

// Each diary entry may be multi-line, each line having its timestamp (optional)
const LineSchema = new mongoose.Schema({
  text: { type: String },
  timestamp: { type: Date }, // optional, ISO8601
});

const DiaryEntrySchema = new mongoose.Schema(
  {
    // For easy lookup per day, you can enforce 1-per-day-per-user on (user, dateStr)
    user: { type: String, required: true }, // Clerk user ID

    dateStr: { type: String, required: true }, // e.g. "2024-05-21" (YYYY-MM-DD)
    lines: [LineSchema],

    content: { type: String, required: true }, // joined text, preserved for quick search
    tags: [{ type: String }], // extensible: future tag support

    attachments: [{ type: String }], // extensible: file URLs

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// To allow only one entry per date per user (change behaviour if you want multiple per day)
DiaryEntrySchema.index({ user: 1, dateStr: 1 }, { unique: true });

module.exports = mongoose.model("DiaryEntry", DiaryEntrySchema);
