const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const usersModel = require("./models/users");

const app = express();
app.use(express.json()); // ✅ Fixed missing parentheses
app.use(cors());

// ✅ Corrected Mongoose connection
mongoose.connect("mongodb://localhost:27017/Project-bookbond")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// ✅ Fixed route parameter name
app.post('/users', (req, res) => {
    usersModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.status(500).json(err));
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
