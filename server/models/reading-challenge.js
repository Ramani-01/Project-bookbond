const mongoose = require("mongoose");

const readingChallengeSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true
  },
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  durationType: { 
    type: String, 
    enum: ["days", "weeks", "months"], 
    required: true 
  },
  duration: { 
    type: Number, 
    required: true, 
    min: 1,
    max: 365 // Limit to a reasonable maximum
  },
  goalType: { 
    type: String, 
    enum: ["pages", "books"], 
    required: true 
  },
  goalValue: { 
    type: Number, 
    required: true, 
    min: 1,
    max: 10000 // Reasonable maximum
  },
  startDate: { 
    type: Date, 
    default: Date.now 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  selectedBooks: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Book" 
  }],
  progress: { 
    type: Number, 
    default: 0,
    min: 0
  },
  status: { 
    type: String, 
    enum: ["active", "completed", "failed"], 
    default: "active" 
  }
}, {
  timestamps: true
});

// Index for better query performance
readingChallengeSchema.index({ user: 1, status: 1 });
readingChallengeSchema.index({ endDate: 1 });

module.exports = mongoose.model("ReadingChallenge", readingChallengeSchema);