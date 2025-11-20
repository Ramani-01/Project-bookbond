require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// Models
const User = require("./models/User");
const Book = require("./models/Book");
const ReadingChallenge = require("./models/ReadingChallenge");

const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  console.error("❌ JWT_SECRET is not defined in environment variables");
  process.exit(1);
}

const PORT = process.env.PORT || 3001;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ================== Middleware for Auth ==================
function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Authentication required" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(403).json({ message: "Invalid token" });
  }
}

// ================== AUTH ==================

// Register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ 
      message: "User registered successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ 
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  res.json({ message: "Logged out successfully" });
});

// Get current user
app.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
});

// ================== BOOKS ==================

// Get all books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find().sort({ title: 1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books", error: err.message });
  }
});

// Add book
app.post("/books", async (req, res) => {
  try {
    const { title, author, pages, coverImage, description } = req.body;
    
    if (!title || !author || !pages) {
      return res.status(400).json({ message: "Title, author, and pages are required" });
    }

    const book = new Book({ title, author, pages, coverImage, description });
    await book.save();
    
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: "Error adding book", error: err.message });
  }
});

// ================== CHALLENGES ==================

// Create challenge
app.post("/reading-challenge", authMiddleware, async (req, res) => {
  try {
    const { title, durationType, duration, goalType, goalValue, selectedBooks } = req.body;
    
    // Validation
    if (!title || !durationType || !duration || !goalType || !goalValue) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const startDate = new Date();
    let endDate = new Date();
    
    // Calculate end date based on duration type
    if (durationType === "days") {
      endDate.setDate(startDate.getDate() + parseInt(duration));
    } else if (durationType === "weeks") {
      endDate.setDate(startDate.getDate() + parseInt(duration) * 7);
    } else if (durationType === "months") {
      endDate.setMonth(startDate.getMonth() + parseInt(duration));
      // Handle cases where the target month has fewer days
      if (endDate.getDate() !== startDate.getDate()) {
        endDate.setDate(0); // Set to last day of previous month
      }
    }

    const challenge = new ReadingChallenge({
      user: req.user.userId,
      title,
      durationType,
      duration: parseInt(duration),
      goalType,
      goalValue: parseInt(goalValue),
      startDate,
      endDate,
      selectedBooks,
      progress: 0,
      status: "active",
    });

    await challenge.save();
    
    // Populate selectedBooks for the response
    await challenge.populate("selectedBooks");
    
    res.status(201).json({ message: "Challenge created successfully", challenge });
  } catch (err) {
    res.status(400).json({ message: "Failed to create challenge", error: err.message });
  }
});

// Get all challenges for current user
app.get("/reading-challenge", authMiddleware, async (req, res) => {
  try {
    const now = new Date();

    // Auto-update expired challenges
    await ReadingChallenge.updateMany(
      { user: req.user.userId, endDate: { $lt: now }, status: "active" },
      { $set: { status: "failed" } }
    );

    const challenges = await ReadingChallenge.find({ user: req.user.userId })
      .populate("selectedBooks")
      .sort({ createdAt: -1 });

    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: "Error fetching challenges", error: err.message });
  }
});

// Update progress
app.patch("/reading-challenge/:id/progress", authMiddleware, async (req, res) => {
  try {
    const { progress } = req.body;
    
    if (typeof progress !== "number" || progress < 0) {
      return res.status(400).json({ message: "Valid progress value is required" });
    }

    const challenge = await ReadingChallenge.findOne({ 
      _id: req.params.id, 
      user: req.user.userId 
    });

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    challenge.progress = progress;

    if (progress >= challenge.goalValue) {
      challenge.status = "completed";
    } else if (challenge.status === "completed") {
      // If progress decreases below goal, revert to active status
      challenge.status = "active";
    }

    await challenge.save();
    res.json({ message: "Progress updated", challenge });
  } catch (err) {
    res.status(400).json({ message: "Failed to update progress", error: err.message });
  }
});

// Delete challenge
app.delete("/reading-challenge/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const challenge = await ReadingChallenge.findOneAndDelete({ 
      _id: id, 
      user: req.user.userId 
    });

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.json({ message: "Challenge deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete challenge", error: err.message });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// ================== SERVER ==================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});