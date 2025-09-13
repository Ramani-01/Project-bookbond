require("dotenv").config({ path: "./.env" });

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const usersModel = require("./models/users");
const Book = require("./models/Book");
const ReadingChallenge = require('./models/reading-challenge');

const { ObjectId } = mongoose.Types;

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

const SECRET_KEY = process.env.SECRET_KEY;
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3001;

if (!SECRET_KEY || !MONGODB_URI) {
    console.error("Missing environment variables! Check .env file.");
    process.exit(1);
}

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
        console.error(" MongoDB connection error:", err);
        process.exit(1);
    });

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    try {
        req.user = jwt.verify(token, SECRET_KEY); // This line assigns req.user
        console.log("Authenticated user:", req.user); // Log after assignment
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};


/// ✅ Register
app.post("/users", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await usersModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new usersModel({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ message: "Server error during registration" });
    }
});

// ✅ Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await usersModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found. Please sign up first." });
        }
        console.log("Stored password hash:", user.password);  // Log the stored hashed password

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password." });
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" });
        res.json({
            message: "Login successful",
            user: { _id: user._id, name: user.name, email: user.email },
            token
        });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: "Server error during login" });
    }
});
// ✅ Profile
app.get("/profile", authMiddleware, async (req, res) => {
    const user = await usersModel.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
});

// ✅ Logout
app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});

// ✅ Update Profile
app.put("/profile", authMiddleware, async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: "Name and Email are required" });
    }

    try {
        const updatedUser = await usersModel.findByIdAndUpdate(
            req.user.userId,
            { name, email },
            { new: true, runValidators: true, context: 'query' }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile updated", user: updatedUser });
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ message: "Server error while updating profile" });
    }
});

// ✅ Books
app.post("/books", async (req, res) => {
    try {
        const { title, coverImage } = req.body;
        const book = new Book({ title, coverImage });
        await book.save();
        res.status(201).json(book);
    } catch (err) {
        console.error("Error saving book:", err);
        res.status(500).json({ error: "Failed to save book" });
    }
});

app.get("/books", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        console.error("Error fetching books:", err);
        res.status(500).json({ message: "Error fetching books", error: err.message });
    }
});

app.delete("/books/:id", async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid book ID format" });
    }

    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ error: "Book not found" });
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (err) {
        console.error("Error deleting book:", err);
        res.status(500).json({ error: "Failed to delete book", details: err.message });
    }
});

// ✅ Create Reading Challenge (FIXED VERSION)
app.post("/reading-challenge", authMiddleware, async (req, res) => {
    try {
        const existing = await ReadingChallenge.findOne({ user: req.user.userId });
        if (existing) {
            return res.status(400).json({ message: "Challenge already exists" });
        }

        const startDate = new Date();
        let endDate = new Date(startDate);

        if (req.body.durationType === "days") {
            endDate.setDate(endDate.getDate() + req.body.duration);
        } else if (req.body.durationType === "months") {
            endDate.setMonth(endDate.getMonth() + req.body.duration);
        } else if (req.body.durationType === "hours") {
            endDate.setHours(endDate.getHours() + req.body.duration);
        }

        const challenge = new ReadingChallenge({
            user: req.user.userId,
            durationType: req.body.durationType,
            duration: req.body.duration,
            goalType: req.body.goalType,
            goalValue: req.body.goalValue,
            startDate,
            endDate,
            selectedBooks: req.body.selectedBooks,
        });

        await challenge.save();
        res.status(201).json(challenge);
    } catch (err) {
        console.error("Error creating challenge:", err.message);
        res.status(500).json({ message: "Failed to create challenge", error: err.message });
    }
});

// ✅ Get Reading Challenge
app.get("/reading-challenge", authMiddleware, async (req, res) => {
    try {
        const challenge = await ReadingChallenge.findOne({ user: req.user.userId }).populate("selectedBooks");
        res.json(challenge);
    } catch (err) {
        console.error("Error fetching challenge:", err);
        res.status(500).json({ message: "Error fetching challenge" });
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
