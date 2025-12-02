import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db/db.js";
connectDB();
import User from "./model/authModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import auth from './middleware/authMiddleware.js'

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

// Register
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res
      .status(201)
      .json({ message: "User registered successful", user, token: token });
  } catch (error) {
    res.status(500).json({ message: "Unable to register user", error });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password." });
    }
    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ message: "User login success", user, token: token });
  } catch (error) {
    res.status(500).json({ message: "Unable to login user", error });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: "Users fetched success", users });
  } catch (error) {
    res.status(500).json({ message: "Unable to get users", error });
  }
});

// Get a perticular user
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findOne();
    res.status(200).json({ message: "User fetched success", user });
  } catch (error) {
    res.status(500).json({ message: "Unable to get user", error });
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
