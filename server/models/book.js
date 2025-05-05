const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  coverImage: String, // store file path or base64
});

module.exports = mongoose.model('Book', bookSchema);
