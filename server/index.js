require("dotenv").config({ path: "./.env" }); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const usersModel = require("./models/users"); // Ensure this model file exists

const app = express();
app.use(express.json());
app.use(cors({ origin:  "http://localhost:5173", credentials: true })); // Allow frontend
app.use(cookieParser()); // Enable parsing of cookies

// ✅ Validate Environment Variables
const SECRET_KEY = process.env.SECRET_KEY;
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3001;

if (!SECRET_KEY || !MONGODB_URI) {
    console.error("❌ Missing environment variables! Check .env file.");
    process.exit(1); // Stop the server if critical variables are missing
}

// ✅ Connect to MongoDB
mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1); // Stop the server if DB connection fails
    });

// ✅ Middleware for Authentication
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(403).json({ message: "Unauthorized" });

    try {
        req.user = jwt.verify(token, SECRET_KEY);
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

//✅ Register Route (Sign-Up)
app.post("/users", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await usersModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Create and save user
        const newUser = new usersModel({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});


app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Incoming login:", email);
  
      const user = await usersModel.findOne({ email });
      if (!user) {
        console.log("User not found");
        return res.status(401).json({ message: "User not found. Please sign up first." });
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("➡️ Entered Password:", password);
      console.log("➡️ Password in DB:", user.password);
      console.log("➡️ bcrypt.compare result:", isMatch);
      if (!isMatch) {
        console.log("Invalid password");
        return res.status(401).json({ message: "Invalid password." });
      }
      const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });
  
      res.json({ success: true, message: "Login successful", user: { name: user.name, email: user.email }, token }); // <-- Also include token
    } catch (err) {
      console.error("Server error:", err.message);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
  

// ✅ Profile Route (Protected)
app.get("/profile", authMiddleware, async (req, res) => {
    const user = await usersModel.findById(req.user.userId).select("-password"); // Hide password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
});

// ✅ Logout Route (Clears Cookie)
app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});

// ✅ Start the Server
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
