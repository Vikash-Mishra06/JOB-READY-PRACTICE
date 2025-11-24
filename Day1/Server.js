import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db/db.js";
connectDB();
import User from "./model/userModel.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Unable to get users" });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res
      .status(201)
      .json({ message: "User registered successfully", User: user });
  } catch (error) {
    res.status(500).json({ message: "Unable to register user", error });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      res.status(404).json({ message: "User not exist" });
    }
    if (password !== password) {
      res.status(401).json({ message: "Password invalid" });
    }
    res.status(200).json({ message: "Login Successful", user });
  } catch (error) {
    res.status(500).json({ message: "Unable to login" });
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successful" });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete user" });
  }
});

app.put("/user/:id", async (req, res) => {
  try {
    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "User updated successful", updateUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user" });
  }
});

app.listen(3000, (req, res) => {
  console.log(`Server is running on http://localhost:3000`);
});
