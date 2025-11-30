import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
dotenv.config();
import User from "./model/AuthModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "./middleware/authMiddleware.js";

const app = express();
connectDB();

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Register route
app.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(500).json({ message: "User already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(201).json({ message: "User registered successfully.", user, token: token });
  } catch (error) {
    res.status(400).json({ message: "Unable to register user." });
  }
});

// Login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    user.token = token;
    await user.save();
    res.status(200).json({ message: "User login successfully", user, token: token });
  } catch (error) {
    res.status(500).json({ message: "Unable to login user", error });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json({ message: "User fetched successfully.", user });
  } catch (error) {
    res.status(400).json({ message: "Unable to get users detail" });
  }
});

// Get a particular user by its Id
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ message: "User fetched successfully.", user });
  } catch (error) {
    res.status(400).json({ message: "Unable to get user detail" });
  }
});

// Update user
app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "User updated successfully.", updatedUser });
  } catch (error) {
    res.status(400).json({ message: "Unable to update user" });
  }
});

// Delete user
app.delete("/users/:id", async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully.", deleteUser });
  } catch (error) {
    res.status(400).json({ message: "Unable to delete user" });
  }
});

// Profile
app.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on PORT:${PORT}`);
});
