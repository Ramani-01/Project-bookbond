const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  pages: {
    type: Number,
    required: true,
    min: 1
  },
  coverImage: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

// Index for better search performance
bookSchema.index({ title: 'text', author: 'text' });

module.exports = mongoose.model("Book", bookSchema);