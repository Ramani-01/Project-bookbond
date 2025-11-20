import { Schema, model } from "mongoose";

const bookSchema = new Schema({
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

export default model("Book", bookSchema);