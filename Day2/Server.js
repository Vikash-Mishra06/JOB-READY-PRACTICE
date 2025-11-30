import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import User from "./model/authModel.js";
dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get("/users", async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json({ message: "User fetched successful", user });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch users", error });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Unable to register user", error });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }
    res.status(200).json({ message: "User login successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Unable to login user", error });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "User updated successful", updateUser });
  } catch (error) {
    res.status(500).json({ message: "Unable to update user" });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successful" });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete user" });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ message: "User fetched", user });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch user" });
  }
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
