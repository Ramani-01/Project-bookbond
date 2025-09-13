const mongoose = require("mongoose");

const readingChallengeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  durationType: String,
  duration: Number,
  goalType: String,
  goalValue: Number,
  startDate: Date,
  endDate: Date,
  selectedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

module.exports = mongoose.model("ReadingChallenge", readingChallengeSchema);
